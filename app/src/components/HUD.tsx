import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame, levelFromXp, MAX_HEARTS } from '@/store/game';
import { useSettings } from '@/store/settings';
import { navigate } from '@/router';

export function HUD() {
  const { xp, hearts, streak, regenHearts } = useGame();
  const { theme, toggleTheme, sound, setSound } = useSettings();
  const { level, into, need } = levelFromXp(xp);

  useEffect(() => {
    regenHearts();
    const t = setInterval(regenHearts, 30000);
    return () => clearInterval(t);
  }, [regenHearts]);

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur"
      style={{ background: 'color-mix(in srgb, var(--bg) 80%, transparent)' }}>
      <div className="mx-auto flex items-center justify-between gap-3 px-4 py-3"
        style={{ maxWidth: 'var(--app-max)' }}>
        <button onClick={() => navigate('#/')} className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-xl font-display font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg,#2fd49d,#13b884)' }}>L</span>
          <span className="font-display font-extrabold text-lg ink hidden sm:block">Lumina</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <Pill icon="🔥" value={streak} tip="連續學習天數" color="#ffb454" />
          <Pill icon="⭐" value={`Lv${level}`} tip="等級" color="#56c6ff" sub={`${into}/${need}`} />
          <Hearts hearts={hearts} max={MAX_HEARTS} />
          <button onClick={() => setSound(!sound)} title="音效"
            className="grid place-items-center w-9 h-9 rounded-xl ink"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {sound ? '🔊' : '🔇'}
          </button>
          <button onClick={toggleTheme} title="主題"
            className="grid place-items-center w-9 h-9 rounded-xl ink"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
      {/* level progress */}
      <div className="h-1 w-full" style={{ background: 'var(--surface-2)' }}>
        <motion.div className="h-full" style={{ background: 'linear-gradient(90deg,#56c6ff,#2fd49d)' }}
          initial={false} animate={{ width: `${(into / need) * 100}%` }} />
      </div>
    </div>
  );
}

function Pill({ icon, value, tip, color, sub }: { icon: string; value: string | number; tip: string; color: string; sub?: string }) {
  return (
    <div title={tip} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <span style={{ color }}>{icon}</span>
      <span className="font-bold ink text-sm">{value}</span>
      {sub && <span className="ink-faint text-[10px] hidden sm:inline">{sub}</span>}
    </div>
  );
}

function Hearts({ hearts, max }: { hearts: number; max: number }) {
  return (
    <div className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} title="愛心">
      <span style={{ color: '#ff5d7e' }}>❤️</span>
      <span className="font-bold ink text-sm">{hearts === max ? max : `${hearts}/${max}`}</span>
    </div>
  );
}
