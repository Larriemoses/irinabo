import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Receipt } from "@/components/Receipt";
import { getReceiptTimeline } from "@/lib/receipts/server";

export default async function ReceiptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const timeline = await getReceiptTimeline();
  const repeatableTimeline = token === "demo-receipt" && timeline ? { ...timeline, feedback: null } : timeline;
  return <main className="grid-noise min-h-screen bg-[var(--paper)] px-5 py-6"><nav className="mx-auto flex max-w-5xl items-center justify-between"><Brand inverse /><Link href="/" className="text-sm font-bold">Done</Link></nav><div className="flex justify-center py-10"><Receipt timeline={repeatableTimeline} /></div></main>;
}
