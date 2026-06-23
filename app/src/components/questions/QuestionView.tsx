import { useMemo, useState } from 'react';
import type { Question, MatchItem } from '@/types/pack';
import { Rich } from '../Tex';
import { WidgetHost } from '../widgets/registry';
import type { AnswerValue } from './grade';
import { sfx } from '@/lib/sfx';
import { useSettings } from '@/store/settings';

interface Props {
  question: Question;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
  locked: boolean;
  /** when locked, which choice is the right one (for highlight). */
  showSolution?: boolean;
}

export function QuestionView(props: Props) {
  const { question } = props;
  switch (question.type) {
    case 'mcq':
      return <Mcq {...props} q={question} />;
    case 'truefalse':
      return <TrueFalse {...props} q={question} />;
    case 'fill':
      return <Fill {...props} q={question} />;
    case 'match':
      return <Match {...props} q={question} />;
    case 'order':
      return <Order {...props} q={question} />;
  }
}

function useTap() {
  const sound = useSettings((s) => s.sound);
  return () => sound && sfx.select();
}

/* --------------------------------- MCQ ----------------------------------- */
function Mcq({ q, value, onChange, locked, showSolution }: Props & { q: Extract<Question, { type: 'mcq' }> }) {
  const tap = useTap();
  const order = useMemo(() => {
    const arr = [...q.choices];
    if (q.shuffle) arr.sort(() => Math.random() - 0.5);
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  return (
    <div className="space-y-3">
      {order.map((c) => {
        const selected = value === c.id;
        const isCorrect = c.id === q.answer;
        let cls = 'border-[var(--border-strong)]';
        if (locked && isCorrect) cls = 'border-brand-400 bg-brand-400/10';
        else if (locked && selected && !isCorrect) cls = 'border-coral-400 bg-coral-400/10';
        else if (selected) cls = 'border-sky-400 bg-sky-400/10';
        return (
          <button
            key={c.id}
            disabled={locked}
            onClick={() => { tap(); onChange(c.id); }}
            className={`w-full text-left rounded-2xl px-4 py-3.5 border-2 transition ink ${cls}`}
            style={{ background: selected || (locked && isCorrect) ? undefined : 'var(--surface)' }}
          >
            <span className="inline-flex items-center gap-3">
              <span className="grid place-items-center w-7 h-7 rounded-lg text-sm font-bold flex-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}>
                {c.id}
              </span>
              <span className="leading-7"><Rich text={c.label} /></span>
            </span>
            {locked && selected && c.feedback && (
              <div className="mt-2 text-sm ink-soft"><Rich text={c.feedback} /></div>
            )}
          </button>
        );
      })}
      {showSolution && <Solution />}
    </div>
  );
}

/* ------------------------------ True / False ------------------------------ */
function TrueFalse({ q, value, onChange, locked }: Props & { q: Extract<Question, { type: 'truefalse' }> }) {
  const tap = useTap();
  const opts: { v: boolean; label: string; icon: string }[] = [
    { v: true, label: q.trueLabel ?? '正確 ◯', icon: '◯' },
    { v: false, label: q.falseLabel ?? '錯誤 ✕', icon: '✕' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {opts.map((o) => {
        const selected = value === o.v;
        const isCorrect = o.v === q.answer;
        let cls = 'border-[var(--border-strong)]';
        if (locked && isCorrect) cls = 'border-brand-400 bg-brand-400/10';
        else if (locked && selected && !isCorrect) cls = 'border-coral-400 bg-coral-400/10';
        else if (selected) cls = 'border-sky-400 bg-sky-400/10';
        return (
          <button
            key={String(o.v)}
            disabled={locked}
            onClick={() => { tap(); onChange(o.v); }}
            className={`rounded-2xl px-4 py-6 border-2 text-lg font-bold ink transition ${cls}`}
            style={{ background: 'var(--surface)' }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- Fill ---------------------------------- */
function Fill({ q, value, onChange, locked }: Props & { q: Extract<Question, { type: 'fill' }> }) {
  const tap = useTap();
  const v = (value as string) ?? '';
  return (
    <div>
      <div className="flex items-center gap-2 rounded-2xl px-4 py-3 border-2"
        style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)' }}>
        <input
          value={v}
          disabled={locked}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder ?? '輸入答案…'}
          className="flex-1 bg-transparent outline-none ink text-lg"
          inputMode={q.normalize === 'text' ? 'text' : 'text'}
        />
        {q.unit && <span className="ink-faint">{q.unit}</span>}
      </div>
      {q.chips && q.chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {q.chips.map((ch) => (
            <button
              key={ch}
              disabled={locked}
              onClick={() => { tap(); onChange((v + ch)); }}
              className="px-3 py-2 rounded-xl text-sm font-mono ink"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}
            >
              {ch}
            </button>
          ))}
          <button
            disabled={locked}
            onClick={() => { tap(); onChange(v.slice(0, -1)); }}
            className="px-3 py-2 rounded-xl text-sm ink-soft"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}
          >⌫</button>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Match --------------------------------- */
function Match({ q, value, onChange, locked }: Props & { q: Extract<Question, { type: 'match' }> }) {
  const tap = useTap();
  const map = (value as Record<string, string>) ?? {};
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const usedRight = new Set(Object.values(map));

  const pick = (rightId: string) => {
    if (!activeLeft) return;
    tap();
    const next = { ...map };
    // remove right from any prior left
    for (const k of Object.keys(next)) if (next[k] === rightId) delete next[k];
    next[activeLeft] = rightId;
    onChange(next);
    setActiveLeft(null);
  };

  const correctPair = (l: string) => q.pairs.find((p) => p[0] === l)?.[1];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="text-xs ink-faint font-semibold">圖形</div>
        {q.left.map((l) => {
          const chosen = map[l.id];
          const ok = locked && chosen === correctPair(l.id);
          const bad = locked && chosen && chosen !== correctPair(l.id);
          return (
            <button
              key={l.id}
              disabled={locked}
              onClick={() => { tap(); setActiveLeft(l.id); }}
              className={`w-full rounded-2xl p-2 border-2 transition ${
                activeLeft === l.id ? 'border-sky-400' : ok ? 'border-brand-400' : bad ? 'border-coral-400' : 'border-[var(--border-strong)]'
              }`}
              style={{ background: 'var(--surface)' }}
            >
              <ItemView item={l} />
              <div className="mt-1 text-sm font-bold ink">
                {chosen ? `→ ${chosen}` : '點此選擇 →'}
              </div>
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        <div className="text-xs ink-faint font-semibold">方程式</div>
        {q.right.map((r) => (
          <button
            key={r.id}
            disabled={locked || (usedRight.has(r.id) && !activeLeft)}
            onClick={() => pick(r.id)}
            className={`w-full text-left rounded-2xl px-4 py-3 border-2 ink transition ${
              usedRight.has(r.id) ? 'opacity-50' : 'border-[var(--border-strong)]'
            }`}
            style={{ background: 'var(--surface)' }}
          >
            <span className="font-bold mr-2">{r.id}</span>
            <ItemView item={r} inline />
          </button>
        ))}
      </div>
    </div>
  );
}

function ItemView({ item, inline }: { item: MatchItem; inline?: boolean }) {
  if (item.widget) return <WidgetHost spec={item.widget} />;
  return <span className={inline ? '' : 'block'}><Rich text={item.label} /></span>;
}

/* --------------------------------- Order --------------------------------- */
function Order({ q, value, onChange, locked }: Props & { q: Extract<Question, { type: 'order' }> }) {
  const tap = useTap();
  const seq = (value as string[]) ?? [];
  const bank = q.tokens.filter((t) => !seq.includes(t.id));
  const label = (id: string) => q.tokens.find((t) => t.id === id)?.label ?? id;
  return (
    <div>
      <div className="min-h-[56px] rounded-2xl p-3 flex flex-wrap gap-2 mb-3"
        style={{ background: 'var(--surface-2)', border: '1px dashed var(--border-strong)' }}>
        {seq.length === 0 && <span className="ink-faint text-sm self-center">依正確順序點選下方步驟</span>}
        {seq.map((id, i) => (
          <button
            key={id}
            disabled={locked}
            onClick={() => { tap(); onChange(seq.filter((x) => x !== id)); }}
            className="px-3 py-2 rounded-xl ink font-medium"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)' }}
          >
            <span className="ink-faint mr-1">{i + 1}.</span><Rich text={label(id)} />
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {bank.map((t) => (
          <button
            key={t.id}
            disabled={locked}
            onClick={() => { tap(); onChange([...seq, t.id]); }}
            className="px-3 py-2 rounded-xl ink font-medium"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)' }}
          >
            <Rich text={t.label} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Solution() {
  return null;
}
