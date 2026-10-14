import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Remove the default padding, e.g. for cards with a full-bleed banner. */
  flush?: boolean;
};

export function Card({ flush, className, ...rest }: Props) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-line bg-surface shadow-card',
        !flush && 'p-5',
        className,
      )}
      {...rest}
    />
  );
}
