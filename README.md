# LeaveLedger

> PTO requests, approvals, and balance tracking for small teams — no spreadsheets required.

**Live demo →** [https://leaveledger.vercel.app](https://leaveledger.vercel.app)  
**Repository →** [github.com/mabeg03/leaveledger](https://github.com/mabeg03/leaveledger)

[License: MIT](LICENSE)

Built for the [Digital Heroes](https://digitalheroes.dev) Full Stack Developer Trial.

---

## What it does

LeaveLedger is a lightweight PTO management app for teams of 5–50. Employees request time off, managers approve or reject in one place, and everyone can see balances and a shared team calendar — without email threads or spreadsheets.

## Features

- **Request leave** — pick dates, see your balance, submit in seconds
- **Manager approvals** — review pending requests with approve/reject workflow
- **Leave balances** — track vacation, sick, and personal days per employee
- **Team calendar** — see approved time off by month
- **Search & filter** — server-side filtering with URL-synced state
- **CSV export** — download leave history
- **Audit log** — who changed what and when
- **Role-based access** — Admin, Manager, and Employee roles enforced server-side



## Tech stack

Next.js 16 · TypeScript · PostgreSQL (Prisma) · Tailwind CSS · Auth.js · Zod · Vercel

## Quick start

```bash
git clone https://github.com/mabeg03/leaveledger.git
cd leaveledger
npm install
cp .env.example .env   # then edit .env with your values
npm run db:push && npm run db:seed
npm run dev            # http://localhost:3000
```



## Demo credentials

Use these on the [live demo](https://leaveledger.vercel.app) or after running `npm run db:seed` locally:


| Email                                       | Password | Role     |
| ------------------------------------------- | -------- | -------- |
| [demo@demo.com](mailto:demo@demo.com)       | demo1234 | Employee |
| [manager@demo.com](mailto:manager@demo.com) | demo1234 | Manager  |
| [admin@demo.com](mailto:admin@demo.com)     | demo1234 | Admin    |




## Screenshots


| Landing                  | Employee dashboard                     |
| ------------------------ | -------------------------------------- |
| LeaveLedger landing page | Employee dashboard with leave balances |



| New leave request      | Manager approvals       |
| ---------------------- | ----------------------- |
| New leave request form | Manager approvals queue |



| Team calendar       |
| ------------------- |
| Team leave calendar |


Save captures as `hero.png`, `dashboard.png`, `requests.png`, `approvals.png`, and `calendar.png` in `[docs/screenshots/](docs/screenshots/)`. See that folder for a capture checklist.

## Environment variables

Copy `.env.example` to `.env` and fill in:


| Variable             | Required   | Description                                                                                        |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`       | Yes        | PostgreSQL connection string ([Neon](https://neon.tech) free tier works)                           |
| `AUTH_SECRET`        | Yes        | Random secret — run: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `AUTH_URL`           | Production | Full app URL, e.g. `https://leaveledger.vercel.app` (no trailing slash)                            |
| `NEXTAUTH_URL`       | Optional   | Legacy alias for `AUTH_URL`                                                                        |
| `AUTH_GOOGLE_ID`     | Optional   | Google OAuth client ID                                                                             |
| `AUTH_GOOGLE_SECRET` | Optional   | Google OAuth client secret                                                                         |


**Vercel:** add the same variables under **Settings → Environment Variables**, then redeploy.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the data model, auth flow, and RBAC design.

## Testing

```bash
npm run test
npm run lint
npm run build
```



## Deployment (Vercel)

1. Push this repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add environment variables from `.env.example` (use Neon for `DATABASE_URL`)
4. Deploy
5. Against your production database, run once locally:
  ```bash
   npm run db:push
   npm run db:seed
  ```
   (Point `DATABASE_URL` in your local `.env` at the Neon production URL.)



## License

MIT — see [LICENSE](LICENSE).