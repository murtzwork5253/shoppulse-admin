import { api } from './client';
import type { Cart, Paged, Product } from '../types';

/** Loads everything the dashboard needs in parallel and derives the numbers from it. */
export async function getDashboardStats(signal?: AbortSignal) {
  const [carts, users, products] = await Promise.all([
    api<Paged<'carts', Cart>>('/carts?limit=0', { signal }),
    api<{ total: number }>('/users?limit=1&select=id', { signal }),
    api<Paged<'products', Pick<Product, 'id' | 'category'>>>('/products?limit=0&select=category', {
      signal,
    }),
  ]);

  const revenue = carts.carts.reduce((sum, c) => sum + c.discountedTotal, 0);

  // Revenue by category: map each product id to its category, then add up cart lines
  const categoryOf = new Map(products.products.map((p) => [p.id, p.category]));
  const byCategory = new Map<string, number>();
  carts.carts.forEach((cart) =>
    cart.products.forEach((item) => {
      const cat = categoryOf.get(item.id) ?? 'other';
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + item.discountedTotal);
    }),
  );
  const revenueByCategory = [...byCategory]
    .map(([category, value]) => ({ category, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return {
    revenue,
    orders: carts.total,
    customers: users.total,
    products: products.total,
    revenueByCategory,
    recentOrders: carts.carts.slice(0, 5),
  };
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
