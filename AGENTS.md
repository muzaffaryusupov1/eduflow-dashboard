# EduFlow Agent Guide

## Goal
Build a portfolio-grade Education Center Management System (EduFlow) as a solo full-stack project.

## Tech
- Frontend: Next.js App Router + TypeScript + Tailwind + shadcn/ui + TanStack Query
- Backend: Node.js + TypeScript + NestJS (preferred) + Prisma
- DB: SQLite for local dev (optional Postgres later)

## Working rules
- Make small, reviewable changes.
- Always list files you will modify/create before editing.
- Run checks: lint + typecheck + tests (if present).
- Keep commands safe; don’t delete files unless asked.
- Prefer clear naming and strict typing; avoid `any`.

## Local commands
- Web: pnpm dev (apps/web)
- API: pnpm dev (apps/api)
- DB: Prisma migrations + seed

## Definition of Done
- Builds successfully
- Lint passes
- No type errors
- Updated docs (.env.example / README) when needed
