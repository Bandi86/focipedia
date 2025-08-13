### Backend – Posts + Comments migráció

Cél
- Bejegyzés és komment CRUD, pagináció, jogosultság

Lépések
1. Inventory az `archive/` poszt és komment logikáról
2. Prisma modellek egyeztetése (ha hiányzik, bővítés és migráció)
3. DTO-k: create/update/list query paramok (pagináció/szűrés)
4. Service: üzleti logika és hozzáférés ellenőrzés
5. Controller: végpontok, Swagger, hibakezelés
6. Smoke teszt

DoD
- [ ] Swagger szerződések, hibakódok
- [ ] Pagináció/limit/offset dokumentálva
- [ ] Lint/format/build zöld


