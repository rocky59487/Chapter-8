/** Reusable canvas-plotting helpers shared by interactive widgets. */
import type { CompiledFn } from '@/lib/expr';

export interface Theme {
  axis: string;
  grid: string;
  text: string;
  ink: string;
}

export function getTheme(): Theme {
  const dark = document.documentElement.classList.contains('dark');
  return dark
    ? {
        axis: 'rgba(255,255,255,.55)',
        grid: 'rgba(255,255,255,.12)',
        text: 'rgba(230,240,255,.75)',
        ink: '#eef5ff',
      }
    : {
        axis: 'rgba(20,32,46,.55)',
        grid: 'rgba(20,40,70,.10)',
        text: 'rgba(40,60,90,.8)',
        ink: '#16202e',
      };
}

export interface Setup {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
}

export function setupCanvas(canvas: HTMLCanvasElement): Setup {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(280, rect.width || canvas.clientWidth || 320);
  const h = Math.max(180, rect.height || canvas.clientHeight || 240);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h, dpr };
}

export interface Mapper {
  X: (x: number) => number;
  Y: (y: number) => number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  pad: number;
}

export function mapper(
  w: number,
  h: number,
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number,
  pad = 30
): Mapper {
  const sx = (w - pad * 2) / (xmax - xmin);
  const sy = (h - pad * 2) / (ymax - ymin);
  return {
    X: (x) => pad + (x - xmin) * sx,
    Y: (y) => h - pad - (y - ymin) * sy,
    xmin,
    xmax,
    ymin,
    ymax,
    pad,
  };
}

export function drawAxes(ctx: CanvasRenderingContext2D, w: number, h: number, m: Mapper, th: Theme) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.font = '11px Inter, sans-serif';
  ctx.strokeStyle = th.grid;
  ctx.fillStyle = th.text;
  for (let x = Math.ceil(m.xmin); x <= Math.floor(m.xmax); x++) {
    const px = m.X(x);
    ctx.beginPath();
    ctx.moveTo(px, m.pad);
    ctx.lineTo(px, h - m.pad);
    ctx.stroke();
  }
  for (let y = Math.ceil(m.ymin); y <= Math.floor(m.ymax); y++) {
    const py = m.Y(y);
    ctx.beginPath();
    ctx.moveTo(m.pad, py);
    ctx.lineTo(w - m.pad, py);
    ctx.stroke();
  }
  ctx.strokeStyle = th.axis;
  ctx.lineWidth = 1.4;
  if (m.ymin < 0 && m.ymax > 0) {
    ctx.beginPath();
    ctx.moveTo(m.pad, m.Y(0));
    ctx.lineTo(w - m.pad, m.Y(0));
    ctx.stroke();
  }
  if (m.xmin < 0 && m.xmax > 0) {
    ctx.beginPath();
    ctx.moveTo(m.X(0), m.pad);
    ctx.lineTo(m.X(0), h - m.pad);
    ctx.stroke();
  }
  // tick labels on axes
  ctx.fillStyle = th.text;
  const y0 = m.ymin < 0 && m.ymax > 0 ? m.Y(0) : h - m.pad;
  for (let x = Math.ceil(m.xmin); x <= Math.floor(m.xmax); x++) {
    if (x === 0) continue;
    ctx.fillText(String(x), m.X(x) + 2, y0 - 4);
  }
  ctx.restore();
}

export function plot(
  ctx: CanvasRenderingContext2D,
  m: Mapper,
  f: CompiledFn,
  color: string,
  lw = 2.6,
  samples = 600
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= samples; i++) {
    const x = m.xmin + ((m.xmax - m.xmin) * i) / samples;
    const y = f(x);
    if (!Number.isFinite(y) || y < m.ymin * 6 || y > m.ymax * 6) {
      started = false;
      continue;
    }
    const px = m.X(x);
    const py = m.Y(Math.max(m.ymin - 1, Math.min(m.ymax + 1, y)));
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

export function shade(
  ctx: CanvasRenderingContext2D,
  m: Mapper,
  f: CompiledFn,
  a: number,
  b: number,
  color: string,
  absolute = false,
  samples = 240
) {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(m.X(lo), m.Y(0));
  for (let i = 0; i <= samples; i++) {
    const x = lo + ((hi - lo) * i) / samples;
    let y = f(x);
    if (absolute) y = Math.abs(y);
    ctx.lineTo(m.X(x), m.Y(Math.max(m.ymin, Math.min(m.ymax, y))));
  }
  ctx.lineTo(m.X(hi), m.Y(0));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function point(
  ctx: CanvasRenderingContext2D,
  m: Mapper,
  x: number,
  y: number,
  color: string,
  label?: string,
  th?: Theme
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(m.X(x), m.Y(y), 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (label && th) {
    ctx.fillStyle = th.ink;
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(label, m.X(x) + 9, m.Y(y) - 8);
  }
  ctx.restore();
}

export const PALETTE = {
  brand: '#2fd49d',
  sky: '#56c6ff',
  grape: '#b59bff',
  sunset: '#ffb454',
  coral: '#ff7a98',
};

export function fmt(v: number, digits = 4): string {
  if (!Number.isFinite(v)) return v > 0 ? '∞' : '-∞';
  const av = Math.abs(v);
  if (av !== 0 && (av < 1e-4 || av >= 1e5)) return v.toExponential(2);
  return Number(v.toFixed(digits)).toString();
}
