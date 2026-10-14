import { Link } from 'react-router';
import { getOrders } from '../api/orders';
import { DataTable, type Column } from '../components/table/DataTable';
import { ErrorState } from '../components/ui/ErrorState';
import { Pagination } from '../components/ui/Pagination';
import { useFetch } from '../hooks/useFetch';
import { useTableParams } from '../hooks/useTableParams';
import type { Cart } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';
import { linkClass } from '../components/ui/styles';

const columns: Column<Cart>[] = [
  {
    key: 'id',
    header: 'Order',
    render: (o) => (
      <Link to={`/orders/${o.id}`} className={linkClass}>
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
      <span className="text-emerald-600 dark:text-emerald-400">
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
      <div className="rounded-2xl border border-line bg-surface shadow-card">
        <ErrorState message={error} onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        caption="Orders"
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
