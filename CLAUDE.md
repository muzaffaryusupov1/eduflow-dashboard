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
pnpm --filter @eduflow/api test   # Jest (API only; no tests written yet)
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
- Tokens stored in localStorage under keys `accessToken` and `refreshToken` (legacy key `eduflow.auth` is auto-migrated on first load via `lib/auth/token-storage.ts`)
- `httpClient` (`lib/http/client.ts`) auto-calls `/auth/refresh` on 401/403 with a single-retry guard (`_retry` flag) to prevent infinite loops, then redirects to `/login` on failure
- `@Public()` decorator marks open routes on the backend

**AuthProvider hydration guard:** `AuthProvider` has a `hydrated` state flag set in a `useEffect`. This prevents SSR/client mismatch. Never remove this pattern — without it, the app will render with stale server state.

**React Query:** Query key factory in `lib/query/keys.ts`. `QueryClientProvider` in `lib/query/providers.tsx`. Mutations invalidate by key factory entries (e.g., `queryKeys.students.all`).

**Path alias:** `@/*` maps to `apps/web/src/*`.

**Error handling (frontend):** `httpClient` throws `ApiError` (from `lib/http/types.ts`) with `status`, `message`, and `body` fields on non-OK responses. Feature `api.ts` files let this propagate; React Query surfaces it in `error` state.

### Backend (`apps/api/src/`)

**Module structure:** Each domain is a NestJS module (StudentsModule, CoursesModule, GroupsModule, EnrollmentsModule, AttendanceModule, StaffModule) imported into `AppModule`. `PrismaModule` is global — inject `PrismaService` anywhere without re-importing the module.

**Auth:** Global `JwtAuthGuard` is registered at `APP_GUARD` level — all routes are protected by default. Use `@Public()` to opt out. `@Roles()` decorator enforces role-based access (OWNER, TEACHER, STUDENT) via a separate `RolesGuard` also registered globally.

**Single active session:** Only one login session is valid system-wide. A new login rotates the global session ID in the `GlobalSession` table (id=1), invalidating all previous tokens.

**DTO pattern:** All request bodies use class-validator decorators (`@IsNotEmpty`, `@IsEmail`, `@IsOptional`, etc.) combined with `@ApiProperty` for Swagger docs. The global `ValidationPipe` is configured with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`.

**Error handling (backend):** Use NestJS built-in exceptions: `NotFoundException`, `UnauthorizedException`, `ForbiddenException`, `ConflictException`. These map to the correct HTTP status codes automatically.

**Database:** Prisma with SQLite for local dev. Schema at `apps/api/prisma/schema.prisma` (8 models: User, Student, Course, Group, Enrollment, AttendanceSession, AttendanceRecord, GlobalSession).

**CORS:** API allows `http://localhost:3000` only. Update `main.ts` when deploying to a different origin.

**API docs:** Swagger at `http://localhost:3001/docs`.

**Default seed credentials:** `owner@eduflow.dev` / `Owner123!`

## Environment variables

Defined in `.env.example` at repo root:

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | API | SQLite file path |
| `JWT_ACCESS_SECRET` | API | Access token (15 min expiry) |
| `JWT_REFRESH_SECRET` | API | Refresh token (7 day expiry) |
| `SEED_OWNER_EMAIL` | API seed | Initial owner account |
| `SEED_OWNER_PASSWORD` | API seed | Initial owner password |
| `NEXT_PUBLIC_API_URL` | Web | Must be `NEXT_PUBLIC_` prefix for browser access |

## Code conventions

- Strict TypeScript — avoid `any`
- Prettier: semicolons, single quotes, trailing commas, 100-char line width
- Make small, reviewable changes; list files before editing
- Keep `.env.example` and README in sync when adding env vars
- Forms use `react-hook-form` + Zod resolver on the frontend; never manage form state manually
