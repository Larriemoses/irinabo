"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return <form action={action} className="mt-8 space-y-5">
    <input type="hidden" name="next" value={next ?? "/dashboard"} />
    <label className="block"><span className="text-sm font-bold">Work email</span><input required name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 outline-none focus:border-[var(--leaf)]" placeholder="you@company.com" /></label>
    <label className="block"><span className="text-sm font-bold">Password</span><input required name="password" type="password" minLength={8} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 outline-none focus:border-[var(--leaf)]" /></label>
    {state?.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{state.error}</p>}
    <button disabled={pending} className="w-full rounded-full bg-[var(--forest)] px-5 py-3 font-bold text-white disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
