import { cx } from '../../utils/cx';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cx('animate-pulse rounded bg-slate-200 dark:bg-slate-800', className)}
    />
  );
}
