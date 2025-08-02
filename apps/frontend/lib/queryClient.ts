import { QueryClient } from "@tanstack/react-query";

/**
 * Alapértelmezett QueryClient konfiguráció
 * - Hosszabb staleTime az auth stabilitásért
 * - Konzervatív refetch beállítások
 * - Retry csak idempotens lekérdezésekhez (alap 2x, 5xx esetekben)
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 perc
        gcTime: 1000 * 60 * 10, // 10 perc
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
        retry: (failureCount, error: any) => {
          const status = error?.status ?? 0;
          // 4xx esetén nincs újrapróbálás
          if (status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

/** Készen álló megosztható QueryClient (nem SSR state megosztásra). */
export const queryClient = createQueryClient();
