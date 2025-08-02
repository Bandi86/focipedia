"use client";

import { Toaster as SonnerToaster, toast as sonner } from "sonner";

/**
 * Toaster (shadcn/ui kompatibilis megközelítés Sonnerrel)
 * Egyszerű helper függvények magyar szövegekkel.
 *
 * Használat:
 *   // Globális gyökérben (layout)
 *   <Toaster />
 *
 *   // Bárhol a kódban:
 *   import { toast } from "@/components/ui/toaster";
 *   toast.success("Siker!", "A művelet befejeződött.");
 */
export function Toaster() {
  return <SonnerToaster richColors position="top-center" />;
}

/** Típussal rendelkező toast API magyar alapértelmezésekkel. */
export type ToastAPI = {
  success: (message?: string, description?: string) => void;
  error: (message?: string, description?: string) => void;
  info: (message?: string, description?: string) => void;
};

/**
 * Konvenciók:
 * - Rövid, cselekvő üzeneteket használj.
 * - A description opcionális, részletezéshez.
 * - Magyar feliratok az alapértelmezett fallback üzenetekhez.
 */
export const toast: ToastAPI = {
  success(message = "Sikeres művelet", description) {
    sonner.success(message, { description });
  },
  error(message = "Hiba történt", description) {
    sonner.error(message, { description });
  },
  info(message = "Információ", description) {
    sonner.message(message, { description });
  },
};
