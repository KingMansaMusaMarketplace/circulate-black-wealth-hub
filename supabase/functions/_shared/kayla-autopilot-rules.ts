// Kayla Autopilot rules (pure, no network).
//
// The autopilot runs Kayla's scoreboard on its own and may keep a fix only
// after proving it helps. Every limit the owner approved lives here so it is
// tested in one place:
//   - 12 rotating questions each day, all questions every Sunday night
//   - a fix is kept only when the failed question now passes AND no other
//     question gets worse
//   - topics about 1325 Clinical, prices/money, legal or patents, and any fix
//     that adds new facts always wait for the owner's approval
//   - at most 3 automatic fixes in any 7 days

export const PASS_SCORE = 85;
export const ALERT_AVERAGE = 90;
export const DAILY_QUESTIONS = 12;
export const SAFEGUARD_QUESTIONS = 10;
export const MAX_AUTO_FIXES_PER_WEEK = 3;
export const STUCK_AFTER_MS = 3 * 60 * 60 * 1000;

// Chicago is UTC-6 in winter, UTC-5 in summer. The schedule ticks at
// 03,11,12,13,14,15 UTC. The full test starts on the Monday 03:00 UTC tick
// (Sunday evening in Chicago); the daily check starts from 11:00 UTC (early
// morning in Chicago). Monday has no separate daily check because the full
// test already covered every question a few hours earlier.
export function decideStart(
  now: Date,
  state: { last_daily_on: string | null; last_weekly_on: string | null },
): "weekly" | "daily" | null {
  const today = now.toISOString().slice(0, 10);
  const hour = now.getUTCHours();
  const isMonday = now.getUTCDay() === 1;
  if (isMonday && hour >= 3 && hour < 11 && state.last_weekly_on !== today) return "weekly";
  if (isMonday) return null;
  if (hour >= 11 && hour < 18 && state.last_daily_on !== today) return "daily";
  return null;
}

export function dayNumber(now: Date): number {
  return Math.floor(now.getTime() / 86_400_000);
}

// Rotates through every question: day N takes the next 12 after day N-1.
export function pickDailyCaseIds(sortedIds: string[], day: number, count = DAILY_QUESTIONS): string[] {
  const n = sortedIds.length;
  if (n <= count) return [...sortedIds];
  const start = ((day * count) % n + n) % n;
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(sortedIds[(start + i) % n]);
  return out;
}

const PROTECTED: { label: string; re: RegExp }[] = [
  { label: "1325 Clinical / healthcare", re: /\b(clinical|clinic|clinics|doctor|doctors|physician|nurse|patient|patients|medical|medicine|health ?care|hipaa|ehr|emr|diagnos\w*|prescri\w*|fhir)\b/i },
  { label: "prices or money", re: /(\$|\b(price|prices|pricing|cost|costs|fee|fees|subscription|tier|tiers|money|payment|payments|pay|refund|revenue|invest\w*|valuation|equity|loan|loans|tax|taxes|credit|savings|commission|wallet)\b)/i },
  { label: "legal", re: /\b(legal|law|laws|lawyer|attorney|contract|contracts|terms|liability|compliance|lawsuit|regulation\w*)\b/i },
  { label: "patent", re: /\b(patent\w*|uspto|trademark\w*|intellectual property)\b/i },
];

export function protectedTopic(input: { category?: string | null; question: string; rule?: string }): string | null {
  if ((input.category || "").toLowerCase() === "clinical") return "1325 Clinical / healthcare";
  const text = `${input.question}\n${input.rule || ""}`;
  for (const p of PROTECTED) if (p.re.test(text)) return p.label;
  return null;
}

// A fix should be an instruction ("check the live directory before naming a
// business"), not a new fact. Numbers, money, percentages, links or quoted
// names count as new facts and always wait for the owner.
export function addsNewFacts(rule: string, modelSaysNewFacts = false): boolean {
  if (modelSaysNewFacts) return true;
  return /\d|\$|%|https?:\/\/|www\.|"[^"]{3,}"|“[^”]{3,}”/.test(rule);
}

export interface TrialInput {
  targetBefore: number;
  targetAfter: number | null;
  safeguards: { before: number; after: number | null }[];
}

export function decideTrial(t: TrialInput): { keep: boolean; reason: string } {
  if (t.targetAfter === null) return { keep: false, reason: "The failed question was not re-tested." };
  if (t.targetAfter < PASS_SCORE) {
    return { keep: false, reason: `The failed question still did not pass (${t.targetAfter}/100).` };
  }
  if (t.targetAfter <= t.targetBefore) {
    return { keep: false, reason: "The failed question did not improve." };
  }
  if (t.safeguards.length === 0) return { keep: false, reason: "No other questions were re-checked." };
  if (t.safeguards.some((s) => s.after === null)) {
    return { keep: false, reason: "Not every re-check question finished." };
  }
  for (const s of t.safeguards) {
    const after = s.after as number;
    if (s.before >= PASS_SCORE && after < PASS_SCORE) {
      return { keep: false, reason: `A question that used to pass now fails (${s.before} → ${after}).` };
    }
    if (s.before - after > 10) {
      return { keep: false, reason: `Another question got noticeably worse (${s.before} → ${after}).` };
    }
  }
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const before = avg(t.safeguards.map((s) => s.before));
  const after = avg(t.safeguards.map((s) => s.after as number));
  if (after < before - 3) {
    return { keep: false, reason: `The other questions averaged lower (${Math.round(before)} → ${Math.round(after)}).` };
  }
  return { keep: true, reason: `Fixed: ${t.targetBefore} → ${t.targetAfter}; ${t.safeguards.length} other questions held steady.` };
}

export function canAutoApply(autoAppliedTimes: (string | null)[], now: Date): boolean {
  const since = now.getTime() - 7 * 86_400_000;
  const recent = autoAppliedTimes.filter((t) => t && new Date(t).getTime() >= since).length;
  return recent < MAX_AUTO_FIXES_PER_WEEK;
}

// Lovable AI stops: workspace credits (402) or access (403) pause the
// autopilot until the owner resumes it; rate limits (429) just skip to the
// next scheduled run.
export function gatewayStop(texts: string[]): "paused" | "rate_limited" | null {
  const joined = texts.join("\n");
  if (/\b(gateway|grader)\s+(402|403)\b/.test(joined)) return "paused";
  if (/\b(gateway|grader)\s+429\b/.test(joined)) return "rate_limited";
  return null;
}

// A kept fix is switched off when the question it fixed fails again.
export function fixesToDisable(
  kept: { id: string; source_case_id: string | null }[],
  scoresByCase: Map<string, number>,
): string[] {
  return kept
    .filter((k) => k.source_case_id && scoresByCase.has(k.source_case_id) && (scoresByCase.get(k.source_case_id) as number) < PASS_SCORE)
    .map((k) => k.id);
}

// Re-check set for a trial: up to 10 passing questions, at least two from
// 1325 Clinical when available (kept fixes reach the doctor guide too).
export function pickSafeguards(
  passing: { case_id: string; category: string | null; score: number }[],
  excludeCaseId: string,
  day: number,
  count = SAFEGUARD_QUESTIONS,
): { case_id: string; score: number }[] {
  const pool = passing.filter((p) => p.case_id !== excludeCaseId && p.score >= PASS_SCORE)
    .sort((a, b) => a.case_id.localeCompare(b.case_id));
  const clinical = pool.filter((p) => (p.category || "") === "clinical");
  const other = pool.filter((p) => (p.category || "") !== "clinical");
  const rotate = <T,>(xs: T[], k: number) => xs.length ? xs.map((_, i) => xs[(i + day * k) % xs.length]) : xs;
  const clinicalOrder = rotate(clinical, 2);
  const otherOrder = rotate(other, count);
  const picked = [...clinicalOrder.slice(0, 2), ...otherOrder];
  // Not enough other questions? Top up with the remaining Clinical ones.
  picked.push(...clinicalOrder.slice(2));
  return picked.slice(0, count).map(({ case_id, score }) => ({ case_id, score }));
}
