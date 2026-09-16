create extension if not exists pgcrypto;
create type public.staff_role as enum ('DRIVER','BOOKING_CLERK','COORDINATOR','BACKUP_COORDINATOR','SAFETY_COORDINATOR','ADMIN');
create type public.routing_class as enum ('RESTRICTED_PENDING','ORDINARY','PROTECTED');
create type public.response_state as enum ('RECEIVED','AWAITING_ACKNOWLEDGEMENT','ACCEPTED','ACTION_UNDERWAY','CLOSED_WITH_OUTCOME','REVIEW_REQUESTED','UNASSIGNED');
create table public.organisations(id uuid primary key default gen_random_uuid(),name text not null,provenance text not null default 'FICTIONAL_DEMO',created_at timestamptz not null default now());
create table public.profiles(id uuid primary key references auth.users(id),display_name text not null,phone_e164 text,status text not null default 'ACTIVE');
create table public.staff_assignments(profile_id uuid references public.profiles,organisation_id uuid references public.organisations,role public.staff_role not null,active_from timestamptz not null default now(),active_until timestamptz,primary key(profile_id,organisation_id,role));
create table public.trips(id uuid primary key default gen_random_uuid(),organisation_id uuid not null references public.organisations,trip_code text not null unique,origin text not null,destination text not null,vehicle_label text not null,status text not null,scheduled_departure timestamptz not null);
create table public.reports(id uuid primary key default gen_random_uuid(),trip_id uuid not null references public.trips,reporter_id uuid references public.profiles,channel text not null,provider_message_id text unique,original_text text not null,urgent boolean not null default false,protection_choice text,routing_class public.routing_class not null default 'RESTRICTED_PENDING',created_at timestamptz not null default now(),received_at timestamptz not null default now());
create table public.incidents(id uuid primary key default gen_random_uuid(),trip_id uuid not null references public.trips,reference text not null unique,routing_class public.routing_class not null,response_state public.response_state not null default 'RECEIVED',owner_id uuid references public.profiles,created_at timestamptz not null default now(),deadline_at timestamptz not null);
create table public.incident_reports(incident_id uuid references public.incidents,report_id uuid references public.reports,primary key(incident_id,report_id));
create table public.location_events(id uuid primary key default gen_random_uuid(),trip_id uuid not null references public.trips,actor_id uuid references public.profiles,source text not null check(source in('web_geolocation','whatsapp_current_location')),latitude double precision not null check(latitude between -90 and 90),longitude double precision not null check(longitude between -180 and 180),accuracy_m double precision,provider_message_id text,client_event_id text,captured_at timestamptz not null,received_at timestamptz not null default now(),unique(provider_message_id),unique(client_event_id));
create table public.audit_events(id uuid primary key default gen_random_uuid(),actor_id uuid references public.profiles,action text not null,target_type text not null,target_id uuid not null,safe_metadata jsonb not null default '{}',created_at timestamptz not null default now());
create table public.resolution_feedback(id uuid primary key default gen_random_uuid(),incident_id uuid not null references public.incidents,actor_id uuid references public.profiles,feedback text not null check(feedback in('MATCHES','NOT_RESOLVED')),note text,created_at timestamptz not null default now(),unique(incident_id,actor_id));
alter table public.incidents enable row level security;alter table public.reports enable row level security;alter table public.location_events enable row level security;
create function public.has_role(org uuid,wanted public.staff_role) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.staff_assignments s where s.profile_id=auth.uid() and s.organisation_id=org and s.role=wanted and (s.active_until is null or s.active_until>now())) $$;
create policy "ordinary incidents scoped to ordinary roles" on public.incidents for select using(routing_class='ORDINARY' and exists(select 1 from public.trips t where t.id=trip_id and (public.has_role(t.organisation_id,'COORDINATOR') or public.has_role(t.organisation_id,'BACKUP_COORDINATOR') or public.has_role(t.organisation_id,'ADMIN'))));
create policy "protected incidents require safety assignment" on public.incidents for select using(routing_class in('PROTECTED','RESTRICTED_PENDING') and exists(select 1 from public.trips t where t.id=trip_id and public.has_role(t.organisation_id,'SAFETY_COORDINATOR')));

-- The project keeps automatic table exposure disabled. Grant only the
-- server role here; browser roles receive table-specific grants in later
-- migrations alongside their RLS policies.
grant usage on schema public to anon, authenticated, service_role;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
