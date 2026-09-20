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

export function getWhatsAppAdapter(): WhatsAppAdapter {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) return simulatedWhatsApp;
  return {
    async send(to, body) {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
      const params = new URLSearchParams({ From: process.env.TWILIO_WHATSAPP_NUMBER!, To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`, Body: body });
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, { method: "POST", headers: { authorization: `Basic ${auth}`, "content-type": "application/x-www-form-urlencoded" }, body: params });
      if (!response.ok) throw new Error(`Twilio responded ${response.status}`);
      const result = await response.json() as { sid: string; status?: string };
      return { id: result.sid, status: "queued" };
    },
  };
}
