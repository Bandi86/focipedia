# syntax=docker/dockerfile:1.7

# Base image
FROM node:20-alpine AS base

# Common setup
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# 1) Install workspace dependencies at repo root with pnpm (monorepo-aware)
FROM base AS deps
WORKDIR /repo

# Copy only files needed for dependency resolution (monorepo root)
# Leverage Docker build cache across services
COPY ../../package.json ./package.json
COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
# Lockfile is optional; copy only if present to leverage cache
# If absent, pnpm will resolve and create one during install
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml

# Also copy package manifests for all workspaces that affect lockfile
# Frontend app manifest
COPY ./package.json ./apps/frontend/package.json

# Install all workspace deps (no scripts). Allow missing or stale lockfile.
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --no-frozen-lockfile --recursive --ignore-scripts

# 2) Build frontend
FROM base AS builder
WORKDIR /repo

# Bring in installed node_modules from deps stage
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /repo/package.json ./package.json
COPY --from=deps /repo/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy frontend source only (avoid copying entire monorepo into image context)
COPY . ./apps/frontend

# Set CWD into the app
WORKDIR /repo/apps/frontend

# Install dependencies for THIS workspace only (no recursion)
# Ensures node_modules for the app exists and Next CLI is available
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm --filter ./apps/frontend install --no-frozen-lockfile

# Build only the frontend app (avoid triggering other workspace build scripts)
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm --filter ./apps/frontend run build

# 3) Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy Next standalone output from the known location under apps/frontend
# Next with `output: 'standalone'` writes server.js and node_modules under .next/standalone
# In this monorepo build, Next writes output under apps/frontend/apps/frontend/.next
# We need both the server bundle and the minimal node_modules that Next outputs there.
COPY --from=builder /repo/apps/frontend/apps/frontend/.next/standalone/ /app/
COPY --from=builder /repo/apps/frontend/apps/frontend/.next/static/ /app/.next/static/
# Public assets (exists near the package.json)
COPY --from=builder /repo/apps/frontend/apps/frontend/public/ /app/public/

# Ensure correct ownership before switching users
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Start Next.js standalone server produced by `output: 'standalone'`
# Try common entrypoints: /app/server.js (Next v15) or /app/server/server.js (older)
ENTRYPOINT ["/bin/sh","-c"]
CMD 'if [ -f "/app/server.js" ]; then exec node /app/server.js; elif [ -f "/app/server/server.js" ]; then exec node /app/server/server.js; else echo "Cannot find Next standalone server entry. Listing /app:"; ls -la /app; echo "Listing /app/server (if exists):"; ls -la /app/server 2>/dev/null || true; echo "Listing /app/.next (if exists):"; ls -la /app/.next 2>/dev/null || true; exit 1; fi'