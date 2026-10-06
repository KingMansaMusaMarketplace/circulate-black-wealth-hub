// Weekly self-improvement.
//
// Takes Kayla's lowest-scoring answers from the most recent scoreboard run,
// works out WHY each one went wrong, and drafts a short corrective rule.
// Every rule lands in an admin approval list — nothing changes Kayla's
// behaviour until an admin approves it. Approved rules are loaded by the
// shared brain (loadApprovedImprovements) on every channel.
//
// Auth: an admin can run it any time. The weekly schedule (anon header) is
// allowed at most once every 6 days, which caps cost even if the URL leaks.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchAIWithRetry } from "../_shared/kayla-brain.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const RESPONSES = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";
const MAX_PROPOSALS = 8;
const WEAK_SCORE = 80;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

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
      } catch { /* partial */ }
    }
  }
  return out;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagnosis: { type: "string", description: "One or two plain-English sentences on why the answer scored low." },
    proposed_rule: { type: "string", description: "A single short instruction (max 2 sentences) for Kayla that would fix this class of mistake. General, not specific to one wording." },
  },
  required: ["diagnosis", "proposed_rule"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!) as any;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY not configured" }, 500);

    // ---- who is calling? ----
    let isAdmin = false;
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      if (data?.user?.id) {
        const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
        isAdmin = !!ok;
      }
    }
    if (!isAdmin) {
      const since = new Date(Date.now() - 6 * 86400000).toISOString();
      const { count } = await supabase
        .from("kayla_improvement_proposals").select("id", { count: "exact", head: true }).gte("created_at", since);
      if ((count ?? 0) > 0) return json({ skipped: true, reason: "already ran this week" });
    }

    // ---- latest finished scoreboard run ----
    const { data: run } = await supabase
      .from("kayla_benchmark_runs").select("id, run_label, finished_at")
      .not("finished_at", "is", null).order("finished_at", { ascending: false }).limit(1).maybeSingle();
    if (!run) return json({ created: 0, reason: "no finished scoreboard run yet" });

    const { data: weak } = await supabase
      .from("kayla_benchmark_results")
      .select("id, question, answer, score, grader_notes, case_id")
      .eq("run_id", run.id).lt("score", WEAK_SCORE)
      .order("score", { ascending: true }).limit(MAX_PROPOSALS * 2);

    // skip results that already have a proposal
    const ids = (weak || []).map((w: any) => w.id);
    const { data: existing } = ids.length
      ? await supabase.from("kayla_improvement_proposals").select("source_result_id").in("source_result_id", ids)
      : { data: [] };
    const done = new Set((existing || []).map((e: any) => e.source_result_id));
    const todo = (weak || []).filter((w: any) => !done.has(w.id)).slice(0, MAX_PROPOSALS);

    let created = 0;
    for (const w of todo) {
      let expected = "";
      if (w.case_id) {
        const { data: c } = await supabase.from("kayla_benchmark_cases")
          .select("expected_facts, must_not_say").eq("id", w.case_id).maybeSingle();
        if (c) expected = `Expected facts: ${c.expected_facts}\nMust not say: ${c.must_not_say || "(none)"}`;
      }

      const prompt = `Kayla (the 1325.AI assistant) gave a weak answer on her test scoreboard. Diagnose it and propose ONE short, general rule that would prevent this kind of mistake. Never propose inventing facts, prices or numbers; only use facts given below.

QUESTION: ${w.question}
${expected}
KAYLA'S ANSWER: ${(w.answer || "").slice(0, 3000)}
SCORE: ${w.score}/100
GRADER NOTES: ${(w.grader_notes || "").slice(0, 1500)}`;

      try {
        const res = await fetchAIWithRetry(RESPONSES, {
          method: "POST",
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
          body: JSON.stringify({
            model: MODEL,
            input: [{ role: "user", content: prompt }],
            stream: true,
            store: false,
            reasoning: { effort: "low" },
            text: { format: { type: "json_schema", name: "improvement", strict: true, schema: SCHEMA } },
          }),
        }, { attempts: 2, label: "kayla-weekly-improvement" });
        if (!res.ok) { console.warn("proposal failed", res.status, (await res.text()).slice(0, 200)); continue; }
        const parsed = JSON.parse((await readStream(res)) || "{}");
        if (!parsed.proposed_rule) continue;

        const { error } = await supabase.from("kayla_improvement_proposals").insert({
          source_result_id: w.id,
          run_id: run.id,
          question: w.question,
          weak_answer: (w.answer || "").slice(0, 4000),
          score: w.score,
          grader_notes: w.grader_notes,
          diagnosis: String(parsed.diagnosis || "").slice(0, 1000),
          proposed_rule: String(parsed.proposed_rule).slice(0, 600),
        });
        if (!error) created++;
      } catch (e) {
        console.warn("proposal error", e);
      }
    }

    return json({ run: run.run_label, weak_found: weak?.length ?? 0, created });
  } catch (e) {
    console.error("kayla-weekly-improvement error", e);
    return json({ error: (e as Error).message }, 500);
  }
});
