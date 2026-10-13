import { api } from './client';
import type { Paged, Product } from '../types';

export type ProductQuery = {
  page: number;
  pageSize: number;
  q?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

type ProductPage = Paged<'products', Product>;

export async function getProducts(query: ProductQuery, signal?: AbortSignal): Promise<ProductPage> {
  const { page, pageSize, q, category, sortBy, order = 'asc' } = query;
  const skip = (page - 1) * pageSize;

  // The API can't search inside a category, so fetch the category and filter here.
  if (q && category) {
    const all = await api<ProductPage>(`/products/category/${category}?limit=0`, { signal });
    const term = q.toLowerCase();
    const matches = all.products.filter((p) => p.title.toLowerCase().includes(term));
    return {
      products: matches.slice(skip, skip + pageSize),
      total: matches.length,
      skip,
      limit: pageSize,
    };
  }

  const params = new URLSearchParams({ limit: String(pageSize), skip: String(skip) });
  if (sortBy) {
    params.set('sortBy', sortBy);
    params.set('order', order);
  }
  let path = '/products';
  if (q) {
    path = '/products/search';
    params.set('q', q);
  } else if (category) {
    path = `/products/category/${category}`;
  }
  return api<ProductPage>(`${path}?${params}`, { signal });
}

export const getProduct = (id: string, signal?: AbortSignal) =>
  api<Product>(`/products/${id}`, { signal });

export const getCategories = (signal?: AbortSignal) =>
  api<string[]>('/products/category-list', { signal });
