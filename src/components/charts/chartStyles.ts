import type { CSSProperties } from 'react';

export const CHART_COLOR = '#6366f1';

export const tooltipStyle: CSSProperties = {
  backgroundColor: 'var(--chart-surface)',
  border: '1px solid var(--chart-border)',
  borderRadius: 8,
  color: 'var(--chart-text)',
  fontSize: 12,
};

// Axis text uses currentColor, so charts inherit the text color of their container.
export const axisTick = { fill: 'currentColor', fontSize: 12 };
