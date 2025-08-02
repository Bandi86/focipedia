"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout, me, register, LoginPayload, RegisterPayload, MeResponse, getFriendlyAuthMessage } from "../api/auth";
import { NormalizedError } from "../lib/axios";
import { toast } from "../components/ui/toaster";

/**
 * useMe
 * Magyar: Bejelentkezett felhasználó lekérdezése. Query kulcs: ["auth","me"].
 */
export function useMe() {
  return useQuery<MeResponse, NormalizedError>({
    queryKey: ["auth", "me"],
    queryFn: () => me(),
    retry: (failureCount, error) => {
      // 401 esetén nincs értelme retrynak
      if (error?.status === 401) {
        if (typeof console !== "undefined" && typeof console.debug === "function") {
          console.debug("[useMe] 401 - munkamenet lejárt vagy érvénytelen token, nem próbálkozunk újra.");
        }
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * useLogin
 * Magyar: Bejelentkezés mutáció. Siker esetén érvényteleníti/refetch-eli a ["auth","me"] lekérdezést.
 */
export function useLogin() {
  const qc = useQueryClient();
  return useMutation<unknown, NormalizedError, LoginPayload>({
    mutationFn: (payload) => login(payload),
    onSuccess: async () => {
      toast.success("Sikeres bejelentkezés", "Üdv újra!");
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => {
      const msg = getFriendlyAuthMessage(error);
      toast.error("Bejelentkezés sikertelen", msg);
    },
  });
}

/**
 * useRegister
 * Magyar: Regisztráció mutáció. Siker esetén érvényteleníti/refetch-eli a ["auth","me"] lekérdezést.
 */
export function useRegister() {
  const qc = useQueryClient();
  return useMutation<unknown, NormalizedError, RegisterPayload>({
    mutationFn: (payload) => register(payload),
    onSuccess: async () => {
      toast.success("Sikeres regisztráció", "Be vagy jelentkezve.");
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => {
      const msg = getFriendlyAuthMessage(error);
      toast.error("Regisztráció sikertelen", msg);
    },
  });
}

/**
 * useLogout
 * Magyar: Kijelentkezés mutáció. Siker esetén érvényteleníti/refetch-eli a ["auth","me"] lekérdezést.
 */
export function useLogout() {
  const qc = useQueryClient();
  return useMutation<unknown, NormalizedError, void>({
    mutationFn: () => logout(),
    onSuccess: async () => {
      toast.info("Kijelentkezve", "Várunk vissza hamarosan!");
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (_error) => {
      // Szándékosan generikus magyar üzenet.
      toast.error("Kijelentkezés sikertelen", "A kijelentkezés nem sikerült. Próbáld újra.");
    },
  });
}