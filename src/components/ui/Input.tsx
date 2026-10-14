import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { fieldClass } from './styles';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
  /** Decorative icon shown inside the field, on the left. */
  icon?: ReactNode;
};

export function Input({ label, hideLabel, icon, id, className, ...rest }: Props) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div>
      <label htmlFor={inputId} className={cx('text-sm font-medium', hideLabel && 'sr-only')}>
        {label}
      </label>
      <div className={cx('relative', !hideLabel && 'mt-1.5')}>
        {icon && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-3"
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cx(fieldClass, Boolean(icon) && 'pl-10', className)}
          {...rest}
        />
      </div>
    </div>
  );
}
