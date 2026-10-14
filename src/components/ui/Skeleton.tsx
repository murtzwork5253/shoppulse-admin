import { cx } from '../../utils/cx';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx('animate-pulse rounded-lg bg-line/70', className)} />;
}
