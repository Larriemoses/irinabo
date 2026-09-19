import Link from "next/link";
import { StatusPill } from "@/components/StatusPill";
import { getStaffSessionContext, listAccessibleIncidents, listAccessibleTrips } from "@/lib/staff/server";

export default async function Dashboard() {
  const context = await getStaffSessionContext();
  const trips = await listAccessibleTrips(context);
  const incidents = await listAccessibleIncidents(context, trips);

  const displayedTrip = trips[0] ?? null;
  const ordinaryIncidents = incidents.filter((incident) => incident.routingClass === "ORDINARY");

  return (
    <main className="p-5 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Staff dashboard</p>
          <h1 className="display mt-1 text-4xl text-[var(--forest)]">Garage overview</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Accessible trips", String(trips.length), "Organisation-scoped visibility"],
          ["Accessible incidents", String(incidents.length), "Role and route filtered"],
          ["Protected incidents", String(incidents.filter((incident) => incident.routingClass !== "ORDINARY").length), "Safety role required"],
          ["Workspace mode", context.mode === "demo" ? "DEMO" : "CONNECTED", context.mode === "demo" ? "No Supabase credentials" : "Supabase Auth session"],
        ].map(([label, value, note], i) => (
          <div key={label} className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{label}</p>
            <p className={`display mt-3 text-4xl ${i === 2 ? "text-[var(--orange)]" : "text-[var(--forest)]"}`}>{value}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{note}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-black/5 bg-white p-6">
          {displayedTrip ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">Journey {displayedTrip.code}</p>
                  <h2 className="display mt-1 text-2xl">
                    {displayedTrip.origin} → {displayedTrip.destination}
                  </h2>
                </div>
                <StatusPill>{displayedTrip.status}</StatusPill>
              </div>
              <div className="mt-7 grid gap-4 border-y border-[var(--line)] py-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[var(--muted)]">Vehicle</p>
                  <p className="font-bold">{displayedTrip.vehicle}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Organisation</p>
                  <p className="font-bold">{displayedTrip.organisationName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Departure</p>
                  <p className="font-bold">{displayedTrip.departure}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">No trips are currently assigned to your active organisation roles.</p>
          )}
        </div>

        <div className="rounded-3xl bg-[var(--lime)] p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--forest)]/60">Attention needed</p>
          <p className="display mt-3 text-3xl text-[var(--forest)]">Protected reports require explicit safety assignments.</p>
          <p className="mt-3 text-sm leading-6 text-[var(--forest)]/70">
            ADMIN assignments remain ordinary-only. Staff need a SAFETY_COORDINATOR assignment for protected queues.
          </p>
          <Link href="/protected" className="mt-6 inline-block rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white">
            Open protected inbox
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">Incident inbox</h2>
          <span className="text-sm text-[var(--muted)]">Ordinary-role view</span>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-xs uppercase tracking-widest text-[var(--muted)]">
              <tr>
                <th className="pb-3">Case</th>
                <th className="pb-3">Route</th>
                <th className="pb-3">State</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordinaryIncidents.map((incident) => (
                <tr key={incident.id} className="border-b border-[var(--line)]/70">
                  <td className="py-4">
                    <p className="font-bold">{incident.title}</p>
                    <p className="text-xs text-[var(--muted)]">{incident.reference}</p>
                  </td>
                  <td>{incident.routingClass}</td>
                  <td>
                    <StatusPill>{incident.responseState.replaceAll("_", " ")}</StatusPill>
                  </td>
                  <td>
                    <Link className="font-bold text-[var(--leaf)]" href={`/incidents/${incident.id}`}>
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!ordinaryIncidents.length && (
            <p className="mt-4 text-sm text-[var(--muted)]">No ordinary incidents are available for your current assignment.</p>
          )}
        </div>
      </section>
    </main>
  );
}
