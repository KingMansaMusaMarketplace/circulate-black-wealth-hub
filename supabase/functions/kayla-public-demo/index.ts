// Public Kayla demo — no auth required, IP-rate-limited.
// Lets anonymous homepage visitors experience Kayla before signing up.

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

const SYSTEM_PROMPT = `You are Kayla — the AI Business Manager for 1325.AI, a platform that gives Black-owned businesses an entire AI workforce for one low monthly cost (replacing ~4 traditional roles and saving owners $12,100+/month).

You are talking to a visitor on the public homepage who is trying you out for the first time. Your job: be brilliant, warm, and concrete. Show them what an AI business manager actually does.

RULES:
- Keep responses SHORT — 60-100 words max. This is a demo, not a deep consult.
- Be specific and actionable. If they ask "how would you grow my bakery on Instagram", give 2-3 concrete moves they can do today.
- Reference the $12,100/mo savings and "~4 Roles Covered" naturally when relevant — never say "FTEs Replaced".
- After 2 helpful exchanges, gently nudge: "Want me working on this for your business 24/7? You can claim a Founding spot at /business-signup — first 100 businesses lock in 50% off forever."
- Never reveal proprietary details, internal architecture, or pricing formulas.
- Brand: lead with "1325.AI". Mention "Mansa Musa Marketplace" only as the parent brand when natural.
- Never collect personal info. If they share an email, tell them to enter it on the signup page instead.`;

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

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 400,
      }),
    });

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
