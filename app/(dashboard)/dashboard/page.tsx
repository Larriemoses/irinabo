import Link from "next/link";
import Image from "next/image";
import { StatusPill } from "@/components/StatusPill";
import { incidents, trip } from "@/lib/demo/data";
import { requireStaff, canViewOrdinary } from "@/lib/auth/staff";
import { getOrganisationIncidents, getSeededTrip } from "@/lib/supabase/server";

export default async function Dashboard() {
  const staff = await requireStaff();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ? process.env.NEXT_PUBLIC_APP_URL : "https://irinabo.vercel.app";
  let storedTrip: Awaited<ReturnType<typeof getSeededTrip>> = null;
  let storedIncidents: Awaited<ReturnType<typeof getOrganisationIncidents>> = [];
  try {
    storedTrip = await getSeededTrip(staff.organisationId);
  } catch {
    // A workspace should still open when trip data is temporarily unavailable.
  }
  try {
    storedIncidents = await getOrganisationIncidents(staff.organisationId);
  } catch {
    // Incident data is optional for the overview shell.
  }
  const displayedTrip = storedTrip ? {
    ...trip,
    code: storedTrip.trip_code,
    origin: storedTrip.origin,
    destination: storedTrip.destination,
    vehicle: storedTrip.vehicle_label,
    status: storedTrip.status.replaceAll("_", " "),
  } : null;
  const liveIncidents = storedIncidents.filter((item) => item.routing_class === "ORDINARY" ? canViewOrdinary(staff.role) : staff.role === "SAFETY_COORDINATOR").map((item) => ({ id: item.id, title: "Passenger report", reference: item.reference, responseState: item.response_state, owner: (item as { assigned_staff_id?: string | null }).assigned_staff_id ? "Assigned staff" : null }));
  const visibleIncidents = storedIncidents.length ? liveIncidents : storedTrip?.trip_code === "TW204" && canViewOrdinary(staff.role)
    ? incidents.filter((incident) => incident.routingClass === "ORDINARY")
    : [];

  return <main className="p-5 lg:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[var(--muted)]">Wednesday, 16 September</p><h1 className="display mt-1 text-4xl text-white">Company overview</h1></div><Link href="/journeys/new" className="rounded-full bg-[var(--lime)] px-5 py-3 text-sm font-bold text-[var(--forest)]">+ Create journey</Link></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Active trips", displayedTrip ? "1" : "0", displayedTrip ? "Journey underway" : "Create your first journey"], ["Open incidents", displayedTrip ? "2" : "0", displayedTrip ? "1 protected" : "No reports yet"], ["Awaiting owner", displayedTrip ? "1" : "0", displayedTrip ? "Deadline passed" : "No open cases"], ["Median owner time", displayedTrip ? "1m 14s" : "—", displayedTrip ? "Current average" : "Available after activity"]].map(([label, value, note], i) => <div key={label} className="rounded-2xl border border-black/5 bg-white p-5"><p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{label}</p><p className={`display mt-3 text-4xl ${i === 2 && displayedTrip ? "text-[var(--orange)]" : "text-[var(--forest)]"}`}>{value}</p><p className="mt-2 text-xs text-[var(--muted)]">{note}</p></div>)}</div>
    {!displayedTrip ? <section className="mt-8 rounded-3xl border border-dashed border-[var(--leaf)] bg-white p-8 text-center"><p className="text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">Ready to begin</p><h2 className="display mt-3 text-3xl text-[var(--forest)]">Create your first journey</h2><p className="mx-auto mt-3 max-w-lg leading-7 text-[var(--muted)]">Add a route, vehicle and departure time. IrinAbo will then create a passenger link that you can share by QR code or message.</p><Link href="/journeys/new" className="mt-6 inline-block rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-bold text-white">Create journey</Link></section> : <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><div className="rounded-3xl border border-black/5 bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">Journey {displayedTrip.code}</p><h2 className="display mt-1 text-2xl">{displayedTrip.origin} → {displayedTrip.destination}</h2></div><StatusPill>{displayedTrip.status}</StatusPill></div><div className="mt-7 grid gap-4 border-y border-[var(--line)] py-5 sm:grid-cols-3"><div><p className="text-xs text-[var(--muted)]">Vehicle</p><p className="font-bold">{displayedTrip.vehicle}</p></div><div><p className="text-xs text-[var(--muted)]">Driver</p><p className="font-bold">{displayedTrip.driver}</p></div><div><p className="text-xs text-[var(--muted)]">Departure</p><p className="font-bold">{displayedTrip.departure}</p></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[var(--muted)]">Passenger link: /journey/{displayedTrip.code}</p><Link href={`/journey/${displayedTrip.code}`} className="text-sm font-bold text-[var(--leaf)]">Open passenger page →</Link></div></div><div className="rounded-3xl bg-[var(--lime)] p-6"><p className="text-xs font-bold uppercase tracking-widest text-[var(--forest)]/60">Passenger QR code</p><Image className="mt-4 size-40 rounded-xl bg-white p-2" alt="Passenger journey QR code" src={`https://quickchart.io/qr?text=${encodeURIComponent(`${appUrl}/journey/${displayedTrip.code}`)}&size=220`} width={160} height={160} unoptimized /><p className="mt-3 break-all text-xs text-[var(--forest)]/70">Share: {appUrl}/journey/{displayedTrip.code}</p></div></section>}
    <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6"><div className="flex items-center justify-between"><h2 className="display text-2xl">Incident inbox</h2><span className="text-sm text-[var(--muted)]">Ordinary-role view</span></div>{visibleIncidents.length ? <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-[var(--line)] text-xs uppercase tracking-widest text-[var(--muted)]"><tr><th className="pb-3">Case</th><th className="pb-3">Journey</th><th className="pb-3">State</th><th className="pb-3">Owner</th><th /></tr></thead><tbody>{visibleIncidents.map((incident) => <tr key={incident.id} className="border-b border-[var(--line)]/70"><td className="py-4"><p className="font-bold">{incident.title}</p><p className="text-xs text-[var(--muted)]">{incident.reference}</p></td><td>{trip.code}</td><td><StatusPill>{incident.responseState.replaceAll("_", " ")}</StatusPill></td><td>{incident.owner}</td><td><Link className="font-bold text-[var(--leaf)]" href={`/incidents/${incident.id}`}>Review →</Link></td></tr>)}</tbody></table></div> : <p className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm text-[var(--muted)]">Your role does not include ordinary incident details. Ask an assigned coordinator to review the queue.</p>}</section>
  </main>;
}
