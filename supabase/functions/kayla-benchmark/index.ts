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
      grounding: { type: "integer", description: "0-100: is everything stated supported, with nothing invented?" },
      usefulness: { type: "integer", description: "0-100: would this actually help the person who asked?" },
      notes: { type: "string", description: "One or two sentences on what was right or wrong." },
    },
    required: ["accuracy", "grounding", "usefulness", "notes"],
  };

  const prompt = `You are a strict grader for an AI business assistant.

QUESTION ASKED:
${question}

KNOWN-CORRECT ANSWER (the ground truth):
${expected}
${mustNotSay ? `\nTHE ANSWER MUST NOT CONTAIN: ${mustNotSay}` : ""}

THE ASSISTANT'S ACTUAL ANSWER:
${answer}

Grade strictly. An answer that invents a fact, a price, a business name or a program scores at most 20 on grounding. An answer that contradicts the known-correct answer scores at most 20 on accuracy. A correct but vague answer loses usefulness points, not accuracy points.`;

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

    // ADMIN ONLY — this runs real model calls and costs money.
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabase.auth.getUser(token);
    const userId = userData?.user?.id;
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

    const body = await req.json().catch(() => ({}));
    const label = body.label || `Run ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;
    const limit = Math.min(Number(body.limit) || 50, 50);

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

    const { data: run } = await supabase
      .from("kayla_benchmark_runs")
      .insert({ run_label: label, cases_run: cases.length, created_by: userId })
      .select("id").single();

    const graded: GradedCase[] = [];

    // Sequential on purpose: the whole workspace shares one rate-limit budget.
    for (const c of cases) {
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

      graded.push({
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

    await supabase.from("kayla_benchmark_results").insert(
      graded.map((g) => ({ run_id: run.id, ...g })),
    );

    const avg = (pick: (g: GradedCase) => number) =>
      Math.round(graded.reduce((s, g) => s + pick(g), 0) / graded.length);

    const averageScore = avg((g) => g.score);
    const passed = graded.filter((g) => g.score >= 70).length;

    await supabase.from("kayla_benchmark_runs").update({
      finished_at: new Date().toISOString(),
      average_score: averageScore,
      accuracy_score: avg((g) => g.accuracy),
      grounding_score: avg((g) => g.grounding),
      passed,
      failed: graded.length - passed,
    }).eq("id", run.id);

    return new Response(JSON.stringify({
      run_id: run.id,
      cases_run: graded.length,
      average_score: averageScore,
      accuracy_score: avg((g) => g.accuracy),
      grounding_score: avg((g) => g.grounding),
      passed,
      failed: graded.length - passed,
      results: graded,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
