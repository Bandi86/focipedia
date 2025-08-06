/* eslint-disable @typescript-eslint/no-explicit-any */
import { authStorage } from '../../auth';
import { AUTH_PREFIX } from '../../auth/authStorage';

describe('authStorage', () => {
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

  it('uses the correct key prefix', () => {
    expect(AUTH_PREFIX).toBe('focipedia.auth.');
  });

  it('token set/get/remove', () => {
    expect(authStorage.getToken()).toBeNull();
    authStorage.setToken('abc');
    expect(authStorage.getToken()).toBe('abc');
    authStorage.removeToken();
    expect(authStorage.getToken()).toBeNull();
  });

  it('refresh token set/get/remove', () => {
    expect(authStorage.getRefreshToken()).toBeNull();
    authStorage.setRefreshToken('r123');
    expect(authStorage.getRefreshToken()).toBe('r123');
    authStorage.removeRefreshToken();
    expect(authStorage.getRefreshToken()).toBeNull();
  });

  it('user set/get/remove with JSON serialization', () => {
    type U = { id: number; name: string };
    expect(authStorage.getUser<U>()).toBeNull();

    const u: U = { id: 1, name: 'Alice' };
    authStorage.setUser<U>(u);

    const stored = authStorage.getUser<U>();
    expect(stored).toEqual(u);

    authStorage.removeUser();
    expect(authStorage.getUser<U>()).toBeNull();
  });

  it('clearAll removes all keys', () => {
    authStorage.setToken('t');
    authStorage.setRefreshToken('r');
    authStorage.setUser({ id: 2 });

    expect(authStorage.getToken()).toBe('t');
    expect(authStorage.getRefreshToken()).toBe('r');
    expect(authStorage.getUser()).toEqual({ id: 2 });

    authStorage.clearAll();

    expect(authStorage.getToken()).toBeNull();
    expect(authStorage.getRefreshToken()).toBeNull();
    expect(authStorage.getUser()).toBeNull();
  });
});