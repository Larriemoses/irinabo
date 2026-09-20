import { NextResponse } from "next/server";
import { capabilities } from "@/lib/demo/data";
import { getOperationalMetrics } from "@/lib/judge/server";
export async function GET() { return NextResponse.json({ readOnly: true, generatedAt: new Date().toISOString(), capabilities, metrics: await getOperationalMetrics() }); }
