### Fázis 0 – Inventory és feltérképezés

Scope
- Cél: az `archive/` teljes tartalmának modulonkénti feltérképezése
- Eredmény: migrációs backlog és priorizált lista

Források (archive)
- Frontend: packages, apps, komponensek, utilok, hookok
- Backend: modulok, szolgáltatások, entitások, DTO-k, middlewarek

Kimenet (target)
- Monorepo: `apps/frontend`, `apps/backend`
- Standardok: DTO-k, validáció, Swagger, lint/format

Lépések
1. Fájl- és modul-inventory készítése (lista, rövid leírás, függőségek)
2. Publikus API-k és szerződések azonosítása
3. Megtartandó/újraírandó/eldobandó jelölése
4. Prioritás és ütemezés (kockázat/haszon alapján)

Gyors statisztika (node_modules kizárva)
- Top-level: apps, dist, docs, packages, prediction_module, scripts, tests
- Második szint: apps/backend, apps/frontend, dist/apps, docs/*, packages/{types,ui,utils}, prediction_module/bots
- Fájlszám: TypeScript ~155, TSX ~93

DoD
- [ ] Teljes inventory táblázat modulonként
- [ ] Prioritási sorrend és migrációs backlog
- [ ] Kockázatok listája és mitigációs javaslatok

Megjegyzések
- Adapter/mapper rétegek számát minimalizálni, de a szükséges helyeken használni


