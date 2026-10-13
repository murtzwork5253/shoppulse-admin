import { api } from './client';
import type { Cart, Paged } from '../types';

export type OrderQuery = {
  page: number;
  pageSize: number;
};

export function getOrders(
  { page, pageSize }: OrderQuery,
  signal?: AbortSignal,
): Promise<Paged<'carts', Cart>> {
  const params = new URLSearchParams({
    limit: String(pageSize),
    skip: String((page - 1) * pageSize),
  });
  return api<Paged<'carts', Cart>>(`/carts?${params}`, { signal });
}

export const getOrder = (id: string, signal?: AbortSignal) => api<Cart>(`/carts/${id}`, { signal });
