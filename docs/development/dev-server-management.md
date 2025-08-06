# Dev Szerver Kezelés - Focipedia

## Probléma

A frontend fejlesztés során gyakran előfordult, hogy:

- Több dev szerver futott egyszerre különböző portokon
- npm helyett pnpm-et kellett volna használni
- A 3000-es port foglalt volt
- Fekete képernyő és végtelen loop problémák

## Megoldás

### 1. Biztonságos Dev Szerver Script

Létrehoztunk egy `dev.sh` script-et a frontend könyvtárban, ami:

```bash
# A frontend könyvtárban
./dev.sh
```

**Funkciók:**

- Ellenőrzi, hogy pnpm telepítve van-e
- Megakadályozza a többszörös dev szerver indítását
- Felszabadítja a 3000-es portot, ha szükséges
- Automatikusan pnpm-et használ

### 2. Package.json Script

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "dev:safe": "./dev.sh"
  }
}
```

Használat:

```bash
pnpm run dev:safe
```

### 3. Globális Script

A `scripts/dev-server.sh` globális script a projekt gyökérkönyvtárából:

```bash
# A projekt gyökérkönyvtárából
./scripts/dev-server.sh
```

## Használati Útmutató

### Ajánlott Módszer

```bash
cd apps/frontend
./dev.sh
```

### Alternatív Módszerek

```bash
# Package.json script
pnpm run dev:safe

# Közvetlen pnpm (csak akkor, ha biztos, hogy nincs más dev szerver)
pnpm run dev

# Globális script
./scripts/dev-server.sh
```

## Problémák Megoldása

### Több Dev Szerver Fut

```bash
# Összes dev szerver leállítása
pkill -f "next dev"
pkill -f "npm run dev"
pkill -f "pnpm run dev"
```

### Port 3000 Foglalt

```bash
# Port 3000 felszabadítása
lsof -ti :3000 | xargs kill -9
```

### Fekete Képernyő

1. Ellenőrizze a böngésző konzolját (F12)
2. Nézze meg a terminal kimenetet
3. Cache törlése: `pnpm run dev -- --clear`

### Végtelen Loop

1. Állítsa le az összes dev szervert
2. Törölje a `.next` könyvtárat: `rm -rf .next`
3. Indítsa újra: `./dev.sh`

## Szabályok

### 1. Mindig pnpm-et használjon

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

### 2. Csak egy dev szerver futhat

A script automatikusan ellenőrzi és megakadályozza a többszörös indítást.

### 3. Port 3000 prioritás

A script megpróbálja a 3000-es portot használni, ha nem sikerül, akkor a következő szabad portot.

## Portok

- **Frontend**: http://localhost:3000 (vagy következő szabad port)
- **Backend**: http://localhost:3001

## Hibaelhárítás

### Script Nem Működik

```bash
# Futtathatóvá tétel
chmod +x dev.sh
chmod +x ../../scripts/dev-server.sh
```

### pnpm Nincs Telepítve

```bash
npm install -g pnpm
```

### Turbopack Problémák

```bash
# Turbopack nélkül
pnpm run dev -- --no-turbopack
```

## Automatizálás

A script automatikusan:

- Ellenőrzi a pnpm telepítését
- Megakadályozza a többszörös indítást
- Felszabadítja a szükséges portokat
- Használja a megfelelő package manager-t

## Jövőbeli Fejlesztések

- [ ] Docker támogatás
- [ ] Automatikus backend indítás
- [ ] Hot reload konfiguráció
- [ ] Environment változók kezelése
