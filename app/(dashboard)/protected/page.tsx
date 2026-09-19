import Link from "next/link";
import { StatusPill } from "@/components/StatusPill";
import { getStaffSessionContext, listAccessibleIncidents, listAccessibleTrips } from "@/lib/staff/server";

export default async function Protected() {
  const context = await getStaffSessionContext();
  const trips = await listAccessibleTrips(context);
  const incidents = await listAccessibleIncidents(context, trips);
  const list = incidents.filter((incident) => incident.routingClass !== "ORDINARY");

  return (
    <main className="p-5 lg:p-8">
      <p className="text-sm text-[var(--muted)]">Safety-role-only queue</p>
      <h1 className="display mt-1 text-4xl text-[var(--forest)]">Protected inbox</h1>
      <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6">
        <strong>Restricted access.</strong> Opening a protected record creates an access event. ADMIN does not grant protected visibility.
      </div>
      <div className="mt-7 grid gap-4">
        {list.map((incident) => (
          <Link
            key={incident.id}
            href={`/incidents/${incident.id}`}
            className="rounded-3xl border border-black/5 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--orange)]">Immediate help requested</p>
                <h2 className="display mt-2 text-2xl">{incident.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{incident.reference} · Identity protected</p>
              </div>
              <StatusPill tone="orange">{incident.responseState.replaceAll("_", " ")}</StatusPill>
            </div>
          </Link>
        ))}
      </div>
      {!list.length && (
        <p className="mt-6 text-sm text-[var(--muted)]">
          No protected incidents are visible. A SAFETY_COORDINATOR assignment is required for this organisation.
        </p>
      )}
    </main>
  );
}
