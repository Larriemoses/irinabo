import Link from "next/link";
import { Brand } from "@/components/Brand";
import { StatusPill } from "@/components/StatusPill";
import { incidents, locations, trip } from "@/lib/demo/data";

export default function JudgeCase() {
  const incident = incidents.find((item) => item.routingClass === "PROTECTED")!;
  return <main className="min-h-screen bg-[var(--paper)] px-6 py-6 text-white">
    <nav className="mx-auto flex max-w-6xl items-center justify-between"><Brand inverse /><Link href="/judge" className="text-sm font-bold text-[var(--leaf)]">Back to Judge Mode</Link></nav>
    <section className="mx-auto max-w-6xl py-12">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--leaf)]">Fictional read-only case · {incident.reference}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="display text-5xl">{incident.title}</h1><p className="mt-3 text-[var(--muted)]">Journey {trip.code} · {trip.origin} to {trip.destination}</p></div><StatusPill tone="orange">PROTECTED ROUTE</StatusPill></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-3xl bg-white p-6 text-[var(--forest)]"><p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Original source accounts</p><div className="mt-5 space-y-4">{incident.reports.map((report) => <article key={report.id} className="rounded-2xl border border-[var(--line)] p-5"><strong>{report.reporterRole === "PASSENGER" ? "Passenger · identity protected" : report.reporterRole}</strong><p className="mt-3 leading-7">“{report.originalText}”</p><p className="mt-3 text-xs text-[var(--muted)]">{report.channel} · Original preserved · No truth score</p></article>)}</div></section>
        <aside className="space-y-6"><section className="rounded-3xl bg-white p-6 text-[var(--forest)]"><p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Location evidence</p>{locations.map((location) => <div key={location.id} className="flex items-center justify-between border-b border-[var(--line)] py-3"><div><p className="text-sm font-bold">{location.source}</p><p className="text-xs text-[var(--muted)]">Captured {location.capturedAt} · {location.accuracy}</p></div><StatusPill tone={location.freshness === "ACTIVE" ? "green" : "orange"}>{location.freshness}</StatusPill></div>)}</section><section className="rounded-3xl bg-white p-6 text-[var(--forest)]"><p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Audit history</p><div className="mt-5 space-y-4">{incident.audit.map((event) => <div key={event.id}><p className="text-sm font-bold">{event.action.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-[var(--muted)]">{event.at} · {event.detail}</p></div>)}</div></section></aside>
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-6 text-[var(--muted)]">This page uses fictional data so judges can inspect the evidence model without staff credentials. It cannot accept responsibility, reveal an identity or trigger an external call.</p>
    </section>
  </main>;
}
