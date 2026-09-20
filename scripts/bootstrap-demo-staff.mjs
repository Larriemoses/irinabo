import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const local = Object.fromEntries(readFileSync(".env.local", "utf8").split(/\r?\n/).filter((line) => line && !line.startsWith("#")).map((line) => { const at = line.indexOf("="); return [line.slice(0, at), line.slice(at + 1)]; }));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || local.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || local.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.DEMO_STAFF_PASSWORD;
if (!url || !key || !password) throw new Error("Supabase credentials and DEMO_STAFF_PASSWORD are required.");

const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: organisation, error: organisationError } = await client.from("organisations").select("id").eq("name", "Unity Transit Demo").single();
if (organisationError) throw organisationError;

const staff = [
  { email: "coordinator@irinabo.demo", name: "Bisi Okafor", role: "COORDINATOR" },
  { email: "safety@irinabo.demo", name: "Amara Bello", role: "SAFETY_COORDINATOR" },
  { email: "admin@irinabo.demo", name: "Tunde Adeyemi", role: "ADMIN" },
];
const { data: existing } = await client.auth.admin.listUsers({ perPage: 1000 });

for (const member of staff) {
  let user = existing.users.find((candidate) => candidate.email === member.email);
  if (!user) {
    const { data, error } = await client.auth.admin.createUser({ email: member.email, password, email_confirm: true });
    if (error) throw error;
    user = data.user;
  } else {
    const { error } = await client.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    if (error) throw error;
  }
  const { error: profileError } = await client.from("profiles").upsert({ id: user.id, display_name: member.name, status: "ACTIVE" });
  if (profileError) throw profileError;
  const { error: assignmentError } = await client.from("staff_assignments").upsert({ profile_id: user.id, organisation_id: organisation.id, role: member.role });
  if (assignmentError) throw assignmentError;
  console.log(`${member.role}: ${member.email}`);
}
