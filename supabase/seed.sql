-- Fictional demonstration records. UUIDs are stable for repeatable demos.
insert into public.organisations(id,name,provenance) values('00000000-0000-4000-8000-000000000001','Unity Transit Demo','FICTIONAL_DEMO');
insert into public.trips(id,organisation_id,trip_code,origin,destination,vehicle_label,status,scheduled_departure) values('00000000-0000-4000-8000-000000000204','00000000-0000-4000-8000-000000000001','TW204','Ikorodu Central Garage','Ibadan Main Garage','UTD-07','IN_PROGRESS','2026-09-16T10:30:00+01:00');
