// =============================================================================
// KAYLA DEEP — premium reasoning + self-review for high-stakes reports.
//
// Two capabilities live here:
//
//  1. runDeepJsonReport()  — runs a structured report on the premium reasoning
//     model (GPT-6 Astra, streamed per gateway rules) and falls back to the
//     standard model automatically if anything comes back unusable. Used by the
//     money reports: investment readiness, credit readiness, cash flow, tax.
//
//  2. reviewJsonReport()   — a second pass that re-reads the draft AGAINST the
//     source data and corrects anything unsupported before the customer sees
//     it. This is the difference between "smart" and "trustworthy": a confident
//     wrong number in a lending or tax report is worse than no report.
//
// Both are fail-open: if the review or the premium run fails, the caller still
// gets a valid report from the standard path.
// =============================================================================

import { fetchAIWithRetry } from "./kayla-brain.ts";

const RESPONSES = "https://ai.gateway.lovable.dev/v1/responses";
const CHAT = "https://ai.gateway.lovable.dev/v1/chat/completions";

export const PREMIUM_MODEL = "openai/gpt-6-astra";
export const STANDARD_DEEP_MODEL = "google/gemini-3.1-pro-preview";

/** Read an SSE stream from /v1/responses and return the concatenated output text. */
async function readResponsesStream(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let out = "";
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          out += evt.delta;
        }
      } catch { /* partial frame */ }
    }
  }
  return out;
}

export interface DeepReportOptions {
  prompt: string;
  /** Strict-compatible JSON schema: object root, every property required. */
  schema: Record<string, unknown>;
  schemaName: string;
  lovableApiKey: string;
  /** "medium" by default; "high" for the heaviest reports. */
  effort?: "low" | "medium" | "high";
  label?: string;
}

export interface DeepReportResult<T = any> {
  result: T | null;
  /** Which path produced the result. */
  modelUsed: "premium" | "standard" | "none";
}

/**
 * Run a structured report on the premium reasoning model, falling back to the
 * standard deep model. Never throws for model-side problems — check `result`.
 */
export async function runDeepJsonReport<T = any>(
  opts: DeepReportOptions,
): Promise<DeepReportResult<T>> {
  const { prompt, schema, schemaName, lovableApiKey } = opts;
  const effort = opts.effort ?? "medium";
  const label = opts.label ?? schemaName;

  // ---- premium path -------------------------------------------------------
  try {
    const res = await fetchAIWithRetry(
      RESPONSES,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: PREMIUM_MODEL,
          input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
          stream: true,
          store: false,
          reasoning: { effort },
          text: {
            format: { type: "json_schema", name: schemaName, strict: true, schema },
          },
        }),
      },
      { attempts: 2, label: `${label}-premium` },
    );

    if (res.ok) {
      const raw = await readResponsesStream(res);
      if (raw.trim()) {
        try {
          return { result: JSON.parse(raw) as T, modelUsed: "premium" };
        } catch {
          console.warn(`[${label}] premium returned unparseable JSON; falling back`);
        }
      }
    } else {
      console.warn(`[${label}] premium ${res.status}; falling back`);
    }
  } catch (e) {
    console.warn(`[${label}] premium threw; falling back`, e);
  }

  // ---- standard fallback --------------------------------------------------
  try {
    const res = await fetchAIWithRetry(
      CHAT,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: STANDARD_DEEP_MODEL,
          messages: [{ role: "user", content: prompt }],
          tools: [{
            type: "function",
            function: { name: schemaName, description: `Return the ${schemaName}`, parameters: schema },
          }],
          tool_choice: { type: "function", function: { name: schemaName } },
        }),
      },
      { attempts: 3, label: `${label}-standard` },
    );
    if (!res.ok) {
      console.error(`[${label}] standard ${res.status}`);
      return { result: null, modelUsed: "none" };
    }
    const data = await res.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) return { result: null, modelUsed: "none" };
    return { result: JSON.parse(call.function.arguments) as T, modelUsed: "standard" };
  } catch (e) {
    console.error(`[${label}] standard path failed`, e);
    return { result: null, modelUsed: "none" };
  }
}

export interface ReviewOptions {
  /** The same source facts the draft was written from. */
  sourcePrompt: string;
  draft: unknown;
  schema: Record<string, unknown>;
  schemaName: string;
  lovableApiKey: string;
  label?: string;
}

export interface ReviewResult<T = any> {
  /** Corrected report (or the original draft when nothing needed changing). */
  result: T;
  /** Plain-English list of what the reviewer corrected. Empty = clean pass. */
  corrections: string[];
  reviewed: boolean;
}

/**
 * Second pair of eyes. Re-reads a finished report against the source data and
 * corrects any claim the data does not support. Fail-open: on any error the
 * original draft is returned untouched.
 */
export async function reviewJsonReport<T = any>(opts: ReviewOptions): Promise<ReviewResult<T>> {
  const { sourcePrompt, draft, schema, schemaName, lovableApiKey } = opts;
  const label = opts.label ?? `${schemaName}-review`;

  const reviewSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      corrections: {
        type: "array",
        items: { type: "string" },
        description: "One short line per problem found. Empty array if the draft is sound.",
      },
      corrected: schema,
    },
    required: ["corrections", "corrected"],
  };

  const prompt = `You are a senior reviewer checking a finished analysis before it reaches a business owner who may use it to borrow money, file taxes, or raise capital. Be skeptical and exact.

SOURCE DATA AND ORIGINAL BRIEF:
${sourcePrompt}

DRAFT REPORT TO REVIEW:
${JSON.stringify(draft)}

Check for:
1. Any number, claim or conclusion the source data does not support.
2. Arithmetic or scoring that does not follow from the inputs.
3. Advice that is generic filler rather than grounded in this business.
4. Anything overstated, or any risk that was missed.
5. Invented facts — businesses, programs, deadlines, dollar figures not in the source.

Return the corrected report in full. Where the draft was right, keep it word for word. List each correction you made in plain English. If the draft is sound, return it unchanged with an empty corrections list.`;

  try {
    const res = await fetchAIWithRetry(
      CHAT,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: STANDARD_DEEP_MODEL,
          messages: [{ role: "user", content: prompt }],
          tools: [{
            type: "function",
            function: { name: "reviewed_report", description: "Corrected report plus corrections made", parameters: reviewSchema },
          }],
          tool_choice: { type: "function", function: { name: "reviewed_report" } },
        }),
      },
      { attempts: 2, label },
    );

    if (!res.ok) {
      console.warn(`[${label}] review ${res.status}; keeping draft`);
      return { result: draft as T, corrections: [], reviewed: false };
    }

    const data = await res.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) return { result: draft as T, corrections: [], reviewed: false };

    const parsed = JSON.parse(call.function.arguments);
    const corrected = parsed?.corrected;
    if (!corrected || typeof corrected !== "object") {
      return { result: draft as T, corrections: [], reviewed: false };
    }
    const corrections: string[] = Array.isArray(parsed.corrections)
      ? parsed.corrections.map((c: unknown) => String(c)).slice(0, 10)
      : [];
    if (corrections.length) console.log(`[${label}] corrected ${corrections.length} item(s)`);
    return { result: corrected as T, corrections, reviewed: true };
  } catch (e) {
    console.warn(`[${label}] review threw; keeping draft`, e);
    return { result: draft as T, corrections: [], reviewed: false };
  }
}
