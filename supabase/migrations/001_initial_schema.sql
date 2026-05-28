-- Orpola initial schema (no PostGIS required)
-- Run in Supabase SQL Editor, or: ./scripts/apply-migration.mjs

-- Clubs directory
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sport_type text not null check (sport_type in ('running', 'cycling', 'both')),
  city text not null,
  address text,
  latitude double precision,
  longitude double precision,
  website text,
  phone text,
  social_links jsonb default '{}'::jsonb,
  price_range text,
  schedule text,
  source_url text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clubs_city_idx on public.clubs (city);
create index if not exists clubs_sport_type_idx on public.clubs (sport_type);

-- Coaches (optional profiles; auth linked later)
create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  bio text,
  specialties text[] default '{}',
  certifications text,
  languages text[] default array['he', 'en'],
  hourly_rate text,
  city text,
  club_id uuid references public.clubs (id) on delete set null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Reviews (user_id linked when auth is enabled)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  user_id uuid,
  author_name text,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_club_id_idx on public.reviews (club_id);

-- RLS: public read
alter table public.clubs enable row level security;
alter table public.coaches enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "clubs public read" on public.clubs;
create policy "clubs public read" on public.clubs for select using (true);

drop policy if exists "coaches public read" on public.coaches;
create policy "coaches public read" on public.coaches for select using (true);

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews for select using (true);

-- Seed sample clubs (Israel)
insert into public.clubs (slug, name, description, sport_type, city, address, latitude, longitude, price_range, schedule, verified)
values
  (
    'tel-aviv-runners',
    'Tel Aviv Runners',
    'Social running group for all levels. Weekly evening runs along the promenade.',
    'running',
    'Tel Aviv',
    'Charles Clore Park',
    32.0622,
    34.7638,
    'Free',
    'Tue & Thu 19:00',
    true
  ),
  (
    'jerusalem-cycling-club',
    'Jerusalem Cycling Club',
    'Road and gravel rides around Jerusalem hills. Beginner-friendly Saturday rides.',
    'cycling',
    'Jerusalem',
    'First Station',
    31.7892,
    35.7855,
    '200 NIS / year',
    'Sat 07:00',
    false
  ),
  (
    'haifa-coastal-run',
    'Haifa Coastal Run',
    'Community runs along the Haifa waterfront. Marathon training groups in season.',
    'running',
    'Haifa',
    'Bat Galim Promenade',
    32.8303,
    34.9748,
    'Free trial, then 150 NIS/month',
    'Mon & Wed 18:30',
    false
  )
on conflict (slug) do nothing;
