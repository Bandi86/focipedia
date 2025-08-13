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

Backlog (hivatkozások az archive-ra)
- [ ] Strukturális audit: `archive/apps/backend/src/modules/auth/**`, `user/**`, `common/guards/**`, `common/decorators/**`
- [ ] DTO-k összevetése és tervezés: `auth.dto.ts`, `user.dto.ts` → új DTO-k validációval
- [ ] Strategy/Guard migráció: `strategies/jwt.strategy.ts`, `jwt-auth.guard.ts`
- [ ] Token és email service-k: `token.service.ts`, `email.service.ts` (titokkezelés, retry, rate-limit)
- [ ] Controller végpontok: `auth.controller.ts`, `user.controller.ts` → Swagger szerződések
- [ ] Service logika: `auth.service.ts`, `user.service.ts` → jelszó hash, token élettartam
- [ ] Konfiguráció: `config/configuration.ts` integrálása `.env`-vel
- [ ] Tesztek átemelése/újraírása: `*.spec.ts` (smoke/unit)
- [ ] DoD ellenőrzés és dokumentáció frissítés

Kockázatok
- Titkok és környezeti változók hiányosságai → `.env.example` bővítés
- Token kezelés eltérései → Swagger és kliensek összehangolása


