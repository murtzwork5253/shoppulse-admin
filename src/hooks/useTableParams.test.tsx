import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useTableParams } from './useTableParams';

const setup = (url: string) =>
  renderHook(() => useTableParams(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    ),
  });

describe('useTableParams', () => {
  it('uses defaults when the URL has no params', () => {
    const { result } = setup('/products');
    expect(result.current).toMatchObject({
      page: 1,
      pageSize: 10,
      q: '',
      category: '',
      sortBy: '',
      order: 'asc',
    });
  });

  it('reads params from the URL', () => {
    const { result } = setup(
      '/products?page=3&size=20&q=phone&category=laptops&sortBy=price&order=desc',
    );
    expect(result.current).toMatchObject({
      page: 3,
      pageSize: 20,
      q: 'phone',
      category: 'laptops',
      sortBy: 'price',
      order: 'desc',
    });
  });

  it.each(['abc', '-3', '0', '2.5'])('falls back to page 1 for page=%s', (page) => {
    const { result } = setup(`/products?page=${page}`);
    expect(result.current.page).toBe(1);
  });

  it('ignores unsupported page sizes and orders', () => {
    const { result } = setup('/products?size=999&order=sideways');
    expect(result.current.pageSize).toBe(10);
    expect(result.current.order).toBe('asc');
  });

  it('resets to page 1 when something other than the page changes', () => {
    const { result } = setup('/products?page=8');
    act(() => result.current.update({ q: 'phone' }));
    expect(result.current.q).toBe('phone');
    expect(result.current.page).toBe(1);
  });

  it('keeps the page when only the page changes', () => {
    const { result } = setup('/products');
    act(() => result.current.update({ page: 4 }));
    expect(result.current.page).toBe(4);
  });

  it('removes a key when its value is empty', () => {
    const { result } = setup('/products?q=phone&category=laptops');
    act(() => result.current.update({ q: '', category: undefined }));
    expect(result.current.q).toBe('');
    expect(result.current.category).toBe('');
  });
});
