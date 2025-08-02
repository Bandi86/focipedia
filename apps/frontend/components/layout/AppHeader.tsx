"use client";

/**
 * AppHeader
 * Magyar: Egyszerű, újrahasználható fejléc, amely az autentikációs állapot alapján mutat linkeket.
 * - Nem bejelentkezett: /login és /register linkek
 * - Bejelentkezett: üdvözlés (név vagy e-mail) és "Kijelentkezés" gomb
 * - Kijelentkezéskor siker esetén toast és átirányítás a főoldalra
 * - Minimális, SSR-biztos megvalósítás; a navigációt a Next.js App Router kezeli
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMe, useLogout } from "../../hooks/useAuth";
import { toast } from "sonner";

// Lokális, minimális CSSProperties típus definíció az @types/react nélkül
type CSSProperties = { [key: string]: string | number | undefined };

export default function AppHeader() {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const { mutate, isPending } = useLogout();

  const onLogout = () => {
    if (isPending) return;
    mutate(undefined, {
      onSuccess: () => {
        try {
          toast.success("Kijelentkezés megtörtént");
        } catch {}
        try {
          router.push("/");
        } catch {}
      },
    });
  };

  // Minimal container + flex + gap, SSR-safe inline styles
  const headerStyle: CSSProperties = {
    borderBottom: "1px solid #e5e7eb",
    padding: "12px 16px",
  };

  const containerStyle: CSSProperties = {
    maxWidth: 960,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const navStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  const brandStyle: CSSProperties = { fontWeight: 600 };

  // Betöltés közben is mutassuk a navigációt: vendég linkek elégségesek,
  // így elkerüljük a villogást és SSR-ben is biztonságos.
  const isAuthed = !!me;

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={brandStyle}>
          <Link href="/">Focipedia</Link>
        </div>

        <nav aria-label="Fő navigáció" style={navStyle}>
          {!isAuthed || isLoading ? (
            <>
              <Link href="/login">Bejelentkezés</Link>
              <Link href="/register">Regisztráció</Link>
            </>
          ) : (
            <>
              <span>
                Üdv, {me?.name || me?.email}
              </span>
              <button
                type="button"
                onClick={onLogout}
                disabled={isPending}
                aria-busy={isPending ? "true" : "false"}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  background: isPending ? "#f3f4f6" : "white",
                  cursor: isPending ? "not-allowed" : "pointer",
                }}
              >
                {isPending ? "Kilépés..." : "Kijelentkezés"}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}