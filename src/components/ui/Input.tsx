import { useId, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
};

export const fieldClass =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

export function Input({ label, hideLabel, id, className, ...rest }: Props) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div>
      <label htmlFor={inputId} className={cx('text-sm font-medium', hideLabel && 'sr-only')}>
        {label}
      </label>
      <input id={inputId} className={cx(fieldClass, !hideLabel && 'mt-1', className)} {...rest} />
    </div>
  );
}
