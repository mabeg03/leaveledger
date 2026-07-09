# Architecture

## Overview

LeaveLedger is a full-stack Next.js application using the App Router, server actions for mutations, and Prisma for data access.

```
Browser → Next.js (App Router) → Server Actions / API Routes → Prisma → SQLite/PostgreSQL
                ↓
           Auth.js (JWT sessions)
```

## Data Model

```
User ──┬── LeaveBalance ── LeaveType
       ├── LeaveRequest ── LeaveType
       │        └── reviewer (User)
       ├── manager (User) ── reports (User[])
       └── AuditLog

Account / Session (Auth.js)
```

### Core entities

| Entity | Purpose |
|--------|---------|
| **User** | Employees, managers, admins with RBAC |
| **LeaveType** | Vacation, Sick, Personal |
| **LeaveBalance** | Total vs used days per user per type |
| **LeaveRequest** | Time-off request with approval workflow |
| **AuditLog** | Immutable activity trail |

## Auth & Authorization

- **Auth.js** with credentials provider (bcrypt cost 12) and optional Google OAuth
- JWT sessions with `id` and `role` in the token
- Middleware protects `/dashboard`, `/requests`, `/approvals`, `/calendar`, `/team`
- Server actions call `requireAuth()` / `requireRole()` before any mutation
- Managers can only approve their direct reports; admins can approve all

## Key Decisions

1. **SQLite for local dev, PostgreSQL for production** — zero-config local setup; swap `DATABASE_URL` for deploy
2. **Server actions over REST** — fewer files, type-safe boundaries with Zod
3. **Business-day calculation** — excludes weekends when computing leave days
4. **Optimistic balance check on create** — rejects requests exceeding remaining balance before submission

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | — | Auth.js handlers |
| GET | `/api/export/requests` | Required | CSV export of leave requests |

Server actions in `src/server/actions/leave.ts` handle create, cancel, review, and signup.
