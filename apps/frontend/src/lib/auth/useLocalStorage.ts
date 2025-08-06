'use client';

import { useEffect, useRef, useState } from 'react';
import { getItem, setItem, removeItem, isBrowser } from './storage';

export interface UseLocalStorageOptions<T> {
  serialize?: (v: T) => string;
  deserialize?: (s: string) => T;
  writeIfMissing?: boolean;
}

function defaultSerialize<T>(v: T): string {
  try {
    return JSON.stringify(v) as unknown as string;
  } catch {
    // fallback to toString
     
    return (v as unknown as { toString(): string }).toString?.() ?? '';
  }
}

function defaultDeserialize<T>(s: string): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return (s as unknown) as T;
  }
}

/**
 * SSR-safe localStorage hook.
 * - Does not touch storage during render.
 * - Reads/writes inside effects or event handlers only.
 */
export function useLocalStorage<T = string>(
  key: string,
  initialValue: T | (() => T),
  options?: UseLocalStorageOptions<T>
): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const { serialize = defaultSerialize, deserialize = defaultDeserialize, writeIfMissing = false } = options ?? {};

  const initialResolvedRef = useRef<T>(
    typeof initialValue === 'function' ? (initialValue as () => T)() : (initialValue as T)
  );

  const [state, setState] = useState<T>(() => initialResolvedRef.current);

  // Hydrate from storage after mount
  useEffect(() => {
    if (!isBrowser()) return;

    const existing = getItem(key);
    if (existing !== null) {
      try {
        const parsed = deserialize(existing);
        setState(parsed);
      } catch {
        // If failing to parse, keep current state
      }
    } else if (writeIfMissing) {
      try {
        setItem(key, serialize(initialResolvedRef.current));
      } catch {
        // noop: storage errors are handled in storage.ts
      }
    }
  }, [key]);

  const set = (value: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
      try {
        setItem(key, serialize(next));
      } catch {
        // noop
      }
      return next;
    });
  };

  const remove = () => {
    try {
      removeItem(key);
    } catch {
      // noop
    }
    // Reset to initial or null if initialValue is undefined
    // Types: initialResolvedRef always has a value; if user provided undefined explicitly, it will store undefined.
    // The requirement says: reset state to initialValue or null if initialValue is undefined.
    const hasInitial = typeof initialValue !== 'undefined';
    setState(hasInitial ? initialResolvedRef.current : (null as unknown as T));
  };

  return [state, set, remove];
}