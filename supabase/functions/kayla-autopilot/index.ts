// Kayla Autopilot.
//
// Runs Kayla's scoreboard on its own (12 rotating questions each morning, all
// questions Sunday night), tries ONE fix for a failed question, and keeps it
// only after a proof re-test shows the failed question now passes and nothing
// else got worse. Clinical, money, legal and patent topics, and any fix that
// adds new facts, always wait for the owner. Every rule and limit lives in
// _shared/kayla-autopilot-rules.ts (tested).
//
// Callers: the scheduled job (x-cron-secret) runs "tick". Admins can also call
// "status", "pause", "resume", "undo" and "tick".
//
// Safety rails (background-job rules): single-flight lease in
// kayla_autopilot_state; each finished run is claimed once
// (autopilot_processed_at); at most one fix trial and two drafted fixes per
// processed run; Lovable AI 402/403 pauses until an admin resumes, 429 waits
// for the next scheduled tick; the pause is checked before any AI call.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchAIWithRetry } from "../_shared/kayla-brain.ts";
import { escapeHtml, requireAdminOrCron } from "../_shared/auth-guard.ts";
import * as R from "../_shared/kayla-autopilot-rules.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};
const RESPONSES = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";
const SCOREBOARD_URL = "https://1325.ai/admin/kayla-scoreboard";
const MAX_DRAFTS_PER_RUN = 2;
const LEASE_MS = 10 * 60 * 1000;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

type Db = any;

async function readStream(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let out = "", buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += value;
    const lines = buf.split("\n");
    buf = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const p = line.slice(5).trim();
      if (!p || p === "[DONE]") continue;
      try {
        const e = JSON.parse(p);
        if (e.type === "response.output_text.delta" && typeof e.delta === "string") out += e.delta;
      } catch { /* partial line */ }
    }
  }
  return out;
}

const DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagnosis: { type: "string", description: "One or two plain-English sentences on why the answer scored low." },
    proposed_rule: { type: "string", description: "One short general instruction (max 2 sentences) that prevents this kind of mistake. An instruction about HOW to answer, never a new fact, number, price, name or link." },
    adds_new_facts: { type: "boolean", description: "True if the rule states any fact, number, price, name, date or link rather than only an instruction." },
  },
  required: ["diagnosis", "proposed_rule", "adds_new_facts"],
};

type Draft = { diagnosis: string; rule: string; newFacts: boolean } | { stop: "paused" | "rate_limited" } | null;

async function draftFix(key: string, q: { question: string; answer: string; score: number; notes: string; expected: string }): Promise<Draft> {
  const prompt = `Kayla (the 1325.AI assistant) gave a weak answer on her test scoreboard. Diagnose it and propose ONE short, general instruction that would prevent this kind of mistake. Never propose inventing facts, prices or numbers; the rule must be about how to answer, not new information.

QUESTION: ${q.question}
${q.expected}
KAYLA'S ANSWER: ${q.answer.slice(0, 3000)}
SCORE: ${q.score}/100
GRADER NOTES: ${q.notes.slice(0, 1500)}`;
  const res = await fetchAIWithRetry(RESPONSES, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model: MODEL,
      input: [{ role: "user", content: prompt }],
      stream: true,
      store: false,
      reasoning: { effort: "low" },
      text: { format: { type: "json_schema", name: "autopilot_fix", strict: true, schema: DRAFT_SCHEMA } },
    }),
  }, { attempts: 2, label: "kayla-autopilot" });
  if (res.status === 402 || res.status === 403) return { stop: "paused" };
  if (res.status === 429) return { stop: "rate_limited" };
  if (!res.ok) { console.warn("draft failed", res.status); return null; }
  try {
    const parsed = JSON.parse((await readStream(res)) || "{}");
    const rule = String(parsed.proposed_rule || "").trim().slice(0, 600);
    if (!rule) return null;
    return { diagnosis: String(parsed.diagnosis || "").slice(0, 1000), rule, newFacts: parsed.adds_new_facts === true };
  } catch {
    return null;
  }
}

async function recipients(db: Db): Promise<string[]> {
  const env = Deno.env.get("ADMIN_EMAIL");
  if (env) return [env];
  const { data } = await db.from("admin_notification_preferences").select("notification_email").limit(1).maybeSingle();
  return data?.notification_email ? [data.notification_email] : [];
}

async function sendAlert(db: Db, subject: string, lines: string[]): Promise<string | null> {
  const key = Deno.env.get("RESEND_API_KEY");
  const to = await recipients(db);
  if (!key || !to.length || !lines.length) return null;
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#111">
<h2 style="color:#003366;margin-bottom:4px">Kayla Autopilot</h2>
<p style="color:#555;margin-top:0">Daily scoreboard check for 1325.AI</p>
<ul style="line-height:1.6">${lines.map((l) => `<li>${l}</li>`).join("")}</ul>
<p><a href="${SCOREBOARD_URL}" style="display:inline-block;background:#FFB300;color:#000;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold">Open the scoreboard (undo any fix there)</a></p>
<p style="color:#777;font-size:12px">Clinical, money, legal and patent fixes, and any fix that adds new facts, always wait for your approval. At most ${R.MAX_AUTO_FIXES_PER_WEEK} automatic fixes in any 7 days.</p></div>`;
  const text = lines.map((l) => `- ${l.replace(/<[^>]+>/g, "")}`).join("\n") + `\n\nScoreboard: ${SCOREBOARD_URL}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "1325.AI Admin <admin@1325.ai>", to, subject, html, text }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body?.id) { console.warn("alert email not accepted", res.status); return null; }
    return String(body.id);
  } catch (e) {
    console.warn("alert email failed", e);
    return null;
  }
}

async function finalizeRun(db: Db, runId: string, note: string) {
  const { data } = await db.from("kayla_benchmark_results").select("score, accuracy, grounding").eq("run_id", runId);
  const rows = (data || []) as any[];
  const avg = (k: string) => rows.length ? Math.round(rows.reduce((s, r) => s + (Number(r[k]) || 0), 0) / rows.length) : null;
  const passed = rows.filter((r) => (r.score ?? 0) >= R.PASS_SCORE).length;
  await db.from("kayla_benchmark_runs").update({
    finished_at: new Date().toISOString(),
    average_score: avg("score"), accuracy_score: avg("accuracy"), grounding_score: avg("grounding"),
    passed, failed: rows.length - passed, notes: note,
  }).eq("id", runId).is("finished_at", null);
  return rows.length;
}

// Latest score per question from ordinary (non-trial) runs before a moment.
async function latestScores(db: Db, beforeIso: string): Promise<Map<string, number>> {
  const since = new Date(new Date(beforeIso).getTime() - 21 * 86_400_000).toISOString();
  const { data: runs } = await db.from("kayla_benchmark_runs").select("id")
    .neq("kind", "trial").not("finished_at", "is", null)
    .gte("started_at", since).lt("started_at", beforeIso).order("started_at", { ascending: false }).limit(40);
  const ids = (runs || []).map((r: any) => r.id);
  const out = new Map<string, number>();
  if (!ids.length) return out;
  const { data: rows } = await db.from("kayla_benchmark_results").select("case_id, score, created_at")
    .in("run_id", ids).not("case_id", "is", null).order("created_at", { ascending: false }).limit(3000);
  for (const r of rows || []) if (!out.has(r.case_id)) out.set(r.case_id, Number(r.score) || 0);
  return out;
}

async function startBenchmark(body: Record<string, unknown>): Promise<{ ok: boolean; run_id?: string; error?: string }> {
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  try {
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/kayla-benchmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}`, "x-internal-continue": serviceKey },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.run_id) return { ok: false, error: data?.error || `scoreboard ${res.status}` };
    return { ok: true, run_id: data.run_id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

const short = (s: string, n = 90) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

async function pause(db: Db, reason: string) {
  await db.from("kayla_autopilot_state").update({ paused_reason: reason, paused_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", 1);
}

const CREDIT_PAUSE = "Lovable AI stopped the check (out of AI credits, workspace AI limit reached, or access blocked). Resume from the scoreboard once that is sorted.";

interface Ctx { db: Db; key: string; now: Date; alerts: string[]; paused: boolean; startedTrial: boolean }

async function evaluateTrial(ctx: Ctx, run: any, results: any[]) {
  const { db, now } = ctx;
  const { data: p } = await db.from("kayla_improvement_proposals").select("*").eq("id", run.trial_proposal_id).maybeSingle();
  if (!p) return;
  const baseline = await latestScores(db, run.started_at);
  const target = results.find((r) => r.case_id === p.source_case_id);
  const safeguards = results.filter((r) => r.case_id !== p.source_case_id).map((r) => ({
    before: baseline.get(r.case_id) ?? R.PASS_SCORE, after: r.score ?? null,
  }));
  // Every planned question must have an answer.
  const planned = (run.case_ids || []) as string[];
  const answered = new Set(results.map((r) => r.case_id));
  for (const id of planned) if (id !== p.source_case_id && !answered.has(id)) safeguards.push({ before: baseline.get(id) ?? R.PASS_SCORE, after: null });

  const d = R.decideTrial({ targetBefore: p.score ?? 0, targetAfter: target ? target.score ?? null : null, safeguards });
  const q = escapeHtml(short(p.question));
  const rule = escapeHtml(p.proposed_rule);

  if (p.status !== "pending") {
    await db.from("kayla_improvement_proposals").update({ autopilot_note: `Proof re-test: ${d.reason} (You had already ${p.status} it.)` }).eq("id", p.id);
    return;
  }
  if (d.keep) {
    const { data: recent } = await db.from("kayla_improvement_proposals").select("auto_applied_at")
      .eq("auto_applied", true).gte("auto_applied_at", new Date(now.getTime() - 7 * 86_400_000).toISOString());
    if (!R.canAutoApply((recent || []).map((r: any) => r.auto_applied_at), now)) {
      await db.from("kayla_improvement_proposals").update({
        autopilot_status: "needs_approval",
        autopilot_note: `Passed the proof re-test (${d.reason}) but ${R.MAX_AUTO_FIXES_PER_WEEK} automatic fixes already went live this week, so it waits for you.`,
      }).eq("id", p.id).eq("status", "pending");
      ctx.alerts.push(`Fix for “${q}” passed its proof but the weekly limit is reached — <b>waiting for your approval</b>: “${rule}”`);
      return;
    }
    const { data: kept } = await db.from("kayla_improvement_proposals").update({
      status: "approved", reviewed_at: now.toISOString(), auto_applied: true, auto_applied_at: now.toISOString(),
      autopilot_status: "kept", autopilot_note: d.reason,
    }).eq("id", p.id).eq("status", "pending").select("id");
    if (kept?.length) ctx.alerts.push(`<b>Kept a fix</b> for “${q}”: “${rule}”. Proof: ${escapeHtml(d.reason)} You can undo it on the scoreboard.`);
  } else {
    await db.from("kayla_improvement_proposals").update({
      status: "rejected", reviewed_at: now.toISOString(), autopilot_status: "discarded", autopilot_note: d.reason,
    }).eq("id", p.id).eq("status", "pending");
    ctx.alerts.push(`Tried a fix for “${q}” and <b>threw it away</b>: ${escapeHtml(d.reason)} Nothing changed for Kayla.`);
  }
}

async function reviewCheck(ctx: Ctx, run: any, results: any[]) {
  const { db, key, now } = ctx;
  const scores = new Map<string, number>(results.filter((r) => r.case_id).map((r) => [r.case_id, Number(r.score) || 0]));

  // 1. Switch off kept fixes whose question fails again.
  const { data: keptFixes } = await db.from("kayla_improvement_proposals").select("id, source_case_id, question, proposed_rule")
    .eq("auto_applied", true).eq("status", "approved").limit(50);
  for (const id of R.fixesToDisable(keptFixes || [], scores)) {
    const f = (keptFixes || []).find((k: any) => k.id === id);
    const { data: off } = await db.from("kayla_improvement_proposals").update({
      status: "rejected", reviewed_at: now.toISOString(), autopilot_status: "disabled",
      autopilot_note: `Switched off automatically on ${now.toISOString().slice(0, 10)}: the question it fixed failed again.`,
    }).eq("id", id).eq("status", "approved").select("id");
    if (off?.length) ctx.alerts.push(`<b>Switched off</b> an automatic fix because “${escapeHtml(short(f?.question || ""))}” failed again.`);
  }

  // 2. Report failures or a low score.
  const failed = results.filter((r) => (r.score ?? 0) < R.PASS_SCORE).sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
  const avg = Number(run.average_score) || 0;
  const label = run.kind === "weekly" ? "Weekly full test" : "Daily check";
  if (failed.length || avg < R.ALERT_AVERAGE) {
    ctx.alerts.push(`${label}: score <b>${avg}/100</b>, ${run.passed ?? 0} of ${results.length} questions passed.`);
    for (const f of failed.slice(0, 5)) ctx.alerts.push(`Needs work (${f.score}/100): “${escapeHtml(short(f.question))}”`);
  }
  if (!failed.length) return;

  // 3. Try at most one fix, drafting at most two.
  const { data: caseRows } = await db.from("kayla_benchmark_cases").select("id, category, expected_facts, must_not_say").eq("is_active", true);
  const caseById = new Map((caseRows || []).map((c: any) => [c.id, c]));
  const { data: recentAuto } = await db.from("kayla_improvement_proposals").select("source_case_id, source_result_id, auto_applied_at, auto_applied")
    .eq("origin", "autopilot").gte("created_at", new Date(now.getTime() - 7 * 86_400_000).toISOString());
  const triedCases = new Set((recentAuto || []).map((r: any) => r.source_case_id));
  const resultIds = failed.map((f) => f.id);
  const { data: existing } = await db.from("kayla_improvement_proposals").select("source_result_id").in("source_result_id", resultIds);
  const hasProposal = new Set((existing || []).map((e: any) => e.source_result_id));
  const autoTimes = (recentAuto || []).filter((r: any) => r.auto_applied).map((r: any) => r.auto_applied_at);

  let drafts = 0;
  for (const f of failed) {
    if (drafts >= MAX_DRAFTS_PER_RUN || ctx.startedTrial || ctx.paused) break;
    if (!f.case_id || hasProposal.has(f.id) || triedCases.has(f.case_id)) continue;
    const c: any = caseById.get(f.case_id);
    if (!c) continue;
    drafts++;
    const draft = await draftFix(key, {
      question: f.question, answer: f.answer || "", score: f.score ?? 0, notes: f.grader_notes || "",
      expected: `Expected facts: ${c.expected_facts}\nMust not say: ${c.must_not_say || "(none)"}`,
    });
    if (draft && "stop" in draft) {
      if (draft.stop === "paused") { await pause(db, CREDIT_PAUSE); ctx.paused = true; ctx.alerts.push(`<b>Autopilot paused</b>: ${CREDIT_PAUSE}`); }
      break;
    }
    if (!draft) continue;
    const topic = R.protectedTopic({ category: c.category, question: f.question, rule: draft.rule });
    const newFacts = R.addsNewFacts(draft.rule, draft.newFacts);
    const base = {
      origin: "autopilot", source_result_id: f.id, source_case_id: f.case_id, run_id: run.id, question: f.question,
      weak_answer: (f.answer || "").slice(0, 4000), score: f.score, grader_notes: f.grader_notes,
      diagnosis: draft.diagnosis, proposed_rule: draft.rule,
    };
    const waitReason = topic ? `It is about ${topic}, which always waits for you.`
      : newFacts ? "It adds new facts, which always wait for you."
      : !R.canAutoApply(autoTimes, now) ? `${R.MAX_AUTO_FIXES_PER_WEEK} automatic fixes already went live this week.`
      : null;
    if (waitReason) {
      const { error } = await db.from("kayla_improvement_proposals").insert({ ...base, autopilot_status: "needs_approval", autopilot_note: waitReason });
      if (!error) ctx.alerts.push(`Suggested fix for “${escapeHtml(short(f.question))}” is <b>waiting for your approval</b>. ${escapeHtml(waitReason)}`);
      continue;
    }
    const { data: prop, error } = await db.from("kayla_improvement_proposals")
      .insert({ ...base, autopilot_status: "trialing", autopilot_note: "Proof re-test running." }).select("id").single();
    if (error || !prop) continue;

    const latest = await latestScores(db, now.toISOString());
    const passing = [...latest.entries()].filter(([id]) => caseById.has(id))
      .map(([id, score]) => ({ case_id: id, score, category: (caseById.get(id) as any)?.category ?? null }));
    const guards = R.pickSafeguards(passing, f.case_id, R.dayNumber(now));
    const started = await startBenchmark({
      kind: "trial", trial_rule: draft.rule, trial_proposal_id: prop.id,
      case_ids: [f.case_id, ...guards.map((g) => g.case_id)],
      label: `Fix trial (autopilot): ${short(f.question, 50)}`,
    });
    if (!started.ok) {
      await db.from("kayla_improvement_proposals").update({ autopilot_status: "needs_approval", autopilot_note: `Proof re-test could not start (${started.error}); waiting for you.` }).eq("id", prop.id);
      continue;
    }
    await db.from("kayla_improvement_proposals").update({ trial_run_id: started.run_id }).eq("id", prop.id);
    ctx.startedTrial = true;
    ctx.alerts.push(`Testing a fix for “${escapeHtml(short(f.question))}”: “${escapeHtml(draft.rule)}”. It goes live only if the proof re-test passes.`);
  }
}

async function processRun(ctx: Ctx, run: any) {
  const { db } = ctx;
  // Claim the run once so a second tick never processes it again.
  const { data: claimed } = await db.from("kayla_benchmark_runs").update({ autopilot_processed_at: ctx.now.toISOString() })
    .eq("id", run.id).is("autopilot_processed_at", null).select("id");
  if (!claimed?.length) return;
  const { data: results } = await db.from("kayla_benchmark_results")
    .select("id, case_id, question, answer, score, grader_notes").eq("run_id", run.id);
  const rows = (results || []) as any[];
  const stop = R.gatewayStop(rows.map((r) => `${r.answer || ""}\n${r.grader_notes || ""}`));
  if (stop) {
    if (run.kind === "trial" && run.trial_proposal_id) {
      await db.from("kayla_improvement_proposals").update({ autopilot_status: "needs_approval", autopilot_note: "Proof re-test was interrupted by Lovable AI limits; waiting for you." })
        .eq("id", run.trial_proposal_id).eq("status", "pending");
    }
    if (stop === "paused") {
      await pause(db, CREDIT_PAUSE);
      ctx.paused = true;
      ctx.alerts.push(`<b>Autopilot paused</b>: ${CREDIT_PAUSE}`);
    }
    return;
  }
  if (run.kind === "trial") await evaluateTrial(ctx, run, rows);
  else await reviewCheck(ctx, run, rows);
}

async function startCheck(ctx: Ctx, kind: "daily" | "weekly", state: any): Promise<string> {
  const { db, now } = ctx;
  const today = now.toISOString().slice(0, 10);
  let caseIds: string[] | undefined;
  if (kind === "daily") {
    const { data: cases } = await db.from("kayla_benchmark_cases").select("id").eq("is_active", true).order("id");
    const ids = (cases || []).map((c: any) => c.id as string);
    if (!ids.length) return "no questions set up";
    const pick = R.pickDailyCaseIds(ids, R.dayNumber(now));
    // Also re-check questions fixed automatically in the last 14 days.
    const { data: kept } = await db.from("kayla_improvement_proposals").select("source_case_id")
      .eq("auto_applied", true).eq("status", "approved")
      .gte("auto_applied_at", new Date(now.getTime() - 14 * 86_400_000).toISOString()).limit(3);
    for (const k of kept || []) if (k.source_case_id && ids.includes(k.source_case_id) && !pick.includes(k.source_case_id)) pick.push(k.source_case_id);
    caseIds = pick;
  }
  const started = await startBenchmark({
    kind, case_ids: caseIds,
    label: `${kind === "weekly" ? "Weekly full test" : "Daily check"} (autopilot) ${today}`,
  });
  if (!started.ok) return `could not start ${kind} check: ${started.error}`;
  await db.from("kayla_autopilot_state").update(kind === "weekly" ? { last_weekly_on: today } : { last_daily_on: today }).eq("id", 1);
  void state;
  return `started ${kind} check`;
}

async function tick(db: Db, key: string): Promise<Record<string, unknown>> {
  const now = new Date();
  const { data: state } = await db.from("kayla_autopilot_state").select("*").eq("id", 1).maybeSingle();
  if (!state) return { skipped: "autopilot is not set up" };
  if (!state.enabled) return { skipped: "turned off by an admin" };
  if (state.paused_reason) return { skipped: "paused", reason: state.paused_reason };

  const { data: lease } = await db.from("kayla_autopilot_state")
    .update({ lease_until: new Date(now.getTime() + LEASE_MS).toISOString(), last_tick_at: now.toISOString() })
    .eq("id", 1).or(`lease_until.is.null,lease_until.lt.${now.toISOString()}`).select("id");
  if (!lease?.length) return { skipped: "another check is already running" };

  const ctx: Ctx = { db, key, now, alerts: [], paused: false, startedTrial: false };
  const notes: string[] = [];
  try {
    // Stuck-run guard: close anything unfinished for over 3 hours.
    const { data: stuck } = await db.from("kayla_benchmark_runs").select("id, run_label, kind")
      .is("finished_at", null).lt("started_at", new Date(now.getTime() - R.STUCK_AFTER_MS).toISOString()).limit(10);
    for (const s of stuck || []) {
      const graded = await finalizeRun(db, s.id, "Closed automatically: it was still unfinished after 3 hours.");
      if (s.kind === "trial") {
        await db.from("kayla_improvement_proposals").update({ autopilot_status: "needs_approval", autopilot_note: "Proof re-test got stuck; waiting for you." })
          .eq("trial_run_id", s.id).eq("status", "pending");
      }
      ctx.alerts.push(`A test got stuck (“${escapeHtml(s.run_label || "untitled")}”) and was closed with ${graded} answers graded.`);
    }

    const { data: active } = await db.from("kayla_benchmark_runs").select("id")
      .is("finished_at", null).in("kind", ["daily", "weekly", "trial"]).limit(1);
    if (active?.length) {
      notes.push("waiting for a running check to finish");
    } else {
      const { data: done } = await db.from("kayla_benchmark_runs").select("*")
        .in("kind", ["daily", "weekly", "trial"]).not("finished_at", "is", null).is("autopilot_processed_at", null)
        .order("started_at", { ascending: true }).limit(2);
      for (const run of done || []) {
        if (ctx.paused) break;
        await processRun(ctx, run);
        notes.push(`reviewed ${run.kind} run`);
      }
      if (!ctx.paused && !ctx.startedTrial) {
        const kind = R.decideStart(now, state);
        if (kind) notes.push(await startCheck(ctx, kind, state));
      }
    }

    if (ctx.alerts.length) {
      const subject = ctx.paused ? "Kayla Autopilot paused" : "Kayla Autopilot update";
      const id = await sendAlert(db, subject, ctx.alerts);
      if (id) await db.from("kayla_autopilot_state").update({ last_email_at: now.toISOString(), last_email_id: id }).eq("id", 1);
      notes.push(id ? "emailed the owner" : "email not sent");
    }
    return { ok: true, notes, alerts: ctx.alerts.length };
  } finally {
    await db.from("kayla_autopilot_state").update({
      lease_until: null, last_tick_note: (notes.join("; ") || "nothing to do").slice(0, 500), updated_at: new Date().toISOString(),
    }).eq("id", 1);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const auth = await requireAdminOrCron(req, corsHeaders);
    if (!auth.authenticated) return json({ error: auth.error ?? "Unauthorized" }, auth.status ?? 401);
    const isAdmin = auth.userId !== "cron" && auth.userId !== "service";
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!) as Db;
    const body = await req.json().catch(() => ({}));
    const action = typeof body.action === "string" ? body.action : "tick";

    if (action !== "tick" && !isAdmin) return json({ error: "Administrators only" }, 403);

    if (action === "status") {
      const now = new Date();
      const [{ data: state }, { data: proposals }, { data: runs }] = await Promise.all([
        db.from("kayla_autopilot_state").select("enabled, paused_reason, paused_at, last_daily_on, last_weekly_on, last_tick_at, last_tick_note, last_email_at").eq("id", 1).maybeSingle(),
        db.from("kayla_improvement_proposals").select("id, question, proposed_rule, status, autopilot_status, autopilot_note, auto_applied, auto_applied_at, score, created_at")
          .eq("origin", "autopilot").order("created_at", { ascending: false }).limit(20),
        db.from("kayla_benchmark_runs").select("id, run_label, kind, started_at, finished_at, average_score, passed, failed, cases_run")
          .neq("kind", "manual").order("started_at", { ascending: false }).limit(6),
      ]);
      const weekAgo = now.getTime() - 7 * 86_400_000;
      const autoThisWeek = (proposals || []).filter((p: any) => p.auto_applied_at && new Date(p.auto_applied_at).getTime() >= weekAgo).length;
      return json({ state, proposals: proposals || [], runs: runs || [], auto_fixes_this_week: autoThisWeek, weekly_limit: R.MAX_AUTO_FIXES_PER_WEEK });
    }
    if (action === "pause") {
      await db.from("kayla_autopilot_state").update({ enabled: false, updated_at: new Date().toISOString() }).eq("id", 1);
      return json({ ok: true });
    }
    if (action === "resume") {
      await db.from("kayla_autopilot_state").update({ enabled: true, paused_reason: null, paused_at: null, updated_at: new Date().toISOString() }).eq("id", 1);
      return json({ ok: true });
    }
    if (action === "undo") {
      const id = typeof body.proposal_id === "string" ? body.proposal_id : "";
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Missing fix id" }, 400);
      const { data } = await db.from("kayla_improvement_proposals").update({
        status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: auth.userId,
        autopilot_status: "undone", autopilot_note: "Undone by an admin.",
      }).eq("id", id).eq("auto_applied", true).eq("status", "approved").select("id");
      if (!data?.length) return json({ error: "That fix is not live any more" }, 409);
      return json({ ok: true });
    }
    if (action !== "tick") return json({ error: "Unknown action" }, 400);

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return json({ error: "LOVABLE_API_KEY not configured" }, 500);
    return json(await tick(db, key));
  } catch (e) {
    console.error("kayla-autopilot error", e);
    return json({ error: (e as Error).message }, 500);
  }
});
