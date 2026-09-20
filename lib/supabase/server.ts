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

export async function getSeededTrip(organisationId: string) {
  const client = await createAuthSupabase();

  const { data, error } = await client
    .from("trips")
    .select("id, trip_code, origin, destination, vehicle_label, status, scheduled_departure")
    .eq("organisation_id", organisationId)
    .eq("trip_code", "TW204")
    .maybeSingle();

  if (error) throw new Error(`Supabase trip query failed: ${error.message}`);
  return data;
}
