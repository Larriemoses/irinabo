import { createHmac, timingSafeEqual } from "node:crypto";

export function validateTwilioSignature(authToken: string, signature: string, url: string, params: Record<string, string>) {
  const payload = url + Object.keys(params).sort().map((key) => `${key}${params[key]}`).join("");
  const expected = createHmac("sha1", authToken).update(payload).digest("base64");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export interface WhatsAppAdapter { send(to: string, body: string): Promise<{ id: string; status: "queued" | "simulated" }> }

export const simulatedWhatsApp: WhatsAppAdapter = {
  async send() { return { id: `sim-${crypto.randomUUID()}`, status: "simulated" }; },
};
