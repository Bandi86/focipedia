# Focipedia 🏈

A modern community platform for football enthusiasts and betting communities, built with Next.js and NestJS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: 24.0.0)
- pnpm 8+ (recommended: 9.12.0)
- PostgreSQL 16.4
- Redis 7.0.0

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd focipedia
   pnpm install
   ```

2. **Environment setup**
   ```bash
   # Backend
   cp apps/backend/env.example apps/backend/.env
   
   # Frontend
   cp apps/frontend/env.example apps/frontend/.env.local
   ```

3. **Database setup**
   ```bash
   # Create database
   createdb focipedia
   
   # Run migrations
   cd apps/backend
   pnpm prisma:generate
   pnpm prisma:migrate:dev
   ```

4. **Start development servers**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individually
   cd apps/backend && pnpm dev    # Backend on http://localhost:3001
   cd apps/frontend && pnpm dev   # Frontend on http://localhost:3000
   ```

### Docker Setup

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15.4.5, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: NestJS 11.0.0, TypeScript, Prisma ORM
- **Database**: PostgreSQL 16.4
- **Cache**: Redis 7.0.0
- **Authentication**: JWT with Argon2 password hashing

### Project Structure
```
focipedia/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # NestJS application
├── packages/
│   ├── ui/                # Shared UI components
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── sources/
│   └── football.json/     # Football data sources
└── docs/                  # Documentation
```

## 📚 Documentation

- [Product Requirements Document](docs/plans/focipedia-prd.md)
- [Development Setup Guide](.cursor/development-setup.md)
- [Architecture Documentation](.cursor/architecture.md)
- [API Documentation](http://localhost:3001/api/docs) (when running)

## 🛠️ Development

### Available Scripts

```bash
# Root level
pnpm dev          # Start all applications
pnpm build        # Build all applications
pnpm test         # Run tests
pnpm lint         # Run linting
pnpm type-check   # TypeScript type checking

# Backend
cd apps/backend
pnpm dev          # Start development server
pnpm test         # Run tests
pnpm prisma:studio # Open Prisma Studio

# Frontend
cd apps/frontend
pnpm dev          # Start development server
pnpm build        # Build for production
```

### Database Management

```bash
cd apps/backend

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate:dev

# Reset database
pnpm prisma:migrate:reset

# Open Prisma Studio
pnpm prisma:studio
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/focipedia
JWT_SECRET=your-super-secret-jwt-key
REDIS_URL=redis://localhost:6379
PORT=3001
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Focipedia
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
pnpm test:cov     # Coverage

# Frontend tests
cd apps/frontend
pnpm test         # Unit tests
```

## 🚀 Deployment

### Production Build

```bash
# Build all applications
pnpm build

# Start production servers
cd apps/backend && pnpm start:prod
cd apps/frontend && pnpm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Features

### Phase 1 (Current)
- ✅ User authentication (registration, login, logout)
- ✅ JWT-based session management
- ✅ User profiles and settings
- ✅ Modern responsive UI
- ✅ Secure password hashing with Argon2
- ✅ Input validation with Zod
- ✅ API documentation with Swagger

### Phase 2 (Planned)
- 🔄 Social features (posts, comments, likes)
- 🔄 Direct messaging
- 🔄 Friend connections
- 🔄 Notifications system
- 🔄 Advanced betting analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
1. Check the [documentation](docs/)
2. Review the [troubleshooting guide](.cursor/development-setup.md#troubleshooting)
3. Create an issue in the repository

## 🔗 Links

- [Frontend](http://localhost:3000) - Main application
- [Backend API](http://localhost:3001) - API server
- [API Docs](http://localhost:3001/api/docs) - Swagger documentation
- [Prisma Studio](http://localhost:5555) - Database management (when running)

---

Built with ❤️ for the football community 