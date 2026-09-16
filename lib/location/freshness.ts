export type Freshness = "ACTIVE" | "DELAYED" | "STALE" | "PAUSED" | "ENDED";

export function locationFreshness(receivedAt: string, now = new Date(), stopped: "PAUSED" | "ENDED" | null = null): Freshness {
  if (stopped) return stopped;
  const age = now.getTime() - new Date(receivedAt).getTime();
  if (age <= 90_000) return "ACTIVE";
  if (age <= 300_000) return "DELAYED";
  return "STALE";
}

export function haversineMetres(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const rad = (value: number) => (value * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
