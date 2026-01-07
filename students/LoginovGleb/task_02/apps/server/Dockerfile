FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN pnpm install --prefer-offline || pnpm install
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable

COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/index.js"]
