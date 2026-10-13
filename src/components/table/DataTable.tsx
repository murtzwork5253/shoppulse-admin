import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Skeleton } from '../ui/Skeleton';

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
}: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase dark:bg-slate-800/50">
          <tr>
            {columns.map((col) => {
              const active = sortBy === col.key;
              const Icon = !active ? ArrowUpDown : order === 'asc' ? ArrowUp : ArrowDown;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={cx('px-4 py-3', col.align === 'right' && 'text-right', col.className)}
                  aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className="inline-flex items-center gap-1 rounded hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:hover:text-white"
                    >
                      {col.header} <Icon size={14} aria-hidden />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className={cx('px-4 py-3', col.className)}>
                    <Skeleton className="h-4" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowId(row)} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cx(
                      'px-4 py-3',
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
  );
}
