import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { monthlyTrend } from '../api/mockStats';
import { getDashboardStats } from '../api/stats';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { RevenueLineChart } from '../components/charts/RevenueLineChart';
import { DataTable, type Column } from '../components/table/DataTable';
import { Card } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { StatCard } from '../components/ui/StatCard';
import { linkClass } from '../components/ui/styles';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import type { Cart } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';

const orderColumns: Column<Cart>[] = [
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
  { key: 'items', header: 'Items', align: 'right', render: (o) => formatNumber(o.totalQuantity) },
  {
    key: 'total',
    header: 'Total',
    align: 'right',
    render: (o) => <span className="font-medium">{formatCurrency(o.discountedTotal)}</span>,
  },
];

const heroLink =
  'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700 focus-visible:outline-none';

function greeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function Hero() {
  const { user } = useAuth();
  const [now] = useState(() => new Date());
  const today = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-[#1c1a5e] p-6 text-white shadow-pop md:p-8">
      <div
        aria-hidden
        className="absolute -top-20 -right-16 size-72 rounded-full bg-fuchsia-400/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-cyan-300/20 blur-3xl"
      />
      <div className="relative">
        <p className="text-sm text-white/70">{today}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          {greeting(now.getHours())}
          {user ? `, ${user.firstName}` : ''}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/80">
          Here&apos;s how your store is performing. Revenue, orders and customers are updated every
          time you open the dashboard.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/orders" className={`${heroLink} bg-white text-brand-700 hover:bg-brand-50`}>
            View orders <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            to="/products"
            className={`${heroLink} bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20`}
          >
            Browse products
          </Link>
        </div>
      </div>
    </section>
  );
}

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
    <div className="space-y-6">
      <Hero />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          icon={DollarSign}
          tone="violet"
          loading={loading}
          value={data ? formatCurrency(data.revenue) : undefined}
          hint={data ? `Across ${formatNumber(data.orders)} orders` : undefined}
        />
        <StatCard
          label="Orders"
          icon={ShoppingCart}
          tone="emerald"
          loading={loading}
          value={data ? formatNumber(data.orders) : undefined}
          hint="All time"
        />
        <StatCard
          label="Customers"
          icon={Users}
          tone="sky"
          loading={loading}
          value={data ? formatNumber(data.customers) : undefined}
          hint="Registered accounts"
        />
        <StatCard
          label="Products"
          icon={Package}
          tone="amber"
          loading={loading}
          value={data ? formatNumber(data.products) : undefined}
          hint="In the catalogue"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Revenue trend</h2>
          <p className="mb-5 text-xs text-ink-2">Last 12 months · Trend uses sample data</p>
          {loading ? <Skeleton className="h-72" /> : <RevenueLineChart data={trend} />}
        </Card>
        <Card>
          <h2 className="font-semibold">Revenue by category</h2>
          <p className="mb-5 text-xs text-ink-2">Top 8 categories</p>
          {loading || !data ? (
            <Skeleton className="h-72" />
          ) : (
            <CategoryBarChart data={data.revenueByCategory} />
          )}
        </Card>
      </div>

      <section aria-labelledby="recent-orders">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="recent-orders" className="font-semibold">
            Recent orders
          </h2>
          <Link to="/orders" className={`${linkClass} inline-flex items-center gap-1 text-sm`}>
            View all <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
        <DataTable
          caption="Recent orders"
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
