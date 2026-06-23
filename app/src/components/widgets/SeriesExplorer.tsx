import { useEffect, useRef, useState } from 'react';
import { compile } from '@/lib/expr';
import { setupCanvas, mapper, getTheme, fmt, PALETTE } from './plot';
import { useSettings } from '@/store/settings';

export interface SeriesParams {
  /** term a_k as an expression in x (x plays the role of k). */
  term: string;
  from?: number;
  maxN?: number;
  /** known limit/target to draw as a dashed line. */
  target?: number;
  /** 'partial' shows partial sums S_n; 'sequence' shows a_k itself. */
  mode?: 'partial' | 'sequence';
  targetLabel?: string;
}

export function SeriesExplorer({ params, height = 240 }: { params: SeriesParams; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useSettings((s) => s.theme);
  const maxN = params.maxN ?? 16;
  const from = params.from ?? 0;
  const [n, setN] = useState(Math.min(8, maxN));
  const [readout, setReadout] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = compile(params.term);
    const mode = params.mode ?? 'partial';

    // compute values
    const vals: number[] = [];
    let acc = 0;
    for (let k = from; k < from + maxN; k++) {
      const ak = a(k);
      acc += ak;
      vals.push(mode === 'partial' ? acc : ak);
    }
    const shown = vals.slice(0, n);
    const lo = Math.min(0, ...shown, params.target ?? 0);
    const hi = Math.max(...shown, params.target ?? 0) * 1.1 || 1;

    const draw = () => {
      const { ctx, w, h } = setupCanvas(canvas);
      const th = getTheme();
      const m = mapper(w, h, from - 0.5, from + n + 0.5, lo, hi, 30);
      // baseline
      ctx.strokeStyle = th.axis;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(m.X(from - 0.5), m.Y(0));
      ctx.lineTo(m.X(from + n + 0.5), m.Y(0));
      ctx.stroke();

      // target line
      if (params.target !== undefined) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,180,84,.85)';
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(m.X(from - 0.5), m.Y(params.target));
        ctx.lineTo(m.X(from + n + 0.5), m.Y(params.target));
        ctx.stroke();
        ctx.restore();
      }

      // bars + dots
      const bw = Math.min(20, (m.X(from + 1) - m.X(from)) * 0.5);
      shown.forEach((v, i) => {
        const k = from + i;
        const x = m.X(k);
        ctx.fillStyle = 'rgba(47,212,157,.28)';
        ctx.fillRect(x - bw / 2, m.Y(Math.max(0, v)), bw, Math.abs(m.Y(v) - m.Y(0)));
        ctx.fillStyle = PALETTE.brand;
        ctx.beginPath();
        ctx.arc(x, m.Y(v), 4, 0, Math.PI * 2);
        ctx.fill();
      });

      const last = shown[shown.length - 1];
      setReadout(
        mode === 'partial'
          ? `S_${n} = ${fmt(last, 5)}`
          : `a_${from + n - 1} = ${fmt(last, 5)}`
      );
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, theme, JSON.stringify(params)]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height, display: 'block', borderRadius: 16 }} />
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs ink-soft mb-1">
          <span>項數 n</span>
          <span className="font-mono ink">{n}</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxN}
          step={1}
          value={n}
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full"
          style={{ accentColor: PALETTE.brand }}
        />
      </div>
      <div className="mt-2 rounded-xl px-3 py-2 text-sm font-mono ink-soft"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {readout}
        {params.targetLabel && <span className="ml-2 ink">→ {params.targetLabel}</span>}
      </div>
    </div>
  );
}
