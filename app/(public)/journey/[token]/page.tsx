import Link from "next/link";
import { Brand } from "@/components/Brand";
import { JourneyMode } from "@/components/JourneyMode";
import { getPublicTrip } from "@/lib/supabase/server";

export default async function JourneyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const trip = await getPublicTrip(token).catch(() => null);
  const whatsappNumber = (process.env.TWILIO_WHATSAPP_NUMBER ?? "whatsapp:+14155238886").replace(/\D/g, "");
  const sandboxCode = process.env.TWILIO_WHATSAPP_SANDBOX_CODE?.trim() || "nation-fifteen";
  const whatsappJoinUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`join ${sandboxCode}`)}`;
  const whatsappTripUrl = trip ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`JOIN ${trip.trip_code}`)}` : "#";
  return <main className="grid-noise min-h-screen bg-[var(--paper)] px-5 py-6"><nav className="mx-auto flex max-w-5xl items-center justify-between"><Brand /><Link href="/" className="text-sm font-bold">Exit</Link></nav><div className="flex justify-center py-10">{trip ? <div className="w-full max-w-md"><JourneyMode trip={trip} /><a href={whatsappJoinUrl} target="_blank" rel="noreferrer" className="mt-4 block rounded-full bg-[var(--lime)] px-6 py-4 text-center font-bold text-[var(--forest)]">Join WhatsApp Sandbox first →</a><a href={whatsappTripUrl} target="_blank" rel="noreferrer" className="mt-3 block rounded-full border border-[var(--line)] px-6 py-3 text-center text-sm font-bold text-[var(--forest)]">Then start trip chat: JOIN {trip.trip_code}</a><p className="mt-3 text-center text-xs text-[var(--muted)]">First send the Sandbox join message. After Twilio confirms access, send the trip message.</p></div> : <div className="rounded-3xl bg-white p-8 text-center paper-shadow"><h1 className="display text-3xl text-[var(--forest)]">Trip link not found</h1><p className="mt-3 text-[var(--muted)]">Ask the company for a current passenger link.</p></div>}</div></main>;
}
