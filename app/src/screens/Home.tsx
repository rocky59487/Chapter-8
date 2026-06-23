import { motion } from 'framer-motion';
import { useActivePack } from '@/store/packs';
import { useGame } from '@/store/game';
import { navigate } from '@/router';
import { Mascot } from '@/components/Mascot';
import type { Lesson, Unit } from '@/types/pack';

const TYPE_ICON: Record<string, string> = {
  teach: '📘',
  practice: '✏️',
  checkpoint: '🏆',
  review: '🔁',
};

export function Home() {
  const pack = useActivePack();
  const lessons = useGame((s) => s.lessons);
  const exam = useGame((s) => s.exam);

  // Determine unlock state: a lesson is unlocked if it's the first overall or
  // the previous lesson is completed.
  const flat: { unit: Unit; lesson: Lesson }[] = [];
  pack.units.forEach((u) => u.lessons.forEach((l) => flat.push({ unit: u, lesson: l })));
  const isUnlocked = (i: number) => i === 0 || !!lessons[flat[i - 1].lesson.id]?.completed;
  const allDone = flat.every((f) => lessons[f.lesson.id]?.completed);

  let runningIndex = -1;

  return (
    <div className="mx-auto px-4 pb-28 pt-4" style={{ maxWidth: 'var(--app-max)' }}>
      {/* course header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden mb-6">
        <div className="relative p-6 sm:p-8" style={{ background: `linear-gradient(135deg, ${pack.accent}22, transparent 60%)` }}>
          <div className="flex items-center gap-4">
            <div className="grid place-items-center w-16 h-16 rounded-2xl text-3xl font-display font-extrabold flex-none"
              style={{ background: `linear-gradient(135deg, ${pack.accent}, ${pack.accent}cc)`, color: '#06241b' }}>
              {pack.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold ink-faint">{pack.subject}</div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold ink leading-tight">{pack.title}</h1>
              <p className="ink-soft text-sm mt-1">{pack.subtitle}</p>
            </div>
          </div>
          <p className="ink-soft mt-4 leading-7 text-sm sm:text-base">{pack.description}</p>
          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            <Chip>📚 {pack.units.length} 單元</Chip>
            <Chip>🎯 {flat.length} 關卡</Chip>
            <Chip>⏱ 約 {pack.estimatedMinutes} 分鐘</Chip>
          </div>
        </div>
      </motion.div>

      {/* the path */}
      {pack.units.map((unit) => (
        <section key={unit.id} className="mb-8">
          <UnitBanner unit={unit} />
          <div className="flex flex-col items-center gap-5 mt-5">
            {unit.lessons.map((lesson, li) => {
              runningIndex++;
              const idx = runningIndex;
              const prog = lessons[lesson.id];
              const unlocked = isUnlocked(idx);
              // serpentine horizontal offset
              const offset = Math.sin(li * 1.15) * 90;
              return (
                <PathNode
                  key={lesson.id}
                  lesson={lesson}
                  color={unit.color ?? pack.accent ?? '#2fd49d'}
                  offset={offset}
                  unlocked={unlocked}
                  completed={!!prog?.completed}
                  crown={prog?.crown ?? 0}
                  onClick={() => unlocked && navigate(`#/lesson/${lesson.id}`)}
                />
              );
            })}
          </div>
        </section>
      ))}

      {/* exam gateway */}
      <motion.div whileHover={{ scale: 1.01 }} className="card p-6 text-center mt-2"
        style={{ borderColor: allDone ? pack.accent : 'var(--border)' }}>
        <div className="flex justify-center mb-2">
          <Mascot mood={allDone ? 'celebrate' : 'think'} size={84} />
        </div>
        <h3 className="font-display text-xl font-extrabold ink">📝 期末考卷</h3>
        <p className="ink-soft text-sm mt-1 mb-4">
          {allDone ? '所有單元完成！挑戰完整考卷吧。' : '完成所有單元後解鎖；也可以先試考。'}
        </p>
        {exam && (
          <div className="text-sm ink-soft mb-3">上次成績：<span className="font-bold ink">{exam.score} 分</span></div>
        )}
        <button onClick={() => navigate('#/exam')}
          className="btn3d px-6 py-3 text-white"
          style={{ background: 'linear-gradient(135deg,#2fd49d,#13b884)', ['--btn-shadow' as string]: '#0a7d5c' }}>
          {exam ? '重新挑戰考卷' : '開始考卷'}
        </button>
      </motion.div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 rounded-full ink-soft"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>{children}</span>
  );
}

function UnitBanner({ unit }: { unit: Unit }) {
  return (
    <div className="rounded-2xl px-5 py-4 flex items-center gap-3 text-white"
      style={{ background: `linear-gradient(135deg, ${unit.color}, ${unit.color}bb)` }}>
      <span className="text-2xl">{unit.icon}</span>
      <div>
        <div className="font-display font-extrabold text-lg leading-tight">{unit.title}</div>
        {unit.subtitle && <div className="text-white/80 text-sm">{unit.subtitle}</div>}
      </div>
    </div>
  );
}

function PathNode({
  lesson, color, offset, unlocked, completed, crown, onClick,
}: {
  lesson: Lesson; color: string; offset: number; unlocked: boolean; completed: boolean; crown: number; onClick: () => void;
}) {
  return (
    <motion.div style={{ transform: `translateX(${offset}px)` }} className="flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={unlocked ? { scale: 1.06 } : {}}
        onClick={onClick}
        disabled={!unlocked}
        className="relative grid place-items-center rounded-full"
        style={{
          width: 74, height: 74,
          background: completed
            ? `linear-gradient(135deg, ${color}, ${color}cc)`
            : unlocked ? 'var(--surface)' : 'var(--surface-2)',
          border: `3px solid ${unlocked ? color : 'var(--border-strong)'}`,
          boxShadow: unlocked ? `0 6px 0 0 ${shade(color)}` : 'none',
          opacity: unlocked ? 1 : 0.6,
          cursor: unlocked ? 'pointer' : 'not-allowed',
        }}
      >
        <span className="text-2xl" style={{ filter: completed ? 'grayscale(0)' : undefined }}>
          {!unlocked ? '🔒' : completed ? '✓' : TYPE_ICON[lesson.type]}
        </span>
        {crown > 0 && (
          <span className="absolute -top-2 -right-1 text-lg" title={`${crown} 冠`}>👑</span>
        )}
      </motion.button>
      <div className="mt-2 text-center">
        <div className="font-bold ink text-sm">{lesson.title}</div>
        {lesson.subtitle && <div className="ink-faint text-xs">{lesson.subtitle}</div>}
      </div>
    </motion.div>
  );
}

function shade(hex: string): string {
  // darken a hex color for the 3D button shadow
  const n = hex.replace('#', '');
  const r = Math.max(0, parseInt(n.slice(0, 2), 16) - 50);
  const g = Math.max(0, parseInt(n.slice(2, 4), 16) - 50);
  const b = Math.max(0, parseInt(n.slice(4, 6), 16) - 50);
  return `rgb(${r},${g},${b})`;
}
