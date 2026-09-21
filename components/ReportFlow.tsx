"use client";

import Link from "next/link";
import { useState } from "react";

type ProtectionChoice = "YES" | "NO" | "PREFER_NOT_TO_SAY";
type DemoReceipt = {
  reference: string;
  routingClass: "RESTRICTED_PENDING" | "ORDINARY" | "PROTECTED";
  note: string;
};

export function ReportFlow() {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("Our bus has stopped near the interchange. The driver is threatening passengers who try to call the garage. I need help.");
  const [urgent, setUrgent] = useState(true);
  const [choice, setChoice] = useState<ProtectionChoice>("YES");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<DemoReceipt | null>(null);

  async function submitDemoReport() {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ originalText: text, urgent, protectionChoice: choice }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The demo server could not accept the report.");
      setReceipt({ reference: data.report.reference, routingClass: data.report.routingClass, note: data.note });
      setStep(3);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The demo server could not accept the report.");
    } finally {
      setSubmitting(false);
    }
  }

  const protectedRoute = receipt ? receipt.routingClass !== "ORDINARY" : choice !== "NO";
  const options: Array<[ProtectionChoice, string, string]> = [
    ["YES", "Yes, staff are involved", "Use the identity-protected safety route"],
    ["NO", "No", "Use the ordinary garage coordinator route"],
    ["PREFER_NOT_TO_SAY", "Prefer not to say", "Use the identity-protected safety route"],
  ];

  return <div className="paper-shadow mx-auto w-full max-w-2xl rounded-[32px] bg-white p-6 sm:p-9">
    <div className="flex items-center gap-2">{[1, 2, 3].map((number) => <span key={number} className={`h-1.5 flex-1 rounded-full ${number <= step ? "bg-[var(--leaf)]" : "bg-[var(--line)]"}`} />)}</div>

    {step === 1 && <>
      <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">Step 1 of 3 · Original report</p>
      <h1 className="display mt-2 text-4xl">What happened on your journey?</h1>
      <p className="mt-3 leading-7 text-[var(--muted)]">This public simulator sends your message to the demo API. It does not contact an emergency service.</p>
      <label className="mt-7 block text-sm font-bold" htmlFor="report">Report</label>
      <textarea id="report" value={text} onChange={(event) => setText(event.target.value)} className="mt-2 min-h-40 w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 outline-none focus:border-[var(--leaf)]" />
      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} className="size-5 accent-[var(--orange)]" />
        <span><strong className="block">I need immediate help</strong><span className="text-sm text-[var(--muted)]">Urgent unanswered reports default to the restricted route.</span></span>
      </label>
      <button disabled={!text.trim()} onClick={() => setStep(2)} className="mt-7 w-full rounded-full bg-[var(--forest)] px-6 py-4 font-bold text-white disabled:opacity-40">Continue to routing choice →</button>
    </>}

    {step === 2 && <>
      <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">Step 2 of 3 · Routing choice</p>
      <h1 className="display mt-2 text-4xl">Does this involve the driver or transport staff?</h1>
      <p className="mt-3 leading-7 text-[var(--muted)]">Yes and prefer not to say use a restricted safety route. This controls visibility. It does not decide whether an account is true.</p>
      <div className="mt-7 grid gap-3">{options.map(([value, label, description]) => <button key={value} disabled={submitting} onClick={() => setChoice(value)} className={`rounded-2xl border p-5 text-left disabled:opacity-60 ${choice === value ? "border-[var(--leaf)] bg-emerald-50" : "border-[var(--line)]"}`}><strong className="block">{label}</strong><span className="mt-1 block text-sm text-[var(--muted)]">{description}</span></button>)}</div>
      <div className="mt-6 rounded-2xl bg-[var(--forest)] p-5 text-white"><strong>Identity-protected is not anonymous.</strong><p className="mt-1 text-sm leading-6 text-white/65">IrinAbo and a configured messaging provider may process a phone number. Ordinary garage staff do not receive protected report content.</p></div>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>}
      <button disabled={submitting} onClick={submitDemoReport} className="mt-7 w-full rounded-full bg-[var(--orange)] px-6 py-4 font-bold text-white disabled:opacity-50">{submitting ? "Sending to demo API…" : "Send demo report →"}</button>
    </>}

    {step === 3 && receipt && <div className="py-10 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-[var(--lime)] text-3xl text-[var(--forest)]">✓</span>
      <p className="mt-7 text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">{receipt.reference} accepted</p>
      <h1 className="display mt-2 text-4xl">The demo server received your report.</h1>
      <p className="mx-auto mt-3 max-w-md leading-7 text-[var(--muted)]">{protectedRoute ? "The protected safety route is locked." : "The ordinary garage route is locked."} No real responder or agency has been contacted.</p>
      <div className="mt-7 rounded-2xl border border-[var(--line)] p-5 text-left"><p className="text-xs uppercase tracking-widest text-[var(--muted)]">Demonstration status</p><div className="mt-3 flex items-center justify-between"><strong>Demo API</strong><span className="text-emerald-700">Accepted ✓</span></div><div className="mt-3 flex items-center justify-between"><strong>Shared persistence</strong><span className="text-orange-700">Not enabled</span></div><div className="mt-3 flex items-center justify-between"><strong>Responsible route notified</strong><span className="text-orange-700">Simulated</span></div><p className="mt-4 text-xs leading-5 text-[var(--muted)]">{receipt.note}</p></div>
      <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/judge/case" className="rounded-full bg-[var(--forest)] px-6 py-3 font-bold text-white">View sample case</Link><Link href="/judge" className="rounded-full border border-[var(--line)] px-6 py-3 font-bold">See capability labels</Link></div>
    </div>}
  </div>;
}
