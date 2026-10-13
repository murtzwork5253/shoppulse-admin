import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

type Color = 'green' | 'amber' | 'red' | 'slate';

const colors: Record<Color, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export function Badge({ color = 'slate', children }: { color?: Color; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colors[color],
      )}
    >
      {children}
    </span>
  );
}
