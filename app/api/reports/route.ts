import { NextResponse } from "next/server";
import { selectRouting } from "@/lib/protection/routing";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.originalText !== "string" || !body.originalText.trim()) {
    return NextResponse.json({ error: "originalText is required" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const report = {
    id,
    reference: `DEMO-${id.slice(0, 8).toUpperCase()}`,
    originalText: body.originalText.slice(0, 4000),
    urgent: Boolean(body.urgent),
    routingClass: selectRouting(body.protectionChoice ?? null, Boolean(body.urgent)),
    receivedAt: new Date().toISOString(),
    source: "WEB_DEMO_API",
    persisted: false,
  };

  return NextResponse.json(
    { report, note: "Accepted by the demo API. Shared database persistence is not enabled for this public simulator." },
    { status: 201 },
  );
}
