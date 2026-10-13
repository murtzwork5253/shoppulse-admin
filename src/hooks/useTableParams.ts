import { useSearchParams } from 'react-router';

export const PAGE_SIZES = [10, 20, 50];

type Defaults = { pageSize?: number };

/** Parses a positive integer from a query value; falls back when missing or invalid. */
function positiveInt(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : fallback;
}

/**
 * Keeps table state (page, size, search, category, sort) in the URL, so refreshing the page
 * or sharing the link keeps the same view. Invalid values in a hand-edited URL fall back to defaults.
 */
export function useTableParams(defaults: Defaults = {}) {
  const defaultSize = defaults.pageSize ?? PAGE_SIZES[0];
  const [params, setParams] = useSearchParams();

  const size = positiveInt(params.get('size'), defaultSize);

  const state = {
    page: positiveInt(params.get('page'), 1),
    pageSize: PAGE_SIZES.includes(size) ? size : defaultSize,
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sortBy: params.get('sortBy') ?? '',
    order: params.get('order') === 'desc' ? ('desc' as const) : ('asc' as const),
  };

  /**
   * Merges `changes` into the URL; an empty or undefined value removes that key.
   * Changing anything except `page` resets to page 1, which avoids landing on an empty page
   * (for example page 8, then searching for something with two results).
   */
  function update(changes: Record<string, string | number | undefined>) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, String(value));
    });
    if (!('page' in changes)) next.delete('page');
    setParams(next, { replace: true });
  }

  return { ...state, update };
}
