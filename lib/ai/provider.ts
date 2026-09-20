export interface AiSuggestion {
  detectedLanguage: string;
  summary: string;
  eventTypeSuggestion: "breakdown" | "delay" | "threat" | "other";
  injuryMentioned: boolean;
  sourceReportIds: string[];
  label: "AI_ASSISTED" | "RULE_BASED_FALLBACK";
}

export interface AiProvider { extract(text: string, reportId: string): Promise<AiSuggestion> }

export const fallbackAiProvider: AiProvider = {
  async extract(text, reportId) {
    const lower = text.toLowerCase();
    const eventTypeSuggestion = lower.includes("threat") ? "threat" : lower.includes("engine") || lower.includes("breakdown") ? "breakdown" : lower.includes("delay") ? "delay" : "other";
    return { detectedLanguage: "en", summary: text.slice(0, 180), eventTypeSuggestion, injuryMentioned: /injur|hurt|blood/.test(lower), sourceReportIds: [reportId], label: "RULE_BASED_FALLBACK" };
  },
};

export function getAiProvider(): AiProvider {
  if (!process.env.AI_API_KEY) return fallbackAiProvider;
  return openRouterProvider;
}

const openRouterProvider: AiProvider = {
  async extract(text, reportId) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${process.env.AI_API_KEY}` },
        body: JSON.stringify({
          model: process.env.AI_TEXT_MODEL || "openai/gpt-4o-mini",
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "Extract a transport incident report. Return JSON only with detectedLanguage, summary, eventTypeSuggestion (breakdown, delay, threat, other), and injuryMentioned boolean. Do not decide truth, urgency, routing, or access." },
            { role: "user", content: text.slice(0, 4000) },
          ],
        }),
      });
      if (!response.ok) throw new Error(`OpenRouter responded ${response.status}`);
      const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const content = body.choices?.[0]?.message?.content;
      if (!content) throw new Error("OpenRouter returned no content");
      const parsed = JSON.parse(content) as Partial<AiSuggestion>;
      const eventTypeSuggestion = ["breakdown", "delay", "threat", "other"].includes(parsed.eventTypeSuggestion ?? "") ? parsed.eventTypeSuggestion as AiSuggestion["eventTypeSuggestion"] : "other";
      return { detectedLanguage: parsed.detectedLanguage || "unknown", summary: String(parsed.summary || text.slice(0, 180)).slice(0, 500), eventTypeSuggestion, injuryMentioned: Boolean(parsed.injuryMentioned), sourceReportIds: [reportId], label: "AI_ASSISTED" };
    } catch {
      return fallbackAiProvider.extract(text, reportId);
    }
  },
};
