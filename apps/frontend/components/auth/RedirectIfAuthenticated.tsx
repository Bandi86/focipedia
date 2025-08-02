"use client";

/**
 * RedirectIfAuthenticated
 * Magyar: Ha a felhasználó már be van jelentkezve, kliens oldalon átirányít a target (alapértelmezetten "/dashboard") oldalra.
 * - Betöltés közben a gyerekeket rendereljük (elkerülendő a villogást).
 * - Ha nincs bejelentkezve, a gyerekek maradnak.
 */

import { useRouter } from "next/navigation";
import { useMe } from "../../hooks/useAuth";

type AnyNode = any;

export default function RedirectIfAuthenticated(props: {
  children?: AnyNode;
  to?: string;
}) {
  const { children, to = "/dashboard" } = props;
  const router = useRouter();
  const { data, isLoading } = useMe();

  // Mikrotask-kal ütemezett redirect, ha már be van jelentkezve és nem töltünk
  queueMicrotask(() => {
    if (!isLoading && data) {
      try {
        router.push(to);
      } catch {}
    }
  });

  // Betöltéskor és nem autentikált állapotban a gyermek tartalom jelenik meg
  return (children as any) ?? null;
}