import { useId, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { fieldClass } from './styles';

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
      <div className={cx('relative', !hideLabel && 'mt-1.5')}>
        <select
          id={selectId}
          className={cx(fieldClass, 'appearance-none pr-9', className)}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-3"
        />
      </div>
    </div>
  );
}
