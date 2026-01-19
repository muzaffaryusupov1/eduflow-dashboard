# EduFlow

## Local setup

1. Copy `.env.example` to `.env` and update secrets.
2. Install dependencies with `pnpm install`.
3. Run Prisma migrations and seed:
   - `pnpm --filter @eduflow/api prisma migrate dev`
   - `pnpm --filter @eduflow/api prisma db seed`
4. Start services:
   - API: `pnpm --filter @eduflow/api dev`
   - Web: `pnpm --filter web dev`

## Web app

- Local dev: `pnpm --filter web dev`
- Add shadcn/ui component:
  - `cd apps/web`
  - `pnpm dlx shadcn@latest add <component>`

## API docs

Swagger UI is available at `http://localhost:3001/docs`.

## Default OWNER credentials (seed)

- Email: `owner@eduflow.dev`
- Password: `Owner123!`

Override with `SEED_OWNER_EMAIL` and `SEED_OWNER_PASSWORD` in `.env`.
