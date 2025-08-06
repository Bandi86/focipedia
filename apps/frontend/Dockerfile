# syntax=docker/dockerfile:1.7

# Base image
FROM node:20-alpine AS base

# Common setup
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

# Align pnpm with repo .npmrc (pnpm@9.12.3)
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Ensure pnpm uses an absolute store dir matching cache mount
RUN pnpm config set store-dir /root/.pnpm-store

# 1) Install workspace dependencies at repo root with pnpm (monorepo-aware)
FROM base AS deps
WORKDIR /repo

# Copy only files needed for dependency resolution (monorepo root)
COPY ../../package.json ./package.json
COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml
# Copy app manifest to ensure lock resolution includes this workspace
COPY ./package.json ./apps/frontend/package.json
# Copy only the source needed for building the frontend
COPY . ./apps/frontend

# Deterministic, non-interactive, no lifecycle scripts to avoid recursion
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm -w install --no-frozen-lockfile --prefer-offline --ignore-scripts

# 2) Build frontend
FROM base AS builder
WORKDIR /repo

# Reuse only frontend manifest and lock; avoid root workspace lifecycle scripts
COPY --from=deps /repo/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /repo/apps/frontend/package.json ./apps/frontend/package.json

# Copy frontend source
COPY . ./apps/frontend

# Build only the frontend app via workspace filtering
# Install only the frontend app deps to avoid root lifecycle scripts
# Ensure we are at workspace root so pnpm -w is valid
WORKDIR /repo
# Install ONLY the frontend's production deps directly in its folder so "next" exists
WORKDIR /repo/apps/frontend
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --no-frozen-lockfile --prefer-offline
# Build only the frontend app (no recursive)
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm run build

# 3) Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy Next standalone output (Next outputs under apps/frontend/.next when output: 'standalone')
# Copy Next output
COPY --from=builder /repo/apps/frontend/.next/standalone/ /app/
COPY --from=builder /repo/apps/frontend/public/ /app/public/
# Copy static assets
COPY --from=builder /repo/apps/frontend/.next/static/ /app/.next/static/
# Also copy any public/static in workspace root if needed (no-op if absent)

# Ensure correct ownership before switching users
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/bin/sh","-c"]
CMD 'if [ -f "/app/server.js" ]; then exec node /app/server.js; elif [ -f "/app/server/server.js" ]; then exec node /app/server/server.js; else echo "Cannot find Next standalone server entry. Listing /app:"; ls -la /app; echo "Listing /app/server (if exists):"; ls -la /app/server 2>/dev/null || true; echo "Listing /app/.next (if exists):"; ls -la /app/.next 2>/dev/null || true; exit 1; fi'