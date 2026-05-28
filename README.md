# Orpola

Discover running & cycling clubs in Israel — [orpola.com](https://www.orpola.com)

## Repo

https://github.com/orpolaproject-a11y/orpola

## Local setup

```bash
npm install
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from Supabase
npm run dev
```

## Supabase database (no PostGIS required)

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/tnwaqyfshomlyjgujdzu/sql/new)
2. Paste the full contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

Or from your Mac (after setting a token or DB password):

```bash
# Account token: https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN=sbp_...
node scripts/apply-migration.mjs
```

```bash
# Or database password: Project Settings → Database
export SUPABASE_DB_PASSWORD=...
node scripts/apply-migration.mjs
```

## Deploy

Push to `main` — Vercel deploys automatically.

### Environment variables (Vercel)

- `NEXT_PUBLIC_SUPABASE_URL` — e.g. `https://tnwaqyfshomlyjgujdzu.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — publishable key from Supabase API Keys

```bash
./scripts/setup-vercel-env.sh "https://tnwaqyfshomlyjgujdzu.supabase.co" "sb_publishable_YOUR_KEY"
```
