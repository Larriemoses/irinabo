import { createServerSupabase } from "@/lib/supabase/server";

export async function getOperationalMetrics() {
  const supabase = createServerSupabase();
  if (!supabase) return null;
  const [{ count: open }, { count: overdue }, { count: escalations }, { count: reviews }] = await Promise.all([
    supabase.from("incidents").select("id", { count: "exact", head: true }).not("response_state", "in", "(CLOSED_WITH_OUTCOME,REVIEW_REQUESTED)"),
    supabase.from("incidents").select("id", { count: "exact", head: true }).in("response_state", ["AWAITING_ACKNOWLEDGEMENT", "RECEIVED"]).lt("deadline_at", new Date().toISOString()),
    supabase.from("audit_events").select("id", { count: "exact", head: true }).eq("action", "ESCALATION_ATTEMPTED"),
    supabase.from("resolution_feedback").select("id", { count: "exact", head: true }).eq("feedback", "NOT_RESOLVED"),
  ]);
  return { open: open ?? 0, overdue: overdue ?? 0, escalations: escalations ?? 0, reviews: reviews ?? 0 };
}
