import { useEffect, useRef } from 'react';
import { useSettings } from '@/store/settings';

const COLORS = ['#2fd49d', '#56c6ff', '#b59bff', '#ffb454', '#ff7a98', '#ffe066'];

/** Lightweight canvas confetti burst that auto-cleans after ~2.4s. */
export function Confetti({ fire }: { fire: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useSettings((s) => s.reducedMotion);

  useEffect(() => {
    if (!fire || reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const W = window.innerWidth;
    const H = window.innerHeight;
    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vr: number; shape: number };
    const parts: P[] = [];
    const N = 150;
    for (let i = 0; i < N; i++) {
      parts.push({
        x: W / 2 + (Math.random() - 0.5) * 120,
        y: H * 0.35,
        vx: (Math.random() - 0.5) * 12,
        vy: -8 - Math.random() * 9,
        r: 4 + Math.random() * 6,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        shape: Math.random() > 0.5 ? 0 : 1,
      });
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.vy += 0.32;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - t / 2400);
        if (p.shape === 0) ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r / 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      if (t < 2400) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [fire, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 60, width: '100vw', height: '100vh' }}
    />
  );
}
