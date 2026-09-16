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
