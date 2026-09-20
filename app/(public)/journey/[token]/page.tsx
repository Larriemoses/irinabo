import Link from "next/link";
import { Brand } from "@/components/Brand";
import { JourneyMode } from "@/components/JourneyMode";
import { getPublicTrip } from "@/lib/supabase/server";
export default async function JourneyPage({ params }: { params: Promise<{ token: string }> }) { const { token } = await params; const trip = await getPublicTrip(token).catch(() => null); return <main className="grid-noise min-h-screen bg-[var(--paper)] px-5 py-6"><nav className="mx-auto flex max-w-5xl items-center justify-between"><Brand /><Link href="/" className="text-sm font-bold">Exit</Link></nav><div className="flex justify-center py-10">{trip ? <JourneyMode trip={trip} /> : <div className="rounded-3xl bg-white p-8 text-center paper-shadow"><h1 className="display text-3xl text-[var(--forest)]">Trip link not found</h1><p className="mt-3 text-[var(--muted)]">Ask the company for a current passenger link.</p></div>}</div></main>; }
