'use client';

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getItem(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
       
      console.debug('localStorage.getItem error:', err);
    }
    return null;
  }
}

export function setItem(key: string, value: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
       
      console.debug('localStorage.setItem error:', err);
    }
  }
}

export function removeItem(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
       
      console.debug('localStorage.removeItem error:', err);
    }
  }
}