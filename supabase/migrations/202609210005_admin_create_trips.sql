create policy "admins can create organisation trips" on public.trips
for insert to authenticated
with check (public.has_role(organisation_id, 'ADMIN'));

grant insert on public.trips to authenticated;
