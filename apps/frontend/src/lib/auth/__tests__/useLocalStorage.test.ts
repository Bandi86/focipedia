/* eslint-disable @typescript-eslint/no-explicit-any */
// React import not needed for this test file
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../auth/useLocalStorage';

// Minimal jsdom localStorage mock helper
function mockLocalStorage(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial };
  (globalThis as any).window = {
    ...(globalThis as any).window,
    localStorage: {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    },
  };
  return store;
}

describe('useLocalStorage', () => {
  const KEY = 'test.key';

  beforeEach(() => {
    mockLocalStorage();
    jest.spyOn(console, 'debug').mockImplementation(() => {}); // silence debug logs in tests
  });

  afterEach(() => {
    (console.debug as jest.Mock).mockRestore();
  });

  it('lazy initializes state without touching storage during render', () => {
    const initFn = jest.fn(() => 'init');
    const { result } = renderHook(() => useLocalStorage(KEY, initFn));

    // Render time: state should equal resolved initial
    expect(result.current[0]).toBe('init');
    expect(initFn).toHaveBeenCalledTimes(1); // lazy called once
  });

  it('on mount, reads current value from storage and sets state if present', () => {
    mockLocalStorage({ [KEY]: JSON.stringify('from-storage') });
    const { result } = renderHook(() => useLocalStorage(KEY, 'init'));
    // useEffect runs after mount; flush effects via act
    act(() => {});
    expect(result.current[0]).toBe('from-storage');
  });

  it('writeIfMissing writes initial value when not present', () => {
    const store = mockLocalStorage({});
    renderHook(() => useLocalStorage(KEY, 'init', { writeIfMissing: true }));
    act(() => {});
    expect(store[KEY]).toBe(JSON.stringify('init'));
  });

  it('setter updates state immediately and writes to storage', () => {
    const store = mockLocalStorage({});
    const { result } = renderHook(() => useLocalStorage(KEY, 1 as number));
    act(() => {});
    act(() => {
      result.current[1](2);
    });
    expect(result.current[0]).toBe(2);
    expect(store[KEY]).toBe(JSON.stringify(2));

    act(() => {
      result.current[1]((prev) => prev + 3);
    });
    expect(result.current[0]).toBe(5);
    expect(store[KEY]).toBe(JSON.stringify(5));
  });

  it('remove clears storage key and resets to initialValue', () => {
    const store = mockLocalStorage({ [KEY]: JSON.stringify('existing') });
    const { result } = renderHook(() => useLocalStorage(KEY, 'init'));
    act(() => {});
    expect(result.current[0]).toBe('existing');

    act(() => {
      result.current[2](); // remove
    });
    expect(result.current[0]).toBe('init');
    expect(store[KEY]).toBeUndefined();
  });

  it('serialize/deserialize options are used with fallback behavior', () => {
    const store = mockLocalStorage({});
    const serialize = (v: number) => `n:${v}`;
    const deserialize = (s: string) => {
      if (s.startsWith('n:')) return Number(s.slice(2));
      // fallback path in hook should keep current state
      return 0;
    };

    const { result } = renderHook(() =>
      useLocalStorage<number>(KEY, 10, { serialize, deserialize, writeIfMissing: true })
    );
    act(() => {});
    expect(store[KEY]).toBe('n:10');

    act(() => {
      result.current[1](42);
    });
    expect(result.current[0]).toBe(42);
    expect(store[KEY]).toBe('n:42');

    // break the stored value so deserialize throws to test default catch path
    (globalThis as any).window.localStorage.getItem = () => {
      throw new Error('get fail');
    };
    // Should not throw and keep current state
    act(() => {
      result.current[1](100);
    });
    expect(result.current[0]).toBe(100);
  });
});