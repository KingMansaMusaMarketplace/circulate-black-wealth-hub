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

// =============================================================================
// PREMIUM CHAT ANSWER — newest/strongest model + self-check, for hard chat
// questions (strategy, forecasts, contracts, money, legal).
//
//   1. Draft on the premium reasoning model with the full Kayla prompt
//      (including live lookups and memory).
//   2. Self-check: a second pass re-reads the draft against the same facts,
//      removes anything unsupported, and fixes the wording before the person
//      ever sees it.
//
// Fail-open: returns null on any failure so callers fall back to their
// standard streaming path.
// =============================================================================

function msgText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((p: any) => (p?.type === "text" ? p.text : "")).filter(Boolean).join("\n");
  }
  return "";
}

async function responsesText(
  lovableApiKey: string,
  input: any[],
  effort: "low" | "medium" | "high",
  label: string,
): Promise<string> {
  const res = await fetchAIWithRetry(
    RESPONSES,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: PREMIUM_MODEL,
        input,
        stream: true,
        store: false,
        reasoning: { effort },
      }),
    },
    { attempts: 2, label },
  );
  if (!res.ok) {
    console.warn(`[${label}] ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return "";
  }
  return (await readResponsesStream(res)).trim();
}

export interface PremiumChatOptions {
  systemPrompt: string;
  messages: Array<{ role: string; content: unknown }>;
  lovableApiKey: string;
  label?: string;
}

export interface PremiumChatResult {
  text: string;
  reviewed: boolean;
}

export async function premiumChatAnswer(opts: PremiumChatOptions): Promise<PremiumChatResult | null> {
  const label = opts.label ?? "kayla-premium-chat";
  try {
    const convo = opts.messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-12)
      .map((m) => ({ role: m.role, content: msgText(m.content).slice(0, 8000) }))
      .filter((m) => m.content);
    if (!convo.length) return null;

    const draft = await responsesText(
      opts.lovableApiKey,
      [{ role: "developer", content: opts.systemPrompt }, ...convo],
      "medium",
      `${label}-draft`,
    );
    if (!draft) return null;

    const lastQuestion = convo.filter((m) => m.role === "user").slice(-1)[0]?.content || "";
    const review = await responsesText(
      opts.lovableApiKey,
      [
        {
          role: "developer",
          content: `You are Kayla's final self-check before an answer reaches a business owner. Re-read the DRAFT against the RULES & FACTS. Then output ONLY the final answer text (no preamble, no notes about reviewing).

Fix, in this order:
1. Remove or soften any number, date, law, price, name or claim that is NOT supported by the facts/lookups or by well-established general knowledge. Never add new facts.
2. If a "Sources:" list is present, keep only URLs that appear in the live lookups; drop any other URL.
3. Make sure the answer actually answers the question and ends with a concrete next step.
4. Keep Kayla's voice, the brand rules, and the length rules. If the draft is already correct, return it unchanged.

=== RULES & FACTS ===
${opts.systemPrompt.slice(-24000)}`,
        },
        { role: "user", content: `QUESTION:\n${lastQuestion}\n\nDRAFT:\n${draft}` },
      ],
      "low",
      `${label}-review`,
    );

    const finalText = review && review.length > 20 ? review : draft;
    return { text: finalText, reviewed: !!review };
  } catch (e) {
    console.warn(`[${label}] failed (falling back):`, e);
    return null;
  }
}

/** Turn finished text into an OpenAI-compatible SSE stream the chat UIs already read. */
export function textToChatSSE(text: string, model: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      const size = 24;
      for (let i = 0; i < text.length; i += size) {
        const data = { choices: [{ delta: { content: text.slice(i, i + size) }, index: 0 }], model };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

/** Questions that deserve the premium brain + self-check. */
export function wantsPremium(category: string, question: string): boolean {
  if (category === "critical" || category === "complex") return true;
  return /\b(strategy|strategic|forecast|projection|contract|agreement|negotiat|business plan|pricing strategy|valuation|legal)\b/i.test(question);
}
