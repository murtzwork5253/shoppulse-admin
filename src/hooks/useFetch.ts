import { useEffect, useState, type DependencyList } from 'react';

/**
 * Runs `fetcher` whenever `deps` change, cancelling the previous request.
 * Returns loading/error state and a `retry` function.
 */
export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetcher(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          setError(err.message || 'Something went wrong');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { data, error, loading, retry: () => setAttempt((n) => n + 1) };
}
