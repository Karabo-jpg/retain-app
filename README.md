# Retain — Personal Expense & Budget Manager

Retain is a full-stack web app for tracking personal expenses and monthly budgets, built as a summative project for the React Development course.

**Live app:** https://retain-app-frontend-lac.vercel.app
**API base URL:** https://retain-app.vercel.app/api

## Tech Stack

**Frontend:** React + TypeScript + Vite, React Router, Redux Toolkit (expense filtering/search/sort/pagination state), React Context (authentication, roles, protected routes), MUI (Material UI), React Hook Form + Zod, Recharts.

**Backend:** Node.js + Express + TypeScript, Prisma ORM, PostgreSQL (hosted on Supabase), JWT authentication, bcrypt password hashing, Zod request validation.

**Deployment:** Vercel (two projects from this monorepo — one for `frontend`, one for `backend` as a serverless function), Supabase (Postgres database, connected to the backend's Vercel project via Vercel's native Supabase integration so the DB credentials are wired automatically and never typed by hand).

## Features

- Email/password signup, login, logout; JWT-based sessions persisted in `localStorage`; role-based access (`USER` / `ADMIN`) via React Context; protected and admin-only routes.
- Expense CRUD (title, description, amount, category, date, payment method, notes) — user-scoped, server-enforced.
- Search, category filter, payment-method filter, date range filter, amount range filter, and sort by date/amount/title — all driven by Redux Toolkit state, with server-side pagination.
- Monthly budget: set/update a budget, see total spent, remaining budget, and status (within / approaching / over — thresholds: <80% within, 80–100% approaching, >100% over).
- User dashboard: total spending for the month, remaining budget, highest individual expense, spending by category (chart), recent expenses.
- Admin dashboard (admin role only, Context-protected): create/update/delete expense categories (deleting a category reassigns its expenses to a protected "Uncategorized" category); platform insights — total users, total expenses, total expense value, expenses this month, spending per category, top 5 / bottom 5 most-used categories (by expense count), recently added expenses, recently registered users.
- Responsive layout (mobile/tablet/desktop) built with MUI's Grid and breakpoints.

## Project Structure

```
backend/   Express + TypeScript API, Prisma schema, migrations, seed script
frontend/  React + TypeScript + Vite app
```

## Setup Instructions

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, DIRECT_URL, JWT_SECRET, CLIENT_URL
npx prisma generate
npx prisma migrate deploy   # or: npx prisma db push (schema already applied via Supabase in this project)
npm run seed                 # seeds categories + an admin user
npm run dev                  # starts the API on http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL to the backend's /api URL
npm run dev             # starts the app on http://localhost:5173
```

### Grader / Demo Login

An admin account is seeded automatically:

- **Email:** `admin@retain.app`
- **Password:** `Admin123!`

Sign up for a separate regular-user account to test the non-admin experience.

## Deployment (Vercel + Supabase)

This repo deploys as **two separate Vercel projects**, both pointing at the same GitHub repo:

1. **Backend project** — Root Directory: `backend`. Add the [Supabase integration](https://vercel.com/integrations/supabase) in the Vercel dashboard and connect it to the `retain-app` Supabase project; this auto-injects `POSTGRES_PRISMA_URL` (pooled) and `POSTGRES_URL_NON_POOLING` (direct), which the backend reads automatically as fallbacks for `DATABASE_URL`/`DIRECT_URL` (see `src/config/env.ts`) — no database password is ever typed into Vercel manually. Also set `JWT_SECRET` and `CLIENT_URL` (the frontend project's URL, once known) as env vars. The backend runs as a Vercel serverless function (`api/index.ts` wraps the Express app).
2. **Frontend project** — Root Directory: `frontend`. Set `VITE_API_BASE_URL` to the backend project's URL + `/api`.
3. After both are deployed, update the backend's `CLIENT_URL` env var to the frontend's exact final URL (for CORS) and the frontend's `VITE_API_BASE_URL` to `<backend-url>/api` (**must** include the `/api` suffix — the backend only mounts routes under `/api`), then redeploy both.
4. Run `npx prisma migrate deploy` (or apply the SQL in `prisma/migrations/0_init`) and `npm run seed` once against the Supabase database to create tables and the starter categories/admin user — this was already done directly against Supabase for this project via the Supabase MCP tooling during development.
5. **Important:** append `?pgbouncer=true` to the pooled `DATABASE_URL` (port 6543) if it isn't already present. Without it, Prisma's prepared statements intermittently fail against Supabase's transaction-mode PgBouncer pooler with `prepared statement "sN" does not exist`. The non-pooled `DIRECT_URL` (port 5432) does not need this flag.
6. Because `VITE_API_BASE_URL` is inlined at build time (not read at runtime), changing it requires a full redeploy of the frontend project, not just a restart.

## API Reference

Base path: `/api`. All endpoints except `/auth/signup` and `/auth/login` require `Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| POST | `/auth/signup` | Create account, returns token + user |
| POST | `/auth/login` | Authenticate, returns token + user |
| GET | `/auth/me` | Current user profile |
| GET | `/expenses` | List current user's expenses (filters: `category`, `paymentMethod`, `dateFrom`, `dateTo`, `minAmount`, `maxAmount`, `search`; sort: `sortBy`, `sortDir`; pagination: `page`, `pageSize`) |
| POST | `/expenses` | Create expense |
| GET/PUT/DELETE | `/expenses/:id` | Get / update / delete own expense |
| GET | `/budgets?month&year` | Get budget for a month |
| PUT | `/budgets` | Create/update (upsert) budget for a month |
| GET | `/categories` | List all categories |
| POST/PUT/DELETE | `/categories/:id` | Admin-only category CRUD (delete reassigns expenses to Uncategorized) |
| GET | `/dashboard?month&year` | User dashboard summary for a month |
| GET | `/admin/insights` | Admin-only platform insights |

## Notes & Known Trade-offs

- JWT is stored in `localStorage` rather than an httpOnly cookie — simpler given the two-Vercel-project cross-origin setup and the project's focus on React/Redux/Context skills over security hardening.
- The backend runs as a Vercel serverless function; the pooled Supabase connection string (`POSTGRES_PRISMA_URL`, pgbouncer) is used for runtime queries so concurrent cold starts don't exhaust Postgres connections, while the non-pooled URL is reserved for migrations.
- Automated tests were not required for this assessment and are not included.
