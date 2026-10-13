import { useId, type SelectHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { fieldClass } from './Input';

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
};

export function Select({ label, hideLabel, id, className, children, ...rest }: Props) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div>
      <label htmlFor={selectId} className={cx('text-sm font-medium', hideLabel && 'sr-only')}>
        {label}
      </label>
      <select id={selectId} className={cx(fieldClass, !hideLabel && 'mt-1', className)} {...rest}>
        {children}
      </select>
    </div>
  );
}
