import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatNumber } from '../../utils/format';
import { Button } from './Button';
import { Select } from './Select';

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
};

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-slate-500" aria-live="polite">
        Showing {formatNumber(first)}–{formatNumber(last)} of {formatNumber(total)}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-slate-500">
            Rows per page
          </span>
          <div className="w-20">
            <Select
              label="Rows per page"
              hideLabel
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <span className="text-slate-500">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3"
          >
            <ChevronLeft size={16} aria-hidden /> Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3"
          >
            Next <ChevronRight size={16} aria-hidden />
          </Button>
        </div>
      </div>
    </nav>
  );
}
