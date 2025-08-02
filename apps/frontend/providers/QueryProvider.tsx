"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import { createQueryClient } from "../lib/queryClient";

/**
 * QueryProvider
 * React Query környezet biztosítása az egész alkalmazás számára.
 * Dev módban React Query Devtools engedélyezve.
 */
export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
