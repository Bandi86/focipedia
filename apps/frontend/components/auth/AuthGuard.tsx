"use client";

/**
 * A fájl nem importál React típusokat, hogy elkerüljük az @types/react igényt.
 * Közvetlen DOM API-t használunk (document.createElement) a minimális őrséghez.
 */

type AnyNode = any;

import { useRouter } from "next/navigation";
import { useMe } from "../../hooks/useAuth";
import { NormalizedError } from "../../lib/axios";

export default function AuthGuard({
  children,
  redirectTo = "/login",
  fallback = null,
}: {
  children: AnyNode;
  redirectTo?: string;
  fallback?: AnyNode;
}) {
  const router = useRouter();
  const { data, isLoading, error } = useMe();

  // Egyszerű effekt pótlás: poll jelleggel figyeljük a státuszt microtaskban
  queueMicrotask(() => {
    const err = error as NormalizedError | undefined;
    if (!isLoading && (err?.status === 401 || data === null)) {
      try { router.push(redirectTo); } catch {}
    }
  });

  // Állapotok renderelése DOM elemekkel
  if (isLoading) {
    return (fallback as any) ?? null;
  }

  const err = error as NormalizedError | undefined;
  if (err && err.status !== 401) {
    const wrapper = document?.createElement ? document.createElement("div") : ({} as any);
    try {
      if (wrapper && "style" in wrapper) {
        (wrapper as any).style = "padding:16px";
        const p = document.createElement("p");
        p.textContent = "Hiba történt a jogosultság ellenőrzése közben.";
        const small = document.createElement("small");
        small.textContent = `Status: ${String(err.status)} | ${err.message}`;
        wrapper.appendChild(p);
        wrapper.appendChild(small);
      }
    } catch {
      // SSR környezetben document nem elérhető: térjünk vissza egy egyszerű sztringgel
      return `Status: ${String(err?.status)} | ${err?.message}` as any;
    }
    return (wrapper as any) ?? null;
  }

  if (data === null) {
    return (fallback as any) ?? null;
  }

  return (children as any) ?? null;
}