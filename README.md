# Focipedia

A modern football encyclopedia built with Next.js frontend and NestJS backend.

## 🏗️ Architecture

This is a monorepo using pnpm workspaces with the following structure:

- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Backend**: NestJS with Prisma ORM and PostgreSQL
- **Shared packages**: TypeScript types, UI components, utilities
- **Data**: Football data from [openfootball/football.json](https://github.com/openfootball/football.json)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.18.0
- pnpm >= 9.0.0
- PostgreSQL

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd focipedia
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   # Backend
   cp apps/backend/.env.example apps/backend/.env
   # Edit apps/backend/.env with your database URL and JWT secret
   
   # Frontend
   cp apps/frontend/.env.example apps/frontend/.env
   # Edit apps/frontend/.env with your API base URL
   ```

4. **Setup database**
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```
focipedia/
├── apps/
│   ├── frontend/          # Next.js 15 frontend
│   └── backend/           # NestJS backend
├── packages/
│   ├── types/             # Shared TypeScript types
│   ├── ui/                # Shared UI components
│   ├── utils/             # Shared utilities
│   └── config/            # Shared configuration
├── sources/
│   └── football.json/     # Football data (git submodule)
└── infra/                 # Docker and deployment configs
```

## 🛠️ Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Run ESLint on all packages
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm ci` - Run all quality gates (lint, typecheck, test, build)

## 🗄️ Database

The project uses PostgreSQL with Prisma ORM. Database schema is defined in `apps/backend/prisma/schema.prisma`.

## 📊 Data Sources

Football data is sourced from the [openfootball/football.json](https://github.com/openfootball/football.json) repository, included as a git submodule. This provides comprehensive match data for various leagues and seasons.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [openfootball](https://github.com/openfootball) for providing the football data
- [Next.js](https://nextjs.org/) for the frontend framework
- [NestJS](https://nestjs.com/) for the backend framework
- [Prisma](https://www.prisma.io/) for the database ORM 