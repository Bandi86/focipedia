# Focipedia – Frontend Roadmap és Docker futtatási útmutató

Az alábbi dokumentum a Focipedia frontend fejlesztési ütemtervét, architekturális irányelveit és a Docker-alapú helyi futtatás gyakorlati tudnivalóit tartalmazza. A dokumentum célja, hogy egységes alapot adjon a fejlesztéshez, csökkentse a kockázatokat és felgyorsítsa a produktív iterációkat.

## Kiindulási elvek

- Moduláris architektúra: világos rétegek (API-kliens, auth state, UI komponensek, routing).
- Tipizált szerződések: közös típusok a monorepóban (pl. packages/types) a backend–frontend határra.
- Biztonság és DX egyensúlya: alapértelmezésben httpOnly cookie-s auth, de lokálban egyszerű beállítások.
- Iteratív szállítás: először a happy path (auth + alap router), majd a navigáció, végül a SEO/perf, edge case-ek.
- Tesztelhetőség: E2E tesztek a kritikus felhasználói utakra, unit tesztek az izolált logikára.
- Dev-proxy és CORS minimalizálása: fejlesztéskor preferált a /api proxy, hogy ne kelljen bonyolult CORS beállítások.
- Observability: böngésző konzol, hálózati kérések és backend /health végpont rutinszerű ellenőrzése.

## API integráció réteg és auth state (Prioritás 1)

- API kliens:
  - Preferált: Axios az egységes HTTP klienshez (interceptorok, hibakezelés, auth header/cookie).
  - Alap URL: környezeti változóból (Vite: VITE_API_BASE_URL, Next: NEXT_PUBLIC_API_BASE_URL).
  - Interceptorok:
    - Request: Authorization Bearer header hozzáadása, ha van in-memory token; cookie alapú auth esetén withCredentials.
    - Response: 401/403 egységes detektálása; opcionális automatikus logout/redirect jelzés a guard felé.
  - Időkorlát és retry: timeout beállítás (pl. 10s); TanStack Query végzi a retry-t, Axios inkább determinisztikus.
  - Hiba-normalizálás: egységes hibaforma (status, code, message) toast/űrlap hibákhoz.
  - Fetch wrapper továbbra is választható, de a roadmap Axios mintát ad.
- Auth state:
  - Forrás: httpOnly cookie alapú session/jwt; frontend state minimalista (pl. csak user summary).
  - Állapotgépek: betöltés, bejelentkezett, kijelentkezett, lejárt/invalid session.
  - Refresh stratégia: backend által vezérelt; frontend automatikus retry csak indokolt esetben.
  - TanStack Query + Context: a bejelentkezett user (me) lekérése Query-vel; auth kontextus csak a kényelmi API-khoz.
- TanStack Query (React Query) alapok:
  - QueryClient provider: globális cache/invalidation, háttérben refetch, retry politika, devtools támogatás.
  - Query kulcsok: ["auth","me"] a bejelentkezett felhasználóhoz; protected adatoknál auth-függő kulcsok.
  - Mutation-ök: login/register/logout műveletek; siker/hiba toastek; cache invalidation (pl. me újrahúzása).
  - Devtools: fejlesztéskor bekapcsolható.
- Hibakezelés:
  - 401/403 egységes kezelése (pl. logout és /login felé irányítás guardon keresztül).
  - Visszajelzés felhasználónak magyar, barátságos üzenetekkel (Toaster).
  - Offline/bizonytalan hálózat esetén retry/backoff és vizuális állapotjelzés.

### Axios és TanStack Query – minták

```ts
// lib/axios.ts
// Axios alap kliens egységes interceptorokkal és hibanormalizálással
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // httpOnly cookie küldése
  timeout: 10000, // 10s időkorlát
});

// Egységes hiba típusa a UI felé
export type NormalizedError = {
  status?: number;
  code?: string;
  message: string;
  details?: unknown;
};

function normalizeAxiosError(err: any): NormalizedError {
  if (err?.response) {
    // Backend válasz hibával
    const status = err.response.status;
    const data = err.response.data;
    const message = data?.message || "Váratlan szerver hiba.";
    const code = data?.code;
    return { status, code, message, details: data?.errors };
  }
  if (err?.request) {
    // Hálózati hiba / timeout
    return { message: "Hálózati hiba vagy időtúllépés. Kérjük próbáld újra." };
  }
  // Konfigurációs/egyéb hiba
  return { message: err?.message ?? "Ismeretlen hiba." };
}

// Request interceptor: opcionális Bearer (ha nem cookie-t használunk)
api.interceptors.request.use((config) => {
  // Példa: ha van in-memory accessToken (nem kötelező)
  const token = (window as any).__ACCESS_TOKEN__ as string | undefined;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: 401/403 kezelése és hibanormalizálás
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const normalized = normalizeAxiosError(error);
    // 401/403 eset: hagyjuk a guard/router felé jelezni a szükséges redirectet
    if (normalized.status === 401 || normalized.status === 403) {
      // Opcionálisan megjelölhetjük egy egyedi property-vel
      (error as any).__authError = true;
    }
    return Promise.reject(Object.assign(error, { __normalized: normalized }));
  }
);

export function getErrorMessage(err: unknown) {
  const n = (err as any)?.__normalized as NormalizedError | undefined;
  return n?.message ?? "Váratlan hiba történt.";
}
```

```ts
// libs/queryClient.ts
// TanStack Query QueryClient központi példány és default opciók
import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Hitelesített adatoknál rövidebb staleTime és background refetch
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        retry: (failureCount, err: any) => {
          // Auth hiba esetén ne retry-oljon, egyébként max 2
          if (err?.__normalized?.status === 401 || err?.__normalized?.status === 403) return false;
          return failureCount <= 2;
        },
      },
      mutations: {
        retry: 0, // Mutációknál alapból ne retry-oljon
      },
    },
  });
}
```

```tsx
// providers/QueryProvider.tsx
// Provider a QueryClient-hez és opcionálisan a Devtools-hoz
"use client";
import { PropsWithChildren, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "../libs/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      {import.meta?.env?.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
```

```ts
// api/auth.ts
// Egyszerű auth API hívások és TanStack Query integráció
import { api, getErrorMessage } from "../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type LoginInput = { email: string; password: string };
export type RegisterInput = { email: string; password: string; name?: string };
export type Me = { id: string; email: string; name?: string };

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<Me | null> => {
      const { data } = await api.get("/api/auth/me");
      return data ?? null;
    },
    // Nem autentikált esetben ne dobáljon hibát
    retry: (count, err: any) => {
      if (err?.__normalized?.status === 401) return false;
      return count <= 1;
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post("/api/auth/login", input);
      return data;
    },
    onSuccess: async () => {
      // Sikeres login után a me frissítése
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (err) => {
      throw new Error(getErrorMessage(err));
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data } = await api.post("/api/auth/register", input);
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (err) => {
      throw new Error(getErrorMessage(err));
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/api/auth/logout");
    },
    onSuccess: async () => {
      // Logout után ürítsük a user cache-t
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (err) => {
      throw new Error(getErrorMessage(err));
    },
  });
}
```

## Auth oldalak és form stack (Prioritás 1)

- Oldalak: /login, /register, /logout (opcionális redirect), /forgot-password (később).
- Form stack:
  - Form state és validáció: pl. React Hook Form + Zod/Yup.
  - UX: azonnali visszajelzés, „disable while submitting”, hibák látható megjelenítése.
  - shadcn/ui Form komponensek: egységes mezők, hibaüzenetek és gombok (Button, Input, Form).
  - Toaster: magyar nyelvű visszajelzések (siker/hiba/információ) központilag.
- Navigációs flow:
  - Sikeres login után: redirect protected kezdőoldalra.
  - Sikeres register után: automatikus login vagy /login-re irányítás (projekt döntés).
- TanStack Query használata:
  - Mutációk: login/register/logout bekötése useMutation-nel, állapotjelzések és invalidation (["auth","me"]).
  - Hibák: axios hiba-normalizálásból származó üzenetek megjelenítése Toasterrel.
- Biztonsági megfontolások:
  - CSRF védelem: cookie + same-site beállítás; lokálban secure=false dokumentáltan.
  - Brute force megelőzés: backend felelősség, de UI jelzések kezelése.

### shadcn/ui és Toaster minták

```tsx
// ui/toaster.tsx
"use client";
import { Toaster as SToaster } from "sonner"; // shadcn Toaster
export function Toaster() {
  return <SToaster richColors position="top-right" />;
}
```

```tsx
// routes/LoginPage.tsx (részlet)
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "../api/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({
  email: z.string().email("Érvényes e-mail címet adj meg."),
  password: z.string().min(6, "A jelszó legalább 6 karakter."),
});
type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const form = useForm<Values>({ resolver: zodResolver(schema) });
  const login = useLogin();

  async function onSubmit(values: Values) {
    try {
      await login.mutateAsync(values);
      toast.success("Sikeres bejelentkezés.");
      // redirect pl. /app
    } catch (err: any) {
      toast.error(err?.message ?? "Hibás e-mail/jelszó.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jelszó</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={login.isPending}>Bejelentkezés</Button>
      </form>
    </Form>
  );
}
```

Példa toast szövegkészlet:
- Sikeres bejelentkezés.
- Hibás jelszó vagy felhasználónév.
- Váratlan hiba történt. Kérjük, próbáld újra.
- Nem sikerült csatlakozni a kiszolgálóhoz. Ellenőrizd a hálózatot.

## Router és route guardok (Prioritás 1)

- Router:
  - SPA router (pl. React Router vagy Next.js App Router használata).
- Guardok:
  - AuthGuard: protected útvonalak védelme; 401 esetén login felé irányítás.
  - RoleGuard (később): különböző szerepkörök (admin, user) esetén.
- Átirányítások:
  - Nem létező útvonalak: 404 oldal.
  - Már bejelentkezett felhasználó a /login oldalon: átirányítás a fő protected route-ra.
- TanStack Query me() cache használata:
  - A guard döntését a ["auth","me"] query állapota vezérelje (loading, success null, success user).
  - 401 válasz esetén ne retry-oljon; navigáció a /login felé.

```tsx
// auth/guards/AuthGuard.tsx (vázlat)
import { Navigate } from "react-router-dom";
import { useMe } from "../../api/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useMe();
  if (isLoading) return <div>Betöltés...</div>;
  if (!me) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

## Navigáció és AppHeader (Prioritás 2)

- AppHeader komponens:
  - Logó, fő navigációs linkek, user menü (profil, logout).
- Oldalstruktúra:
  - Alap layout: fejléc, tartalom, lábléc (ha szükséges).
- Reszponzivitás:
  - Mobil/desktop menü; hamburger ikon kis képernyőn.
- Aktív link kiemelés és accessibilty attribútumok.

## UI komponensek és design rendszer (Prioritás 2)

- Alap készlet:
  - Button, Input, Select, Checkbox, Modal, Alert/Toast.
- Stílus:
  - Egységes spacing, színek, tipográfia; light/dark téma opció később.
- Komponens-könyvtár:
  - shadcn/ui mint baseline (Radix alapokra), testreszabott design tokenekkel.
  - Toaster provider globálisan beépítve (magyar nyelvű toastekhez).
  - Belső UI csomag (packages/ui) továbbra is opció, de shadcn komponensekre támaszkodva.
- Komponenskatalógus:
  - Kritikus komponensek dokumentálása (Button, Input, Form, Toast/Toaster) és használati minták.
- Dokumentáció:
  - Storybook (később): kritikus komponensekre story-k, vizuális regresszióhoz alap.

```tsx
// app/root.tsx vagy fő layout (részlet)
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/ui/toaster";

export default function AppRoot({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster />
    </QueryProvider>
  );
}
```

## SEO és teljesítmény (Prioritás 3)

- SEO:
  - Oldalcímek és meta tag-ek dinamikus kezelése.
  - Open Graph és Twitter kártyák fő oldalakhoz.
- Teljesítmény:
  - Kódsplitting és lazy loading.
  - Képek optimalizálása; kritikus CSS minimalizálása.
  - TanStack Query: cache policy (staleTime, gcTime) és prefetch a fő nézetekhez.
  - Optimistic update csak indokoltan; rollback stratégia hiba esetén.
- SSR/Server Components megjegyzések:
  - Next/SSR környezetben preferált az adatlekérés SSR-ben vagy Server Components-ben.
  - Auth-érzékeny hívásoknál cookie-kezelés és edge-cache megfontolások.
  - Vite/CSR esetén SSR pontok később bővíthetők.
- Monitoring:
  - Web Vitals mérés; hibalog gyűjtés (Sentry vagy alternatíva – később).

```ts
// Prefetch példa (React Router loader vagy komponens szint)
import { QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export async function prefetchHome(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: ["home","stats"],
    queryFn: async () => (await api.get("/api/home/stats")).data,
    staleTime: 60_000,
  });
}
```

## E2E happy-path tesztek (Prioritás 3)

- Eszköz:
  - Playwright vagy Cypress.
- Happy-path:
  - Látogasd meg a főoldalt; /register → /login → protected oldal elérése; logout.
- Stabilitás:
  - Tesztadatok izolálása; idempotens setup/teardown.
- Futás:
  - CI-ben alap pipeline; lokálban fejlesztőbarát parancsok.

## Edge case-ek és hibakezelés

- Auth:
  - Lejárt session közben lévő kérés; frissítés és retry vagy logout.
- Hálózat:
  - Időkorlát, hálózati hiba; user felé érthető feedback.
  - Axios hiba-normalizálás: egységes üzenetek (status, code, message) a UI felé.
  - TanStack Query retry/backoff: auth hibára ne retry-oljon, hálózati hibára limitált kísérlet.
  - Offline kezelés: vizuális jelzés; manuális újrapróbálás gombok.
- Skeleton és állapotok:
  - Betöltés: skeletonok és spinnerek következetesen.
  - Üres állapot: kezeljük külön a „nincs adat” esetet.
- Formok:
  - Backend validációs hibák aggregálása mezőkhöz és globális szinten.
- Router:
  - Back/forward navigáció, guardokkal konzisztensen.

## Kézbesítési ütemterv (iterációk)

- Iteráció 1 (Prioritás 1):
  - API kliens és auth state alapok.
  - /login, /register oldalak és validáció.
  - Router és AuthGuard; protected shell oldal.
- Iteráció 2 (Prioritás 2):
  - AppHeader és navigáció; alap UI komponensek.
  - Alap design rendszer és reszponzivitás.
- Iteráció 3 (Prioritás 3):
  - SEO/meta; teljesítmény optimalizálások.
  - E2E happy-path tesztek és minimális CI.
- Iteráció 4:
  - Edge case-ek mélyítése; hibakezelés finomhangolás; monitoring bekötése.

## DoD – Definition of Done ellenőrzőlista

- [ ] Típuskövetkezetesség: API típusok és kliens kontraktusok szinkronban.
- [ ] Auth flow: login/register működik, guardok érvényesek, logout tiszta.
- [ ] UX: betöltés/hiba állapotok minden fő folyamatban.
- [ ] Tesztek: unit a kritikus logikára, E2E happy-path zöld.
- [ ] Dokumentáció: README szekció a futtatásról és env-kről; jelen dokumentum friss.
- [ ] Teljesítmény: N+1 kérések elkerülve; felesleges re-render minimalizálva.
- [ ] Biztonság: httpOnly cookie alap; lokál kivételek dokumentálva; CORS jól beállítva.

## Javasolt fájlstruktúra

Példa (React/Vite vagy Next) – igazítsd a monorepóhoz:
```
apps/frontend/
  src/
    api/
      auth.ts                # TanStack Query hookok: useMe, useLogin, useRegister, useLogout
    auth/
      AuthProvider.tsx
      useAuth.ts
      guards/
        AuthGuard.tsx
    routes/
      index.tsx
      LoginPage.tsx
      RegisterPage.tsx
      ProtectedHome.tsx
    components/
      AppHeader/
      ui/
        button.tsx           # shadcn/ui
        input.tsx            # shadcn/ui
        form.tsx             # shadcn/ui
        toaster.tsx          # Toaster wrapper
    hooks/
    lib/
      axios.ts               # Axios init + interceptorok + normalize
    libs/
      queryClient.ts         # QueryClient init + defaultOptions
    providers/
      QueryProvider.tsx      # QueryClientProvider + Devtools
    styles/
  public/
  .env.example
```
Megjegyzés:
- Ha Next/SSR: a provider és Toaster elhelyezése app/layout.tsx-ben; Server Components-ben adatlekérés, auth cookie-k kezelése.
- Ha Vite/CSR: a provider a fő entry-ben; SSR pontok később bővíthetők.

## Docker-specifikus jegyzetek (helyi fejlesztés)

- Compose szolgáltatások (példa): frontend (Vite/Next dev), backend (API), db (Postgres), reverse proxy (opcionális).
- Ajánlott hostname/domain:
  - frontend: http://localhost:5173 vagy http://localhost:3000
  - backend: http://localhost:4000
  - Ha httpOnly cookie: set-cookie domain=localhost; secure=false lokálban; CORS origin és credentials: true.
- ENV példák:
  - FRONTEND:
    - `VITE_API_BASE_URL=http://localhost:4000` vagy `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
  - BACKEND:
    - `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000`
    - `COOKIE_DOMAIN=localhost`
    - `COOKIE_SECURE=false`
    - `SESSION_SECRET=dev_only_change_me`
- Proxy opciók:
  - Dev szerver proxy a `/api`-ra, vagy nginx/traefik compose szolgáltatás.
- Token stratégia döntés:
  - elsődlegesen httpOnly cookie; fallback Bearer in-memory + refresh.
- Tippek fejlesztéshez:
  - hot reload portok, container volume-ok, node_modules kezelése (bind mount vs. dockerized install), `.env.example` minták.

Kibővített példa docker-compose részlet (irányadó, projektfüggő):
```yaml
version: "3.9"
services:
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"   # Vite
      # - "3000:3000" # Next dev esetén
    environment:
      - VITE_API_BASE_URL=http://localhost:4000
      # - NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
    volumes:
      - ./apps/frontend:/app
      - /app/node_modules
    command: ["pnpm", "dev", "--host", "0.0.0.0"]
    depends_on:
      - backend

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile.dev
    ports:
      - "4000:4000"
    environment:
      - CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
      - COOKIE_DOMAIN=localhost
      - COOKIE_SECURE=false
      - SESSION_SECRET=dev_only_change_me
    volumes:
      - ./apps/backend:/app
      - /app/node_modules
    command: ["pnpm", "dev"]

  db:
    image: postgres:16
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=focipedia
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # reverse-proxy (opcionális):
  # proxy:
  #   image: traefik:v3
  #   ports:
  #     - "80:80"
  #   command:
  #     - "--api.insecure=true"
  #     - "--providers.docker=true"

volumes:
  postgres-data:
```

Megjegyzések:
- node_modules: helyi fejlesztésnél gyakran praktikus a konténerben tartani (anonymous volume /app/node_modules), és a forrást bind-mountolni.
- Vite esetén figyelj a `--host 0.0.0.0` indításra, hogy a böngészőből elérhető legyen.
- Ha dev proxy-t használsz Vite-ban:
  - `vite.config.ts` példa:
    ```ts
    export default defineConfig({
      server: {
        proxy: {
          "/api": {
            target: "http://localhost:4000",
            changeOrigin: true,
            secure: false,
          },
        },
      },
    });
    ```

## How to run with Docker (lépésről lépésre)

1) Előkészítés:
- Másold az env fájlokat: `cp .env.example .env` mind a backend és frontend alatt (ha külön).  
- Töltsd ki a fentiek szerint, különös tekintettel a következőkre:
  - FRONTEND: `VITE_API_BASE_URL` vagy `NEXT_PUBLIC_API_BASE_URL`
  - BACKEND: `CORS_ALLOWED_ORIGINS`, `COOKIE_DOMAIN=localhost`, `COOKIE_SECURE=false`, `SESSION_SECRET`

2) Indítás:
- `docker compose up -d`  
- Ha nincs compose fájl, jegyzet: „Compose fájl a későbbiekben kerül hozzáadásra; az alábbi példa alapján kell elkészíteni.”

3) Egészségi ellenőrzés:
- Backend: `GET http://localhost:4000/health` → 200 OK várható.  
- Frontend: böngészőben nyisd meg a `http://localhost:5173` (Vite) vagy `http://localhost:3000` (Next) címet.  
- Cookie ellenőrzés: böngésző devtools → Application/Storage → Cookies → `localhost` bejegyzések (httpOnly jelzés).

4) Regisztráció/bejelentkezés próba:
- Lépések: `/register` → siker után `/login` → login → protected oldal elérése.  
- Ha guard helyesen működik, nem autentikált állapotban a protected oldalra lépve átirányít a `/login`-ra.

5) Gyakori problémák és megoldások:
- 401 Unauthorized: lejárt/hiányzó session → login újra; backend logok ellenőrzése.
- CORS hiba: ellenőrizd a `CORS_ALLOWED_ORIGINS` beállítást és a frontend origin-t; dev proxy preferált.
- Cookie secure mismatch: lokálban `COOKIE_SECURE=false`; `domain=localhost`; SameSite beállítások összehangolása.
- Port ütközés: módosítsd a host portokat a compose-ban (pl. `5174:5173`, `4001:4000`).
- Hot reload nem működik: ellenőrizd a bind mount-ot, a `--host 0.0.0.0` indítást és a fejlesztői szerver logokat.

## Következő lépés

1. iteráció (konkrét feladatok):
- HTTP kliens (Axios) + TanStack Query alap + Toaster (shadcn) bekötése.
- API endpointok bekötése az auth-hoz (`login`, `register`, `me`, `logout`) Query mutationökkel és ["auth","me"] invalidationnel.
- Auth state és `AuthProvider` megírása (httpOnly cookie elsődleges; Bearer fallback előkészítés).
- `/login`, `/register` oldalak megvalósítása (React Hook Form + Zod),
  hibakezeléssel és magyar toast visszajelzésekkel.
- Router konfiguráció és `AuthGuard` implementáció; egy egyszerű protected oldal (pl. `/app`).
- Alap .env.example fájlok létrehozása frontend/backend alatt a dokumentált kulcsokkal.
- Docker lokál futtatás minimál compose-szal (vagy a példa alapján), backend `/health` és frontend alap oldal ellenőrzése.