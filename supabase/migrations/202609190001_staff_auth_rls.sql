-- Staff authentication and organisation-scoped access for browser/session queries.
-- Service-role access remains for trusted server operations only.

alter table public.organisations enable row level security;
alter table public.profiles enable row level security;
alter table public.staff_assignments enable row level security;
alter table public.trips enable row level security;

-- Replace the initial incident policies that relied on a security-definer helper.
drop policy if exists "ordinary incidents scoped to ordinary roles" on public.incidents;
drop policy if exists "protected incidents require safety assignment" on public.incidents;
drop function if exists public.has_role(uuid, public.staff_role);

create policy "profiles self select" on public.profiles
for select to authenticated
using (id = auth.uid());

create policy "staff assignments self select" on public.staff_assignments
for select to authenticated
using (
  profile_id = auth.uid()
  and (active_until is null or active_until > now())
);

create policy "organisations by active assignment" on public.organisations
for select to authenticated
using (
  exists (
    select 1
    from public.staff_assignments s
    where s.organisation_id = organisations.id
      and s.profile_id = auth.uid()
      and (s.active_until is null or s.active_until > now())
  )
);

create policy "trips by active assignment" on public.trips
for select to authenticated
using (
  exists (
    select 1
    from public.staff_assignments s
    where s.organisation_id = trips.organisation_id
      and s.profile_id = auth.uid()
      and (s.active_until is null or s.active_until > now())
  )
);

create policy "ordinary incidents by ordinary roles" on public.incidents
for select to authenticated
using (
  routing_class = 'ORDINARY'
  and exists (
    select 1
    from public.trips t
    join public.staff_assignments s on s.organisation_id = t.organisation_id
    where t.id = incidents.trip_id
      and s.profile_id = auth.uid()
      and s.role in ('COORDINATOR', 'BACKUP_COORDINATOR', 'ADMIN')
      and (s.active_until is null or s.active_until > now())
  )
);

create policy "protected incidents require safety role" on public.incidents
for select to authenticated
using (
  routing_class in ('PROTECTED', 'RESTRICTED_PENDING')
  and exists (
    select 1
    from public.trips t
    join public.staff_assignments s on s.organisation_id = t.organisation_id
    where t.id = incidents.trip_id
      and s.profile_id = auth.uid()
      and s.role = 'SAFETY_COORDINATOR'
      and (s.active_until is null or s.active_until > now())
  )
);

grant select on public.organisations to authenticated;
grant select on public.profiles to authenticated;
grant select on public.staff_assignments to authenticated;
grant select on public.trips to authenticated;
grant select on public.incidents to authenticated;
