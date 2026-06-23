import type { ContentBlock, CalloutTone } from '@/types/pack';
import { Rich, Tex } from './Tex';
import { WidgetHost } from './widgets/registry';

const TONES: Record<CalloutTone, { icon: string; bg: string; border: string; label: string }> = {
  info: { icon: '💡', bg: 'rgba(86,198,255,.10)', border: 'rgba(86,198,255,.35)', label: '概念' },
  tip: { icon: '✨', bg: 'rgba(47,212,157,.10)', border: 'rgba(47,212,157,.38)', label: '訣竅' },
  trap: { icon: '⚠️', bg: 'rgba(255,122,152,.10)', border: 'rgba(255,122,152,.40)', label: '陷阱' },
  key: { icon: '🔑', bg: 'rgba(181,155,255,.12)', border: 'rgba(181,155,255,.42)', label: '重點' },
  warn: { icon: '🚨', bg: 'rgba(255,180,84,.12)', border: 'rgba(255,180,84,.42)', label: '注意' },
};

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}
    </div>
  );
}

function Block({ b }: { b: ContentBlock }) {
  switch (b.t) {
    case 'p':
      return <p className="leading-8 ink-soft text-[1.02rem]"><Rich text={b.text} /></p>;
    case 'h':
      return <h3 className="text-xl font-bold ink"><Rich text={b.text} /></h3>;
    case 'math':
      return (
        <div className="overflow-x-auto py-1">
          <Tex tex={b.tex} display />
        </div>
      );
    case 'steps':
      return (
        <ol className={b.ordered === false ? 'space-y-2' : 'space-y-2 list-none'}>
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 leading-7 ink-soft">
              <span
                className="flex-none mt-1 grid place-items-center w-6 h-6 rounded-full text-xs font-bold"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)', color: 'var(--accent-ink)' }}
              >
                {i + 1}
              </span>
              <span><Rich text={it} /></span>
            </li>
          ))}
        </ol>
      );
    case 'callout': {
      const tone = TONES[b.tone];
      return (
        <div className="rounded-2xl p-4 flex gap-3" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
          <span className="text-xl flex-none">{tone.icon}</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide mb-1 ink-soft">
              {b.title ?? tone.label}
            </div>
            <div className="leading-7 ink"><Rich text={b.text} /></div>
          </div>
        </div>
      );
    }
    case 'formula':
      return (
        <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {b.name && <div className="text-xs font-semibold ink-faint mb-2"><Rich text={b.name} /></div>}
          <Tex tex={b.tex} display />
          {b.note && <div className="text-sm ink-faint mt-2"><Rich text={b.note} /></div>}
        </div>
      );
    case 'image':
      return (
        <figure className="text-center">
          <img src={b.src} alt={b.alt ?? ''} className="rounded-2xl mx-auto max-w-full" />
          {b.caption && <figcaption className="text-sm ink-faint mt-2"><Rich text={b.caption} /></figcaption>}
        </figure>
      );
    case 'widget':
      return <WidgetHost spec={b.widget} />;
    default:
      return null;
  }
}
