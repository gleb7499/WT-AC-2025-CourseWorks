# Multi-stage build for monorepo with pnpm

# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /repo

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

RUN corepack enable

# Copy monorepo configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ ./apps/
COPY packages/ ./packages/

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Build server and generate Prisma client
RUN pnpm -C apps/server build
WORKDIR /repo/apps/server
RUN pnpm prisma generate
WORKDIR /repo

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /repo

# Install OpenSSL for Prisma and curl for healthchecks
RUN apk add --no-cache openssl curl

ENV NODE_ENV=production
RUN corepack enable

# Copy entire monorepo structure from builder
COPY --from=builder /repo /repo

# Copy entrypoint script
COPY apps/server/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set working directory to server app
WORKDIR /repo/apps/server

# Expose port
EXPOSE 3000

# Use entrypoint for migrations + start
ENTRYPOINT ["docker-entrypoint.sh"]
