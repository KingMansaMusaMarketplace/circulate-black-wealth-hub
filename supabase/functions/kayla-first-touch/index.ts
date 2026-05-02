// kayla-first-touch
// Day-one enrichment: when a new business is created, run a coordinated burst
// of lightweight Kayla agents in parallel and consolidate the results into
// kayla_business_baseline + a personalized welcome message in ai_chat_sessions.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { requireAuth, authErrorResponse } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token, x-cron-secret",
};

interface FirstTouchRequest {
  businessId: string;
  force?: boolean; // re-run even if baseline exists
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const CRON_SECRET = Deno.env.get("CRON_SECRET");

  // Auth: accept either CRON_SECRET (DB trigger path) or authenticated user (UI path)
  const cronHeader = req.headers.get("x-cron-secret");
  const isCron = !!CRON_SECRET && cronHeader === CRON_SECRET;
  let callerUserId: string | null = null;
  if (!isCron) {
    const auth = await requireAuth(req, corsHeaders);
    if (!auth.authenticated) return authErrorResponse(auth, corsHeaders);
    callerUserId = auth.userId ?? null;
  }

  try {
    const { businessId, force }: FirstTouchRequest = await req.json();
    if (!businessId) {
      return new Response(JSON.stringify({ error: "businessId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Idempotency: skip if baseline already complete and not forced
    const { data: existing } = await admin
      .from("kayla_business_baseline")
      .select("id, status")
      .eq("business_id", businessId)
      .maybeSingle();

    if (existing && existing.status === "complete" && !force) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "baseline already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    // Mark in-progress
    await admin
      .from("kayla_business_baseline")
      .upsert(
        { business_id: businessId, status: "running" },
        { onConflict: "business_id" },
      );

    // Load minimal business context for downstream agents
    const { data: biz } = await admin
      .from("businesses")
      .select("id, name, category, description, address, city, state, owner_id, website")
      .eq("id", businessId)
      .maybeSingle();

    if (!biz) {
      await admin
        .from("kayla_business_baseline")
        .update({ status: "failed" })
        .eq("business_id", businessId);
      return new Response(JSON.stringify({ error: "business not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Helper to invoke a sibling Kayla function with service auth
    const invokeAgent = async (name: string, body: Record<string, unknown>) => {
      try {
        const r = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_KEY}`,
            "x-cron-secret": CRON_SECRET ?? "",
          },
          body: JSON.stringify(body),
        });
        if (!r.ok) return { agent: name, ok: false, status: r.status };
        return { agent: name, ok: true, data: await r.json().catch(() => ({})) };
      } catch (e) {
        return { agent: name, ok: false, error: (e as Error).message };
      }
    };

    // Parallel burst — Promise.allSettled so one failure doesn't kill baseline
    const results = await Promise.allSettled([
      invokeAgent("kayla-grant-matcher", { businessId }),
      invokeAgent("kayla-compliance-checker", { businessId }),
      invokeAgent("kayla-supplier-diversity", { businessId }),
      invokeAgent("kayla-reputation-monitor", { businessId }),
    ]);

    const raw_insights: Record<string, unknown> = {};
    results.forEach((r, i) => {
      const key = ["grants", "compliance", "diversity", "reputation"][i];
      raw_insights[key] = r.status === "fulfilled" ? r.value : { error: String(r.reason) };
    });

    // Pull fresh top items now that sub-agents have written their tables
    const [{ data: grants }, { data: complianceRows }] = await Promise.all([
      admin
        .from("kayla_grant_matches")
        .select("grant_name, grant_provider, match_score, amount_max")
        .eq("business_id", businessId)
        .order("match_score", { ascending: false })
        .limit(3),
      admin
        .from("kayla_business_insights")
        .select("title, summary, insight_type")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    const top_grants = grants ?? [];
    const compliance_gaps = complianceRows ?? [];

    // Generate Kayla's welcome message via Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let welcome_message =
      `Welcome, ${biz.name}! I've already taken a first look at your business and ` +
      `pulled together a starting set of grants, compliance gaps, and certification opportunities. ` +
      `Open any card to dive deeper.`;

    if (LOVABLE_API_KEY) {
      try {
        const ai = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content:
                  "You are Kayla, Ph.D. — a warm, brilliant Black AI executive assistant for Black-owned businesses on the Mansa Musa Marketplace. Greet the new business owner in 2-3 sentences, reference their specific business, mention 1-2 concrete things you've already prepared for them. Never use exclamation overload.",
              },
              {
                role: "user",
                content: `Business: ${biz.name} (${biz.category || "uncategorized"}) in ${biz.city || ""}, ${biz.state || ""}. Top grant match: ${top_grants[0]?.grant_name || "scanning"}. Compliance gaps found: ${compliance_gaps.length}. Description: ${biz.description || "n/a"}.`,
              },
            ],
            max_tokens: 220,
          }),
        });
        if (ai.ok) {
          const j = await ai.json();
          const content = j?.choices?.[0]?.message?.content;
          if (content) welcome_message = content;
        }
      } catch (e) {
        console.error("AI welcome failed:", e);
      }
    }

    // Persist baseline
    await admin
      .from("kayla_business_baseline")
      .upsert(
        {
          business_id: businessId,
          industry: biz.category ?? null,
          size_estimate: null,
          public_sentiment: null,
          top_grants,
          compliance_gaps,
          certifications: raw_insights.diversity ?? [],
          welcome_message,
          raw_insights,
          status: "complete",
        },
        { onConflict: "business_id" },
      );

    // Seed welcome message into ai_chat_sessions for first chat opening
    if (biz.owner_id) {
      const sessionId = `first-touch-${businessId}`;
      await admin.from("ai_chat_sessions").upsert(
        {
          session_id: sessionId,
          user_id: biz.owner_id,
          messages: [
            {
              role: "assistant",
              content: welcome_message,
              metadata: { type: "first_touch_welcome", business_id: businessId },
              created_at: new Date().toISOString(),
            },
          ],
        },
        { onConflict: "session_id" },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        business_id: businessId,
        top_grants_count: top_grants.length,
        compliance_gaps_count: compliance_gaps.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("kayla-first-touch error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
