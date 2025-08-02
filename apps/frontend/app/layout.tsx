import "./globals.css";
import type { Metadata } from "next";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "../components/ui/toaster";
import AppHeader from "../components/layout/AppHeader";

/**
 * Alap layout, amely az egész alkalmazást körbefogja.
 * - QueryProvider: TanStack Query környezet
 * - Toaster: globális értesítések (magyar szövegekkel)
 * - AppHeader: auth-tudatos, egyszerű fejléc a lap tetején
 */
export const metadata: Metadata = {
  // Alapértelmezett SEO meta adatok (hu)
  title: {
    default: "Focipedia",
    template: "Focipedia – %s",
  },
  description: "Focipedia – futball adatok és tudástár. Böngéssz ligákat, csapatokat és statisztikákat.",
  applicationName: "Focipedia",
  metadataBase: new URL("https://focipedia.hu"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Focipedia",
    description:
      "Focipedia – futball adatok és tudástár. Böngéssz ligákat, csapatokat és statisztikákat.",
    url: "https://focipedia.hu",
    siteName: "Focipedia",
    type: "website",
    locale: "hu_HU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focipedia",
    description:
      "Focipedia – futball adatok és tudástár. Böngéssz ligákat, csapatokat és statisztikákat.",
  },
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="hu">
      <body>
        <QueryProvider>
          <AppHeader />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
