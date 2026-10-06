// Per-employee learning: each Agentic AI Employee reads its OWN past results
// (what owners approved, edited or rejected) before doing new work.
// Business-scoped first; falls back to platform-wide approved examples only
// when that business has no history yet. Never stores health details.

const POSITIVE = ["approved", "accepted", "applied", "sent", "published", "completed"];
const NEGATIVE = ["rejected", "dismissed", "declined", "ignored"];

/** Tables where an employee's drafts carry an owner decision in `status`. */
const STATUS_SOURCES: Record<string, { table: string; text: string; label: string }> = {
  "review-manager": { table: "kayla_review_drafts", text: "draft_response", label: "review reply" },
  "kayla-grant-matcher": { table: "kayla_grant_matches", text: "grant_name", label: "grant match" },
  "kayla-price-optimizer": { table: "kayla_price_recommendations", text: "reasoning", label: "price suggestion" },
};

const clip = (s: unknown, n = 280) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, n);
const HEALTH = /\b(diagnos|prescri|medication|symptom|patient|hiv|pregnan|therapy|mental health)\w*/i;

/**
 * Returns a short prompt block of this employee's own track record, or "".
 * Fail-open: any error returns "" so the employee still works.
 */
export async function agentLessons(
  supabase: any,
  agentKey: string,
  businessId?: string | null,
): Promise<string> {
  try {
    const good: string[] = [];
    const bad: string[] = [];

    // 1) Thumbs up/down + owner notes
    let q = supabase.from("ai_agent_feedback")
      .select("rating, feedback_text, decision_type, decision_payload, business_id")
      .eq("agent_name", agentKey).not("rating", "is", null)
      .order("created_at", { ascending: false }).limit(20);
    if (businessId) q = q.eq("business_id", businessId);
    const { data: fb } = await q;
    for (const r of fb || []) {
      const note = clip(r.feedback_text, 200);
      if (r.rating > 0) good.push(note ? `Owner liked: ${note}` : `Owner approved a ${r.decision_type}.`);
      else bad.push(note ? `Owner said: "${note}"` : `Owner rejected a ${r.decision_type}.`);
    }

    // 2) Drafts with an owner decision (approve / reject)
    const src = STATUS_SOURCES[agentKey];
    if (src) {
      const run = async (scoped: boolean) => {
        let s = supabase.from(src.table).select(`status, ${src.text}`)
          .in("status", [...POSITIVE, ...NEGATIVE]).order("created_at", { ascending: false }).limit(12);
        if (scoped && businessId) s = s.eq("business_id", businessId);
        const { data } = await s;
        return data || [];
      };
      let rows = await run(true);
      if (!rows.length && businessId) rows = (await run(false)).filter((r: any) => POSITIVE.includes(r.status));
      for (const r of rows) {
        const text = clip(r[src.text]);
        if (!text || HEALTH.test(text)) continue;
        (POSITIVE.includes(r.status) ? good : bad).push(`${src.label}: "${text}"`);
      }
    }

    if (!good.length && !bad.length) return "";
    const parts = ["\n[YOUR OWN TRACK RECORD — learn from what this owner approved and rejected]"];
    if (good.length) parts.push("Do more like these (approved):\n" + good.slice(0, 4).map((g) => `  - ${g}`).join("\n"));
    if (bad.length) parts.push("Avoid what went wrong here (rejected):\n" + bad.slice(0, 4).map((b) => `  - ${b}`).join("\n"));
    parts.push("Match the style of approved work. Never copy personal or health details.");
    return parts.join("\n");
  } catch (e) {
    console.warn("[agentLessons] skipped:", (e as Error).message);
    return "";
  }
}
