import { notFound } from "next/navigation";
import { StatusPill } from "@/components/StatusPill";
import { incidents, locations, trip } from "@/lib/demo/data";
import { getAccessibleIncidentById, getStaffSessionContext } from "@/lib/staff/server";

export default async function IncidentPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  const incidentId = (await params).incidentId;
  const context = await getStaffSessionContext();

  if (context.mode === "demo") {
    const incident = incidents.find((item) => item.id === incidentId);
    if (!incident) notFound();

    return (
      <main className="p-5 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--muted)]">
              {incident.reference} · Journey {trip.code}
            </p>
            <h1 className="display mt-1 text-4xl text-[var(--forest)]">{incident.title}</h1>
            <div className="mt-3 flex gap-2">
              <StatusPill tone={incident.routingClass === "PROTECTED" ? "orange" : "green"}>{incident.routingClass} ROUTE</StatusPill>
              <StatusPill tone="grey">{incident.evidenceState.replaceAll("_", " ")}</StatusPill>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Original source accounts</p>
              <div className="mt-5 space-y-4">
                {incident.reports.map((report, index) => (
                  <article
                    key={report.id}
                    className={`rounded-2xl border p-5 ${index === 0 && incident.routingClass === "PROTECTED" ? "border-orange-200 bg-orange-50/60" : "border-[var(--line)]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <strong>
                        {report.reporterRole === "PASSENGER" && incident.routingClass === "PROTECTED"
                          ? "Passenger · identity protected"
                          : report.reporterRole}
                      </strong>
                      <span className="text-xs text-[var(--muted)]">
                        {report.channel} · {new Date(report.receivedAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="mt-3 leading-7">“{report.originalText}”</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">AI-assisted suggestion</p>
                <StatusPill tone="grey">FALLBACK MODE</StatusPill>
              </div>
              <h2 className="display mt-4 text-2xl">Possible breakdown with staff-conduct concern</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Passenger reports a stopped bus, engine overheating and threatening staff conduct. Immediate help was selected by the user.
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-white">
              <div className="p-5">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-start justify-between border-b border-[var(--line)] py-3 last:border-0">
                    <div>
                      <strong className="text-sm">{location.source}</strong>
                      <p className="mt-1 text-xs text-[var(--muted)]">Captured {location.capturedAt} · Accuracy {location.accuracy}</p>
                    </div>
                    <StatusPill tone={location.freshness === "ACTIVE" ? "green" : "orange"}>{location.freshness}</StatusPill>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    );
  }

  const incident = await getAccessibleIncidentById(context, incidentId);
  if (!incident) notFound();

  return (
    <main className="p-5 lg:p-8">
      <p className="text-sm text-[var(--muted)]">{incident.trip.organisationName} · Authenticated workspace</p>
      <h1 className="display mt-1 text-4xl text-[var(--forest)]">{incident.reference}</h1>
      <div className="mt-3 flex gap-2">
        <StatusPill tone={incident.routingClass === "ORDINARY" ? "green" : "orange"}>{incident.routingClass}</StatusPill>
        <StatusPill tone="grey">{incident.responseState.replaceAll("_", " ")}</StatusPill>
      </div>
      <div className="mt-6 rounded-3xl border border-black/5 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Journey</p>
        <h2 className="display mt-2 text-2xl">
          {incident.trip.code} · {incident.trip.origin} → {incident.trip.destination}
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Access is organisation-scoped by active staff assignments. Protected details remain limited to explicit safety assignments.
        </p>
      </div>
    </main>
  );
}
