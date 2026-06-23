import type { ComponentType } from 'react';
import type { WidgetSpec } from '@/types/pack';
import { FunctionPlot } from './FunctionPlot';
import { SeriesExplorer } from './SeriesExplorer';
import { GraphThumb } from './GraphThumb';

/**
 * Widget registry: maps a course pack's `widget.type` string to a React
 * component. Adding a new interactive widget == registering it here. Course
 * packs reference widgets by type + params, so authors (or an AI) compose
 * interactivity declaratively without touching engine code.
 */
type WidgetComponent = ComponentType<{ params: any; height?: number }>;

export const WIDGETS: Record<string, WidgetComponent> = {
  functionPlot: FunctionPlot,
  series: SeriesExplorer,
  graphThumb: GraphThumb,
};

export function WidgetHost({ spec }: { spec: WidgetSpec }) {
  const Comp = WIDGETS[spec.type];
  if (!Comp) {
    return (
      <div className="rounded-xl px-3 py-4 text-sm ink-faint text-center"
        style={{ background: 'var(--surface-2)', border: '1px dashed var(--border-strong)' }}>
        （互動元件 {spec.type} 尚未支援）
      </div>
    );
  }
  return (
    <div className="rounded-2xl p-3"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
      <Comp params={spec.params ?? {}} height={spec.height} />
      {spec.caption && <p className="mt-2 text-xs ink-faint text-center">{spec.caption}</p>}
    </div>
  );
}
