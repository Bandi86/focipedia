### Backend – Auth + User migráció

Cél
- Auth flow és User domain modernizálása NestJS best practice szerint

Lépések
1. Inventory az `archive/` auth/user kódjairól (guard, strategy, dto, service)
2. DTO-k és validációk tervezése (register/login/profile/update)
3. Guards/Strategies (JWT, session) implementálása
4. Service réteg: jelszó hash, token kiadás/megújítás, profil műveletek
5. Swagger szerződések, hibakódok
6. Smoke teszt + Swagger UI ellenőrzés

DoD
- [ ] DTO-k validációval + Swagger
- [ ] Védett endpointok guard-okkal
- [ ] Lint/format/build zöld

Megjegyzések
- Secret kezelés: `.env` és CI secret management


