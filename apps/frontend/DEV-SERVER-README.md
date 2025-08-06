# Focipedia Frontend Dev Server

## Biztonságos Dev Szerver Indítás

A frontend fejlesztéshez használja a következő módszereket:

### 1. Biztonságos Script Használata (AJÁNLOTT)

```bash
# A frontend könyvtárban
./dev.sh

# VAGY
pnpm run dev:safe
```

Ez a script:

- Ellenőrzi, hogy pnpm telepítve van-e
- Megakadályozza a többszörös dev szerver indítását
- Felszabadítja a 3000-es portot, ha szükséges
- Automatikusan pnpm-et használ

### 2. Közvetlen pnpm Használata

```bash
# Csak akkor használja, ha biztos, hogy nincs más dev szerver
pnpm run dev
```

### 3. Globális Script Használata

```bash
# A projekt gyökérkönyvtárából
./scripts/dev-server.sh
```

## Problémák Megoldása

### Több Dev Szerver Fut

Ha több dev szerver fut egyszerre:

```bash
# Összes dev szerver leállítása
pkill -f "next dev"
pkill -f "npm run dev"
pkill -f "pnpm run dev"
```

### Port 3000 Foglalt

Ha a 3000-es port foglalt:

```bash
# Port 3000 felszabadítása
lsof -ti :3000 | xargs kill -9
```

### npm Helyett pnpm Használata

**NE használja az npm-et!** Mindig pnpm-et használjon:

```bash
# HELYES
pnpm run dev
pnpm install
pnpm add package-name

# HELYTELEN
npm run dev
npm install
npm install package-name
```

## Portok

- **Frontend**: http://localhost:3000 (vagy következő szabad port)
- **Backend**: http://localhost:3001

## Hibaelhárítás

### Fekete Képernyő

Ha fekete képernyőt lát:

1. Ellenőrizze a böngésző konzolját (F12)
2. Nézze meg a terminal kimenetet
3. Próbálja meg a cache törlését: `pnpm run dev -- --clear`

### Végtelen Loop

Ha végtelen loop van:

1. Állítsa le az összes dev szervert
2. Törölje a `.next` könyvtárat: `rm -rf .next`
3. Indítsa újra: `pnpm run dev:safe`

### Turbopack Problémák

Ha Turbopack problémákat okoz:

```bash
# Turbopack nélkül
pnpm run dev -- --no-turbopack
```
