# Scripture Speed

SvelteKit + Vercel-ready quiz game (daily scripture quote, speed scoring, global/group leaderboards) with offline shell and optional Neon Postgres persistence.

## Prerequisites
- Node 20.x (configured via adapter-vercel runtime)
- npm

## Setup
```bash
npm install
npm run dev
```

## Environment variables
Create `.env.local` (gitignored):
```
DATABASE_URL=postgres://<user>:<password>@<host>/<db>?sslmode=require
APP_ORIGIN=http://localhost:5173   # optional, for CORS if you lock it down
```

## Migrations
Schema is in `migrations/schema.sql`. Apply to Neon (or any Postgres) before enabling DB mode. The app falls back to in-memory if `DATABASE_URL` is unset.

## Build
```bash
npm run build
npm run preview
```

## Deploy (Vercel)
- Import repo, set Node 20
- Add `DATABASE_URL` in Vercel env (and `APP_ORIGIN` if needed)
- Adapter: `@sveltejs/adapter-vercel` with runtime nodejs20.x
