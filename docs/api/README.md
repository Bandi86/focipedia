# 🔌 API Dokumentáció

Ez a mappa tartalmazza a Focipedia projekt API dokumentációját.

## 📁 Dokumentumok

### 📚 [API Documentation](./api-documentation.md)

**Részletes API dokumentáció**

- REST API specifikációk
- Endpoint dokumentációk
- Request/Response példák
- Authentication dokumentáció

## 🚀 API Áttekintés

### Base URL

```
http://localhost:3001/api
```

### Authentication

- **JWT Token** - Bearer token authentication
- **Refresh Token** - Token frissítés támogatása

### Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📋 API Endpoints

### 🔐 Authentication

- `POST /auth/login` - Bejelentkezés
- `POST /auth/register` - Regisztráció
- `POST /auth/refresh` - Token frissítés
- `POST /auth/logout` - Kijelentkezés

### 📝 Posts

- `GET /posts` - Post lista lekérése
- `GET /posts/:id` - Egy post lekérése
- `POST /posts` - Új post létrehozása
- `PUT /posts/:id` - Post szerkesztése
- `DELETE /posts/:id` - Post törlése

### 💬 Comments

- `GET /comments/post/:postId` - Post kommentjei
- `GET /comments/replies/:commentId` - Komment válaszok
- `POST /comments` - Új komment létrehozása
- `PUT /comments/:id` - Komment szerkesztése
- `DELETE /comments/:id` - Komment törlése

### 👥 Users

- `GET /users/profile` - Felhasználói profil
- `PUT /users/profile` - Profil frissítése
- `GET /users/:id` - Felhasználó adatai

### 🏥 Health Check

- `GET /health` - Szerver állapot

## 🔧 API Használat

### Példa kérés

```bash
curl -X GET http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Példa válasz

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "1",
        "title": "Post cím",
        "content": "Post tartalom",
        "authorId": "user1",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10
  },
  "message": "Posts retrieved successfully"
}
```

## 🛠️ Fejlesztői eszközök

### Swagger UI

```
http://localhost:3001/api/docs
```

### Postman Collection

- [Focipedia API Collection](./postman-collection.json)

## 📝 API Verziókezelés

### Jelenlegi verzió

- **v1** - Alapvető CRUD műveletek
- **v2** - Speciális funkciók (tervezés alatt)

### Deprecation Policy

- 6 hónapos deprecation notice
- Backward compatibility 1 évig
- Migration guide minden változáshoz

## 🔒 Biztonság

### Rate Limiting

- 100 kérés/perc IP-nként
- 1000 kérés/óra felhasználónként

### CORS

```javascript
{
  origin: ['http://localhost:3000'],
  credentials: true
}
```

### Validation

- Request validation minden endpoint-on
- Sanitization automatikus
- SQL injection védelem

---

_Utoljára frissítve: 2024. január_
