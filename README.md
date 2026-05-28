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

## Supabase

1. Enable **postgis** extension
2. Run `supabase/migrations/001_initial_schema.sql` in SQL Editor

## Deploy

Push to `main` — Vercel deploys automatically.

Environment variables in Vercel (Production + Preview):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
