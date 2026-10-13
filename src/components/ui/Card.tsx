import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        'rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
      {...rest}
    />
  );
}
