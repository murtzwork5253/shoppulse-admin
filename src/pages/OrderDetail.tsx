import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { getOrder } from '../api/orders';
import { DataTable, type Column } from '../components/table/DataTable';
import { Card } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { useFetch } from '../hooks/useFetch';
import type { CartItem } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';

const columns: Column<CartItem>[] = [
  {
    key: 'title',
    header: 'Product',
    render: (item) => (
      <Link
        to={`/products/${item.id}`}
        className="flex items-center gap-3 rounded font-medium hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
      >
        <img
          src={item.thumbnail}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="size-10 shrink-0 rounded bg-slate-100 object-cover dark:bg-slate-800"
        />
        <span className="line-clamp-2">{item.title}</span>
      </Link>
    ),
  },
  { key: 'price', header: 'Price', align: 'right', render: (i) => formatCurrency(i.price) },
  { key: 'quantity', header: 'Qty', align: 'right', render: (i) => formatNumber(i.quantity) },
  {
    key: 'total',
    header: 'Line total',
    align: 'right',
    className: 'hidden sm:table-cell',
    render: (i) => formatCurrency(i.total),
  },
  {
    key: 'discountedTotal',
    header: 'After discount',
    align: 'right',
    render: (i) => formatCurrency(i.discountedTotal),
  },
];

const backLink =
  'inline-flex items-center gap-1 rounded text-sm text-slate-600 hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:text-slate-400';

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export default function OrderDetail() {
  const { id = '' } = useParams();
  const { data: order, loading, error, status, retry } = useFetch((s) => getOrder(id, s), [id]);

  return (
    <div className="space-y-4">
      <Link to="/orders" className={backLink}>
        <ArrowLeft size={16} aria-hidden /> Back to orders
      </Link>

      {error ? (
        <Card>
          {status === 404 ? (
            <ErrorState message={`Order #${id} doesn't exist.`} />
          ) : (
            <ErrorState message={error} onRetry={retry} />
          )}
        </Card>
      ) : (
        <>
          <Card>
            <h2 className="font-semibold">Order #{id}</h2>
            {loading || !order ? (
              <Skeleton className="mt-4 h-14" />
            ) : (
              <dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                <Summary label="Customer ID" value={String(order.userId)} />
                <Summary label="Items" value={formatNumber(order.totalQuantity)} />
                <Summary label="Total" value={formatCurrency(order.total)} />
                <Summary
                  label="Discount"
                  value={formatCurrency(order.total - order.discountedTotal)}
                />
                <Summary label="You pay" value={formatCurrency(order.discountedTotal)} />
              </dl>
            )}
          </Card>

          <DataTable
            columns={columns}
            rows={order?.products ?? []}
            getRowId={(i) => i.id}
            loading={loading}
            skeletonRows={4}
            emptyMessage="This order has no items."
          />
        </>
      )}
    </div>
  );
}
