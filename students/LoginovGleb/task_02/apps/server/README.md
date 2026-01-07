# Server (Variant 40)

## Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL running and reachable via `DATABASE_URL`

## Setup

1. Copy `apps/server/.env.example` to `apps/server/.env` and configure:
   - JWT secrets (generate strong secrets for production)
   - CORS origin (frontend URL)
   - Database URL
2. Install deps: `pnpm install` (from repo root).
3. Generate Prisma client: `pnpm --filter @app/server prisma:generate`.
4. Run migrations: `pnpm --filter @app/server prisma:migrate --name init`.

## Development

- Start API: `pnpm dev:server`
- Health: `GET /health` returns `{ status: "ok" }`
- Readiness: `GET /ready` checks DB availability
- Auth endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
  - `GET /users/me` (requires `Authorization: Bearer <access>`)
    - Business API (access token only): `/forms`, `/statuses`, `/applications`, `/attachments`

  ## Seed данные для разработки

  - Seed очищает все таблицы перед созданием данных (dev-only).
  - Выполнить после миграций: `pnpm -C apps/server prisma db seed`
  - Тестовые аккаунты (email/пароль):
    - <admin@example.com> / admin123!
    - <moderator@example.com> / moderator123!
    - <user@example.com> / user123!
    - <demo@example.com> / demo123!
    - <analytics@example.com> / student123!
    - <content@example.com> / author123!
  - Предзаполненные сущности: базовые статусы (`draft`, `pending`, `approved`, `rejected`, `withdrawn`), две формы, пять заявок (draft/pending/approved/rejected/withdrawn) и один файл-вложение.
  - Примеры команд (PowerShell + curl.exe, замените `<access_token>` и `<refresh_cookie>`):
    - Login: `curl.exe -X POST "http://localhost:3000/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"admin123!\"}"`
    - Refresh (используя refresh cookie из Set-Cookie): `curl.exe -X POST "http://localhost:3000/auth/refresh" -H "Cookie: refresh_token=<refresh_cookie>"`
    - Logout: `curl.exe -X POST "http://localhost:3000/auth/logout" -H "Cookie: refresh_token=<refresh_cookie>"`
    - Пример защищенного запроса: `curl.exe "http://localhost:3000/forms" -H "Authorization: Bearer <access_token>"`

## Notes

- Refresh token is stored as HttpOnly cookie `refresh_token`.
- Access token must be sent in `Authorization: Bearer <token>`.
- Structured logs via pino (JSON in production, pretty in dev).
- `prisma studio` available with `pnpm --filter @app/server prisma:studio`.
- Required base statuses: create statuses with names `draft`, `pending`, `withdrawn` (and any others) before using application flows.
