import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !["MATCHES", "NOT_RESOLVED"].includes(body.feedback)) return NextResponse.json({ error: "feedback must be MATCHES or NOT_RESOLVED" }, { status: 400 });
  if (body.demo === true) return NextResponse.json({ recorded: false, simulated: true, feedback: body.feedback });
  const supabase = createServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Persistence unavailable" }, { status: 503 });
  const { error } = await supabase.from("resolution_feedback").insert({ incident_id: "00000000-0000-4000-8000-000000000301", feedback: body.feedback, note: null });
  if (error) return NextResponse.json({ error: "Could not record feedback" }, { status: 500 });
  return NextResponse.json({ recorded: true, feedback: body.feedback });
}
