"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth/staff";
import { createServerSupabase } from "@/lib/supabase/server";
const schema=z.object({fullName:z.string().trim().min(2).max(100),username:z.string().trim().toLowerCase().regex(/^[a-z0-9._-]{3,32}$/),role:z.string().trim().min(2).max(40),accessCode:z.string().regex(/^\d{6}$/)});
async function hash(value:string){const bytes=new TextEncoder().encode(value);const digest=await crypto.subtle.digest("SHA-256",bytes);return Array.from(new Uint8Array(digest)).map((b)=>b.toString(16).padStart(2,"0")).join("");}
export async function addStaff(formData:FormData){const adminStaff=await requireStaff(["ADMIN"]);const parsed=schema.safeParse(Object.fromEntries(formData));if(!parsed.success)redirect("/staff?error=Use a valid name, username, role, and 6-digit access code.");const db=createServerSupabase();if(!db)redirect("/staff?error=Staff storage is not configured.");const{error}=await db.from("company_staff").insert({organisation_id:adminStaff.organisationId,full_name:parsed.data.fullName,username:parsed.data.username,role:parsed.data.role,access_code_hash:await hash(parsed.data.accessCode)});if(error)redirect(`/staff?error=${encodeURIComponent(error.message.includes("duplicate")?"That username is already in use.":"We could not add this staff member yet.")}`);revalidatePath("/staff");redirect("/staff?success=Staff member added. Share their username and access code securely.");}
export async function deactivateStaff(formData:FormData){const adminStaff=await requireStaff(["ADMIN"]);const id=String(formData.get("id"));const db=createServerSupabase();if(!db)return;await db.from("company_staff").update({active:false}).eq("id",id).eq("organisation_id",adminStaff.organisationId);revalidatePath("/staff");}
