import api, { normalizeAxiosError, NormalizedError } from "../lib/axios";
import { isOfflineError } from "../lib/network";

/**
 * Felhasználó típus (backend minimális feltételezés).
 * - id: string | number
 * - email: string
 * - name?: opcionális név
 * - Egyéb mezők lehetnek, ezért [key: string]: unknown
 */
export type User = {
  id: string | number;
  email: string;
  name?: string | null;
  [key: string]: unknown;
};

/** Regisztrációs kérés payload. */
export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

/** Bejelentkezés payload. */
export type LoginPayload = {
  email: string;
  password: string;
};

/** /me válasz (minimális): visszatérhet User vagy null (ha nem bejelentkezett). */
export type MeResponse = User | null;

/**
 * Hungarian: Auth hibákhoz felhasználóbarát üzenet.
 * - Kis, bővíthető mapping HTTP státusz és backend kódok alapján.
 */
export function getFriendlyAuthMessage(err: NormalizedError | unknown): string {
  const e = (err as any) as NormalizedError | undefined;

  // Offline / hálózati hiba
  if (isOfflineError(err)) {
    return "Nincs hálózati kapcsolat. Próbáld újra később.";
  }

  const status = (e && "status" in (e as any) ? (e as any).status : null) as number | null;
  const code = (e && "code" in (e as any) ? (e as any).code : null) as string | null;

  // 409 Conflict vagy ismert backend kód
  if (status === 409 || code === "EMAIL_TAKEN") {
    return "Ez az e-mail cím már foglalt.";
  }

  // 401 hibák: belépésnél hibás cred, /me-n lejárt token
  if (status === 401) {
    // Token lejárt/invalid eset (különösen /me kérésre)
    if (code === "TOKEN_EXPIRED" || code === "TOKEN_INVALID") {
      return "A munkamenet lejárt, kérlek jelentkezz be újra.";
    }
    // Általános 401: rossz e-mail/jelszó
    return "Hibás e-mail vagy jelszó.";
  }

  // Alapértelmezett
  return "Váratlan hiba történt.";
}

/**
 * Regisztráció API hívás.
 * Magyar JSDoc: Új felhasználó létrehozása.
 */
export async function register(payload: RegisterPayload): Promise<User> {
  try {
    const { data } = await api.post<User>("/api/v1/auth/register", payload);
    return data;
  } catch (err) {
    throw normalizeAxiosError(err) as NormalizedError;
  }
}

/**
 * Bejelentkezés API hívás.
 * Magyar JSDoc: E-mail/jelszó alapú bejelentkezés (sütis session).
 */
export async function login(payload: LoginPayload): Promise<User> {
  try {
    const { data } = await api.post<User>("/api/v1/auth/login", payload);
    return data;
  } catch (err) {
    throw normalizeAxiosError(err) as NormalizedError;
  }
}

/**
 * Kilépés API hívás.
 * Magyar JSDoc: Kijelentkezteti a felhasználót (süti törlése).
 */
export async function logout(): Promise<{ success: boolean }> {
  try {
    const { data } = await api.post<{ success: boolean }>("/api/v1/auth/logout");
    return data ?? { success: true };
  } catch (err) {
    throw normalizeAxiosError(err) as NormalizedError;
  }
}

/**
 * Saját profil lekérése.
 * Magyar JSDoc: Bejelentkezett felhasználó lekérése (vagy null ha nincs).
 */
export async function me(): Promise<MeResponse> {
  try {
    const { data } = await api.get<MeResponse>("/api/v1/auth/me");
    return data ?? null;
  } catch (err) {
    throw normalizeAxiosError(err) as NormalizedError;
  }
}