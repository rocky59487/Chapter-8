import { navigate } from '@/router';

const ITEMS = [
  { route: 'home', hash: '#/', icon: '🏠', label: '學習' },
  { route: 'library', hash: '#/library', icon: '📂', label: '課程庫' },
  { route: 'exam', hash: '#/exam', icon: '📝', label: '考卷' },
  { route: 'profile', hash: '#/profile', icon: '🙂', label: '我' },
];

/** Mobile-style bottom tab bar; hidden during lessons. */
export function BottomNav({ active }: { active: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur"
      style={{
        background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
      <div className="mx-auto flex" style={{ maxWidth: 420 }}>
        {ITEMS.map((it) => {
          const on = active === it.route || (it.route === 'home' && active === 'lesson');
          return (
            <button key={it.route} onClick={() => navigate(it.hash)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition"
              style={{ color: on ? 'var(--accent-ink)' : 'var(--text-faint)' }}>
              <span className="text-xl" style={{ transform: on ? 'scale(1.12)' : 'scale(1)', transition: 'transform .15s' }}>
                {it.icon}
              </span>
              <span className="text-[11px] font-semibold">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
