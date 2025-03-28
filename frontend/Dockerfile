# Base stage for shared dependencies
FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Development stage
FROM base AS development
WORKDIR /app
COPY . .
RUN pnpm prisma generate
ENV NODE_ENV=development
CMD ["pnpm", "dev"]

# Production build stage
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm prisma generate
RUN pnpm build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install production dependencies only
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Copy necessary runtime files
COPY --from=builder /app/prisma ./prisma
RUN pnpm prisma generate

# Create storage directory for images
RUN mkdir -p storage/images storage/thumbnails

EXPOSE 3000
CMD ["node", "server.js"]
