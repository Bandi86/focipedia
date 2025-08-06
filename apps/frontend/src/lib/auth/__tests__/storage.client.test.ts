/* eslint-disable @typescript-eslint/no-explicit-any */
import { getItem, setItem, removeItem, isBrowser } from '../../auth/storage';

describe('storage.ts (client environment)', () => {
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

  it('isBrowser returns true when window.localStorage exists', () => {
    expect(isBrowser()).toBe(true);
  });

  it('setItem/getItem/removeItem operate on localStorage', () => {
    expect(getItem('a')).toBeNull();
    setItem('a', '1');
    expect(getItem('a')).toBe('1');
    removeItem('a');
    expect(getItem('a')).toBeNull();
  });

  it('gracefully handles localStorage errors (getItem)', () => {
    const ls = (globalThis as any).window.localStorage;
    ls.getItem = () => {
      throw new Error('get fail');
    };
    expect(getItem('x')).toBeNull();
  });

  it('gracefully handles localStorage errors (setItem/removeItem)', () => {
    const ls = (globalThis as any).window.localStorage;
    ls.setItem = () => {
      throw new Error('set fail');
    };
    ls.removeItem = () => {
      throw new Error('remove fail');
    };
    expect(() => setItem('x', 'y')).not.toThrow();
    expect(() => removeItem('x')).not.toThrow();
  });
});