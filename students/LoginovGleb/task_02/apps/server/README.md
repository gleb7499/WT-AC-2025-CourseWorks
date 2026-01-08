# Server (Backend) — Вариант 40

REST API сервер для системы управления заявками «Да, я в деле».

## Что реализовано

**Основные функции:**

- JWT аутентификация (access + refresh tokens с ротацией)
- Роли пользователей: admin, moderator, user
- CRUD для форм заявок (только admin)
- CRUD для статусов (только admin)
- Управление заявками (создание, просмотр, редактирование, смена статусов)
- Загрузка вложений к заявкам
- История изменений статусов
- Валидация данных (Zod)
- Структурированное логирование (Pino)

**Эндпоинты:**

*Auth (публичные):*

- `POST /auth/register` — регистрация
- `POST /auth/login` — вход (возвращает access token + устанавливает HttpOnly cookie с refresh)
- `POST /auth/refresh` — обновление access token по refresh cookie
- `POST /auth/logout` — выход (отзыв refresh token)

*Users (защищённые):*

- `GET /users/me` — информация о текущем пользователе

*Forms (GET публичные, остальное admin):*

- `GET /forms` — список форм (гости видят только активные, admin — все)
- `GET /forms/:id` — детали формы
- `POST /forms` — создание (admin)
- `PUT /forms/:id` — редактирование (admin)
- `DELETE /forms/:id` — удаление (admin)

*Statuses (требуют авторизации; создание/изменение/удаление — только admin):*

- `GET /statuses` — список статусов
- `GET /statuses/:id` — детали статуса
- `POST /statuses` — создание (admin)
- `PUT /statuses/:id` — редактирование (admin)
- `DELETE /statuses/:id` — удаление (admin)

*Applications (требуют авторизации):*

- `GET /applications` — список заявок (пользователи видят свои, модераторы/admin — все)
- `GET /applications/:id` — детали заявки
- `POST /applications` — создание заявки
- `PUT /applications/:id` — редактирование (только черновики, владелец или admin)
- `DELETE /applications/:id` — удаление (только черновики, владелец или admin)
- `POST /applications/:id/submit` — отправка на рассмотрение (статус draft → pending)
- `PUT /applications/:id/status` — смена статуса (moderator/admin)
- `POST /applications/:id/withdraw` — отзыв заявки (владелец)

*Attachments (требуют авторизации):*

- `GET /attachments?applicationId=...` — список вложений заявки
- `GET /attachments/:id` — скачивание файла
- `POST /attachments` — загрузка (только черновики, до 10 файлов, макс. 50 МБ на заявку)
- `DELETE /attachments/:id` — удаление (только черновики, владелец или admin)

*Health:*

- `GET /health` — статус сервера
- `GET /ready` — готовность (проверка подключения к БД)

## API Documentation

- Swagger UI: <http://localhost:3000/api-docs>
- OpenAPI JSON: <http://localhost:3000/api-docs.json>
- Для тестирования авторизованных запросов нажмите кнопку **Authorize** в Swagger UI и вставьте `Bearer <access_token>` в поле значения токена.

**Модели данных (Prisma):**

- User (id, username, email, passwordHash, role, createdAt)
- RefreshToken (id, tokenHash, userId, expiresAt, revokedAt, ...)
- Form (id, name, description, fields:JSON, isActive, createdById, ...)
- Status (id, name, description, color, order, isFinal, createdAt)
- Application (id, formId, userId, statusId, data:JSON, comment, submittedAt, ...)
- Attachment (id, applicationId, filename, filePath, fileSize, mimeType, uploadedById, ...)
- StatusHistory (id, applicationId, fromStatusId, toStatusId, changedById, changedAt, comment)

## Требования

- Node.js 20+
- PostgreSQL 14+ (запущен и доступен)
- pnpm 8.15+

## Установка

### 1. Установка зависимостей

```bash
# Из корня проекта
pnpm install
```

### 2. Настройка переменных окружения

Создайте файл `apps/server/.env` со следующими переменными:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coursework_db?schema=public"

# JWT Secrets
# ВАЖНО: в production используйте криптостойкие случайные строки!
JWT_ACCESS_SECRET="your_access_secret_min_32_chars"
JWT_REFRESH_SECRET="your_refresh_secret_min_32_chars"

# JWT TTL (время жизни токенов)
JWT_ACCESS_TTL="15m"    # Access token на 15 минут
JWT_REFRESH_TTL="7d"    # Refresh token на 7 дней

# CORS (разделяйте запятыми для нескольких origin)
CORS_ORIGIN="http://localhost:5173"

# Server
SERVER_PORT=3000
SERVER_HOST=0.0.0.0
NODE_ENV=development

# Cookies (для production установите true)
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

**Примечания:**

- `DATABASE_URL` — строка подключения к PostgreSQL
- `JWT_*_SECRET` — должны быть разными и достаточно длинными (минимум 32 символа)
- `JWT_ACCESS_TTL` — короткий TTL для access token (5-30 минут)
- `JWT_REFRESH_TTL` — длинный TTL для refresh token (7-30 дней)
- `CORS_ORIGIN` — URL фронтенда (или несколько через запятую)
- `COOKIE_SECURE=true` в production (требует HTTPS)

**Важно про cookies в production:**

- Если frontend и backend находятся на **разных доменах/поддоменах**, для отправки refresh-cookie браузером обычно нужно выставить `COOKIE_SAMESITE=none` и `COOKIE_SECURE=true` (а значит — HTTPS).
- `CORS_ORIGIN` должен быть задан точным origin фронтенда, и на сервере должен быть включён `credentials: true` (в проекте включено).

### 3. Инициализация базы данных

```bash
# Генерация Prisma клиента
pnpm --filter @app/server prisma:generate

# Применение миграций (создаст таблицы)
pnpm --filter @app/server prisma:migrate
# При запросе имени миграции введите, например: init

# Заполнение тестовыми данными (опционально, для разработки)
pnpm --filter @app/server prisma:seed
```

## Запуск

**Из корня проекта:**

```bash
# Только backend
pnpm dev:server

# Или вместе с фронтендом
pnpm dev
```

**Напрямую из apps/server:**

```bash
cd apps/server
pnpm dev
```

Сервер запустится на <http://localhost:3000>

## Seed данные (тестовые пользователи)

После выполнения `pnpm --filter @app/server prisma:seed` в БД будут созданы:

**Пользователи:**

| Email                 | Пароль       | Роль      | Описание                      |
|-----------------------|--------------|-----------|-------------------------------|
| <admin@example.com>     | admin123!    | admin     | Администратор                 |
| <moderator@example.com> | moderator123!| moderator | Модератор                     |
| <user@example.com>      | user123!     | user      | Обычный пользователь          |
| <demo@example.com>      | demo123!     | user      | Демо-пользователь             |
| <analytics@example.com> | student123!  | user      | Анна (аналитика)              |
| <content@example.com>   | author123!   | user      | Иван (контент)                |

**Предзаполненные данные:**

- 5 базовых статусов: draft, pending, approved, rejected, withdrawn (с цветами)
- 2 формы заявок: «Участие в событии» (активна), «Обратная связь» (неактивна)
- 5 демонстрационных заявок в разных статусах
- 1 файл-вложение

⚠️ **Важно:** Seed **очищает все таблицы** перед созданием данных! Используйте только в dev-окружении.

## Примеры запросов (PowerShell + curl.exe)

### 1. Регистрация

```powershell
curl.exe -X POST "http://localhost:3000/auth/register" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"newuser@test.com\",\"username\":\"newuser\",\"password\":\"Pass123!\"}'
```

**Ответ:**

```json
{
  "status": "ok",
  "data": {
    "user": {
      "id": "...",
      "username": "newuser",
      "email": "newuser@test.com",
      "role": "user",
      "createdAt": "..."
    },
    "accessToken": "eyJhbGc..."
  }
}
```

### 2. Вход (Login)

```powershell
curl.exe -X POST "http://localhost:3000/auth/login" `
  -H "Content-Type: application/json" `
  -c cookies.txt `
  -d '{\"email\":\"admin@example.com\",\"password\":\"admin123!\"}'
```

**Ответ:**

```json
{
  "status": "ok",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc..."
  }
}
```

**Примечание:** Флаг `-c cookies.txt` сохраняет HttpOnly cookie с refresh token.

### 3. Refresh (обновление access token)

```powershell
curl.exe -X POST "http://localhost:3000/auth/refresh" `
  -H "Content-Type: application/json" `
  -b cookies.txt `
  -c cookies.txt
```

**Ответ:**

```json
{
  "status": "ok",
  "data": {
    "user": { ... },
    "accessToken": "новый_access_token"
  }
}
```

**Примечание:**

- `-b cookies.txt` отправляет refresh cookie
- `-c cookies.txt` сохраняет новый refresh cookie (ротация)

### 4. Logout (выход)

```powershell
curl.exe -X POST "http://localhost:3000/auth/logout" `
  -b cookies.txt
```

**Ответ:** HTTP 204 (No Content)

После logout повторный refresh вернёт 401.

### 5. Защищённые эндпоинты

Для доступа к защищённым эндпоинтам используйте access token из login/refresh:

```powershell
$accessToken = "полученный_access_token"

# Получить информацию о себе
curl.exe "http://localhost:3000/users/me" `
  -H "Authorization: Bearer $accessToken"

# Список форм (авторизованный пользователь видит неактивные, если admin)
curl.exe "http://localhost:3000/forms" `
  -H "Authorization: Bearer $accessToken"

# Список заявок
curl.exe "http://localhost:3000/applications" `
  -H "Authorization: Bearer $accessToken"

# Создать заявку
curl.exe -X POST "http://localhost:3000/applications" `
  -H "Authorization: Bearer $accessToken" `
  -H "Content-Type: application/json" `
  -d '{\"formId\":\"form_id\",\"data\":{\"field1\":\"value1\"},\"comment\":\"Тест\"}'
```

## Prisma Studio

Графический интерфейс для просмотра и редактирования данных в БД:

```bash
pnpm --filter @app/server prisma:studio
```

Откроется по адресу <http://localhost:5555>

## Health Checks

### Health (базовый)

```bash
curl.exe http://localhost:3000/health
```

**Ответ:**

```json
{ "status": "ok" }
```

### Ready (с проверкой БД)

```bash
curl.exe http://localhost:3000/ready
```

**Ответ:**

```json
{
  "status": "ok",
  "checks": {
    "database": "ok"
  }
}
```

Если БД недоступна — вернёт 503.

## Структура проекта

```
apps/server/
├── src/
│   ├── index.ts              # Точка входа
│   ├── app.ts                # Конфигурация Express
│   ├── lib/                  # Утилиты (config, jwt, logger, prisma, ...)
│   ├── middleware/           # Middleware (auth, errorHandler, ...)
│   ├── modules/              # Бизнес-логика по модулям
│   │   ├── auth/             # Аутентификация (register, login, refresh, logout)
│   │   ├── users/            # Пользователи
│   │   ├── forms/            # Формы
│   │   ├── statuses/         # Статусы
│   │   ├── applications/     # Заявки
│   │   └── attachments/      # Вложения
│   ├── routes/               # Агрегация роутов
│   └── types/                # TypeScript типы
├── prisma/
│   ├── schema.prisma         # Схема БД
│   ├── migrations/           # Миграции
│   └── seed.ts               # Seed данные
├── package.json
├── tsconfig.json
└── README.md
```

## Логирование

Используется Pino с форматированием:

- **Development:** Pretty logs (читаемый вывод)
- **Production:** JSON logs (для централизованного сбора)

Уровень логов настраивается через `NODE_ENV`.

## Безопасность

- Пароли хэшируются с bcrypt (cost factor 10)
- Refresh tokens хранятся хэшированными (SHA-256)
- HttpOnly cookies для refresh tokens (защита от XSS)
- CORS настроен на конкретные origins
- Helmet для базовых HTTP заголовков безопасности
- Валидация всех входящих данных (Zod)

## Troubleshooting

**Ошибка "Missing required env JWT_ACCESS_SECRET":**

- Создайте файл `apps/server/.env` с нужными переменными

**Ошибка подключения к БД:**

- Убедитесь, что PostgreSQL запущен
- Проверьте `DATABASE_URL` в `.env`

**Ошибка "P1001: Can't reach database server":**

- Проверьте хост/порт PostgreSQL
- Убедитесь, что нет файрволла, блокирующего подключение

**CORS ошибки:**

- Добавьте URL фронтенда в `CORS_ORIGIN`

**Ошибка "Migration failed":**

- Убедитесь, что БД существует и доступна
- Попробуйте `pnpm --filter @app/server prisma:push` для форсированной синхронизации

**Для отладки JWT refresh (короткий TTL):**

```env
JWT_ACCESS_TTL=1m
```

Access token будет истекать через минуту, что удобно для тестирования автоматического обновления на фронтенде.

## Production Checklist

- [ ] Сгенерируйте криптостойкие `JWT_*_SECRET` (минимум 32 символа)
- [ ] Установите `COOKIE_SECURE=true` (требует HTTPS)
- [ ] Настройте `CORS_ORIGIN` на реальный домен
- [ ] Увеличьте `JWT_ACCESS_TTL` до 15-30 минут
- [ ] Настройте централизованный сбор логов
- [ ] Используйте connection pooling для PostgreSQL
- [ ] Настройте rate limiting
- [ ] Включите мониторинг и алерты

## Дополнительные команды

```bash
# Генерация Prisma клиента
pnpm --filter @app/server prisma:generate

# Применение миграций
pnpm --filter @app/server prisma:migrate

# Синхронизация схемы без миграций (dev only!)
pnpm --filter @app/server prisma:push

# Открыть Prisma Studio
pnpm --filter @app/server prisma:studio

# Заполнить БД seed-данными
pnpm --filter @app/server prisma:seed

# Сборка для production
pnpm --filter @app/server build

# Запуск production build
pnpm --filter @app/server start
```

## Следующие этапы

MVP реализован. Планируются бонусные фичи:

- OpenAPI 3.0 спецификация + Swagger UI
- Unit и integration тесты (Vitest)
- Dockerfile + Docker Compose
- Kubernetes манифесты
- CI/CD пайплайн
- Prometheus метрики
- Redis для кэширования сессий
