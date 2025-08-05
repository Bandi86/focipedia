# Focipedia 🏈

A modern community platform for football enthusiasts and betting communities, built with Next.js and NestJS. Features enhanced authentication with dual login support, comprehensive dashboard modules, and Hungarian localization.

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

   # Run migrations and seed data
   cd apps/backend
   pnpm prisma:generate
   pnpm prisma:migrate:dev
   pnpm prisma:seed
   ```

4. **Start development servers**

   ```bash
   # Start all services
   pnpm dev

   # Or start individually
   cd apps/backend && pnpm dev    # Backend on http://localhost:3001
   cd apps/frontend && pnpm dev   # Frontend on http://localhost:3000
   ```

### Test User Credentials

After running the seed script, you can use these test credentials:

- **Username**: `testuser`
- **Email**: `test@example.com`
- **Password**: `TestPassword123!`

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
- **Internationalization**: Hungarian language support
- **Design System**: Green/emerald color scheme

### Enhanced Features

- **Dual Login Support**: Username or email login
- **Extended Token Management**: 24h access tokens, 30d refresh tokens
- **Automatic Token Refresh**: Seamless token refresh mechanism
- **Comprehensive Dashboard**: Multiple modules with lazy loading
- **Hungarian Localization**: Full Hungarian language support

### Project Structure

```
focipedia/
├── apps/
│   ├── frontend/          # Next.js application with dashboard modules
│   └── backend/           # NestJS application with enhanced auth
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
- [Project Summary](.cursor/project-summary.md)
- [API Documentation](http://localhost:3001/api/docs) (when running)

## 🛠️ Development

### Available Scripts

```bash
# Root level
pnpm dev          # Start all applications
pnpm build        # Build all applications
pnpm test         # Run tests
pnpm lint         # Run linting

# Backend
cd apps/backend
pnpm dev          # Start development server
pnpm prisma:seed  # Seed database
pnpm prisma:studio # Open database GUI

# Frontend
cd apps/frontend
pnpm dev          # Start development server
```

### Dashboard Modules

- **Newsfeed** (`/dashboard/newsfeed`): Posts, comments, trending topics
- **Matches** (`/dashboard/matches`): Live matches and statistics
- **Community** (`/dashboard/community`): User search and discovery
- **Notifications** (`/dashboard/notifications`): Real-time notifications
- **Favorites** (`/dashboard/favorites`): Favorite items management
- **Trends** (`/dashboard/trends`): Trending topics and analytics

### API Endpoints

- **Authentication**: `/api/auth/*` (login, register, refresh, logout)
- **Users**: `/api/users/*` (profile, settings, password)
- **Profiles**: `/api/profiles/*` (public profiles)
- **Settings**: `/api/settings/*` (user preferences)
- **Health**: `/api/health/*` (system health)

## 🔐 Authentication

### Features

- **Dual Login**: Support for username or email login
- **Extended Tokens**: 24h access tokens, 30d refresh tokens
- **Automatic Refresh**: Seamless token refresh mechanism
- **Secure Storage**: Token management with expiration checking
- **Route Protection**: Enhanced authentication checks

### Login Flow

1. User enters username/email and password
2. Backend validates credentials and returns JWT tokens
3. Frontend stores tokens securely with expiration tracking
4. API interceptor automatically refreshes expired tokens
5. Protected routes check authentication status

## 🎨 Design System

### Color Scheme

- **Primary**: Green/emerald gradients
- **Secondary**: Complementary colors
- **Dark Mode**: Full dark mode support
- **Accessibility**: High contrast ratios

### Localization

- **Language**: Hungarian throughout the application
- **Consistent Terminology**: Standardized Hungarian terms
- **User Experience**: Native Hungarian interface

## 🚀 Performance

### Frontend Optimizations

- **Lazy Loading**: Dashboard modules loaded on demand
- **Code Splitting**: Dynamic imports for large components
- **Bundle Optimization**: Minimized bundle sizes
- **Image Optimization**: Next.js image optimization

### Backend Optimizations

- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis for frequently accessed data
- **Token Management**: Optimized token refresh

## 🧪 Testing

### Test Coverage

- **Backend**: Unit tests for services and controllers
- **Frontend**: Component tests with React Testing Library
- **Authentication**: Dual login and token refresh tests
- **Dashboard**: Module functionality tests

### Test Commands

```bash
# Run all tests
pnpm test

# Run backend tests
cd apps/backend && pnpm test

# Run frontend tests
cd apps/frontend && pnpm test
```

## 📊 Current Status

### Phase 1: Core Infrastructure ✅ COMPLETED

- ✅ Enhanced authentication system with dual login
- ✅ Comprehensive dashboard with multiple modules
- ✅ Hungarian localization throughout
- ✅ Extended token management (24h/30d)
- ✅ Automatic token refresh mechanism
- ✅ Seed data for development and testing

### Phase 2: Backend Integration (Next)

- 🔄 Backend integration for dashboard modules
- 🔄 Real-time features with WebSocket
- 🔄 File upload and media handling
- 🔄 Advanced search functionality
- 🔄 Push notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards and guidelines
4. Test your changes thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:

1. Check the [troubleshooting guide](.cursor/development-setup.md#troubleshooting)
2. Review the [documentation](.cursor/)
3. Create an issue in the repository

---

**Focipedia** - A modern football community platform built with ❤️ and modern web technologies.
