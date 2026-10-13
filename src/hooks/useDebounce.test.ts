import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('updates only after the delay', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 400), {
      initialProps: { v: 'a' },
    });
    rerender({ v: 'ab' });
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe('ab');
  });

  it('restarts the wait when the value changes again', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 400), {
      initialProps: { v: 'a' },
    });
    rerender({ v: 'ab' });
    act(() => vi.advanceTimersByTime(300));
    rerender({ v: 'abc' });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('abc');
  });
});
