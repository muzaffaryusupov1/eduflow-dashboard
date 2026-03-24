# 🤖 EduFlow – Agent Rules

This file defines STRICT rules for AI coding agents (Codex, Cursor, Claude Code).
Agents MUST follow these rules when working on this project.

---

# 🧠 PROJECT CONTEXT

- Project: EduFlow (Education Management Dashboard)
- Stage: MVP
- Scope: Single learning centre (NOT multi-tenant)
- Tech:
  - Frontend: Next.js + TypeScript + shadcn/ui + TanStack Query
  - Backend: NestJS + Prisma
  - DB: SQLite (dev), PostgreSQL (future)

---

# 🚨 CORE PRINCIPLES (NON-NEGOTIABLE)

1. **Follow existing patterns**
   - Look at Students / Courses / Groups features
   - Copy structure and adapt
   - DO NOT invent new architecture

2. **Smallest change possible**
   - Do not refactor unrelated code
   - Do not rename files unless required

3. **Consistency over creativity**
   - Use same naming, structure, patterns
   - Avoid "smart" or complex solutions

4. **Working > Perfect**
   - MVP focus
   - Deliver simple, working solution

---

# 📁 FRONTEND RULES

## Feature Structure (MANDATORY)

Each feature MUST follow:

src/features/<feature>/
- api.ts
- queries.ts
- types.ts
- schema.ts (zod if needed)
- components/

DO NOT create random files outside this structure.

---

## UI RULES (STRICT)

- ONLY use shadcn/ui components
- DO NOT build custom UI unless absolutely necessary

Allowed:
- Table
- Dialog
- Form
- Input
- Select
- Button
- Card
- Tabs
- Badge
- Skeleton
- Alert

NOT allowed:
- custom modal
- custom table
- random CSS components

---

## DATA FETCHING

- Use TanStack Query ONLY
- No manual fetch inside components
- API calls must go through shared http client

---

## ROUTING

- Use App Router (Next.js)
- Keep pages clean
- Move logic into features/

---

# 🔐 AUTH RULES

- Always send Authorization header:
  Bearer <accessToken>

- Token source:
  localStorage:
    - eduflow.accessToken
    - eduflow.refreshToken

- On 401:
  1. Try refresh ONCE
  2. If failed → redirect to /login

---

# 🧱 BACKEND RULES

## Structure

- Use NestJS modules
- Keep controller → service → prisma flow

---

## VALIDATION

- Use DTO + class-validator
- NEVER trust frontend data

---

## BUSINESS RULES

- Teacher = User with role=TEACHER
- Enrollment:
  - Only 1 ACTIVE per student+group
- Attendance:
  - One session per group per day

---

## DATABASE

- Use Prisma ONLY
- Always:
  - create proper relations
  - add indexes if needed

---

# ⚙️ CODING RULES

## General

- Use TypeScript strictly
- Avoid `any`
- Prefer explicit types

---

## Naming

- clear and consistent names
- no abbreviations

GOOD:
- createEnrollment
- getGroupStudents

BAD:
- doStuff
- dataHandler

---

## Functions

- small and readable
- one responsibility

---

# 🚫 WHAT NOT TO DO

❌ Do NOT:
- refactor entire files
- change architecture
- add new libraries without reason
- create complex abstractions
- break existing features

---

# 🧪 BEFORE FINISHING TASK

Agent MUST:

1. Check:
   - Does it compile?
   - Does it follow patterns?
   - Any console errors?

2. Validate:
   - API works
   - UI loads
   - basic flow works

3. Keep output minimal:
   - no unnecessary code
   - no duplicate logic

---

# 📋 TASK EXECUTION STRATEGY

When given a task:

1. ANALYZE first
   - find similar feature
   - understand structure

2. PLAN
   - list files to create/change

3. IMPLEMENT
   - follow patterns

4. VERIFY
   - check functionality

---

# 💡 AGENT BEHAVIOR

- Act like a **junior developer**
- Do NOT assume things
- If unsure → choose simplest safe option
- Prefer clarity over cleverness

---

# 🔮 FUTURE FEATURES (IGNORE FOR NOW)

DO NOT implement:
- multi-tenant
- payments
- notifications
- real-time features

---

# ✅ SUCCESS DEFINITION

Task is DONE only if:
- code works
- follows structure
- matches existing patterns
- no unnecessary complexity

---

# ⚠️ FINAL RULE

If something is unclear:

→ Follow existing codebase patterns
→ Do NOT invent new solutions
