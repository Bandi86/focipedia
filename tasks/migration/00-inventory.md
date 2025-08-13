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

DoD
- [ ] Teljes inventory táblázat modulonként
- [ ] Prioritási sorrend és migrációs backlog
- [ ] Kockázatok listája és mitigációs javaslatok

Megjegyzések
- Adapter/mapper rétegek számát minimalizálni, de a szükséges helyeken használni


