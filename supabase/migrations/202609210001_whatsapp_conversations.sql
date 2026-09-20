alter table public.reports add column if not exists source_address text;
alter table public.reports add column if not exists provider_metadata jsonb not null default '{}'::jsonb;
create table if not exists public.whatsapp_sessions (source_address text primary key, trip_id uuid not null references public.trips(id), state text not null default 'AWAITING_REPORT', pending_report_id uuid references public.reports(id), updated_at timestamptz not null default now());
create table if not exists public.whatsapp_messages (id uuid primary key default gen_random_uuid(), provider_message_id text not null unique, source_address text not null, destination_address text, body text not null default '', media_count integer not null default 0, provider_metadata jsonb not null default '{}'::jsonb, received_at timestamptz not null default now());
alter table public.whatsapp_sessions enable row level security;
alter table public.whatsapp_messages enable row level security;
grant all privileges on public.whatsapp_sessions, public.whatsapp_messages to service_role;
