import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getCategories, getProducts } from '../api/products';
import { DataTable, type Column } from '../components/table/DataTable';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { Select } from '../components/ui/Select';
import { StockBadge } from '../components/ui/StockBadge';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { useTableParams } from '../hooks/useTableParams';
import type { Product } from '../types';
import { formatCategory, formatCurrency } from '../utils/format';

const columns: Column<Product>[] = [
  {
    key: 'title',
    header: 'Product',
    sortable: true,
    render: (p) => (
      <Link
        to={`/products/${p.id}`}
        className="flex items-center gap-3 rounded font-medium hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
      >
        <img
          src={p.thumbnail}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="size-10 shrink-0 rounded bg-slate-100 object-cover dark:bg-slate-800"
        />
        <span className="line-clamp-2">{p.title}</span>
      </Link>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    className: 'hidden md:table-cell',
    render: (p) => formatCategory(p.category),
  },
  {
    key: 'price',
    header: 'Price',
    sortable: true,
    align: 'right',
    render: (p) => formatCurrency(p.price),
  },
  {
    key: 'rating',
    header: 'Rating',
    sortable: true,
    className: 'hidden md:table-cell',
    render: (p) => `★ ${p.rating.toFixed(1)}`,
  },
  {
    key: 'stock',
    header: 'Stock',
    sortable: true,
    align: 'right',
    render: (p) => p.stock,
  },
  {
    key: 'status',
    header: 'Status',
    render: (p) => <StockBadge stock={p.stock} />,
  },
];

export default function Products() {
  const { page, pageSize, q, category, sortBy, order, update } = useTableParams();

  // The search box is local state so typing is instant; the URL (and the request) follow 400 ms later.
  const [search, setSearch] = useState(q);
  const debouncedSearch = useDebounce(search);
  useEffect(() => {
    if (debouncedSearch !== q) update({ q: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, loading, error, retry } = useFetch(
    (signal) => getProducts({ page, pageSize, q, category, sortBy, order }, signal),
    [page, pageSize, q, category, sortBy, order],
  );
  const { data: categories } = useFetch(getCategories, []);

  // If the URL asks for a page past the end (e.g. ?page=99), jump to the last real page.
  useEffect(() => {
    if (!data || data.total === 0) return;
    const lastPage = Math.ceil(data.total / pageSize);
    if (page > lastPage) update({ page: lastPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSort = (key: string) =>
    update({ sortBy: key, order: sortBy === key && order === 'asc' ? 'desc' : 'asc' });

  const filtersActive = Boolean(q || category || sortBy);
  const clearFilters = () => {
    setSearch('');
    update({ q: undefined, category: undefined, sortBy: undefined, order: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-72">
          <Input
            label="Search products"
            hideLabel
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sm:w-56">
          <Select
            label="Category"
            hideLabel
            value={category}
            onChange={(e) => update({ category: e.target.value })}
          >
            <option value="">All categories</option>
            {categories?.map((slug) => (
              <option key={slug} value={slug}>
                {formatCategory(slug)}
              </option>
            ))}
          </Select>
        </div>
        {filtersActive && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {error ? (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <ErrorState message={error} onRetry={retry} />
        </div>
      ) : (
        <>
          <DataTable
            caption="Products"
            columns={columns}
            rows={data?.products ?? []}
            getRowId={(p) => p.id}
            loading={loading}
            skeletonRows={pageSize}
            sortBy={sortBy}
            order={order}
            onSort={onSort}
            emptyMessage={q || category ? 'No products match your filters.' : 'No products found.'}
          />
          {data && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={data.total}
              onPageChange={(p) => update({ page: p === 1 ? undefined : p })}
              onPageSizeChange={(size) => update({ size })}
            />
          )}
        </>
      )}
    </div>
  );
}
