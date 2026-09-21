"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff } from "@/lib/auth/staff";
import { createAuthSupabase } from "@/lib/supabase/auth";
const schema=z.object({tripCode:z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{3,20}$/),origin:z.string().trim().min(2).max(120),destination:z.string().trim().min(2).max(120),vehicle:z.string().trim().min(2).max(80),departure:z.string().min(1)});
export async function createJourney(formData:FormData){const staff=await requireStaff(["ADMIN"]);const parsed=schema.safeParse(Object.fromEntries(formData));if(!parsed.success)redirect("/journeys/new?error=Enter valid journey details.");const db=await createAuthSupabase();const{error}=await db.from("trips").insert({organisation_id:staff.organisationId,trip_code:parsed.data.tripCode,origin:parsed.data.origin,destination:parsed.data.destination,vehicle_label:parsed.data.vehicle,status:"PLANNED",scheduled_departure:new Date(parsed.data.departure).toISOString()});if(error)redirect(`/journeys/new?error=${encodeURIComponent(error.message.includes("duplicate")?"That trip code is already in use.":"We could not save this journey yet.")}`);redirect("/dashboard");}
