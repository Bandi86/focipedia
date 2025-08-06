# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
# Align pnpm with repo .npmrc (pnpm@9.12.3)
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
# Use absolute store dir to match cache mount
RUN pnpm config set store-dir /root/.pnpm-store

# 1) Pre-fetch only: fills store from lockfile for deterministic installs
FROM base AS prefetch
WORKDIR /repo
# Root manifests
COPY ../../package.json ./package.json
COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml
# App manifest
COPY ./package.json ./apps/backend/package.json
RUN --mount=type=cache,target=/root/.pnpm-store pnpm fetch

# 2) Build backend
FROM base AS build
WORKDIR /repo
COPY --from=prefetch /root/.local/share/pnpm/store /root/.local/share/pnpm/store
COPY ../../package.json ./package.json
COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./package.json ./apps/backend/package.json
# Install only what backend needs (dev deps allowed for build), ignore scripts to avoid lifecycle recursion
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --filter ./apps/backend... --prefer-offline --frozen-lockfile --ignore-scripts
# Copy sources and build
COPY apps/backend ./apps/backend
# Generate Prisma Client with explicit schema path (explicitly run script after install)
RUN pnpm --filter ./apps/backend exec prisma generate --schema=./apps/backend/prisma/schema.prisma
# Build TS -> dist
RUN pnpm --filter ./apps/backend run build

# 3) Create pruned, production deployment with flat node_modules
FROM base AS deploy
WORKDIR /repo
COPY --from=prefetch /root/.local/share/pnpm/store /root/.local/share/pnpm/store
COPY ../../package.json ./package.json
COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./package.json ./apps/backend/package.json
# Produce self-contained production install for backend into /opt/backend
RUN --mount=type=cache,target=/root/.pnpm-store pnpm config set node-linker node-modules \
  && pnpm --dir /repo deploy --filter ./apps/backend --prod /opt/backend

# 4) Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy pruned package with flat node_modules and package.json
COPY --from=deploy /opt/backend/ ./
# Bring compiled dist and prisma schema
COPY --from=build /repo/apps/backend/dist ./dist
COPY --from=build /repo/apps/backend/prisma ./prisma

# Non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3001
ENV PORT=3001
CMD ["node", "dist/main.js"]
