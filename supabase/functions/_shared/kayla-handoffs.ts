// Team handoffs: when one Agentic AI Employee's work points at a problem
// another employee solves, the work is passed along and Kayla answers once,
// naming who helped. Max 2 handoffs per question to keep cost bounded.

export interface TeamMember {
  id: string;
  name: string;
  triggers: string[];
  /** latest saved output for this business */
  table?: string;
  fields?: string[];
  filter?: Record<string, unknown>;
}

export const TEAM: TeamMember[] = [
  { id: "cashflow", name: "Cash-Flow Analyst", triggers: ["cash", "runway", "forecast", "burn", "revenue", "expenses", "money coming in", "profit"],
    table: "kayla_cashflow_forecasts", fields: ["forecast_period", "projected_revenue", "projected_expenses", "projected_net", "confidence_level", "ai_summary"] },
  { id: "grants", name: "Grant-Finder", triggers: ["grant", "funding", "capital", "free money"],
    table: "kayla_grant_matches", fields: ["grant_name", "grant_provider", "amount_min", "amount_max", "deadline", "grant_url", "match_score"] },
  { id: "credit", name: "Credit Readiness Coach", triggers: ["credit", "loan", "sba", "lender", "borrow"] },
  { id: "investor", name: "Investor Readiness", triggers: ["investor", "pitch", "raise", "valuation", "equity"],
    table: "kayla_investment_readiness", fields: ["overall_score", "strengths", "weaknesses", "ai_assessment"] },
  { id: "reviews", name: "Review Manager", triggers: ["review", "reputation", "rating", "complaint"],
    table: "kayla_review_drafts", fields: ["sentiment", "status", "draft_response"] },
  { id: "content", name: "Content Creator", triggers: ["post", "social", "instagram", "caption", "campaign", "marketing"],
    table: "kayla_social_posts" },
  { id: "compliance", name: "Compliance Officer", triggers: ["compliance", "license", "permit", "regulation", "deadline"],
    table: "kayla_compliance_reminders", fields: ["title", "due_date", "urgency", "description"], filter: { is_completed: false } },
  { id: "legal", name: "Legal Templates", triggers: ["contract", "nda", "legal", "agreement", "terms"],
    table: "kayla_legal_templates" },
  { id: "pricing", name: "Pricing Optimizer", triggers: ["price", "pricing", "discount", "margin", "charge"],
    table: "kayla_price_recommendations", fields: ["product_or_service", "current_price", "recommended_price", "confidence_score", "reasoning"] },
  { id: "inventory", name: "Inventory Manager", triggers: ["inventory", "stock", "sku", "reorder", "supplies"],
    table: "kayla_inventory_items", fields: ["item_name", "current_stock", "min_stock_level", "reorder_recommended"] },
  { id: "tax-risk", name: "Tax Risk Strategist", triggers: ["audit", "tax exposure", "nexus", "irs"] },
  { id: "tax", name: "Tax Preparer", triggers: ["tax", "deduction", "1099", "quarterly"],
    table: "kayla_tax_prep", fields: ["tax_year", "estimated_tax_liability", "deductions_found", "filing_deadline", "ai_summary"] },
];

/** who passes work to whom, and why */
export const HANDOFFS: Array<{ from: string; to: string; why: string }> = [
  { from: "cashflow", to: "grants", why: "a cash gap may be covered by a grant" },
  { from: "cashflow", to: "credit", why: "a cash gap may need a loan, so credit readiness matters" },
  { from: "reviews", to: "content", why: "strong reviews become marketing posts; weak ones need a response plan" },
  { from: "compliance", to: "legal", why: "compliance needs often require a contract or policy template" },
  { from: "pricing", to: "inventory", why: "a price change affects how fast stock sells" },
  { from: "tax-risk", to: "tax", why: "tax risks must be reflected in the tax prep" },
];

const byId = (id: string) => TEAM.find((t) => t.id === id)!;
const clip = (s: unknown, n = 220) =>
  (typeof s === "string" ? s : JSON.stringify(s ?? "")).replace(/\s+/g, " ").trim().slice(0, n);

/** Pick the lead employees for a question plus at most 2 handoff partners. */
export function planTeam(question: string): { leads: TeamMember[]; handoffs: Array<{ from: TeamMember; to: TeamMember; why: string }> } {
  const m = question.toLowerCase();
  const leads = TEAM.filter((t) => t.triggers.some((w) => m.includes(w))).slice(0, 3);
  const leadIds = new Set(leads.map((l) => l.id));
  const handoffs = HANDOFFS
    .filter((h) => leadIds.has(h.from) && !leadIds.has(h.to))
    .slice(0, 2)
    .map((h) => ({ from: byId(h.from), to: byId(h.to), why: h.why }));
  return { leads, handoffs };
}

async function latest(supabase: any, t: TeamMember, businessId: string): Promise<string> {
  if (!t.table) return "";
  try {
    let q = supabase.from(t.table).select(t.fields ? t.fields.join(",") : "*")
      .eq("business_id", businessId).order("created_at", { ascending: false }).limit(3);
    for (const [k, v] of Object.entries(t.filter || {})) q = q.eq(k, v);
    const { data } = await q;
    if (!data?.length) return "";
    return data.map((row: any) => {
      const r = { ...row };
      delete r.id; delete r.business_id; delete r.created_at; delete r.updated_at;
      return "    • " + clip(r, 260);
    }).join("\n");
  } catch {
    return "";
  }
}

/**
 * Builds a TEAM BRIEFING block for Kayla's chat. Empty when no employee is
 * relevant. Includes each involved employee's latest saved work for the
 * owner's business so Kayla can give ONE combined answer.
 */
export async function buildTeamBriefing(
  supabase: any,
  question: string,
  businessId: string | null,
): Promise<{ block: string; team: string[]; handoffs: string[] }> {
  const { leads, handoffs } = planTeam(question);
  if (!leads.length) return { block: "", team: [], handoffs: [] };
  const members = [...leads, ...handoffs.map((h) => h.to)];
  const lines = ["\n[TEAM BRIEFING — your Agentic AI Employees worked on this question]"];
  for (const t of members) {
    const work = businessId ? await latest(supabase, t, businessId) : "";
    lines.push(`- ${t.name}: ${work ? "latest work for this owner's business:\n" + work : "no saved work for this business yet."}`);
  }
  for (const h of handoffs) lines.push(`- HANDOFF: ${h.from.name} → ${h.to.name} because ${h.why}.`);
  lines.push(
    "Give the owner ONE combined answer. Connect the employees' findings (e.g. if cash is short, name the matching grants). " +
    "End with a single line: \"Team on this: <names>\". Only use numbers shown above or in live lookups; if an employee has no saved work, say they can run it from the owner dashboard instead of inventing results.",
  );
  return {
    block: lines.join("\n"),
    team: members.map((m) => m.name),
    handoffs: handoffs.map((h) => `${h.from.name} → ${h.to.name}`),
  };
}

/** Log a handoff so the scoreboard can show teamwork. Fail-open. */
export async function logHandoff(
  supabase: any,
  row: { business_id?: string | null; from_agent: string; to_agent: string; reason: string; channel: string; status?: string },
) {
  try {
    await supabase.from("kayla_agent_handoffs").insert({ status: "done", ...row });
  } catch { /* non-fatal */ }
}
