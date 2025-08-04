# Project Start Plan

angol prd keszitese ennek az md oldalnak a segitsegevel.
szabalyok:
clean code, modern design, modern tech stack, modern architecture, modern best practices.
magyar nyelvu oldal, magyar nyelvu visszajelzesek. Angol kod angol kommentek.
Kod es logika funkiokra es fileokra bontas.

Focipedia egy olyan kozossegi oldal ahol a felhasznaloi kozotti kozossegi kapcsolatokat lehet kialakitani foci es fogadas temaban.

- description: "Focipedia monorepo (pnpm workspaces) with Next.js frontend and NestJS backend"
- packageManager: "pnpm@9.12.0"
- engines:
  - node: "24.0.0"
  - pnpm: "9.12.0"

## Project setup
pnpm, husky, eslint, prettier, typscript latest version.

## Project structure
- apps/
  - frontend/
  - backend/
- packages/
  - ui/
  - utils/
  - types/

## Frontend
Dependencies:
- Nextjs 15.4.5
- React latest
- Tailwind CSS latest
- Shadcn UI components latest
- axios latest for fetching data
- zod latest version for validation
- formik latest version for forms
- tanstack query latest version for fetching data

## Backend
Dependencies:
- NestJS 11.0.0
- Prisma 5.20.0
- PostgreSQL 16.4
- Redis 7.0.0
- JWT latest version for authentication
- argon2 latest version for password hashing
- cookie latest version for cookies
- cookie-parser latest version for cookie parsing
- helmet latest version for security
- jsonwebtoken latest version for jwt
- reflect-metadata latest version for metadata reflection
- rxjs latest version for reactive programming
- swagger latest version for api documentation
- caching with redis
- rate limiter


## Frontend visual design
Kezdo oldal: szep modern design sportos szinek animaciok. innen kell regisztralni az oldalra ami elvisz a dashboardra.
Dashboard tartalma: logo navbar grid layout. kesobb kiderul lesz a dashboard tartalma addig csak egy egszeru mock.
Authentikacio secure modern kijelentkezes middlewarek
Szerver komponensek, gyors betoltes skeleton, pre fetch, caching, tanstack quary, szep loading animation, szep login register formok.

## Backend kezdeti alapok:
gateway modul:
- health check
- auth
- user
- profile
- settings
KESOBB:
- notifications
- messages
- friends
- posts
- comments
- likes

Osszegzes:
Gyors modern design, modern tech stack, modern architecture, modern best practices.
Felkeszites kesobbi fejleszteshez pl adatbazis bovites, modulok bovites, fejlesztesi lehetosegek.
Az elso fazis celja a 2 db page letrehozasa az authentikacio hibatlan es biztonsagos elvegzese, es a par alap backend modul egy alap semaval.