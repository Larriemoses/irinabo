import Link from "next/link";
import { StatusPill } from "@/components/StatusPill";
import { incidents, trip } from "@/lib/demo/data";
import { requireStaff, canViewOrdinary } from "@/lib/auth/staff";
import { getSeededTrip } from "@/lib/supabase/server";

export default async function Dashboard() {
  const staff = await requireStaff();
  const storedTrip = await getSeededTrip(staff.organisationId);
  const displayedTrip = storedTrip ? {
    ...trip,
    code: storedTrip.trip_code,
    origin: storedTrip.origin,
    destination: storedTrip.destination,
    vehicle: storedTrip.vehicle_label,
    status: storedTrip.status.replaceAll("_", " "),
  } : trip;
  const visibleIncidents = canViewOrdinary(staff.role)
    ? incidents.filter((incident) => incident.routingClass === "ORDINARY")
    : [];

  return <main className="p-5 lg:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[var(--muted)]">Wednesday, 16 September</p><h1 className="display mt-1 text-4xl text-[var(--forest)]">Company overview</h1></div><button className="rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white">+ Create journey</button></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Active trips", "1", "Journey underway"], ["Open incidents", "2", "1 protected"], ["Awaiting owner", "1", "Deadline passed"], ["Median owner time", "1m 14s", "Demonstration data"]].map(([label, value, note], i) => <div key={label} className="rounded-2xl border border-black/5 bg-white p-5"><p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{label}</p><p className={`display mt-3 text-4xl ${i === 2 ? "text-[var(--orange)]" : "text-[var(--forest)]"}`}>{value}</p><p className="mt-2 text-xs text-[var(--muted)]">{note}</p></div>)}</div>
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><div className="rounded-3xl border border-black/5 bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">Journey {displayedTrip.code}</p><h2 className="display mt-1 text-2xl">{displayedTrip.origin} → {displayedTrip.destination}</h2></div><StatusPill>{displayedTrip.status}</StatusPill></div><div className="mt-7 grid gap-4 border-y border-[var(--line)] py-5 sm:grid-cols-3"><div><p className="text-xs text-[var(--muted)]">Vehicle</p><p className="font-bold">{displayedTrip.vehicle}</p></div><div><p className="text-xs text-[var(--muted)]">Driver</p><p className="font-bold">{displayedTrip.driver}</p></div><div><p className="text-xs text-[var(--muted)]">Departure</p><p className="font-bold">{displayedTrip.departure}</p></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[var(--muted)]">Passenger link: /journey/{displayedTrip.code}</p><Link href={`/journey/${displayedTrip.code}`} className="text-sm font-bold text-[var(--leaf)]">Open passenger page →</Link></div></div><div className="rounded-3xl bg-[var(--lime)] p-6"><p className="text-xs font-bold uppercase tracking-widest text-[var(--forest)]/60">Needs attention</p><p className="display mt-3 text-3xl text-[var(--forest)]">One case has no owner.</p><p className="mt-3 text-sm leading-6 text-[var(--forest)]/70">Protected case IRN-204-031 is past its response deadline. The fallback process is ready.</p><Link href="/protected" className="mt-6 inline-block rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white">Open protected inbox</Link></div></section>
    <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6"><div className="flex items-center justify-between"><h2 className="display text-2xl">Incident inbox</h2><span className="text-sm text-[var(--muted)]">Ordinary-role view</span></div>{visibleIncidents.length ? <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-[var(--line)] text-xs uppercase tracking-widest text-[var(--muted)]"><tr><th className="pb-3">Case</th><th className="pb-3">Journey</th><th className="pb-3">State</th><th className="pb-3">Owner</th><th /></tr></thead><tbody>{visibleIncidents.map((incident) => <tr key={incident.id} className="border-b border-[var(--line)]/70"><td className="py-4"><p className="font-bold">{incident.title}</p><p className="text-xs text-[var(--muted)]">{incident.reference}</p></td><td>{trip.code}</td><td><StatusPill>{incident.responseState.replaceAll("_", " ")}</StatusPill></td><td>{incident.owner}</td><td><Link className="font-bold text-[var(--leaf)]" href={`/incidents/${incident.id}`}>Review →</Link></td></tr>)}</tbody></table></div> : <p className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm text-[var(--muted)]">Your role does not include ordinary incident details. Ask an assigned coordinator to review the queue.</p>}</section>
  </main>;
}
