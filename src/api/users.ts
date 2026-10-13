import { api } from './client';
import type { Paged, User } from '../types';

export type UserQuery = {
  page: number;
  pageSize: number;
  q?: string;
};

export function getUsers(
  { page, pageSize, q }: UserQuery,
  signal?: AbortSignal,
): Promise<Paged<'users', User>> {
  const params = new URLSearchParams({
    limit: String(pageSize),
    skip: String((page - 1) * pageSize),
  });
  let path = '/users';
  if (q) {
    path = '/users/search';
    params.set('q', q);
  }
  return api<Paged<'users', User>>(`${path}?${params}`, { signal });
}
