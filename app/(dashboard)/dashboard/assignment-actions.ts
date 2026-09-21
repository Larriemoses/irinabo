"use server";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth/staff";
import { createServerSupabase } from "@/lib/supabase/server";
export async function assignIncident(formData:FormData){const staff=await requireStaff(["ADMIN","COORDINATOR","SAFETY_COORDINATOR"]);const incidentId=String(formData.get("incidentId"));const assignedStaffId=String(formData.get("assignedStaffId"));const db=createServerSupabase();if(!db)return;await db.from("incidents").update({assigned_staff_id:assignedStaffId||null}).eq("id",incidentId);await db.from("audit_events").insert({action:"STAFF_ASSIGNED",target_type:"incident",target_id:incidentId,safe_metadata:{assigned_staff_id:assignedStaffId,assigned_by:staff.id}});revalidatePath("/dashboard");}
