import { Link } from 'react-router';
import { getOrders } from '../api/orders';
import { DataTable, type Column } from '../components/table/DataTable';
import { ErrorState } from '../components/ui/ErrorState';
import { Pagination } from '../components/ui/Pagination';
import { useFetch } from '../hooks/useFetch';
import { useTableParams } from '../hooks/useTableParams';
import type { Cart } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';

const columns: Column<Cart>[] = [
  {
    key: 'id',
    header: 'Order',
    render: (o) => (
      <Link
        to={`/orders/${o.id}`}
        className="rounded font-medium text-brand-600 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:text-brand-500"
      >
        #{o.id}
      </Link>
    ),
  },
  { key: 'userId', header: 'Customer ID', render: (o) => o.userId },
  {
    key: 'products',
    header: 'Products',
    align: 'right',
    className: 'hidden md:table-cell',
    render: (o) => formatNumber(o.totalProducts),
  },
  {
    key: 'quantity',
    header: 'Quantity',
    align: 'right',
    render: (o) => formatNumber(o.totalQuantity),
  },
  {
    key: 'total',
    header: 'Total',
    align: 'right',
    className: 'hidden md:table-cell',
    render: (o) => formatCurrency(o.total),
  },
  {
    key: 'discountedTotal',
    header: 'Discounted total',
    align: 'right',
    render: (o) => formatCurrency(o.discountedTotal),
  },
  {
    key: 'savings',
    header: 'Savings',
    align: 'right',
    className: 'hidden sm:table-cell',
    render: (o) => (
      <span className="text-green-600 dark:text-green-400">
        {formatCurrency(o.total - o.discountedTotal)}
      </span>
    ),
  },
];

export default function Orders() {
  const { page, pageSize, update } = useTableParams();
  const { data, loading, error, retry } = useFetch(
    (signal) => getOrders({ page, pageSize }, signal),
    [page, pageSize],
  );

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <ErrorState message={error} onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        rows={data?.carts ?? []}
        getRowId={(o) => o.id}
        loading={loading}
        skeletonRows={pageSize}
        emptyMessage="No orders found."
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
    </div>
  );
}
