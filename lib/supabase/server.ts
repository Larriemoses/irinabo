import { createClient } from "@supabase/supabase-js";
import { createAuthSupabase } from "@/lib/supabase/auth";

export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getPublicTrip(tripCode: string) {
  const client = createServerSupabase();
  if (!client) return null;
  const { data, error } = await client.from("trips").select("id, trip_code, origin, destination, vehicle_label, status, scheduled_departure, organisations(name)").eq("trip_code", tripCode.toUpperCase()).maybeSingle();
  if (error) throw new Error(`Public trip query failed: ${error.message}`);
  return data;
}

export async function getSeededTrip(organisationId: string) {
  const client = await createAuthSupabase();

  const { data, error } = await client
    .from("trips")
    .select("id, trip_code, origin, destination, vehicle_label, status, scheduled_departure")
    .eq("organisation_id", organisationId)
    .order("scheduled_departure", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Supabase trip query failed: ${error.message}`);
  return data;
}

export async function getOrganisationIncidents(organisationId: string) {
  const client = createServerSupabase();
  if (!client) return [];
  const select = "id, reference, routing_class, response_state, owner_id, assigned_staff_id, created_at, deadline_at, trip_id, trips!inner(organisation_id, trip_code)";
  const { data, error } = await client.from("incidents").select(select).eq("trips.organisation_id", organisationId).order("created_at", { ascending: false });
  if (!error) return data ?? [];

  // Keep the workspace usable while an older hosted database finishes applying
  // the staff-assignment migration. The incident itself remains available.
  if (error.message.includes("assigned_staff_id") || error.message.includes("schema cache")) {
    const fallback = await client.from("incidents").select("id, reference, routing_class, response_state, owner_id, created_at, deadline_at, trip_id, trips!inner(organisation_id, trip_code)").eq("trips.organisation_id", organisationId).order("created_at", { ascending: false });
    return fallback.data ?? [];
  }
  return [];
}
