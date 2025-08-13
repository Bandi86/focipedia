### Migrációs terv – régi projekt visszahozása az archive mappából

Ez a dokumentum lépésről lépésre meghatározza, hogyan hozzuk vissza a régi projekt releváns részeit az `archive/` mappából a jelenlegi monorepóba, átgondoltan, fokozatosan, minőségbiztosítással és modernizálással.

### Célok
- Biztonságos, inkrementális migráció, üzemi stabilitás megtartásával
- Kódminőség javítása: típusosság, lint/format, DTO-k, validáció, Swagger
- Ismételhető folyamat CI ellenőrzésekkel, pre-commit/pre-push hookokkal

### Alapelvek
- Ne teljes fájlokat másoljunk; csak a szükséges logikát, újraszervezve és tisztítva.
- Válasszuk szét a rétegeket (DTO, service, controller) és tegyük explicitté a szerződéseket.
- Minden lépés Definition of Done szerint zárul (build+lint+format+unit smoke).
- Kapcsolt részeket kis, áttekinthető PR-okra bontva hozzuk be.

### Terjedelem és forrás
- Forrás: `archive/` mappa alatt lévő régi frontend/backend csomagok és kódok.
- Cél: monorepó `apps/frontend` és `apps/backend` egységes architektúrával.

### Előkészületek (kész)
- Lint/Prettier/Husky + pre-commit/pre-push beállítva.
- Backend: ValidationPipe, Prisma exception filter, Swagger, DTO-k, ParseIntPipe, globális interceptors.
- CI: lint+prettier workflow.

### Eszközök és standardok
- Csomagkezelő: pnpm
- Backend: NestJS + Prisma, `class-validator`/`class-transformer`, Swagger
- Frontend: Next.js 15, TypeScript, shadcn/ui, TailwindCSS
- Kódstílus: ESLint flat config + Prettier, endOfLine=lf

### Migrációs fázisok
1) Fázis 0 – Feltérképezés és tervezés
   - Katalógus az `archive/` tartalmáról: modulok, komponensek, utilok, API-k.
   - Döntés: mi kerül migrálásra, mi kerül elhagyásra/újraírásra.
   - Köztes kompatibilitás: szükség esetén adapterek/mapper rétegek.

2) Fázis 1 – Backend alapok és közös elemek
   - Adatszerződések egységesítése (DTO, enumok, validációk)
   - Service API-k szerződésének rögzítése (Swagger)
   - Adatbázis séma validálás (Prisma), szükség esetén migrációk

3) Fázis 2 – Frontend alapok és UI könyvtár
   - Alap layoutok, navigáció, theme, globális provider-ek
   - Általános komponensek (Button, Input, Form), utilok és hookok migrálása

4) Fázis 3 – Domain modulok inkrementális migrációja (backend → frontend)
   - Auth (gateway, user, session): API-k, DTO-k, guard-ok
   - Users: profil, beállítások, listázás, keresés
   - Posts/Comments: CRUD, listázás, részletek, interakciók
   - Sport domain (teams, players, matches, odds, trophies...): a jelenlegi modulok bővítése a régi logikával

5) Fázis 4 – Refaktor és hardening
   - Teljesítmény, caching, loggolás finomhangolás
   - Hibakezelés és edge-case lefedettség növelése

### Részletes feladatlebontás (iteratív, modulonként)
- Inventory a modulról az `archive/` alatt (fájlok, publikus API-k, függőségek)
- Mapping a cél struktúrára (controller/service/dto/entity/util)
- Data model és DTO egyeztetés: mezők, enumok, optional/required
- Implementáció: logika átemelése/újraírása, tesztelhető egységekben
- Smoke teszt + Swagger ellenőrzés
- Lint/format, build, commit, PR

### Backend – migrációs sorrend javaslat
1. Auth + User alapok (guard, strategy, DTO, service)
2. Profile/Settings (user domain bővítés)
3. Posts/Comments (CRUD, pagináció, jogosultság)
4. Sport modulok: Teams → Players → Leagues → Matches → Match Events → Player Stats → Odds → Trophies

### Frontend – migrációs sorrend javaslat
1. Alap layout, navigáció, providers, auth állapot kezelés
2. Közös UI és util csomagok (shadcn/ui integráció, form utilok)
3. Oldalak: Root → Dashboard → Domain oldalak (read-only) → CRUD űrlapok

### Adatbázis és migrációk (Prisma)
- Sémák egyeztetése az áthozott modellekkel
- Szükség szerinti új `prisma migrate` lépések
- Seed/Fixture stratégia lokális fejlesztéshez

### QA és minőségkapuk
- Pre-commit: lint-staged (prettier/eslint)
- Pre-push: `pnpm format:check && pnpm lint:ci`
- CI: lint+prettier, később build+unit tesztek

### Definition of Done (minden modulra)
- [ ] DTO-k validációval és Swagger dokumentációval
- [ ] Service és Controller egységteszt-szintű smoke lefedettség
- [ ] Swagger UI review (request/response contract)
- [ ] Lint/format/build zöld
- [ ] Minimal user flow manuális teszt (ha UI érintett)

### Kockázatok és mitigáció
- API szerződés eltérés: adapter/mapping réteg beiktatása
- Rejtett függőségek: inventory és fokozatos beemelés kis PR-okkal
- Formátum/validáció eltérés: DTO-k és e2e smoke tesztek

### Kommunikáció és munkaszervezés
- Kis, áttekinthető PR-ok (egy modulon belül 1–3 lépés)
- Changelog és README frissítések, ha publikus API változik

### Következő lépések (konkrét akciók)
- [ ] `archive/` teljes inventory készítése (lista fájlokról és modulok publikus felületeiről)
- [ ] Auth+User modul cél-API és DTO tervezés (backend)
- [ ] Frontend auth állapot és alap UI komponensek migrációs terve
- [ ] Ütemezés (heti mérföldkövek) és feladatkiosztás