import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

type Color = 'green' | 'amber' | 'red' | 'slate' | 'brand';

const colors: Record<Color, string> = {
  green: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300',
  amber: 'bg-amber-500/10 text-amber-700 ring-amber-500/30 dark:text-amber-300',
  red: 'bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-300',
  brand: 'bg-brand-500/10 text-brand-700 ring-brand-500/25 dark:text-brand-200',
  slate: 'bg-surface-2 text-ink-2 ring-line',
};

export function Badge({ color = 'slate', children }: { color?: Color; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full whitespace-nowrap px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        colors[color],
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
