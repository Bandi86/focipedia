"use client";

/**
 * Védett oldal példa (Dashboard)
 * Magyar: Csak bejelentkezett felhasználó láthatja. Betöltés közben "Betöltés..." jelenik meg.
 *
 * Teljesítmény:
 * - Az alábbi példa bemutatja a route-szintű kódszeletelést (code-splitting) React.lazy segítségével.
 * - A lassú komponens helyére egy minimális Skeleton kerül betöltés közben.
 */

// A projektben nincs @types/react, így elkerüljük a típus importot.
const ReactRef: any = (globalThis as any).React || require("react");
const Suspense: any = ReactRef.Suspense;
const lazy: any = ReactRef.lazy;

import AuthGuard from "../../../components/auth/AuthGuard";

// Lazy kliens komponens dinamikus importja
const LazyHello = lazy(() => import("../../../components/common/LazyHello").then((m) => ({ default: m.default })));

// Egyszerű skeleton fallback
import Skeleton from "../../../components/common/Skeleton";

export default function DashboardPage() {
  return (
    <AuthGuard fallback={"Betöltés..."} redirectTo="/login">
      <div className="mx-auto max-w-2xl w-full p-6">
        <h1 className="text-2xl font-semibold mb-2">Irányítópult</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Üdv! Ez egy védett oldal. Csak autentikált felhasználók férhetnek hozzá.
        </p>

        {/* Minimális, nem tolakodó lazy-szegmens */}
        <Suspense fallback={<Skeleton width="100%" height={32} />}>
          <LazyHello />
        </Suspense>
      </div>
    </AuthGuard>
  );
}