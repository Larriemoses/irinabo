alter table public.incidents add column if not exists assigned_staff_id uuid references public.company_staff(id);
grant all privileges on public.incidents to service_role;
