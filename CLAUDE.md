# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Start development:**
```bash
pnpm --filter @eduflow/api dev    # NestJS API on :3001
pnpm --filter web dev             # Next.js web on :3000
```

**Build:**
```bash
pnpm --filter web build
pnpm --filter @eduflow/api build
```

**Lint & typecheck:**
```bash
pnpm lint
pnpm typecheck
pnpm --filter @eduflow/api test   # Jest (API only)
```

**Database:**
```bash
pnpm --filter @eduflow/api prisma migrate dev
pnpm --filter @eduflow/api prisma db seed
```

**Add shadcn/ui component:**
```bash
cd apps/web && pnpm dlx shadcn@latest add <component>
```

## Architecture

This is a pnpm monorepo with two apps:
- `apps/web` — Next.js 16 + React 19 frontend
- `apps/api` — NestJS 10 backend

### Frontend (`apps/web/src/`)

**Routing:** App Router with two route groups:
- `(auth)/login` — public login page
- `(dashboard)/` — protected pages (dashboard, people, classes, courses, attendance, billing)

**Feature modules** (`features/`): Each domain (students, courses, groups, enrollments, attendance, staff) has:
- `api.ts` — raw fetch calls via `httpClient`
- `queries.ts` — TanStack React Query hooks (`useQuery`, `useMutation`)
- `types.ts` — TypeScript interfaces
- `schema.ts` — Zod validation schemas
- `components/` — feature-specific UI components

**Auth flow:**
- `AuthProvider` (`components/auth-provider.tsx`) wraps the app and decodes JWT from localStorage
- Tokens stored as `eduflow.accessToken` and `eduflow.refreshToken`
- `httpClient` (`lib/http/client.ts`) auto-calls `/auth/refresh` on 401/403, then redirects to `/login` on failure
- `@Public()` decorator marks open routes on the backend

**React Query:** Query key factory in `lib/query/keys.ts`. `QueryClientProvider` in `lib/query/providers.tsx`.

**Path alias:** `@/*` maps to `apps/web/src/*`.

### Backend (`apps/api/src/`)

**Module structure:** Each domain is a NestJS module (StudentsModule, CoursesModule, GroupsModule, EnrollmentsModule, AttendanceModule, StaffModule) imported into `AppModule`.

**Auth:** Global `JwtAuthGuard` is registered at `APP_GUARD` level — all routes are protected by default. Use `@Public()` to opt out. `@Roles()` decorator enforces role-based access (OWNER, TEACHER, STUDENT).

**Single active session:** Only one login session is valid system-wide. A new login rotates the global session ID in the `GlobalSession` table, invalidating all previous tokens.

**Database:** Prisma with SQLite for local dev. Schema at `apps/api/prisma/schema.prisma` (8 models: User, Student, Course, Group, Enrollment, AttendanceSession, AttendanceRecord, GlobalSession).

**API docs:** Swagger at `http://localhost:3001/docs`.

**Default seed credentials:** `owner@eduflow.dev` / `Owner123!`

## Code conventions

- Strict TypeScript — avoid `any`
- Prettier: semicolons, single quotes, trailing commas, 100-char line width
- Make small, reviewable changes; list files before editing
- Keep `.env.example` and README in sync when adding env vars
