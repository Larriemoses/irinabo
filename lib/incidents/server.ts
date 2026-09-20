import { createAuthSupabase } from "@/lib/supabase/auth";

const references: Record<string, string> = { "inc-protected-001": "IRN-204-031", "inc-ordinary-002": "IRN-204-028" };

export async function getPersistedIncident(demoId: string) {
  const reference = references[demoId];
  if (!reference) return null;
  const supabase = await createAuthSupabase();
  const { data: incident } = await supabase.from("incidents").select("id,response_state,owner_id").eq("reference", reference).maybeSingle();
  if (!incident) return null;
  const { data: audit } = await supabase.from("audit_events").select("id,action,created_at,safe_metadata").eq("target_id", incident.id).order("created_at", { ascending: true });
  return { responseState: incident.response_state, ownerId: incident.owner_id, audit: audit ?? [] };
}
