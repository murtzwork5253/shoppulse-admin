import { renderHook, waitFor } from '@testing-library/react';
import { ApiError } from '../api/client';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  it('returns data once the request resolves', async () => {
    const { result } = renderHook(() => useFetch(() => Promise.resolve('hello'), []));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe('hello');
    expect(result.current.error).toBeNull();
  });

  it('exposes the error message and HTTP status', async () => {
    const { result } = renderHook(() =>
      useFetch(() => Promise.reject(new ApiError(404, 'Not found')), []),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Not found');
    expect(result.current.status).toBe(404);
  });

  it('refetches with the new dependencies and aborts the previous request', async () => {
    const signals: AbortSignal[] = [];
    const fetcher = (id: number) => (signal: AbortSignal) => {
      signals.push(signal);
      return new Promise<number>((resolve) => setTimeout(() => resolve(id), 10));
    };
    const { result, rerender } = renderHook(({ id }) => useFetch(fetcher(id), [id]), {
      initialProps: { id: 1 },
    });
    rerender({ id: 2 });
    expect(signals[0].aborted).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe(2);
  });

  it('runs the request again on retry', async () => {
    let calls = 0;
    const { result } = renderHook(() =>
      useFetch(
        () => (++calls === 1 ? Promise.reject(new Error('boom')) : Promise.resolve('ok')),
        [],
      ),
    );
    await waitFor(() => expect(result.current.error).toBe('boom'));
    result.current.retry();
    await waitFor(() => expect(result.current.data).toBe('ok'));
    expect(result.current.error).toBeNull();
  });
});
