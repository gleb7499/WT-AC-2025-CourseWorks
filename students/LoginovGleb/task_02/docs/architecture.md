# Architecture (Draft)

- **Variant:** 40 — заявки "Да, я в деле".
- **Frontend:** React + TypeScript + Vite (SPA) in apps/web.
- **Backend:** Node.js + Express + TypeScript in apps/server.
- **Database:** PostgreSQL via Prisma ORM (schema.prisma configured, models TBD).
- **Auth & Validation:** JWT, Zod (to be added in later phases).
- **Packaging:** pnpm workspace with shared packages in packages/ui and packages/utils.
- **Infrastructure:** Docker Compose for local dev; Kubernetes manifests planned in k8s/.
