import { Badge } from './Badge';

/** 0 → out of stock, under 10 → low stock, otherwise in stock. */
export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge color="red">Out of stock</Badge>;
  if (stock < 10) return <Badge color="amber">Low stock</Badge>;
  return <Badge color="green">In stock</Badge>;
}
