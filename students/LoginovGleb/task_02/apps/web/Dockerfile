FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src ./src

RUN pnpm install --prefer-offline || pnpm install
RUN pnpm build

FROM nginx:1.25-alpine AS runner
COPY --from=base /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
