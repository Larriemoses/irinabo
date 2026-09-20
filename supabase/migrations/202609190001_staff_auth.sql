-- Staff identity and tenant boundaries. Browser access is granted only where
-- RLS can prove that the signed-in user has an active assignment.
alter table public.organisations enable row level security;
alter table public.profiles enable row level security;
alter table public.staff_assignments enable row level security;
alter table public.trips enable row level security;

create or replace function public.is_active_staff(org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff_assignments s
    where s.profile_id = auth.uid()
      and s.organisation_id = org
      and s.active_from <= now()
      and (s.active_until is null or s.active_until > now())
  )
$$;

create policy "staff can read their profile" on public.profiles
for select to authenticated using (id = auth.uid());

create policy "staff can read their assignments" on public.staff_assignments
for select to authenticated using (
  profile_id = auth.uid() and active_from <= now()
  and (active_until is null or active_until > now())
);

create policy "staff can read assigned organisations" on public.organisations
for select to authenticated using (public.is_active_staff(id));

create policy "staff can read organisation trips" on public.trips
for select to authenticated using (public.is_active_staff(organisation_id));

grant select on public.profiles, public.staff_assignments, public.organisations, public.trips to authenticated;
grant select on public.incidents, public.reports, public.location_events to authenticated;
grant execute on function public.is_active_staff(uuid) to authenticated;
grant execute on function public.has_role(uuid, public.staff_role) to authenticated;

-- Reports and locations inherit the incident/trip company boundary. Reporter
-- identity is deliberately omitted from ordinary-role queries in application code.
create policy "staff can read reports attached to visible incidents" on public.reports
for select to authenticated using (
  exists (
    select 1 from public.incident_reports ir
    join public.incidents i on i.id = ir.incident_id
    where ir.report_id = reports.id
  )
);

create policy "staff can read locations for assigned trips" on public.location_events
for select to authenticated using (
  exists (select 1 from public.trips t where t.id = trip_id and public.is_active_staff(t.organisation_id))
);

create policy "ordinary coordinators can update ordinary incidents" on public.incidents
for update to authenticated using (
  routing_class = 'ORDINARY' and exists (
    select 1 from public.trips t where t.id = trip_id
    and (public.has_role(t.organisation_id, 'COORDINATOR') or public.has_role(t.organisation_id, 'BACKUP_COORDINATOR') or public.has_role(t.organisation_id, 'ADMIN'))
  )
) with check (routing_class = 'ORDINARY');

create policy "safety coordinators can update protected incidents" on public.incidents
for update to authenticated using (
  routing_class in ('PROTECTED', 'RESTRICTED_PENDING') and exists (
    select 1 from public.trips t where t.id = trip_id and public.has_role(t.organisation_id, 'SAFETY_COORDINATOR')
  )
) with check (routing_class in ('PROTECTED', 'RESTRICTED_PENDING'));

create policy "assigned staff can write audit events" on public.audit_events
for insert to authenticated with check (
  actor_id = auth.uid() and exists (
    select 1 from public.staff_assignments s where s.profile_id = auth.uid()
    and s.active_from <= now() and (s.active_until is null or s.active_until > now())
  )
);
grant insert on public.audit_events to authenticated;
grant update on public.incidents to authenticated;

-- Fictional persisted demo incidents used by the authenticated workspace.
insert into public.incidents(id, trip_id, reference, routing_class, response_state, deadline_at)
select '00000000-0000-4000-8000-000000000301', id, 'IRN-204-031', 'PROTECTED', 'AWAITING_ACKNOWLEDGEMENT', '2026-09-16T11:44:00+01:00'
from public.trips where trip_code = 'TW204'
and not exists (select 1 from public.incidents where reference = 'IRN-204-031');
insert into public.incidents(id, trip_id, reference, routing_class, response_state, deadline_at)
select '00000000-0000-4000-8000-000000000302', id, 'IRN-204-028', 'ORDINARY', 'ACTION_UNDERWAY', '2026-09-16T11:20:00+01:00'
from public.trips where trip_code = 'TW204'
and not exists (select 1 from public.incidents where reference = 'IRN-204-028');
