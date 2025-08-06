/* eslint-disable @typescript-eslint/no-explicit-any */
import { getItem, setItem, removeItem, isBrowser } from '../../auth/storage';

describe('storage.ts (server environment)', () => {
  const hadWindow = typeof (globalThis as any).window !== 'undefined';
  const originalWindow = hadWindow ? (globalThis as any).window : undefined;

  beforeAll(() => {
    // Simulate no window on server
    (globalThis as any).window = undefined;
  });

  afterAll(() => {
    // Restore window if it originally existed
    if (hadWindow) {
      (globalThis as any).window = originalWindow;
    } else {
      // Ensure no stray window
      delete (globalThis as any).window;
    }
  });

  test('isBrowser returns false', () => {
    expect(isBrowser()).toBe(false);
  });

  test('getItem returns null on server', () => {
    expect(getItem('key')).toBeNull();
  });

  test('setItem and removeItem are no-ops on server (no throw)', () => {
    expect(() => setItem('k', 'v')).not.toThrow();
    expect(() => removeItem('k')).not.toThrow();
  });
});