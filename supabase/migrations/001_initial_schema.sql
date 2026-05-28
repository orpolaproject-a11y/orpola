-- Run in Supabase SQL Editor. Enable postgis first: Database -> Extensions -> postgis

create extension if not exists postgis;

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
  location geography(point, 4326),
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

create or replace function public.clubs_set_location()
returns trigger as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.location := st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clubs_set_location_trigger on public.clubs;
create trigger clubs_set_location_trigger
  before insert or update on public.clubs
  for each row execute function public.clubs_set_location();

alter table public.clubs enable row level security;
drop policy if exists "clubs public read" on public.clubs;
create policy "clubs public read" on public.clubs for select using (true);

insert into public.clubs (slug, name, description, sport_type, city, address, latitude, longitude, price_range, schedule, verified)
values
  ('tel-aviv-runners', 'Tel Aviv Runners', 'Social running group for all levels.', 'running', 'Tel Aviv', 'Charles Clore Park', 32.0622, 34.7638, 'Free', 'Tue & Thu 19:00', true),
  ('jerusalem-cycling-club', 'Jerusalem Cycling Club', 'Road and gravel rides.', 'cycling', 'Jerusalem', 'First Station', 31.7892, 35.7855, '200 NIS / year', 'Sat 07:00', false),
  ('haifa-coastal-run', 'Haifa Coastal Run', 'Community runs along the waterfront.', 'running', 'Haifa', 'Bat Galim Promenade', 32.8303, 34.9748, 'Free trial, then 150 NIS/month', 'Mon & Wed 18:30', false)
on conflict (slug) do nothing;
