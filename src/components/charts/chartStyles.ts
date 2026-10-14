import type { CSSProperties } from 'react';

export const CHART_COLOR = '#7c5cf6';

export const tooltipStyle: CSSProperties = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: 12,
  boxShadow: '0 12px 32px -12px rgb(16 18 38 / 0.35)',
  color: 'var(--ink)',
  fontSize: 12,
  padding: '8px 12px',
};

// Axis text uses currentColor, so charts inherit the text color of their container.
export const axisTick = { fill: 'currentColor', fontSize: 12 };
