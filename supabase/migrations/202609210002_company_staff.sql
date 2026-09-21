create table if not exists public.company_staff (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  full_name text not null,
  username text not null,
  role text not null default 'STAFF',
  access_code_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(organisation_id, username)
);
alter table public.company_staff enable row level security;
grant all privileges on public.company_staff to service_role;
