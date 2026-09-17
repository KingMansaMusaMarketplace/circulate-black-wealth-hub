// Nightly lesson review.
//
// Kayla's agents write down lessons as they work, but a lesson is only worth
// keeping if it held up in the real world. This job takes unconfirmed lessons
// that are old enough to have been tested by events, puts them next to what
// actually happened to that business, and keeps, rejects or leaves each one
// pending. Confirmed lessons are the only ones the agents are allowed to lean
// on, so this is what turns activity into genuine learning.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token, x-cron-secret",
};

import { fetchAIWithRetry } from "../_shared/kayla-brain.ts";
import { verifyLearning } from "../_shared/kayla-coordination.ts";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MIN_AGE_DAYS = 3;
const MAX_PER_RUN = 60;

async function outcomesFor(supabase: any, businessId: string) {
  const since = new Date(Date.now() - 45 * 86400000).toISOString();
  const [reviews, scans, bookings, churn] = await Promise.all([
    supabase.from("reviews").select("rating, created_at").eq("business_id", businessId).gte("created_at", since),
    supabase.from("qr_scans").select("id, created_at").eq("business_id", businessId).gte("created_at", since),
    supabase.from("bookings").select("id, status, created_at").eq("business_id", businessId).gte("created_at", since),
    supabase.from("churn_predictions").select("churn_risk_score, created_at").eq("business_id", businessId)
      .order("created_at", { ascending: false }).limit(1),
  ]);

  const ratings = (reviews.data || []).map((r: any) => r.rating).filter(Boolean);
  const avg = ratings.length ? ratings.reduce((s: number, r: number) => s + r, 0) / ratings.length : null;

  return [
    `Reviews in last 45 days: ${ratings.length}${avg ? ` (avg ${avg.toFixed(1)} stars)` : ""}`,
    `Loyalty QR scans in last 45 days: ${(scans.data || []).length}`,
    `Bookings in last 45 days: ${(bookings.data || []).length}`,
    `Latest churn risk score: ${churn.data?.[0]?.churn_risk_score ?? "unknown"}`,
  ].join("\n");
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

    const cutoff = new Date(Date.now() - MIN_AGE_DAYS * 86400000).toISOString();

    const { data: pending } = await supabase
      .from("kayla_learnings")
      .select("id, business_id, agent_name, learning, source, confidence, created_at")
      .eq("verified", false)
      .eq("review_status", "pending")
      .lt("created_at", cutoff)
      .order("created_at", { ascending: true })
      .limit(MAX_PER_RUN);

    if (!pending?.length) {
      return new Response(JSON.stringify({ reviewed: 0, confirmed: 0, rejected: 0, message: "Nothing ready to review" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Group by business so we only pull each business's outcomes once.
    const byBusiness = new Map<string, any[]>();
    for (const l of pending) {
      const list = byBusiness.get(l.business_id) || [];
      list.push(l);
      byBusiness.set(l.business_id, list);
    }

    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        verdicts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              id: { type: "string" },
              verdict: { type: "string", enum: ["confirmed", "rejected", "pending"] },
              reason: { type: "string" },
            },
            required: ["id", "verdict", "reason"],
          },
        },
      },
      required: ["verdicts"],
    };

    let confirmed = 0, rejected = 0, stillPending = 0, failures = 0;

    for (const [businessId, learnings] of byBusiness) {
      try {
        const outcomes = await outcomesFor(supabase, businessId);
        const prompt = `You are auditing lessons an AI agent team wrote down about one business. Decide which lessons the real-world results support.

WHAT ACTUALLY HAPPENED AT THIS BUSINESS:
${outcomes}

LESSONS AWAITING REVIEW:
${learnings.map((l: any) => `- id ${l.id} | agent ${l.agent_name} | written ${l.created_at.slice(0, 10)} | confidence ${l.confidence}\n  "${l.learning}"`).join("\n")}

Rules:
- "confirmed" only when the results above clearly support the lesson, or it is a plain factual record of something that demonstrably happened.
- "rejected" when the results contradict the lesson, or it is a speculative prediction that did not come true.
- "pending" when there is not enough evidence either way. When in doubt, choose pending — a wrong lesson that gets trusted is worse than one that waits.
Return a verdict for every id listed.`;

        const resp = await fetchAIWithRetry(GATEWAY, {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3.1-pro-preview",
            messages: [{ role: "user", content: prompt }],
            tools: [{ type: "function", function: { name: "return_verdicts", description: "Return one verdict per lesson", parameters: schema } }],
            tool_choice: { type: "function", function: { name: "return_verdicts" } },
          }),
        });

        if (!resp.ok) { failures++; continue; }
        const data = await resp.json();
        const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
        const verdicts = JSON.parse(args || "{}").verdicts || [];

        for (const v of verdicts) {
          const match = learnings.find((l: any) => l.id === v.id);
          if (!match) continue;
          if (v.verdict === "confirmed") {
            await verifyLearning(supabase, match.id, `outcome review: ${v.reason}`.slice(0, 500));
            await supabase.from("kayla_learnings")
              .update({ review_status: "confirmed", reviewed_at: new Date().toISOString() })
              .eq("id", match.id);
            confirmed++;
          } else if (v.verdict === "rejected") {
            await supabase.from("kayla_learnings").update({
              review_status: "rejected",
              reviewed_at: new Date().toISOString(),
              applied: false,
              verification_note: `outcome review rejected: ${v.reason}`.slice(0, 500),
            }).eq("id", match.id);
            rejected++;
          } else {
            stillPending++;
          }
        }
      } catch (e) {
        // One bad business never stops the sweep.
        console.error(`learning-review failed for business ${businessId}:`, e);
        failures++;
      }
    }

    console.log(`[learning-review] reviewed=${pending.length} confirmed=${confirmed} rejected=${rejected} pending=${stillPending} failures=${failures}`);

    return new Response(JSON.stringify({
      reviewed: pending.length, confirmed, rejected, still_pending: stillPending, failures,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
