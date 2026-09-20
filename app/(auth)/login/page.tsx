import { Brand } from "@/components/Brand";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reason?: string }> }) {
  const query = await searchParams;
  return <main className="grid min-h-screen place-items-center bg-[#edf0ea] p-5"><section className="w-full max-w-md rounded-3xl border border-black/5 bg-[var(--paper)] p-7 paper-shadow sm:p-10"><Brand /><p className="mt-10 text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">Staff workspace</p><h1 className="display mt-2 text-4xl text-[var(--forest)]">Welcome back</h1><p className="mt-3 leading-7 text-[var(--muted)]">Sign in with the staff account assigned to your transport company. Your role controls which cases you can open.</p>{query.reason && <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">A staff account is required to open that page.</p>}<LoginForm next={query.next} /><p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">Passengers do not need an account to report or follow a journey.</p></section></main>;
}
