import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useActivePack } from '@/store/packs';
import { useGame } from '@/store/game';
import { useSettings } from '@/store/settings';
import { navigate } from '@/router';
import { ContentBlocks } from '@/components/ContentBlocks';
import { QuestionView } from '@/components/questions/QuestionView';
import { grade, type AnswerValue } from '@/components/questions/grade';
import { Rich } from '@/components/Tex';
import { Mascot } from '@/components/Mascot';
import { Confetti } from '@/components/Confetti';
import { sfx } from '@/lib/sfx';
import type { QuestionStep } from '@/types/pack';

export function Exam() {
  const pack = useActivePack();
  const exam = pack.exam;
  const recordExam = useGame((s) => s.recordExam);
  const sound = useSettings((s) => s.sound);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);

  const allQuestions = useMemo(() => {
    const out: { q: QuestionStep; points: number; section: string }[] = [];
    exam?.sections.forEach((s) => s.questions.forEach((q) => out.push({ q, points: s.pointsEach ?? 1, section: s.title })));
    return out;
  }, [exam]);

  if (!exam) return <div className="p-8 ink">此課程沒有考卷。</div>;

  const totalPoints = allQuestions.reduce((a, b) => a + b.points, 0);
  const earned = allQuestions.reduce((a, { q, points }) => a + (grade(q.question, answers[q.id] ?? null) ? points : 0), 0);
  const correctCount = allQuestions.filter(({ q }) => grade(q.question, answers[q.id] ?? null)).length;
  const score = Math.round((earned / totalPoints) * 100);
  const answeredCount = Object.values(answers).filter((v) => v !== null && v !== undefined && v !== '').length;

  const submit = () => {
    setSubmitted(true);
    if (sound) score >= (exam.passScore ?? 60) ? sfx.levelup() : sfx.complete();
    recordExam({ score, total: allQuestions.length, correct: correctCount, takenAt: Date.now() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const passed = score >= (exam.passScore ?? 60);

  return (
    <div className="mx-auto px-4 pb-28 pt-4" style={{ maxWidth: 'var(--app-max)' }}>
      {submitted && passed && <Confetti fire />}

      {/* header / result banner */}
      {!submitted ? (
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('#/')} className="text-2xl ink-faint">✕</button>
            <div>
              <h1 className="font-display text-2xl font-extrabold ink">{exam.title}</h1>
              {exam.intro && <p className="ink-soft text-sm mt-1"><Rich text={exam.intro} /></p>}
            </div>
          </div>
          <div className="mt-3 text-sm ink-faint">已作答 {answeredCount} / {allQuestions.length} 題</div>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="card p-7 mb-5 text-center">
          <div className="flex justify-center mb-2"><Mascot mood={passed ? 'celebrate' : 'think'} size={100} /></div>
          <div className="text-5xl font-display font-extrabold ink">{score}<span className="text-2xl ink-faint"> 分</span></div>
          <p className="ink-soft mt-2">答對 {correctCount} / {allQuestions.length} 題・{passed ? '通過！🎉' : `未達 ${exam.passScore ?? 60} 分，再接再厲`}</p>
          <div className="flex gap-3 justify-center mt-5">
            <button onClick={() => { setSubmitted(false); setAnswers({}); window.scrollTo({ top: 0 }); }}
              className="btn3d px-5 py-3 text-white" style={{ background: 'linear-gradient(135deg,#56c6ff,#2ba8f0)', ['--btn-shadow' as string]: '#1f7fb8' }}>
              再考一次
            </button>
            <button onClick={() => navigate('#/')} className="btn3d px-5 py-3 ink"
              style={{ background: 'var(--surface)', ['--btn-shadow' as string]: 'var(--border-strong)', border: '1px solid var(--border)' }}>
              回首頁
            </button>
          </div>
        </motion.div>
      )}

      {/* questions grouped by section */}
      {exam.sections.map((section) => (
        <section key={section.id} className="mb-6">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-xl font-extrabold ink">{section.title}</h2>
            {section.pointsEach && <span className="text-xs ink-faint">每題 {section.pointsEach} 分</span>}
          </div>
          {section.instructions && <p className="ink-soft text-sm mb-3"><Rich text={section.instructions} /></p>}
          <div className="space-y-4">
            {section.questions.map((q, i) => {
              const val = answers[q.id] ?? null;
              const ok = submitted && grade(q.question, val);
              const wrong = submitted && !ok;
              return (
                <div key={q.id} className="card p-5"
                  style={{ borderColor: submitted ? (ok ? 'rgba(47,212,157,.5)' : 'rgba(255,93,126,.5)') : 'var(--border)' }}>
                  <div className="flex items-start gap-2 mb-3">
                    <span className="grid place-items-center w-7 h-7 rounded-lg text-sm font-bold flex-none ink"
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}>{i + 1}</span>
                    <div className="text-base font-semibold ink leading-7"><Rich text={q.question.prompt} /></div>
                    {submitted && <span className="ml-auto text-xl">{ok ? '✅' : '❌'}</span>}
                  </div>
                  {q.prompt && <div className="mb-3"><ContentBlocks blocks={q.prompt} /></div>}
                  <QuestionView question={q.question} value={val} locked={submitted}
                    onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
                  {wrong && q.explanation && (
                    <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: 'var(--surface-2)' }}>
                      <div className="font-bold ink mb-1">詳解</div>
                      <ContentBlocks blocks={q.explanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {!submitted && (
        <div className="sticky bottom-0 py-4" style={{ background: 'var(--bg)' }}>
          <button onClick={submit} className="btn3d w-full py-4 text-white text-lg"
            style={{ background: 'linear-gradient(135deg,#2fd49d,#13b884)', ['--btn-shadow' as string]: '#0a7d5c' }}>
            交卷並看成績
          </button>
        </div>
      )}
    </div>
  );
}
