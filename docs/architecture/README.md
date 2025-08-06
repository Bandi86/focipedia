# 🏗️ Architektúra és Tervezés

Ez a mappa tartalmazza a Focipedia projekt architektúra és tervezési dokumentumait.

## 📁 Dokumentumok

### 📋 [Product Requirements Document](./focipedia-prd.md)

**Részletes PRD dokumentáció**

- Projekt célok és célközönség
- Funkcionális követelmények
- Nem funkcionális követelmények
- Technikai specifikációk

## 🏗️ Rendszerarchitektúra

### Frontend Architektúra

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 App Router                    │
├─────────────────────────────────────────────────────────────┤
│  Server Components  │  Client Components  │  API Routes     │
├─────────────────────┼─────────────────────┼─────────────────┤
│ • Feed Page         │ • Interactive Forms │ • Auth API      │
│ • Dashboard         │ • Real-time Updates │ • Posts API     │
│ • Static Pages      │ • State Management  │ • Comments API  │
└─────────────────────┴─────────────────────┴─────────────────┘
```

### Backend Architektúra

```
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Backend                        │
├─────────────────────────────────────────────────────────────┤
│  Controllers  │  Services  │  Repositories  │  Middleware   │
├───────────────┼────────────┼────────────────┼───────────────┤
│ • Auth        │ • Business │ • Data Access  │ • Validation  │
│ • Posts       │ • Logic    │ • Database     │ • Auth        │
│ • Comments    │ • Rules    │ • Caching      │ • Logging     │
└───────────────┴────────────┴────────────────┴───────────────┘
```

### Adatbázis Architektúra

```
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
├─────────────────────────────────────────────────────────────┤
│  Users  │  Posts  │  Comments  │  Likes  │  Follows  │ ... │
├─────────┼─────────┼────────────┼─────────┼───────────┼─────┤
│ • Auth  │ • CRUD  │ • Nested   │ • Count │ • Social  │     │
│ • Prof  │ • Tags  │ • Replies  │ • Track │ • Graph   │     │
└─────────┴─────────┴────────────┴─────────┴───────────┴─────┘
```

## 🎯 Architektúra Elvek

### 1. **Server-First Approach**

- Server Components mindenhol, ahol lehetséges
- Client Components csak interakcióhoz
- Optimalizált bundle méret

### 2. **Performance-First**

- Lazy loading minden komponenshez
- Code splitting automatikus
- Image optimization
- Caching stratégia

### 3. **Scalability**

- Microservices-ready architektúra
- Horizontal scaling támogatás
- Database sharding lehetőség
- CDN integráció

### 4. **Security**

- JWT authentication
- Role-based access control
- Input validation minden szinten
- SQL injection védelem

## 🔧 Technológiai Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **State**: Zustand
- **Data Fetching**: React Query

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: class-validator

### DevOps

- **Package Manager**: PNPM
- **Testing**: Jest + Playwright
- **Linting**: ESLint + Prettier
- **Deployment**: Docker + Vercel

## 📊 Teljesítmény Célok

### Frontend

- **Page Load Time**: < 2 másodperc
- **Time to Interactive**: < 3 másodperc
- **Lighthouse Score**: > 90
- **Bundle Size**: < 500KB

### Backend

- **API Response Time**: < 200ms
- **Database Query Time**: < 100ms
- **Uptime**: > 99.9%
- **Error Rate**: < 1%

## 🔄 Deployment Architektúra

### Development

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │  Database   │
│  (Port 3000)│◄──►│ (Port 3001) │◄──►│ (Port 5432) │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Production

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CDN       │    │   Load      │    │  Database   │
│ (Vercel)    │◄──►│ Balancer    │◄──►│ (Managed)   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 📈 Skálázási Terv

### Phase 1: MVP

- Single server deployment
- Basic CRUD műveletek
- Authentication

### Phase 2: Growth

- Load balancer
- Database replication
- Caching layer

### Phase 3: Scale

- Microservices
- Event-driven architecture
- Real-time features

---

_Utoljára frissítve: 2024. január_
