import type { SupabaseClient } from "@supabase/supabase-js";
import { incidents as demoIncidents, trip as demoTrip } from "@/lib/demo/data";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { createServerSupabaseSessionClient } from "@/lib/supabase/server";
import {
  canReadIncidentForAssignments,
  canReadTripsForOrganisation,
  filterActiveAssignments,
  type StaffAssignmentRecord,
} from "@/lib/staff/access";
import type { RoutingClass, StaffRole } from "@/lib/domain";

export interface DashboardTripSummary {
  id: string;
  organisationId: string;
  organisationName: string;
  code: string;
  origin: string;
  destination: string;
  vehicle: string;
  status: string;
  departure: string;
}

export interface DashboardIncidentSummary {
  id: string;
  tripId: string;
  organisationId: string;
  reference: string;
  title: string;
  routingClass: RoutingClass;
  responseState: string;
}

export interface StaffIdentity {
  userId: string;
  email: string | null;
  displayName: string;
  assignments: StaffAssignmentRecord[];
  organisations: Array<{ id: string; name: string }>;
}

export type StaffSessionContext =
  | {
      mode: "demo";
      isAuthenticated: true;
      identity: StaffIdentity;
      client: null;
    }
  | {
      mode: "connected";
      isAuthenticated: false;
      identity: null;
      client: SupabaseClient | null;
    }
  | {
      mode: "connected";
      isAuthenticated: true;
      identity: StaffIdentity;
      client: SupabaseClient;
    };

const DEMO_IDENTITY: StaffIdentity = {
  userId: "demo-staff",
  email: null,
  displayName: "Bisi Okafor",
  assignments: [{ organisationId: "00000000-0000-4000-8000-000000000001", role: "COORDINATOR" }],
  organisations: [{ id: "00000000-0000-4000-8000-000000000001", name: "Unity Transit Demo" }],
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function titleForRoutingClass(routingClass: RoutingClass) {
  if (routingClass === "PROTECTED") return "Passenger requests immediate help";
  if (routingClass === "RESTRICTED_PENDING") return "Pending routing review";
  return "Operational incident";
}

export async function getStaffSessionContext(): Promise<StaffSessionContext> {
  if (!isSupabaseAuthConfigured()) {
    return { mode: "demo", isAuthenticated: true, identity: DEMO_IDENTITY, client: null };
  }

  const client = await createServerSupabaseSessionClient();
  if (!client) {
    return { mode: "connected", isAuthenticated: false, identity: null, client: null };
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { mode: "connected", isAuthenticated: false, identity: null, client };
  }

  const [{ data: profile }, { data: assignmentRows }] = await Promise.all([
    client.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
    client
      .from("staff_assignments")
      .select("organisation_id, role, active_from, active_until")
      .eq("profile_id", user.id),
  ]);

  const assignments = filterActiveAssignments(
    (assignmentRows ?? []).map((row) => ({
      organisationId: row.organisation_id,
      role: row.role as StaffRole,
      activeFrom: row.active_from,
      activeUntil: row.active_until,
    })),
  );

  const organisationIds = [...new Set(assignments.map((assignment) => assignment.organisationId))];

  const { data: organisationRows } = organisationIds.length
    ? await client.from("organisations").select("id, name").in("id", organisationIds)
    : { data: [] as Array<{ id: string; name: string }> };

  const organisations = organisationRows ?? [];

  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "Staff member";

  return {
    mode: "connected",
    isAuthenticated: true,
    identity: {
      userId: user.id,
      email: user.email ?? null,
      displayName,
      assignments,
      organisations,
    },
    client,
  };
}

export async function listAccessibleTrips(context: StaffSessionContext): Promise<DashboardTripSummary[]> {
  if (context.mode === "demo") {
    return [
      {
        id: demoTrip.id,
        organisationId: "00000000-0000-4000-8000-000000000001",
        organisationName: demoTrip.organisation,
        code: demoTrip.code,
        origin: demoTrip.origin,
        destination: demoTrip.destination,
        vehicle: demoTrip.vehicle,
        status: demoTrip.status,
        departure: demoTrip.departure,
      },
    ];
  }

  if (!context.isAuthenticated || !context.client) return [];

  const assignments = context.identity.assignments;
  const orgNameById = new Map(context.identity.organisations.map((org) => [org.id, org.name]));
  const organisationIds = [...new Set(assignments.map((assignment) => assignment.organisationId))];

  if (!organisationIds.length) return [];

  const { data, error } = await context.client
    .from("trips")
    .select("id, organisation_id, trip_code, origin, destination, vehicle_label, status, scheduled_departure")
    .in("organisation_id", organisationIds)
    .order("scheduled_departure", { ascending: false });

  if (error) throw new Error(`Supabase trips query failed: ${error.message}`);

  return (data ?? [])
    .filter((trip) => canReadTripsForOrganisation(assignments, trip.organisation_id))
    .map((trip) => ({
      id: trip.id,
      organisationId: trip.organisation_id,
      organisationName: orgNameById.get(trip.organisation_id) ?? "Assigned organisation",
      code: trip.trip_code,
      origin: trip.origin,
      destination: trip.destination,
      vehicle: trip.vehicle_label,
      status: formatStatus(trip.status),
      departure: new Date(trip.scheduled_departure).toLocaleString("en-NG", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
}

export async function listAccessibleIncidents(
  context: StaffSessionContext,
  trips: DashboardTripSummary[],
): Promise<DashboardIncidentSummary[]> {
  if (context.mode === "demo") {
    return demoIncidents.map((incident) => ({
      id: incident.id,
      tripId: incident.tripId,
      organisationId: "00000000-0000-4000-8000-000000000001",
      reference: incident.reference,
      title: incident.title,
      routingClass: incident.routingClass,
      responseState: incident.responseState,
    }));
  }

  if (!context.isAuthenticated || !context.client) return [];

  if (!trips.length) return [];

  const tripIds = trips.map((trip) => trip.id);
  const orgIdByTripId = new Map(trips.map((trip) => [trip.id, trip.organisationId]));

  const { data, error } = await context.client
    .from("incidents")
    .select("id, trip_id, reference, routing_class, response_state")
    .in("trip_id", tripIds)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Supabase incidents query failed: ${error.message}`);

  return (data ?? [])
    .map((incident) => {
      const organisationId = orgIdByTripId.get(incident.trip_id);
      if (!organisationId) return null;

      return {
        id: incident.id,
        tripId: incident.trip_id,
        organisationId,
        reference: incident.reference,
        title: titleForRoutingClass(incident.routing_class as RoutingClass),
        routingClass: incident.routing_class as RoutingClass,
        responseState: incident.response_state,
      };
    })
    .filter((incident): incident is DashboardIncidentSummary => Boolean(incident))
    .filter((incident) =>
      canReadIncidentForAssignments(context.identity.assignments, {
        organisationId: incident.organisationId,
        routingClass: incident.routingClass,
      }),
    );
}

export async function getAccessibleIncidentById(context: StaffSessionContext, incidentId: string) {
  if (context.mode === "demo") {
    return null;
  }

  if (!context.isAuthenticated || !context.client) return null;

  const { data: incident, error } = await context.client
    .from("incidents")
    .select("id, trip_id, reference, routing_class, response_state")
    .eq("id", incidentId)
    .maybeSingle();

  if (error) throw new Error(`Supabase incident detail query failed: ${error.message}`);
  if (!incident) return null;

  const { data: trip, error: tripError } = await context.client
    .from("trips")
    .select("id, trip_code, organisation_id, origin, destination, vehicle_label")
    .eq("id", incident.trip_id)
    .maybeSingle();

  if (tripError) throw new Error(`Supabase trip detail query failed: ${tripError.message}`);
  if (!trip) return null;

  const allowed = canReadIncidentForAssignments(context.identity.assignments, {
    organisationId: trip.organisation_id,
    routingClass: incident.routing_class as RoutingClass,
  });

  if (!allowed) return null;

  const organisationName =
    context.identity.organisations.find((organisation) => organisation.id === trip.organisation_id)?.name ??
    "Assigned organisation";

  return {
    id: incident.id,
    reference: incident.reference,
    routingClass: incident.routing_class as RoutingClass,
    responseState: incident.response_state,
    trip: {
      id: trip.id,
      code: trip.trip_code,
      origin: trip.origin,
      destination: trip.destination,
      vehicle: trip.vehicle_label,
      organisationName,
      organisationId: trip.organisation_id,
    },
  };
}
