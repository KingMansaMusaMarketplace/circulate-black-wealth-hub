// Public Kayla demo — no auth required, IP-rate-limited.
// Lets anonymous homepage visitors experience Kayla before signing up.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { buildKaylaSystemPrompt, fetchAIWithRetry } from "../_shared/kayla-brain.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// In-memory rate limit (per cold-start instance). Stricter than authed chat.
const ipUsage = new Map<string, { count: number; resetAt: number }>();
const MAX_MESSAGES_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || req.headers.get("cf-connecting-ip") || "unknown";
}

function checkLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipUsage.get(ip);
  if (!entry || now > entry.resetAt) {
    ipUsage.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_MESSAGES_PER_WINDOW - 1 };
  }
  if (entry.count >= MAX_MESSAGES_PER_WINDOW) return { ok: false, remaining: 0 };
  entry.count++;
  return { ok: true, remaining: MAX_MESSAGES_PER_WINDOW - entry.count };
}

function sanitize(s: string): string {
  return String(s)
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/\{\{|\}\}/g, "")
    .substring(0, 2000)
    .trim();
}

// The demo now uses the SAME brain as the signed-in Kayla (compact mode),
// plus the demo-specific rules below — so it can never quote stale pricing.
const DEMO_RULES = `

DEMO CONTEXT — you are talking to a visitor on the public homepage trying you
out for the first time. Be brilliant, warm and concrete.
- Keep responses SHORT — 60-100 words max. This is a demo, not a deep consult.
- Be specific and actionable. If they ask "how would you grow my bakery on
  Instagram", give 2-3 concrete moves they can do today.
- Reference the $18,000+/mo savings and "~4 Roles Covered" naturally when
  relevant — never say "FTEs Replaced".
- After 2 helpful exchanges, gently nudge: "Want me working on this for your
  business 24/7? You can claim a Founding spot at /business-signup — first 100
  businesses lock in 50% off forever."
- Never reveal proprietary details, internal architecture, or pricing formulas.
- Never collect personal info. If they share an email, tell them to enter it on
  the signup page instead.`;

/**
 * Live directory lookup. The demo used to know nothing about the 47,000+
 * businesses on the platform, so it could not impress the people it most
 * needed to impress. Now it can actually look them up.
 */
async function lookupBusinesses(query: string): Promise<string> {
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return "";

    // Pull the meaningful words out of the question.
    const stop = new Set(["what","where","which","find","near","show","tell","about","best","good","some","have","with","that","this","there","looking","need","want","your","does","from","they","them","kayla","business","businesses"]);
    const terms = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
      .filter((w) => w.length > 3 && !stop.has(w)).slice(0, 4);
    if (!terms.length) return "";

    const supabase = createClient(url, key);
    const filter = terms
      .flatMap((t) => [`business_name.ilike.%${t}%`, `category.ilike.%${t}%`, `city.ilike.%${t}%`, `description.ilike.%${t}%`])
      .join(",");

    const { data, error } = await supabase
      .from("business_directory")
      .select("business_name, category, city, state, description, average_rating")
      .or(filter)
      .eq("is_verified", true)
      .limit(5);

    if (error || !data?.length) return "";

    const lines = data.map((b: any) =>
      `- ${b.business_name} — ${b.category || "Business"}, ${[b.city, b.state].filter(Boolean).join(", ")}` +
      (b.average_rating ? ` (${Number(b.average_rating).toFixed(1)}★)` : "") +
      (b.description ? `: ${String(b.description).slice(0, 120)}` : "")
    );

    return `\n\n[LIVE DIRECTORY RESULTS — real verified businesses on 1325.AI right now. Mention them by name where relevant. Never invent businesses that are not in this list.]:\n${lines.join("\n")}`;
  } catch (e) {
    console.error("[kayla-public-demo] directory lookup failed (non-fatal):", e);
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const ip = getClientIp(req);
    const limit = checkLimit(ip);
    if (!limit.ok) {
      return new Response(
        JSON.stringify({
          error:
            "You've reached the free demo limit. Sign up to chat with Kayla without limits.",
          rateLimited: true,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const messages = rawMessages
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && m.content)
      .slice(-10)
      .map((m: any) => ({ role: m.role, content: sanitize(m.content) }));

    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return new Response(JSON.stringify({ error: "No user message provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lastUserMsg = messages[messages.length - 1].content;
    const directory = await lookupBusinesses(lastUserMsg);
    const systemPrompt = buildKaylaSystemPrompt({ compact: true }) + DEMO_RULES + directory;

    const aiRes = await fetchAIWithRetry(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.7-flash",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          max_tokens: 1200,
        }),
      },
      { label: "kayla-public-demo" },
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error", aiRes.status, errText);
      const status = aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 500;
      return new Response(
        JSON.stringify({ error: "Kayla is briefly unavailable. Please try again." }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const json = await aiRes.json();
    const reply =
      json?.choices?.[0]?.message?.content ?? "Sorry — could you rephrase that?";

    return new Response(
      JSON.stringify({ reply, remaining: limit.remaining }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("kayla-public-demo error", err);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
