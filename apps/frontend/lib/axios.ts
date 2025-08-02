import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Axios kliens létrehozása egységes beállításokkal.
 * - Alap URL környezeti változóból (NEXT_PUBLIC_API_BASE_URL), fejlesztésben hiány esetén window.location.origin.
 * - withCredentials engedélyezve httpOnly sütikhez.
 * - Időkorlát és interceptorok.
 * - Hibák normalizálása egységes típusra.
 */

/**
 * Normalizált hiba forma az egész alkalmazásban.
 * Magyar JSDoc: Egységesített Axios hiba, bővítve backend "code" mezővel.
 */
export type NormalizedError = {
  status: number | null;
  code?: string | null;
  message: string;
  details?: unknown;
};

/**
 * Hungarian: Axios hiba normalizálása; egységes 'status', 'code', 'message' mezők.
 * - status: HTTP státuszkód vagy null
 * - code: backend által visszaadott kódsztring (pl. EMAIL_TAKEN), ha van
 * - message: emberi olvasható üzenet (angol lehet, a felületen később mappoljuk)
 */
export function normalizeAxiosError(err: unknown): NormalizedError {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<any>;
    const status = e.response?.status ?? null;

    // Backend válasz lehetséges mezői: message, error, code
    const data = (e.response?.data ?? {}) as Record<string, any>;
    const backendMessage: string | undefined = (data.message as string) || (data.error as string);
    const backendCode: string | undefined = (data.code as string) || (data.errorCode as string);

    const message =
      backendMessage ||
      e.message ||
      "Ismeretlen hiba";
    const code = backendCode ?? (typeof e.code === "string" ? e.code : null);

    return { status, code, message, details: data || e.cause || undefined };
  }

  // Nem Axios hiba
  return {
    status: null,
    code: null,
    message: (err as any)?.message ?? "Ismeretlen hiba",
    details: err,
  };
}

/** Alap API URL meghatározása környezeti változóból vagy originből fejlesztésben. */
function getBaseURL(): string {
  if (typeof window !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    return fromEnv || window.location.origin;
  }
  // SSR eset: csak env érhető el
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
}

/** Globális Axios példány. */
export const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 15000,
});

/** Kimenő kérések interceptorai (itt opcionális Auth fejléc injektálás mintája). */
api.interceptors.request.use((config) => {
  // Opcionális Authorization fejléc minta:
  // const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  // if (token) {
  //   config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  // }
  return config;
});

/** Bejövő válaszok/hibák kezelése és normalizálása. */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Itt további globális hiba-kezelés is megvalósítható (pl. 401 kezelése)
    return Promise.reject(normalizeAxiosError(error));
  }
);

export default api;
