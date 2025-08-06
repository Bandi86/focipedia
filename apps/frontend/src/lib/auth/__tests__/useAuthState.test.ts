/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react';
import { useAuthState } from '../../auth/useAuthState';
import { authStorage } from '../../auth/authStorage';

describe('useAuthState', () => {
  const originalWindow = (globalThis as any).window;

  beforeEach(() => {
    (globalThis as any).window = {
      localStorage: {
        store: {} as Record<string, string>,
        getItem(key: string) {
          return this.store[key] ?? null;
        },
        setItem(key: string, value: string) {
          this.store[key] = value;
        },
        removeItem(key: string) {
          delete this.store[key];
        },
      },
    };
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
  });

  it('hydrates and derives authenticated from token presence', () => {
    const { result, rerender } = renderHook(() => useAuthState());

    // Initially before effect
    expect(result.current.isHydrated).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.accessToken).toBeNull();
    expect(result.current.user).toBeNull();

    // Write tokens and user, then rerender to trigger effect run
    authStorage.setToken('token-123');
    authStorage.setUser({ id: 1 });

    // Flush effects
    act(() => {});
    rerender();

    expect(result.current.isHydrated).toBe(true);
    expect(result.current.accessToken).toBe('token-123');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ id: 1 });
  });

  it('remains unauthenticated when no token', () => {
    const { result } = renderHook(() => useAuthState());
    act(() => {});
    expect(result.current.isHydrated).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.accessToken).toBeNull();
  });
});