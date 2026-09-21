import Link from "next/link";
import { Brand } from "@/components/Brand";
import { StatusPill } from "@/components/StatusPill";
import { capabilities } from "@/lib/demo/data";
import { getOperationalMetrics } from "@/lib/judge/server";

export default async function Judge() {
  const tone = { LIVE: "green", SIMULATED: "orange", FICTIONAL: "lime", DEFERRED: "grey" } as const;
  const metrics = await getOperationalMetrics();
  return <main className="min-h-screen bg-[var(--paper)]">
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6"><Brand inverse /><Link href="/judge/case" className="rounded-full bg-[var(--lime)] px-5 py-3 text-sm font-bold text-[var(--forest)]">View sample case</Link></nav>
    <section className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--leaf)]">Read-only evidence view</p>
      <h1 className="display mt-3 max-w-3xl text-6xl leading-none text-white">What is real in this demonstration?</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Judge Mode reports capability status and selected persisted metrics. It does not enable integrations, bypass authentication or weaken access controls.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Open incidents", metrics?.open ?? "—"], ["Overdue", metrics?.overdue ?? "—"], ["Escalations", metrics?.escalations ?? "—"], ["Review requests", metrics?.reviews ?? "—"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{label}</p><p className="display mt-2 text-4xl text-[var(--forest)]">{value}</p><p className="mt-1 text-xs text-[var(--muted)]">Persisted demo data</p></div>)}</div>
      <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--line)] bg-white">{capabilities.map((capability, index) => <div key={capability.name} className={`grid gap-3 p-6 sm:grid-cols-[180px_1fr] ${index ? "border-t border-[var(--line)]" : ""}`}><StatusPill tone={tone[capability.state]}>{capability.state}</StatusPill><div><h2 className="font-bold">{capability.name}</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{capability.note}</p></div></div>)}</div>
    </section>
  </main>;
}
