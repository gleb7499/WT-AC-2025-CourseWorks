# Курсовой проект «Веб-Технологии» — Вариант 40

**Заявки «Да, я в деле»** — система для приёма и обработки заявок через настраиваемые формы с трекингом статусов и ролями пользователей.

## Описание проекта

Full-stack приложение для управления заявками:

- Пользователи заполняют заявки по шаблонным формам
- Модераторы и администраторы управляют статусами заявок
- Администраторы создают формы и статусы
- JWT аутентификация (access + refresh tokens с ротацией)
- Роли: admin, moderator, user

## Стек технологий

**Frontend:**

- React 18 + TypeScript
- Vite
- React Router v7
- React Hook Form + Zod
- CSS modules

**Backend:**

- Node.js 20+
- Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT (jsonwebtoken)
- Pino (структурированные логи)

## Требования

- Node.js 20 или выше
- pnpm 8.15+ (установить: `npm install -g pnpm`)
- PostgreSQL 14+ (запущен и доступен)

## Быстрый старт

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Настройка backend

Создайте файл `apps/server/.env` (пример ниже):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coursework_db?schema=public"

# JWT Secrets (генерируйте случайные строки для production!)
JWT_ACCESS_SECRET="dev_access_secret_change_in_prod"
JWT_REFRESH_SECRET="dev_refresh_secret_change_in_prod"

# JWT TTL (время жизни токенов)
JWT_ACCESS_TTL="15m"
JWT_REFRESH_TTL="7d"

# CORS
CORS_ORIGIN="http://localhost:5173"

# Server
SERVER_PORT=3000
NODE_ENV=development
```

### 3. Инициализация базы данных

```bash
# Генерация Prisma клиента
pnpm --filter @app/server prisma:generate

# Применение миграций
pnpm --filter @app/server prisma:migrate

# Заполнение тестовыми данными (опционально)
pnpm --filter @app/server prisma:seed
```

### 4. Настройка frontend

Создайте файл `apps/web/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 5. Запуск приложения

**Запустить всё одной командой:**

```bash
pnpm dev
```

Это запустит:

- Backend: <http://localhost:3000>
- Frontend: <http://localhost:5173>

**Или запускать раздельно (в разных терминалах):**

```bash
# Terminal 1 - Backend
pnpm dev:server

# Terminal 2 - Frontend
pnpm dev:web
```

## Проверка работоспособности

### 1. Регистрация

Откройте <http://localhost:5173> → кликните «Регистрация»:

- Email: `test@example.com`
- Имя: `testuser`
- Пароль: `Test123!`

### 2. Вход

После регистрации произойдёт автоматический вход. При повторном заходе используйте созданные учётные данные.

### 3. Основной сценарий

**Для обычного пользователя:**

1. Перейдите в раздел «Заявки»
2. Нажмите «Новая заявка»
3. Выберите форму и заполните поля
4. Сохраните черновик или отправьте на рассмотрение
5. Просмотрите статус заявки

**Для администратора (используйте seed-данные):**

1. Войдите как `admin@example.com` / `admin123!`
2. Создайте новую форму в разделе «Формы»
3. Настройте статусы в разделе «Статусы»
4. Просмотрите все заявки и измените их статусы

### 4. Проверка JWT refresh

Access token истекает через 15 минут (по умолчанию). При любом защищённом запросе после истечения:

- Frontend автоматически вызовет `POST /auth/refresh` с HttpOnly cookie
- Получит новый access token
- Повторит исходный запрос
- Пользователь не заметит разрыва сессии

### 5. Выход

Кликните кнопку выхода в шапке:

- Refresh token отзывается на сервере
- HttpOnly cookie очищается
- Дальнейшие попытки refresh вернут 401

## Структура проекта

```
task_02/
├── apps/
│   ├── server/          # Backend (Express + Prisma)
│   │   ├── src/         # Исходники TypeScript
│   │   ├── prisma/      # Схема БД, миграции, seed
│   │   └── README.md    # Подробная документация backend
│   └── web/             # Frontend (React + Vite)
│       ├── src/         # Компоненты, страницы, API клиент
│       └── README.md    # Подробная документация frontend
├── packages/            # Общие пакеты (utils, ui)
├── docs/                # Документация архитектуры
├── task_01/             # Требования и спецификации
├── package.json         # Корневой package.json с общими скриптами
└── pnpm-workspace.yaml  # Конфигурация монорепозитория
```

## Тестовые пользователи (seed-данные)

После выполнения `prisma:seed` доступны следующие аккаунты:

| Email                    | Пароль       | Роль      |
|--------------------------|--------------|-----------|
| <admin@example.com>        | admin123!    | admin     |
| <moderator@example.com>    | moderator123!| moderator |
| <user@example.com>         | user123!     | user      |
| <demo@example.com>         | demo123!     | user      |
| <analytics@example.com>    | student123!  | user      |
| <content@example.com>      | author123!   | user      |

## Health checks

- **Backend health:** <http://localhost:3000/health>
- **Backend readiness:** <http://localhost:3000/ready> (проверяет подключение к БД)

## Дополнительные команды

```bash
# Сборка production
pnpm build

# Открыть Prisma Studio (GUI для БД)
pnpm --filter @app/server prisma:studio
```

## Следующие этапы (бонусы)

MVP реализован. Планируются:

- Документация API (OpenAPI + Swagger UI)
- Тестирование (Vitest + Playwright)
- Контейнеризация (Docker + Docker Compose)
- Kubernetes манифесты
- CI/CD пайплайн (GitHub Actions)
- Наблюдаемость (Prometheus, Redis кэш)

Подробности реализации в документации каждого приложения:

- [Backend README](apps/server/README.md)
- [Frontend README](apps/web/README.md)

## Troubleshooting

**Ошибка подключения к БД:**

- Проверьте, что PostgreSQL запущен
- Убедитесь, что `DATABASE_URL` корректен в `apps/server/.env`

**CORS ошибки:**

- Убедитесь, что `CORS_ORIGIN` в `apps/server/.env` включает `http://localhost:5173`

**Access token истекает слишком быстро (для отладки refresh):**

- Установите `JWT_ACCESS_TTL=1m` в `apps/server/.env` для тестирования автоматического обновления

**Проблемы с pnpm:**

- Если используете PowerShell и возникают ошибки политики выполнения, используйте `pnpm.cmd` вместо `pnpm`
