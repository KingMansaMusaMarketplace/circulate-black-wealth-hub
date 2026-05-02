/**
 * Shared coordination layer for the 33 Kayla agents.
 *
 * Provides:
 *   - getBusinessContext / appendDecision: shared brain via kayla_business_context
 *   - logLearning: human-readable note for "What Kayla learned" feed
 *   - buildReasoning: produces a compact reasoning blob agents save
 *     alongside their output, so the UI can show "Why this?"
 */

export interface BusinessContext {
  goals: Array<{ text: string; created_at?: string }>;
  recent_decisions: Array<{ agent: string; summary: string; at: string }>;
  key_metrics: Record<string, number | string>;
  preferences: Record<string, unknown>;
  summary: string | null;
}

const EMPTY: BusinessContext = {
  goals: [],
  recent_decisions: [],
  key_metrics: {},
  preferences: {},
  summary: null,
};

export async function getBusinessContext(
  supabase: any,
  businessId: string,
): Promise<BusinessContext> {
  try {
    const { data } = await supabase
      .from("kayla_business_context")
      .select("goals, recent_decisions, key_metrics, preferences, summary")
      .eq("business_id", businessId)
      .maybeSingle();
    if (!data) return EMPTY;
    return {
      goals: (data.goals as any) || [],
      recent_decisions: (data.recent_decisions as any) || [],
      key_metrics: (data.key_metrics as any) || {},
      preferences: (data.preferences as any) || {},
      summary: data.summary ?? null,
    };
  } catch (e) {
    console.error("getBusinessContext failed:", e);
    return EMPTY;
  }
}

/** Format the shared context as a short prompt fragment for any agent. */
export function contextAsPromptFragment(ctx: BusinessContext): string {
  if (!ctx.summary && !ctx.goals.length && !ctx.recent_decisions.length) return "";
  const parts: string[] = ["\n[SHARED BUSINESS CONTEXT — use this so your decision is consistent with the rest of the team]"];
  if (ctx.summary) parts.push(`Summary: ${ctx.summary}`);
  if (ctx.goals.length) parts.push(`Goals: ${ctx.goals.slice(0, 5).map(g => g.text).join("; ")}`);
  if (Object.keys(ctx.key_metrics).length) {
    const m = Object.entries(ctx.key_metrics).slice(0, 6).map(([k, v]) => `${k}=${v}`).join(", ");
    parts.push(`Key metrics: ${m}`);
  }
  if (ctx.recent_decisions.length) {
    parts.push(
      "Recent team decisions:\n" +
      ctx.recent_decisions.slice(0, 6).map(d => `  - ${d.agent}: ${d.summary}`).join("\n"),
    );
  }
  return parts.join("\n");
}

/** Append a decision summary (last 20 kept) and bump key_metrics. */
export async function appendDecision(
  supabase: any,
  businessId: string,
  agent: string,
  summary: string,
  metricsPatch?: Record<string, number | string>,
): Promise<void> {
  try {
    const ctx = await getBusinessContext(supabase, businessId);
    const recent_decisions = [
      { agent, summary, at: new Date().toISOString() },
      ...ctx.recent_decisions,
    ].slice(0, 20);
    const key_metrics = { ...ctx.key_metrics, ...(metricsPatch || {}) };
    await supabase.from("kayla_business_context").upsert(
      { business_id: businessId, recent_decisions, key_metrics, last_updated_by: agent },
      { onConflict: "business_id" },
    );
  } catch (e) {
    console.error("appendDecision failed:", e);
  }
}

/** Visible learning note. */
export async function logLearning(
  supabase: any,
  businessId: string,
  agentName: string,
  learning: string,
  source = "agent_run",
  confidence = 0.6,
): Promise<void> {
  try {
    await supabase.from("kayla_learnings").insert({
      business_id: businessId,
      agent_name: agentName,
      learning,
      source,
      confidence,
      applied: true,
    });
  } catch (e) {
    console.error("logLearning failed:", e);
  }
}

export interface AgentReasoning {
  inputs: Array<{ label: string; value: string | number }>;
  rationale: string;
}

/**
 * Build a tiny reasoning blob agents return alongside their decision so
 * the UI can show "Why this?". Keep it short — 2-4 inputs + one sentence.
 */
export function buildReasoning(
  inputs: Array<{ label: string; value: string | number }>,
  rationale: string,
): AgentReasoning {
  return { inputs: inputs.slice(0, 4), rationale: rationale.slice(0, 280) };
}
