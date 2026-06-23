import { useEffect, useRef, useState } from 'react';
import { compile } from '@/lib/expr';
import {
  setupCanvas,
  mapper,
  drawAxes,
  plot,
  shade,
  point,
  getTheme,
  fmt,
  PALETTE,
} from './plot';
import { useSettings } from '@/store/settings';

interface FnSpec {
  expr: string;
  color?: string;
  width?: number;
}
interface PointSpec {
  x: number;
  y?: number;
  fnIndex?: number;
  label?: string;
  color?: string;
}
interface SliderSpec {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  role: 'riemann-n' | 'area-upper' | 'tangent-x' | 'series-n';
}

export interface FunctionPlotParams {
  fns?: FnSpec[];
  domain?: [number, number];
  range?: [number, number];
  mode?: 'plot' | 'riemann' | 'area' | 'tangent';
  shade?: { fnIndex?: number; expr?: string; from: number; to: number; absolute?: boolean; color?: string };
  points?: PointSpec[];
  slider?: SliderSpec;
  /** expression for the readout's "exact" value if known */
  exactLabel?: string;
}

const COLORS = [PALETTE.brand, PALETTE.grape, PALETTE.sunset, PALETTE.sky];

export function FunctionPlot({ params, height = 240 }: { params: FunctionPlotParams; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useSettings((s) => s.theme);
  const [sliderVal, setSliderVal] = useState(params.slider?.value ?? 0);
  const [readout, setReadout] = useState('');
  const animRef = useRef<number>(0);
  const drawnRef = useRef(0); // animation progress 0..1

  const fns = params.fns ?? [{ expr: 'x' }];
  const [xmin, xmax] = params.domain ?? [-4, 4];
  const [ymin, ymax] = params.range ?? [-4, 4];
  const mode = params.mode ?? 'plot';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawnRef.current = 0;
    const start = performance.now();
    const compiled = fns.map((f) => compile(f.expr));

    const render = (now: number) => {
      const p = Math.min(1, (now - start) / 480);
      drawnRef.current = p;
      draw(p);
      if (p < 1) animRef.current = requestAnimationFrame(render);
    };

    const draw = (anim: number) => {
      const { ctx, w, h } = setupCanvas(canvas);
      const th = getTheme();
      const m = mapper(w, h, xmin, xmax, ymin, ymax, 30);
      drawAxes(ctx, w, h, m, th);

      // shading / mode-specific fills
      const sv = sliderVal;
      let info = '';

      if (mode === 'riemann' && params.slider) {
        const n = Math.round(sv);
        const f = compiled[0];
        const a = params.shade?.from ?? xmin;
        const b = params.shade?.to ?? xmax;
        const dx = (b - a) / n;
        let sum = 0;
        ctx.save();
        ctx.fillStyle = 'rgba(86,198,255,.22)';
        ctx.strokeStyle = th.grid;
        for (let i = 0; i < n; i++) {
          const xc = a + (i + 0.5) * dx;
          const yv = f(xc);
          sum += yv * dx;
          const top = m.Y(Math.max(ymin, Math.min(ymax, yv)));
          const x0 = m.X(a + i * dx);
          const x1 = m.X(a + (i + 1) * dx);
          ctx.fillRect(x0, top, x1 - x0, m.Y(0) - top);
          ctx.strokeRect(x0, top, x1 - x0, m.Y(0) - top);
        }
        ctx.restore();
        info = `N = ${n}　近似 = ${fmt(sum)}`;
      } else if (params.shade) {
        const f = params.shade.expr ? compile(params.shade.expr) : compiled[params.shade.fnIndex ?? 0];
        const to = mode === 'area' && params.slider ? sv : params.shade.to;
        shade(ctx, m, f, params.shade.from, to, params.shade.color ?? 'rgba(47,212,157,.22)', params.shade.absolute);
        if (mode === 'area' && params.slider) {
          // signed area numerically
          const a = params.shade.from;
          let area = 0;
          const steps = 400;
          for (let i = 0; i < steps; i++) {
            const x = a + ((to - a) * (i + 0.5)) / steps;
            area += f(x) * ((to - a) / steps);
          }
          info = `上限 b = ${fmt(sv, 2)}　累積 = ${fmt(area)}`;
        }
      }

      // curves (animated draw-in by clipping sample count via anim)
      fns.forEach((f, i) => {
        const fn = compiled[i];
        const animFn = (x: number) => {
          const cut = xmin + (xmax - xmin) * anim;
          return x <= cut ? fn(x) : NaN;
        };
        plot(ctx, m, anim < 1 ? animFn : fn, f.color ?? COLORS[i % COLORS.length], f.width ?? 2.8);
      });

      // tangent
      if (mode === 'tangent' && params.slider) {
        const f = compiled[0];
        const x0 = sv;
        const eps = 1e-4;
        const slope = (f(x0 + eps) - f(x0 - eps)) / (2 * eps);
        const y0 = f(x0);
        const tan = (x: number) => y0 + slope * (x - x0);
        plot(ctx, m, tan, PALETTE.sunset, 2);
        point(ctx, m, x0, y0, PALETTE.coral, undefined, th);
        info = `x = ${fmt(x0, 2)}　斜率 f'(x) = ${fmt(slope, 3)}`;
      }

      // explicit points
      (params.points ?? []).forEach((pt) => {
        const y = pt.y ?? compiled[pt.fnIndex ?? 0](pt.x);
        point(ctx, m, pt.x, y, pt.color ?? PALETTE.coral, pt.label, th);
      });

      if (info) setReadout(info);
    };

    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(render);

    const ro = new ResizeObserver(() => draw(drawnRef.current || 1));
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderVal, theme, JSON.stringify(params)]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height, display: 'block', borderRadius: 16 }}
      />
      {params.slider && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs ink-soft mb-1">
            <span>{params.slider.label}</span>
            <span className="font-mono ink">{fmt(sliderVal, 2)}</span>
          </div>
          <input
            type="range"
            min={params.slider.min}
            max={params.slider.max}
            step={params.slider.step}
            value={sliderVal}
            onChange={(e) => setSliderVal(parseFloat(e.target.value))}
            className="w-full accent-brand-400"
            style={{ accentColor: PALETTE.brand }}
          />
        </div>
      )}
      {readout && (
        <div className="mt-2 rounded-xl px-3 py-2 text-sm font-mono ink-soft"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {readout}
          {params.exactLabel && <span className="ml-2 ink">精確 = {params.exactLabel}</span>}
        </div>
      )}
    </div>
  );
}
