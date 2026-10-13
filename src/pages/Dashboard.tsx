import { useMemo } from 'react';
import { Link } from 'react-router';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { monthlyTrend } from '../api/mockStats';
import { getDashboardStats } from '../api/stats';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { RevenueLineChart } from '../components/charts/RevenueLineChart';
import { DataTable, type Column } from '../components/table/DataTable';
import { Card } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { StatCard } from '../components/ui/StatCard';
import { useFetch } from '../hooks/useFetch';
import type { Cart } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';

const orderColumns: Column<Cart>[] = [
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
  { key: 'items', header: 'Items', align: 'right', render: (o) => formatNumber(o.totalQuantity) },
  {
    key: 'total',
    header: 'Total',
    align: 'right',
    render: (o) => formatCurrency(o.discountedTotal),
  },
];

export default function Dashboard() {
  const { data, loading, error, retry } = useFetch(getDashboardStats, []);
  const trend = useMemo(() => (data ? monthlyTrend(data.revenue) : []), [data]);

  if (error) {
    return (
      <Card>
        <ErrorState message={error} onRetry={retry} />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          icon={DollarSign}
          loading={loading}
          value={data ? formatCurrency(data.revenue) : undefined}
          hint={data ? `Across ${formatNumber(data.orders)} orders` : undefined}
        />
        <StatCard
          label="Orders"
          icon={ShoppingCart}
          loading={loading}
          value={data ? formatNumber(data.orders) : undefined}
          hint="All time"
        />
        <StatCard
          label="Customers"
          icon={Users}
          loading={loading}
          value={data ? formatNumber(data.customers) : undefined}
          hint="Registered accounts"
        />
        <StatCard
          label="Products"
          icon={Package}
          loading={loading}
          value={data ? formatNumber(data.products) : undefined}
          hint="In the catalogue"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Revenue trend</h2>
          <p className="mb-4 text-xs text-slate-500">Last 12 months · Trend uses sample data</p>
          {loading ? <Skeleton className="h-72" /> : <RevenueLineChart data={trend} />}
        </Card>
        <Card>
          <h2 className="font-semibold">Revenue by category</h2>
          <p className="mb-4 text-xs text-slate-500">Top 8 categories</p>
          {loading || !data ? (
            <Skeleton className="h-72" />
          ) : (
            <CategoryBarChart data={data.revenueByCategory} />
          )}
        </Card>
      </div>

      <section aria-labelledby="recent-orders">
        <div className="mb-2 flex items-center justify-between">
          <h2 id="recent-orders" className="font-semibold">
            Recent orders
          </h2>
          <Link
            to="/orders"
            className="rounded text-sm text-brand-600 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:text-brand-500"
          >
            View all
          </Link>
        </div>
        <DataTable
          columns={orderColumns}
          rows={data?.recentOrders ?? []}
          getRowId={(o) => o.id}
          loading={loading}
          skeletonRows={5}
          emptyMessage="No orders yet."
        />
      </section>
    </div>
  );
}
