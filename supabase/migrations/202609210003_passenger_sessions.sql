create table if not exists public.passenger_sessions (id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.trips(id) on delete cascade, access_code text not null unique, session_token text not null unique, location_sharing boolean not null default false, created_at timestamptz not null default now(), last_seen_at timestamptz);
alter table public.passenger_sessions enable row level security;
grant all privileges on public.passenger_sessions to service_role;
