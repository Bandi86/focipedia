### Backend – Sports domain (Teams/Players/Leagues/Matches/...)

Cél
- A meglévő sport modulok bővítése a régi logikával, egységes API-val

Lépések
1. Inventory: utilok, kalkulációk, aggregációs logika az `archive/` alatt
2. DTO-k és válaszmodellek pontosítása (Swagger példákkal)
3. Service réteg bővítés: statisztikák, összesítések, szűrések
4. E2E smoke path: tipikus user flow-ok lefedése

DoD
- [ ] Swagger példák a kulcs endpointokra
- [ ] Edge case-ek kezelése (hiányzó adatok, 404, 409)
- [ ] Lint/format/build zöld


