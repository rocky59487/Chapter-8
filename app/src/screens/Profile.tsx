import { motion } from 'framer-motion';
import { useGame, levelFromXp } from '@/store/game';
import { useSettings } from '@/store/settings';
import { useActivePack, lessonSequence } from '@/store/packs';
import { navigate } from '@/router';
import { Mascot } from '@/components/Mascot';

export function Profile() {
  const pack = useActivePack();
  const game = useGame();
  const { theme, setTheme, sound, setSound, haptics, setHaptics, reducedMotion } = useSettings();
  const setReduced = (v: boolean) => useSettings.setState({ reducedMotion: v });
  const { level, into, need } = levelFromXp(game.xp);

  const seq = lessonSequence(pack);
  const doneCount = seq.filter((s) => game.lessons[s.lesson.id]?.completed).length;
  const crowns = Object.values(game.lessons).reduce((a, l) => a + (l.crown || 0), 0);

  return (
    <div className="mx-auto px-4 pb-28 pt-4" style={{ maxWidth: 'var(--app-max)' }}>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('#/')} className="text-2xl ink-faint">←</button>
        <h1 className="font-display text-2xl font-extrabold ink">個人檔案</h1>
      </div>

      {/* hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-5">
        <div className="flex items-center gap-4">
          <Mascot mood="wave" size={88} />
          <div>
            <div className="text-xs ink-faint font-semibold">學習者</div>
            <div className="font-display text-2xl font-extrabold ink">等級 {level}</div>
            <div className="w-44 h-2 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <div className="h-full" style={{ width: `${(into / need) * 100}%`, background: 'linear-gradient(90deg,#56c6ff,#2fd49d)' }} />
            </div>
            <div className="text-xs ink-faint mt-1">{into} / {need} XP 到下一級</div>
          </div>
        </div>
      </motion.div>

      {/* stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat icon="⭐" label="總 XP" value={game.xp} color="#56c6ff" />
        <Stat icon="🔥" label="連續天數" value={game.streak} color="#ffb454" />
        <Stat icon="✅" label="完成關卡" value={`${doneCount}/${seq.length}`} color="#2fd49d" />
        <Stat icon="👑" label="獲得皇冠" value={crowns} color="#b59bff" />
      </div>

      {game.exam && (
        <div className="card p-5 mb-6 flex items-center justify-between">
          <div>
            <div className="ink-faint text-xs font-semibold">期末考卷最佳成績</div>
            <div className="font-display text-3xl font-extrabold ink">{game.exam.score} 分</div>
          </div>
          <button onClick={() => navigate('#/exam')} className="btn3d px-5 py-2.5 text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#2fd49d,#13b884)', ['--btn-shadow' as string]: '#0a7d5c' }}>
            再挑戰
          </button>
        </div>
      )}

      {/* settings */}
      <div className="card p-5">
        <h2 className="font-display text-lg font-extrabold ink mb-3">設定</h2>
        <Row label="🌙 深色主題">
          <Toggle on={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
        </Row>
        <Row label="🔊 音效">
          <Toggle on={sound} onChange={setSound} />
        </Row>
        <Row label="📳 觸覺回饋">
          <Toggle on={haptics} onChange={setHaptics} />
        </Row>
        <Row label="🎬 減少動態效果">
          <Toggle on={reducedMotion} onChange={setReduced} />
        </Row>

        <div className="border-t mt-4 pt-4 flex flex-wrap gap-3" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => game.refillHearts()} className="btn3d px-4 py-2.5 ink text-sm"
            style={{ background: 'var(--surface-2)', ['--btn-shadow' as string]: 'var(--border-strong)', border: '1px solid var(--border)' }}>
            ❤️ 補滿愛心
          </button>
          <button
            onClick={() => { if (confirm('確定要清除所有學習進度嗎？此動作無法復原。')) game.resetAll(); }}
            className="btn3d px-4 py-2.5 text-sm"
            style={{ background: 'rgba(255,93,126,.12)', color: '#ff5d7e', ['--btn-shadow' as string]: '#c93e5c', border: '1px solid rgba(255,93,126,.4)' }}>
            🗑 清除進度
          </button>
        </div>
      </div>

      <p className="text-center ink-faint text-xs mt-8">Lumina · 內容驅動的互動學習平台</p>
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-extrabold mt-1" style={{ color }}>{value}</div>
      <div className="text-xs ink-faint mt-0.5">{label}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="ink">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="relative w-12 h-7 rounded-full transition"
      style={{ background: on ? '#2fd49d' : 'var(--border-strong)' }}>
      <motion.span className="absolute top-1 w-5 h-5 rounded-full bg-white" animate={{ left: on ? 26 : 4 }} />
    </button>
  );
}
