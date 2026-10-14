import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Skeleton } from '../ui/Skeleton';
import { focusRing } from '../ui/styles';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right';
  /** Extra classes for the header and cells, e.g. `hidden md:table-cell` to hide on phones. */
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  loading?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  skeletonRows?: number;
  /** Accessible name for the table, read by screen readers but not shown. */
  caption?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  loading,
  sortBy,
  order,
  onSort,
  emptyMessage = 'No results found.',
  skeletonRows = 10,
  caption,
}: Props<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b border-line bg-surface-2/60 text-left text-xs font-semibold tracking-wide text-ink-2 uppercase">
            <tr>
              {columns.map((col) => {
                const active = sortBy === col.key;
                const Icon = !active ? ArrowUpDown : order === 'asc' ? ArrowUp : ArrowDown;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cx(
                      'px-3 py-3.5 sm:px-5',
                      col.align === 'right' && 'text-right',
                      col.className,
                    )}
                    aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    {col.sortable && onSort ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        className={cx(
                          'inline-flex items-center gap-1.5 rounded uppercase hover:text-ink',
                          active && 'text-brand-600 dark:text-brand-300',
                          focusRing,
                        )}
                      >
                        {col.header}
                        <Icon size={14} aria-hidden className={active ? '' : 'opacity-50'} />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className={cx('px-3 py-4 sm:px-5', col.className)}>
                      <Skeleton className="h-4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-14 text-center text-ink-2">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={getRowId(row)} className="transition-colors hover:bg-brand-500/5">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cx(
                        'px-3 py-3.5 sm:px-5',
                        col.align === 'right' && 'text-right tabular-nums',
                        col.className,
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
