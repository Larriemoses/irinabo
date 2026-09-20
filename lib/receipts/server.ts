import { createServerSupabase } from "@/lib/supabase/server";

export async function getReceiptTimeline() {
  const supabase = createServerSupabase();
  if (!supabase) return null;
  const incidentId = "00000000-0000-4000-8000-000000000301";
  const [{ data: audit }, { data: feedback }] = await Promise.all([
    supabase.from("audit_events").select("id,action,created_at,safe_metadata").eq("target_id", incidentId).order("created_at", { ascending: true }),
    supabase.from("resolution_feedback").select("feedback").eq("incident_id", incidentId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  return { audit: audit ?? [], feedback: feedback?.feedback ?? null };
}
