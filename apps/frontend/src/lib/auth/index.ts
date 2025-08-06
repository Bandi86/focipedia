'use client';

export { isBrowser, getItem, setItem, removeItem } from './storage';
export type { UseLocalStorageOptions } from './useLocalStorage';
export { useLocalStorage } from './useLocalStorage';
export type { AuthKey, AuthStorage } from './authStorage';
export { authStorage } from './authStorage';
export type { AuthState } from './useAuthState';
export { useAuthState } from './useAuthState';

// Re-export constants to be available for consumers/tests if needed
export { AUTH_PREFIX, Keys } from './authStorage';