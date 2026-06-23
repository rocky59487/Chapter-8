import { useReducer, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Lesson, QuestionStep, Step } from '@/types/pack';
import { findLesson, useActivePack } from '@/store/packs';
import { useGame } from '@/store/game';
import { useSettings } from '@/store/settings';
import { navigate } from '@/router';
import { ContentBlocks } from '@/components/ContentBlocks';
import { QuestionView } from '@/components/questions/QuestionView';
import { grade, isAnswered, type AnswerValue } from '@/components/questions/grade';
import { WidgetHost } from '@/components/widgets/registry';
import { Rich } from '@/components/Tex';
import { MascotSay, Mascot } from '@/components/Mascot';
import { Confetti } from '@/components/Confetti';
import { sfx, unlockAudio } from '@/lib/sfx';

export function Lesson({ lessonId }: { lessonId: string }) {
  const pack = useActivePack();
  const found = findLesson(pack, lessonId);
  if (!found) {
    return <div className="p-8 text-center ink">找不到課程。<button className="underline" onClick={() => navigate('#/')}>回首頁</button></div>;
  }
  return <LessonPlayer key={lessonId} lesson={found.lesson} accent={found.unit.color ?? pack.accent ?? '#2fd49d'} />;
}

interface RunState {
  queue: Step[];           // remaining steps (wrong questions get re-queued)
  pos: number;
  total: number;
  answered: number;
  correct: number;
  asked: number;
}

function LessonPlayer({ lesson, accent }: { lesson: Lesson; accent: string }) {
  const sound = useSettings((s) => s.sound);
  const { loseHeart, completeLesson, hearts } = useGame();

  const [run, setRun] = useState<RunState>({
    queue: lesson.steps,
    pos: 0,
    total: lesson.steps.length,
    answered: 0,
    correct: 0,
    asked: 0,
  });
  const [value, setValue] = useState<AnswerValue>(null);
  const [locked, setLocked] = useState(false);
  const [verdict, setVerdict] = useState<null | boolean>(null);
  const [done, setDone] = useState(false);
  const [, force] = useReducer((x) => x + 1, 0);

  const step = run.queue[run.pos];
  const progress = run.pos / run.queue.length;

  if (done) {
    const acc = run.asked ? run.correct / run.asked : 1;
    return <ResultScreen lesson={lesson} accuracy={acc} accent={accent} />;
  }

  const onContinue = () => {
    if (sound) sfx.tap();
    unlockAudio();
    // advance
    if (run.pos + 1 >= run.queue.length) {
      // finished
      const acc = run.asked ? run.correct / run.asked : 1;
      completeLesson(lesson.id, acc, lesson.xp ?? 20);
      if (sound) sfx.complete();
      setDone(true);
      return;
    }
    setRun((r) => ({ ...r, pos: r.pos + 1 }));
    setValue(null);
    setLocked(false);
    setVerdict(null);
  };

  const onCheck = () => {
    if (step.kind !== 'question') return;
    unlockAudio();
    const ok = grade(step.question, value);
    setLocked(true);
    setVerdict(ok);
    setRun((r) => ({
      ...r,
      answered: r.answered + 1,
      asked: r.asked + 1,
      correct: r.correct + (ok ? 1 : 0),
    }));
    if (ok) {
      if (sound) sfx.correct();
    } else {
      if (sound) sfx.wrong();
      loseHeart();
      // re-queue this question near the end (spaced repetition feel)
      setRun((r) => {
        const q = { ...step } as Step;
        const newQueue = [...r.queue, q];
        return { ...r, queue: newQueue, total: r.total };
      });
    }
    force();
  };

  const headerLeftPct = `${Math.round(progress * 100)}%`;

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* top: close + progress + hearts */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3" style={{ maxWidth: 'var(--app-max)', margin: '0 auto', width: '100%' }}>
        <button onClick={() => navigate('#/')} className="text-2xl ink-faint leading-none">✕</button>
        <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}
            initial={false} animate={{ width: headerLeftPct }} />
        </div>
        <div className="flex items-center gap-1 font-bold ink">
          <span style={{ color: '#ff5d7e' }}>❤️</span>{hearts}
        </div>
      </div>

      {/* body */}
      <div className="flex-1 px-4 py-3" style={{ maxWidth: 'var(--app-max)', margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${run.pos}-${step.id}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step.kind === 'teach' ? (
              <TeachCard step={step} />
            ) : (
              <QuestionCard step={step} value={value} onChange={setValue} locked={locked} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer: check / continue + feedback */}
      <Footer
        kind={step.kind}
        canCheck={step.kind === 'question' ? isAnswered(step.question, value) : true}
        locked={locked}
        verdict={verdict}
        explanation={step.kind === 'question' ? step.explanation : undefined}
        accent={accent}
        onCheck={onCheck}
        onContinue={onContinue}
        outOfHearts={hearts <= 0 && verdict === false}
      />
    </div>
  );
}

function TeachCard({ step }: { step: Extract<Step, { kind: 'teach' }> }) {
  return (
    <div className="card p-5 sm:p-7">
      {step.say && <div className="mb-4"><MascotSay mood="idle" text={step.say} /></div>}
      {step.title && <h2 className="font-display text-2xl font-extrabold ink mb-4">{step.title}</h2>}
      <ContentBlocks blocks={step.body} />
    </div>
  );
}

function QuestionCard({ step, value, onChange, locked }: { step: QuestionStep; value: AnswerValue; onChange: (v: AnswerValue) => void; locked: boolean }) {
  return (
    <div className="card p-5 sm:p-7">
      <div className="text-xs font-bold uppercase tracking-wide ink-faint mb-3">題目</div>
      {step.prompt && <div className="mb-4"><ContentBlocks blocks={step.prompt} /></div>}
      <div className="text-lg font-semibold ink mb-4 leading-8">
        <Rich text={step.question.prompt} />
      </div>
      {step.widget && <div className="mb-5"><WidgetHost spec={step.widget} /></div>}
      <QuestionView question={step.question} value={value} onChange={onChange} locked={locked} />
      {step.hint && !locked && (
        <details className="mt-4 text-sm ink-soft">
          <summary className="cursor-pointer select-none">💡 看提示</summary>
          <div className="mt-2"><Rich text={step.hint} /></div>
        </details>
      )}
    </div>
  );
}

function Footer({
  kind, canCheck, locked, verdict, explanation, accent, onCheck, onContinue, outOfHearts,
}: {
  kind: string; canCheck: boolean; locked: boolean; verdict: boolean | null;
  explanation?: QuestionStep['explanation']; accent: string;
  onCheck: () => void; onContinue: () => void; outOfHearts: boolean;
}) {
  const showFeedback = locked && verdict !== null;
  const good = verdict === true;
  return (
    <div className="sticky bottom-0 mt-2"
      style={{
        background: showFeedback ? (good ? 'rgba(47,212,157,.12)' : 'rgba(255,93,126,.12)') : 'var(--bg)',
        borderTop: `1px solid ${showFeedback ? (good ? 'rgba(47,212,157,.4)' : 'rgba(255,93,126,.4)') : 'var(--border)'}`,
      }}>
      <div className="px-4 py-4" style={{ maxWidth: 'var(--app-max)', margin: '0 auto' }}>
        {showFeedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mb-3">
            <Mascot mood={good ? 'celebrate' : 'sad'} size={56} />
            <div>
              <div className={`font-extrabold text-lg ${good ? 'text-brand-500' : 'text-coral-500'}`}
                style={{ color: good ? '#13b884' : '#ff5d7e' }}>
                {good ? '答對了！' : '再想想～'}
              </div>
              {explanation && (
                <div className="text-sm ink-soft mt-1"><ContentBlocks blocks={explanation} /></div>
              )}
              {outOfHearts && <div className="text-xs mt-1" style={{ color: '#ff5d7e' }}>愛心用完了，但你仍可繼續練習。</div>}
            </div>
          </motion.div>
        )}
        <div className="flex justify-end">
          {kind === 'teach' ? (
            <button onClick={onContinue} className="btn3d px-8 py-3.5 text-white w-full sm:w-auto"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, ['--btn-shadow' as string]: '#0a7d5c' }}>
              繼續
            </button>
          ) : !locked ? (
            <button onClick={onCheck} disabled={!canCheck}
              className="btn3d px-8 py-3.5 text-white w-full sm:w-auto"
              style={{ background: canCheck ? `linear-gradient(135deg, ${accent}, ${accent}cc)` : 'var(--border-strong)', ['--btn-shadow' as string]: '#0a7d5c' }}>
              檢查
            </button>
          ) : (
            <button onClick={onContinue} className="btn3d px-8 py-3.5 text-white w-full sm:w-auto"
              style={{ background: good ? 'linear-gradient(135deg,#2fd49d,#13b884)' : 'linear-gradient(135deg,#ff7a98,#ff5d7e)', ['--btn-shadow' as string]: good ? '#0a7d5c' : '#c93e5c' }}>
              繼續
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ lesson, accuracy, accent }: { lesson: Lesson; accuracy: number; accent: string }) {
  const pct = Math.round(accuracy * 100);
  const perfect = accuracy >= 0.999;
  const xp = lesson.xp ?? 20;
  return (
    <div className="min-h-[100dvh] grid place-items-center px-4">
      <Confetti fire />
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="card p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-3"><Mascot mood="celebrate" size={120} /></div>
        <h2 className="font-display text-3xl font-extrabold ink mb-1">{perfect ? '完美通關！' : '關卡完成！'}</h2>
        <p className="ink-soft mb-6">{lesson.title}</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Stat label="正確率" value={`${pct}%`} color={accent} />
          <Stat label="獲得 XP" value={`+${xp}`} color="#56c6ff" />
        </div>
        <button onClick={() => navigate('#/')} className="btn3d px-8 py-3.5 text-white w-full"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, ['--btn-shadow' as string]: '#0a7d5c' }}>
          回到學習路徑
        </button>
      </motion.div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-xs ink-faint mt-1">{label}</div>
    </div>
  );
}
