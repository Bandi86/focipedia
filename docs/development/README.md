# 💻 Fejlesztési Dokumentáció

Ez a mappa tartalmazza a Focipedia projekt fejlesztési dokumentációját.

## 📁 Dokumentumok

### 🐛 [Frontend Issues](./frontend.md)

**Frontend problémák és megoldások**

- Elvégzett feladatok (FÁZIS 1-2)
- Fennmaradó problémák
- Következő fontos dolgok
- Implementációs stratégia

### 🧪 [Testing Setup](./testing-setup.md)

**Tesztelési dokumentáció**

- Unit tesztek setup
- E2E tesztek konfiguráció
- Tesztelési stratégiák
- Coverage jelentések

### 👥 [Contributing Guidelines](./contributing.md)

**Fejlesztői útmutató**

- Kód írási szabályok
- Git workflow
- Code review folyamat
- Pull request template

### 📦 [Package Manager](./pnpm.md)

**PNPM dokumentáció**

- Telepítés és konfiguráció
- Workspace kezelés
- Script-ek és parancsok
- Best practices

### 🏗️ [Project Start Plan](./project_start_plan_self.md)

**Projekt indítási terv**

- Kezdeti setup
- Architektúra döntések
- Technológiai stack
- Fejlesztési fázisok

## 🚀 Gyors linkek

- [Frontend issues](./frontend.md)
- [Testing setup](./testing-setup.md)
- [Contributing guidelines](./contributing.md)

## 🔧 Fejlesztési környezet

### Technológiai stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, Prisma, PostgreSQL
- **Testing**: Jest, React Testing Library, Playwright
- **Package Manager**: PNPM

### Fejlesztési parancsok

```bash
# Telepítés
pnpm install

# Fejlesztési szerver indítása
pnpm run dev

# Tesztek futtatása
pnpm run test

# Build
pnpm run build
```

## 📝 Kód írási szabályok

1. **TypeScript** - Minden kód TypeScript-ben
2. **ESLint + Prettier** - Kód formázás és linting
3. **Commit konvenciók** - Conventional Commits
4. **Testing** - Minden új funkció tesztelése
5. **Dokumentáció** - Kód dokumentálása

## 🔄 Fejlesztési folyamat

1. **Feature branch** - Új feature branch létrehozása
2. **Fejlesztés** - Kód írása és tesztelése
3. **Pull Request** - Code review kérése
4. **Merge** - Main branch-be merge
5. **Deploy** - Automatikus deploy

---

_Utoljára frissítve: 2024. január_
