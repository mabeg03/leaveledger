# LeaveLedger

> PTO requests, approvals, and balance tracking for small teams — no spreadsheets required.

**Live demo →** Run locally or deploy to Vercel (see below)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Built for the [Digital Heroes](https://digitalheroes.dev) Full Stack Developer Trial.

## Features

- **Request leave** — pick dates, see your balance, submit in seconds
- **Manager approvals** — review pending requests with approve/reject workflow
- **Leave balances** — track vacation, sick, and personal days per employee
- **Team calendar** — see approved time off by month
- **Search & filter** — server-side filtering with URL-synced state
- **CSV export** — download leave history
- **Audit log** — who changed what and when
- **Role-based access** — Admin, Manager, Employee roles enforced server-side

## Tech Stack

Next.js 16 · TypeScript · SQLite/PostgreSQL (Prisma) · Tailwind CSS · Auth.js · Zod · Vercel

## Quick Start

```bash
git clone <your-repo-url> && cd leaveledger
cp .env.example .env
npm install
npm run db:push && npm run db:seed
npm run dev   # http://localhost:3000
```

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| demo@demo.com | demo1234 | Employee |
| manager@demo.com | demo1234 | Manager |
| admin@demo.com | demo1234 | Admin |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite `file:./dev.db` locally; PostgreSQL URL in production |
| `AUTH_SECRET` | Session signing secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` locally) |
| `AUTH_GOOGLE_ID` | Optional Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Optional Google OAuth secret |

## Architecture

See [docs/architecture.md](docs/architecture.md) for the data model and auth flow.

## Testing

```bash
npm run test
npm run lint
npm run build
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add env vars from `.env.example`
4. Use Neon/Supabase PostgreSQL for `DATABASE_URL`
5. Run `npx prisma db push` against production DB
6. Run `npm run db:seed` once for demo data

## License

MIT — see [LICENSE](LICENSE).
