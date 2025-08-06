# Frontend Refaktorálás TODO Lista

## 🚨 KRITIKUS - useEffect-ek eltávolítása és Server Components

### 1. Posts oldal átalakítása Server Component-re ✅

- [x] `apps/frontend/src/app/posts/page.tsx` átalakítása Server Component-re
- [x] useEffect eltávolítása, helyette server-side data fetching
- [x] Loading state kezelése Suspense-szel
- [x] Error boundary hozzáadása
- [x] Client Components csak ahol szükséges (form-ok, interaktív elemek)

### 2. PostForm átalakítása ✅

- [x] `apps/frontend/src/components/posts/PostForm.tsx` Client Component marad (form interakciók miatt)
- [x] Optimizálás: csak a szükséges state-ek
- [x] Server Actions használata form submission-hez

### 3. PostCard átalakítása ✅

- [x] `apps/frontend/src/components/posts/PostCard.tsx` Server Component lehet
- [x] Interaktív elemek (edit, delete) külön Client Component-ek
- [x] Optimizálás: memo, useCallback

## 🌐 MAGAS - Lokalizáció javítása

### 4. Next.js i18n beállítása

- [ ] `next.config.js` i18n konfiguráció
- [ ] Locale fájlok létrehozása (`locales/hu.json`, `locales/en.json`)
- [ ] useTranslations hook beállítása
- [ ] Dinamikus nyelvváltás támogatása

### 5. Komponensek lokalizálása ✅

- [x] PostForm szövegek i18n-re átalakítása
- [x] PostCard szövegek i18n-re átalakítása
- [x] Posts oldal szövegek i18n-re átalakítása
- [x] Error üzenetek lokalizálása
- [x] Toast üzenetek lokalizálása

## 🛣️ MAGAS - Routing struktúra átszervezése

### 6. Új feed oldal létrehozása ✅

- [x] `apps/frontend/src/app/feed/page.tsx` létrehozása
- [x] `apps/frontend/src/app/hirfolyam/page.tsx` létrehozása (magyar verzió)
- [x] Facebook-szerű layout és design
- [x] Infinite scroll implementálása
- [x] Server-side pagination

### 7. Dashboard integráció ✅

- [x] Dashboard oldalra feed widget hozzáadása
- [x] Navigáció a feed oldalra
- [x] `/posts` átirányítás `/feed`-re
- [x] Breadcrumb navigáció

### 8. Komponens struktúra átszervezése ✅

- [x] Feed komponensek létrehozása
- [x] Post list komponens átszervezése
- [x] Komment rendszer integrálása a feed-be
- [x] Responsive design javítása

## ⚡ KÖZEPES - Funkcionalitás bővítése

### 9. Like/Dislike rendszer

- [ ] Backend API endpoints (like, unlike, dislike, undislike)
- [ ] Database schema kiegészítése (PostLike, PostDislike táblák)
- [ ] Frontend like/dislike komponensek
- [ ] Real-time like count frissítés
- [ ] Optimistic updates

### 10. Share funkció

- [ ] Share modal komponens
- [ ] Social media sharing (Facebook, Twitter, LinkedIn)
- [ ] Copy link funkció
- [ ] Share analytics

### 11. Hashtag támogatás

- [ ] Hashtag parsing a post tartalomból
- [ ] Hashtag linkek (kattintható)
- [ ] Hashtag keresés
- [ ] Trending hashtags
- [ ] Hashtag oldal (`/hashtag/[tag]`)

### 12. Képfeltöltés

- [ ] Image upload komponens
- [ ] Cloud storage integráció (AWS S3 vagy Cloudinary)
- [ ] Image optimization
- [ ] Multiple image support
- [ ] Image gallery

### 13. Komment moderáció

- [ ] Post szerző jogosultságai
- [ ] Komment törlés funkció
- [ ] Törlés audit log
- [ ] Moderátor szerepkörök

## 🎨 ALACSONY - UX/UI finomhangolás

### 14. Loading states és error handling

- [ ] Skeleton loading komponensek
- [ ] Error boundary-ek minden oldalon
- [ ] Retry mechanism
- [ ] Offline support

### 15. Responsive design

- [ ] Mobile-first approach
- [ ] Tablet layout optimalizálás
- [ ] Touch-friendly interakciók
- [ ] Accessibility javítások

### 16. Performance optimalizálás

- [ ] Image lazy loading
- [ ] Code splitting
- [ ] Bundle size optimalizálás
- [ ] Caching stratégia

## 🔧 Technikai feladatok

### 17. TypeScript javítások

- [ ] Strict mode bekapcsolása
- [ ] Type definíciók javítása
- [ ] API response típusok
- [ ] Error típusok

### 18. Testing

- [ ] Unit tesztek a komponensekhez
- [ ] Integration tesztek
- [ ] E2E tesztek a kritikus user flow-khoz
- [ ] Performance tesztek

### 19. Dokumentáció

- [ ] Komponens dokumentáció
- [ ] API dokumentáció frissítése
- [ ] Deployment guide
- [ ] Contributing guide

## 📋 Implementációs sorrend

### Fázis 1: Kritikus javítások (1-2 nap)

1. useEffect-ek eltávolítása
2. Server Components implementálása
3. Infinite loading problémák megoldása

### Fázis 2: Lokalizáció (1 nap)

4. i18n beállítása
5. Szövegek lokalizálása

### Fázis 3: Routing átszervezés (2-3 nap)

6. Feed oldal létrehozása
7. Dashboard integráció
8. Navigáció javítása

### Fázis 4: Funkcionalitás bővítés (3-5 nap)

9. Like/Dislike rendszer
10. Share funkció
11. Hashtag támogatás
12. Képfeltöltés

### Fázis 5: Finomhangolás (1-2 nap)

13. UX/UI javítások
14. Performance optimalizálás
15. Testing

## 🎯 Várható eredmények

- **Teljesítmény**: 50-70% gyorsabb betöltés
- **UX**: Konzisztens, modern felhasználói élmény
- **Karbantarthatóság**: Tisztább kód, jobb architektúra
- **Skálázhatóság**: Könnyebb új funkciók hozzáadása
- **Lokalizáció**: Teljes magyar nyelv támogatás
