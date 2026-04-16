import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { business_id } = await req.json();
    if (!business_id) {
      return new Response(JSON.stringify({ error: "business_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating, review_text, created_at")
      .eq("business_id", business_id)
      .eq("is_flagged", false)
      .order("created_at", { ascending: false })
      .limit(50);

    if (reviewsError) throw reviewsError;
    if (!reviews || reviews.length < 2) {
      return new Response(JSON.stringify({ summary: null, reason: "Not enough reviews to summarize" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check cache
    const reviewHash = reviews.map(r => `${r.rating}:${r.review_text?.substring(0, 20)}`).join("|");
    const simpleHash = btoa(reviewHash).substring(0, 32);

    const { data: cached } = await supabase
      .from("ai_review_summaries")
      .select("*")
      .eq("business_id", business_id)
      .single();

    if (cached && cached.review_hash === simpleHash) {
      return new Response(JSON.stringify({ summary: cached.summary, review_count: cached.review_count, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get business name
    const { data: business } = await supabase
      .from("businesses")
      .select("name, category")
      .eq("id", business_id)
      .single();

    const reviewsText = reviews.map(r => `Rating: ${r.rating}/5 - "${r.review_text || 'No text'}"`).join("\n");
    const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: "You summarize customer reviews for businesses. Write a concise 2-3 sentence summary that highlights what customers love and any areas for improvement. Be balanced and helpful. Do not use markdown. Write in third person.",
          },
          {
            role: "user",
            content: `Summarize these ${reviews.length} reviews for "${business?.name || 'this business'}" (${business?.category || 'General'}). Average rating: ${avgRating}/5.\n\n${reviewsText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const summary = aiData.choices?.[0]?.message?.content || "Unable to generate summary.";

    // Cache the summary using upsert
    await supabase.from("ai_review_summaries").upsert({
      business_id,
      summary,
      review_count: reviews.length,
      review_hash: simpleHash,
      generated_at: new Date().toISOString(),
    }, { onConflict: "business_id" });

    return new Response(JSON.stringify({ summary, review_count: reviews.length, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-review-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
