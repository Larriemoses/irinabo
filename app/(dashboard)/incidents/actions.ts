"use server";

import { revalidatePath } from "next/cache";
import { incidents } from "@/lib/demo/data";
import { canViewOrdinary, canViewProtected, requireStaff } from "@/lib/auth/staff";
import { createAuthSupabase } from "@/lib/supabase/auth";

const incidentReferences: Record<string, string> = {
  "inc-protected-001": "IRN-204-031",
  "inc-ordinary-002": "IRN-204-028",
};

export async function acceptResponsibility(formData: FormData) {
  const incidentId = String(formData.get("incidentId"));
  const demoIncident = incidents.find((incident) => incident.id === incidentId);
  if (!demoIncident) throw new Error("Incident not found");
  const staff = await requireStaff();
  if (demoIncident.routingClass === "PROTECTED" ? !canViewProtected(staff.role) : !canViewOrdinary(staff.role)) throw new Error("Not authorised");
  const supabase = await createAuthSupabase();
  const { data: incident, error: incidentError } = await supabase.from("incidents").select("id, trip_id").eq("reference", incidentReferences[incidentId]).single();
  if (incidentError) throw new Error("Incident persistence is not available");
  const { error } = await supabase.from("incidents").update({ response_state: "ACCEPTED", owner_id: staff.id }).eq("id", incident.id);
  if (error) throw new Error("Could not accept responsibility");
  const { error: auditError } = await supabase.from("audit_events").insert({ actor_id: staff.id, action: "RESPONSIBILITY_ACCEPTED", target_type: "incident", target_id: incident.id, safe_metadata: { display_name: staff.displayName } });
  if (auditError) throw new Error("Could not record audit event");
  revalidatePath(`/incidents/${incidentId}`);
}

export async function recordAction(formData: FormData) {
  const incidentId = String(formData.get("incidentId"));
  const note = String(formData.get("note") ?? "").trim().slice(0, 1000);
  if (!note) throw new Error("Action note is required");
  const demoIncident = incidents.find((incident) => incident.id === incidentId);
  if (!demoIncident) throw new Error("Incident not found");
  const staff = await requireStaff();
  if (demoIncident.routingClass === "PROTECTED" ? !canViewProtected(staff.role) : !canViewOrdinary(staff.role)) throw new Error("Not authorised");
  const supabase = await createAuthSupabase();
  const { data: incident, error: incidentError } = await supabase.from("incidents").select("id").eq("reference", incidentReferences[incidentId]).single();
  if (incidentError) throw new Error("Incident persistence is not available");
  const { error } = await supabase.from("incidents").update({ response_state: "ACTION_UNDERWAY", owner_id: staff.id }).eq("id", incident.id);
  if (error) throw new Error("Could not record action");
  const { error: auditError } = await supabase.from("audit_events").insert({ actor_id: staff.id, action: "ACTION_RECORDED", target_type: "incident", target_id: incident.id, safe_metadata: { note } });
  if (auditError) throw new Error("Could not record audit event");
  revalidatePath(`/incidents/${incidentId}`);
}
