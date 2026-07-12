// Verify Business Submission
// Kayla-powered verification: checks website live, matches address/phone,
// looks for Black-owned signals across the web, and scores confidence.
// Runs on submit (no auth required — the submission row is the input).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface KaylaCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

async function checkWebsiteLive(url: string): Promise<KaylaCheck> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "MansaMusaBot/1.0 (+https://1325.ai)" },
    });
    clearTimeout(t);
    if (res.ok) {
      return {
        name: "Website is live",
        status: "pass",
        detail: `HTTP ${res.status} — site loads successfully.`,
      };
    }
    return {
      name: "Website is live",
      status: "warn",
      detail: `HTTP ${res.status} — site returned an error status.`,
    };
  } catch (err: any) {
    return {
      name: "Website is live",
      status: "fail",
      detail: `Could not reach site: ${err?.message ?? "unknown error"}`,
    };
  }
}

async function fetchSiteText(url: string): Promise<string> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "MansaMusaBot/1.0 (+https://1325.ai)" },
    });
    clearTimeout(t);
    if (!res.ok) return "";
    const html = await res.text();
    // Strip tags cheaply
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .slice(0, 20000);
  } catch {
    return "";
  }
}

function checkPhoneOnSite(text: string, phone: string): KaylaCheck {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) {
    return { name: "Phone on website", status: "warn", detail: "Phone too short to verify." };
  }
  const last7 = digits.slice(-7);
  return text.replace(/\D/g, "").includes(last7)
    ? { name: "Phone on website", status: "pass", detail: `Found matching phone (${last7}) on site.` }
    : { name: "Phone on website", status: "warn", detail: "Phone number not found on the site." };
}

function checkCityOnSite(text: string, city: string, state: string): KaylaCheck {
  const c = city.toLowerCase().trim();
  const s = state.toLowerCase().trim();
  const cityHit = text.includes(c);
  const stateHit = text.includes(s);
  if (cityHit && stateHit) {
    return { name: "Location on website", status: "pass", detail: `Found "${city}" and "${state}" on site.` };
  }
  if (cityHit || stateHit) {
    return {
      name: "Location on website",
      status: "warn",
      detail: `Only partial match — city:${cityHit} state:${stateHit}`,
    };
  }
  return { name: "Location on website", status: "warn", detail: "City/state not found on site." };
}

function checkBlackOwnedSignals(text: string, businessName: string): KaylaCheck {
  const signals = [
    "black-owned", "black owned", "african american", "african-american",
    "hbcu", "black entrepreneur", "black business", "minority-owned",
    "minority owned", "mbe certified", "nmsdc",
  ];
  const found = signals.filter((s) => text.includes(s));
  if (found.length >= 2) {
    return {
      name: "Black-owned signals",
      status: "pass",
      detail: `Found ${found.length} on-site signals: ${found.slice(0, 3).join(", ")}`,
    };
  }
  if (found.length === 1) {
    return {
      name: "Black-owned signals",
      status: "warn",
      detail: `Only 1 signal found on site: "${found[0]}". Manual review recommended.`,
    };
  }
  return {
    name: "Black-owned signals",
    status: "warn",
    detail: `No explicit Black-owned signals on ${businessName}'s site. Verify manually via web search.`,
  };
}

async function askKaylaForVerdict(
  submission: any,
  siteExcerpt: string,
): Promise<{ score: number; summary: string } | null> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return null;

  const prompt = `You are Kayla, the AI verification agent for the Mansa Musa Marketplace / 1325.AI directory of Black-owned businesses.

Evaluate this business submission and return a JSON verdict.

SUBMISSION:
- Business: ${submission.business_name}
- Website: ${submission.website}
- Owner: ${submission.owner_name}
- Location: ${submission.city}, ${submission.state}
- Category: ${submission.category}
- Phone: ${submission.phone}
- Email: ${submission.email}

WEBSITE CONTENT (excerpt):
${siteExcerpt.slice(0, 4000) || "(website content could not be fetched)"}

Return ONLY valid JSON in this exact shape (no markdown, no code fences):
{"score": <integer 0-100>, "summary": "<2-3 sentence verdict for the human admin>"}

Scoring guide:
- 80-100: Website clearly matches the business, category fits, Black-owned strongly indicated
- 60-79: Business appears legitimate but Black-owned status needs manual confirmation
- 40-59: Some red flags (mismatched info, generic site, no Black-owned signals)
- 0-39: Likely spam, fraud, or unrelated business`;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      console.warn("Kayla LLM call failed:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw);
    if (typeof parsed?.score === "number" && typeof parsed?.summary === "string") {
      return { score: Math.max(0, Math.min(100, Math.round(parsed.score))), summary: parsed.summary };
    }
    return null;
  } catch (err) {
    console.warn("Kayla LLM parse error:", err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { submission_id } = await req.json();
    if (!submission_id) {
      return new Response(JSON.stringify({ error: "Missing submission_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: submission, error: fetchErr } = await supabase
      .from("business_submissions")
      .select("*")
      .eq("id", submission_id)
      .single();

    if (fetchErr || !submission) {
      return new Response(JSON.stringify({ error: "Submission not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Duplicate check — has this website already been submitted or listed?
    const { data: dupes } = await supabase
      .from("business_submissions")
      .select("id")
      .neq("id", submission_id)
      .ilike("website", submission.website)
      .limit(1);

    const { data: existingBusinesses } = await supabase
      .from("businesses")
      .select("id")
      .ilike("website", submission.website)
      .limit(1);

    const isDuplicate = (dupes?.length ?? 0) > 0 || (existingBusinesses?.length ?? 0) > 0;

    // Run all checks
    const liveCheck = await checkWebsiteLive(submission.website);
    const siteText = liveCheck.status !== "fail" ? await fetchSiteText(submission.website) : "";
    const phoneCheck = checkPhoneOnSite(siteText, submission.phone);
    const locationCheck = checkCityOnSite(siteText, submission.city, submission.state);
    const blackOwnedCheck = checkBlackOwnedSignals(siteText, submission.business_name);

    const duplicateCheck: KaylaCheck = isDuplicate
      ? { name: "Duplicate check", status: "fail", detail: "This website is already submitted or listed." }
      : { name: "Duplicate check", status: "pass", detail: "No duplicate submissions or listings found." };

    // Ask Kayla LLM for overall verdict
    const kaylaVerdict = await askKaylaForVerdict(submission, siteText);

    // Compute a heuristic confidence score
    const checks = [liveCheck, phoneCheck, locationCheck, blackOwnedCheck, duplicateCheck];
    const weights: Record<string, number> = {
      "Website is live": 20,
      "Phone on website": 15,
      "Location on website": 15,
      "Black-owned signals": 25,
      "Duplicate check": 25,
    };
    let heuristicScore = 0;
    for (const c of checks) {
      const w = weights[c.name] ?? 0;
      if (c.status === "pass") heuristicScore += w;
      else if (c.status === "warn") heuristicScore += w * 0.5;
    }
    heuristicScore = Math.round(heuristicScore);

    // Blend Kayla's LLM score with the heuristic
    const finalScore = kaylaVerdict
      ? Math.round((heuristicScore + kaylaVerdict.score) / 2)
      : heuristicScore;

    const report = {
      checks,
      llm_summary: kaylaVerdict?.summary ?? "Kayla LLM verdict unavailable — see heuristic checks only.",
      heuristic_score: heuristicScore,
      llm_score: kaylaVerdict?.score ?? null,
      verified_at: new Date().toISOString(),
    };

    await supabase
      .from("business_submissions")
      .update({
        kayla_report: report,
        confidence_score: finalScore,
        status: "pending_review",
      })
      .eq("id", submission_id);

    return new Response(
      JSON.stringify({ ok: true, confidence_score: finalScore, report }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("verify-business-submission error:", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
