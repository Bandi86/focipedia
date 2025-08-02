"use client";

import axios from "axios";

/**
 * isOfflineError(err)
 * Magyar: Megállapítja, hogy a hiba offline / hálózati eredetű-e.
 * - Axios hiba esetén: nincs response (pl. timeout, DNS, offline)
 * - Vagy a böngésző offline (navigator.onLine === false)
 */
export function isOfflineError(err: unknown): boolean {
  try {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  } catch {
    // ignore
  }
  if (axios.isAxiosError(err)) {
    return !err.response;
  }
  return false;
}

/**
 * registerOnlineListener(cb)
 * Magyar: Feliratkozás az ablak 'online' eseményére. Visszaad egy leiratkozó függvényt.
 */
export function registerOnlineListener(cb: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("online", handler);
  return () => {
    window.removeEventListener("online", handler);
  };
}