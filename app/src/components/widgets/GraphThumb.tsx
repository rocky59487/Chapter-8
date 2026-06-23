import { useEffect, useRef } from 'react';
import { compile } from '@/lib/expr';
import { setupCanvas, mapper, drawAxes, plot, getTheme, PALETTE } from './plot';
import { useSettings } from '@/store/settings';

export interface GraphThumbParams {
  expr: string;
  domain?: [number, number];
  range?: [number, number];
  color?: string;
}

/** Compact static curve — used as a visual option in matching questions. */
export function GraphThumb({ params, height = 150 }: { params: GraphThumbParams; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useSettings((s) => s.theme);
  const [xmin, xmax] = params.domain ?? [-3, 3];
  const [ymin, ymax] = params.range ?? [-6, 6];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const f = compile(params.expr);
    const draw = () => {
      const { ctx, w, h } = setupCanvas(canvas);
      const th = getTheme();
      const m = mapper(w, h, xmin, xmax, ymin, ymax, 16);
      drawAxes(ctx, w, h, m, th);
      plot(ctx, m, f, params.color ?? PALETTE.sky, 3);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, JSON.stringify(params)]);

  return <canvas ref={canvasRef} style={{ width: '100%', height, display: 'block', borderRadius: 12 }} />;
}
