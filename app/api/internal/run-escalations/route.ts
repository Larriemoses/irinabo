import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!process.env.INTERNAL_CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.INTERNAL_CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Persistence unavailable" }, { status: 503 });
  const { data: overdue, error: queryError } = await supabase.from("incidents").select("id,reference,routing_class,deadline_at,response_state").in("response_state", ["AWAITING_ACKNOWLEDGEMENT", "RECEIVED"]).lt("deadline_at", new Date().toISOString());
  if (queryError) return NextResponse.json({ error: "Could not load overdue incidents" }, { status: 500 });
  const escalated: string[] = [];
  for (const incident of overdue ?? []) {
    const { data: prior } = await supabase.from("audit_events").select("id").eq("target_id", incident.id).eq("action", "ESCALATION_ATTEMPTED").limit(1);
    if (prior?.length) continue;
    const route = incident.routing_class === "PROTECTED" ? "independent-safety-demo" : "backup-coordinator-demo";
    const { error: auditError } = await supabase.from("audit_events").insert({ action: "ESCALATION_ATTEMPTED", target_type: "incident", target_id: incident.id, safe_metadata: { route, result: "SIMULATED", reason: "acknowledgement deadline passed" } });
    if (auditError) continue;
    await supabase.from("incidents").update({ response_state: "UNASSIGNED" }).eq("id", incident.id);
    escalated.push(incident.reference);
  }
  return NextResponse.json({ claimed: escalated.length, escalated, result: "SIMULATED", note: "No external call was placed." });
}
