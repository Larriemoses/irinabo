import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAuthConfig, getSupabaseServiceConfig } from "@/lib/supabase/config";

export async function createServerSupabaseSessionClient(): Promise<SupabaseClient | null> {
  const config = getSupabaseAuthConfig();
  if (!config) return null;

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookie writes are not always available in Server Components.
        }
      },
    },
  });
}

export function createServerSupabaseServiceRoleClient() {
  const config = getSupabaseServiceConfig();
  if (!config) return null;

  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getSeededTrip() {
  const client = createServerSupabaseServiceRoleClient();
  if (!client) return null;

  const { data, error } = await client
    .from("trips")
    .select("id, trip_code, origin, destination, vehicle_label, status, scheduled_departure")
    .eq("trip_code", "TW204")
    .maybeSingle();

  if (error) throw new Error(`Supabase trip query failed: ${error.message}`);
  return data;
}
