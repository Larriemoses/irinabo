"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthSupabase } from "@/lib/supabase/auth";
import { createServerSupabase } from "@/lib/supabase/server";
export type RegisterState = { error?: string } | undefined;
const schema = z.object({ company: z.string().trim().min(2).max(120), name: z.string().trim().min(2).max(120), email: z.email(), password: z.string().min(8), tripCode: z.string().trim().regex(/^[A-Za-z0-9-]{3,20}$/) });
export async function register(_state: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a company, your name, a valid email, a password of 8+ characters, and a short trip code." };
  const admin = createServerSupabase();
  if (!admin) return { error: "Registration is temporarily unavailable." };
  const tripCode = parsed.data.tripCode.toUpperCase();
  const { data: existing } = await admin.from("trips").select("id").eq("trip_code", tripCode).maybeSingle();
  if (existing) return { error: "That trip code is already in use. Choose another one." };
  const { data: authData, error: authError } = await admin.auth.admin.createUser({ email: parsed.data.email, password: parsed.data.password, email_confirm: true, user_metadata: { display_name: parsed.data.name } });
  if (authError || !authData.user) return { error: authError?.message.includes("already") ? "An account with that email already exists." : "We could not create the account." };
  const organisationId = crypto.randomUUID();
  const { error: setupError } = await admin.from("organisations").insert({ id: organisationId, name: parsed.data.company, provenance: "SELF_REGISTERED" });
  if (!setupError) await admin.from("profiles").insert({ id: authData.user.id, display_name: parsed.data.name, status: "ACTIVE" });
  if (!setupError) await admin.from("staff_assignments").insert({ profile_id: authData.user.id, organisation_id: organisationId, role: "ADMIN" });
  if (!setupError) await admin.from("trips").insert({ organisation_id: organisationId, trip_code: tripCode, origin: "Starting point", destination: "Destination", vehicle_label: "New vehicle", status: "PLANNED", scheduled_departure: new Date().toISOString() });
  if (setupError) { await admin.auth.admin.deleteUser(authData.user.id); return { error: "We could not finish setting up the company." }; }
  const auth = await createAuthSupabase();
  const { error: signInError } = await auth.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (signInError) redirect("/login?registered=1");
  redirect("/dashboard");
}
