// Kayla scoreboard.
//
// Runs a fixed set of questions with known-correct answers through exactly the
// same brain the live chat uses (same system prompt, same difficulty router,
// same live lookups), then has a separate grader model score each answer
// against the known answer. This is how we tell whether a change actually made
// Kayla smarter instead of guessing.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

import { buildKaylaSystemPrompt, classifyQuery, fetchAIWithRetry } from "../_shared/kayla-brain.ts";
import { gatherLiveGrounding } from "../_shared/kayla-grounding.ts";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface GradedCase {
  case_id: string | null;
  question: string;
  answer: string;
  score: number;
  accuracy: number;
  grounding: number;
  usefulness: number;
  grader_notes: string;
  tools_used: string;
  model_used: string;
  latency_ms: number;
}

async function answerQuestion(
  supabase: any,
  question: string,
  key: string,
): Promise<{ answer: string; model: string; tools: string }> {
  const { category } = await classifyQuery(question, key);
  const model = category === "simple"
    ? "google/gemini-3.7-flash"
    : "google/gemini-3.1-pro-preview";

  const grounding = await gatherLiveGrounding({
    supabase,
    question,
    lovableApiKey: key,
    budgetMs: 12000,
  });

  const system = buildKaylaSystemPrompt({ isAdmin: false }) + grounding.block;

  const resp = await fetchAIWithRetry(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: question },
      ],
    }),
  });

  if (!resp.ok) {
    return { answer: `[no answer: gateway ${resp.status}]`, model, tools: "" };
  }
  const data = await resp.json();
  return {
    answer: data.choices?.[0]?.message?.content ?? "",
    model,
    tools: grounding.calls.map((c) => c.tool).join(", "),
  };
}

async function gradeAnswer(
  question: string,
  expected: string,
  mustNotSay: string | null,
  answer: string,
  key: string,
): Promise<{ accuracy: number; grounding: number; usefulness: number; notes: string }> {
  const gradingSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      accuracy: { type: "integer", description: "0-100: does the answer match the known-correct facts?" },
      grounding: { type: "integer", description: "0-100: are all CHECKABLE claims (prices, numbers, names, dates) correct and nothing contradicted or fabricated? Extra true detail is fine." },
      usefulness: { type: "integer", description: "0-100: would this actually help the person who asked?" },
      notes: { type: "string", description: "One or two sentences on what was right or wrong." },
    },
    required: ["accuracy", "grounding", "usefulness", "notes"],
  };

  const prompt = `You are a strict grader for an AI business assistant.

QUESTION ASKED:
${question}

KNOWN-CORRECT ANSWER (the ground truth). This is a MINIMUM bar, not an exhaustive list. It states what MUST be correct; it does not limit what the answer is allowed to mention:
${expected}
${mustNotSay ? `\nTHE ANSWER MUST NOT CONTAIN: ${mustNotSay}` : ""}

THE ASSISTANT'S ACTUAL ANSWER:
${answer}

Grading rules:
- ACCURACY: does it state the ground-truth facts correctly? Contradicting them scores at most 20.
- GROUNDING: judge only CHECKABLE claims — prices, counts, dates, named businesses, named programs, legal/patent claims. Score at most 20 only if such a claim is wrong, invented, or contradicts the ground truth.
  Do NOT deduct grounding for extra detail that is plausible, on-brand and not contradicted (feature descriptions, benefits, next-step suggestions, links to the company's own site such as 1325.ai pages, or offers to help further). Additional true or reasonable context is a strength, not a violation.
- USEFULNESS: would this actually help the person who asked? A correct but vague answer loses usefulness points, not accuracy points.`;

  try {
    const resp = await fetchAIWithRetry(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-pro-preview",
        messages: [{ role: "user", content: prompt }],
        tools: [{ type: "function", function: { name: "grade", description: "Return the grade", parameters: gradingSchema } }],
        tool_choice: { type: "function", function: { name: "grade" } },
      }),
    });
    if (!resp.ok) throw new Error(`grader ${resp.status}`);
    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = JSON.parse(args || "{}");
    return {
      accuracy: Number(parsed.accuracy) || 0,
      grounding: Number(parsed.grounding) || 0,
      usefulness: Number(parsed.usefulness) || 0,
      notes: parsed.notes || "",
    };
  } catch (e) {
    return { accuracy: 0, grounding: 0, usefulness: 0, notes: `Grading failed: ${(e as Error).message}` };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    ) as any;
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("LOVABLE_API_KEY is not configured");

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const body = await req.json().catch(() => ({}));

    // A long sweep cannot finish inside one edge invocation, so the function
    // re-invokes itself to carry on where it stopped. Those internal calls
    // carry the service key instead of a user token.
    const isInternal = req.headers.get("x-internal-continue") === serviceKey;

    let userId: string | null = null;
    if (!isInternal) {
      // ADMIN ONLY — this runs real model calls and costs money.
      const authHeader = req.headers.get("Authorization") || "";
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      userId = userData?.user?.id ?? null;
      if (!userId) {
        return new Response(JSON.stringify({ error: "Sign in required" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: roleRow } = await supabase
        .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "Administrators only" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const label = body.label || `Run ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;
    const limit = Math.min(Number(body.limit) || 100, 100);

    const { data: cases } = await supabase
      .from("kayla_benchmark_cases")
      .select("id, question, expected_facts, must_not_say")
      .eq("is_active", true)
      .limit(limit);

    if (!cases?.length) {
      return new Response(JSON.stringify({ error: "No benchmark questions are set up yet" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let runId: string = body.run_id;
    if (!runId) {
      const { data: run } = await supabase
        .from("kayla_benchmark_runs")
        .insert({ run_label: label, cases_run: cases.length, created_by: userId })
        .select("id").single();
      runId = run.id;
    }

    // Skip anything already graded for this run so a resumed pass picks up
    // exactly where the previous one was cut off.
    const { data: done } = await supabase
      .from("kayla_benchmark_results").select("case_id").eq("run_id", runId);
    const doneIds = new Set((done || []).map((d: any) => d.case_id));
    const todo = cases.filter((c: any) => !doneIds.has(c.id));

    const finalize = async () => {
      const { data: all } = await supabase
        .from("kayla_benchmark_results")
        .select("score, accuracy, grounding").eq("run_id", runId);
      const rows = (all || []) as any[];
      const avg = (k: string) =>
        Math.round(rows.reduce((s, r) => s + (Number(r[k]) || 0), 0) / Math.max(rows.length, 1));
      const passed = rows.filter((r) => (r.score ?? 0) >= 70).length;
      await supabase.from("kayla_benchmark_runs").update({
        finished_at: new Date().toISOString(),
        average_score: avg("score"),
        accuracy_score: avg("accuracy"),
        grounding_score: avg("grounding"),
        passed,
        failed: rows.length - passed,
      }).eq("id", runId);
    };

    const work = (async () => {
      const deadline = Date.now() + 110_000; // stay well inside the invocation limit

      // Sequential on purpose: the whole workspace shares one rate-limit budget.
      for (const c of todo) {
        if (Date.now() > deadline) {
          // Hand the rest to a fresh invocation and stop cleanly.
          await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/kayla-benchmark`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${serviceKey}`,
              "x-internal-continue": serviceKey,
            },
            body: JSON.stringify({ run_id: runId, limit }),
          }).catch(() => {});
          return;
        }

        const started = Date.now();
        let answer = "", model = "", tools = "";
        try {
          const res = await answerQuestion(supabase, c.question, key);
          answer = res.answer; model = res.model; tools = res.tools;
        } catch (e) {
          answer = `[error: ${(e as Error).message}]`;
        }
        const latency = Date.now() - started;
        const g = await gradeAnswer(c.question, c.expected_facts, c.must_not_say, answer, key);
        const score = Math.round((g.accuracy + g.grounding + g.usefulness) / 3);

        await supabase.from("kayla_benchmark_results").insert({
          run_id: runId,
          case_id: c.id,
          question: c.question,
          answer,
          score,
          accuracy: g.accuracy,
          grounding: g.grounding,
          usefulness: g.usefulness,
          grader_notes: g.notes,
          tools_used: tools,
          model_used: model,
          latency_ms: latency,
        });
      }

      await finalize();
    })();

    // deno-lint-ignore no-explicit-any
    const rt = (globalThis as any).EdgeRuntime;
    if (rt?.waitUntil) rt.waitUntil(work); else work.catch(() => {});

    return new Response(JSON.stringify({
      run_id: runId,
      cases_run: cases.length,
      remaining: todo.length,
      status: "running",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
