'use client';

import { getItem, setItem, removeItem } from './storage';

const AUTH_PREFIX = 'focipedia.auth.' as const;

const Keys = {
  access_token: AUTH_PREFIX + 'access_token',
  refresh_token: AUTH_PREFIX + 'refresh_token',
  user: AUTH_PREFIX + 'user',
} as const;

export type AuthKey = keyof typeof Keys;

export interface AuthStorage {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;

  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;

  getUser<T = unknown>(): T | null;
  setUser<T = unknown>(u: T): void;
  removeUser(): void;

  clearAll(): void;
}

function getToken(): string | null {
  return getItem(Keys.access_token);
}

function setToken(token: string): void {
  setItem(Keys.access_token, token);
}

function removeToken(): void {
  removeItem(Keys.access_token);
}

function getRefreshToken(): string | null {
  return getItem(Keys.refresh_token);
}

function setRefreshToken(token: string): void {
  setItem(Keys.refresh_token, token);
}

function removeRefreshToken(): void {
  removeItem(Keys.refresh_token);
}

function getUser<T = unknown>(): T | null {
  const raw = getItem(Keys.user);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Fallback to string as unknown if parsing fails
    return (raw as unknown) as T;
  }
}

function setUser<T = unknown>(u: T): void {
  try {
    setItem(Keys.user, JSON.stringify(u));
  } catch {
    // JSON or storage failure are swallowed by storage.ts behavior
  }
}

function removeUser(): void {
  removeItem(Keys.user);
}

function clearAll(): void {
  removeItem(Keys.access_token);
  removeItem(Keys.refresh_token);
  removeItem(Keys.user);
}

export const authStorage: AuthStorage = {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  getUser,
  setUser,
  removeUser,
  clearAll,
};

export { AUTH_PREFIX, Keys };