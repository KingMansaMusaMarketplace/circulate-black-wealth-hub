import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLACEHOLDER_PATTERNS = [
  "placeholder", "default-banner", "default-logo", "unsplash.com",
  "restaurant-banner.jpg", "${", "{{",
];

const isPlaceholder = (url: string | null): boolean => {
  if (!url) return true;
  const lc = url.toLowerCase().trim();
  if (!lc) return true;
  return PLACEHOLDER_PATTERNS.some(p => lc.includes(p));
};

async function callAI(prompt: string, systemPrompt: string): Promise<string | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return null;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════
// ADAPTIVE LEARNING MODULE
// ══════════════════════════════════════════
interface LearningContext {
  preferredTone?: string;
  avoidPatterns: string[];
  confidenceThreshold: number;
}

async function getLearningContext(
  supabase: any,
  serviceType: string
): Promise<LearningContext> {
  const ctx: LearningContext = { avoidPatterns: [], confidenceThreshold: 0.5 };
  try {
    const { data: signals } = await supabase
      .from("kayla_learning_signals")
      .select("signal_type, signal_key, signal_value, confidence")
      .eq("service_type", serviceType)
      .gte("confidence", 0.4);

    for (const s of signals || []) {
      if (s.signal_type === "preference" && s.signal_key === "tone") {
        ctx.preferredTone = (s.signal_value as any)?.value;
      } else if (s.signal_type === "avoidance") {
        ctx.avoidPatterns.push(s.signal_key);
      }
    }

    // Adjust threshold based on recent success rate
    const { data: recent } = await supabase
      .from("kayla_outcome_feedback")
      .select("outcome")
      .eq("service_type", serviceType)
      .order("created_at", { ascending: false })
      .limit(50);

    if (recent && recent.length >= 10) {
      const accepted = recent.filter((f: any) => f.outcome === "accepted").length;
      const rate = accepted / recent.length;
      if (rate < 0.5) ctx.confidenceThreshold = Math.min(0.9, ctx.confidenceThreshold + 0.15);
    }
  } catch (e) {
    console.warn("Learning context load error:", e);
  }
  return ctx;
}

function applyLearningToPrompt(basePrompt: string, ctx: LearningContext): string {
  const adds: string[] = [];
  if (ctx.preferredTone) adds.push(`Use a ${ctx.preferredTone} tone — preferred in past interactions.`);
  if (ctx.avoidPatterns.length) adds.push(`AVOID these previously rejected patterns: ${ctx.avoidPatterns.join(", ")}`);
  return adds.length ? `${basePrompt}\n\n--- ADAPTIVE CONTEXT ---\n${adds.join("\n")}` : basePrompt;
}

async function updateLearningSignals(supabase: any, serviceType: string) {
  try {
    const { data: feedback } = await supabase
      .from("kayla_outcome_feedback")
      .select("outcome, action_type, confidence_score")
      .eq("service_type", serviceType)
      .not("outcome", "eq", "pending")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!feedback?.length || feedback.length < 5) return;
    const accepted = feedback.filter((f: any) => f.outcome === "accepted").length;
    const rejected = feedback.filter((f: any) => f.outcome === "rejected").length;
    const total = accepted + rejected;
    if (!total) return;

    const successRate = accepted / total;

    await supabase.from("kayla_learning_signals").upsert({
      service_type: serviceType,
      signal_type: "threshold",
      signal_key: "success_rate",
      signal_value: { rate: successRate, sample_size: total },
      confidence: Math.min(0.99, 0.5 + (total / 200)),
      sample_count: total,
      last_updated_at: new Date().toISOString(),
    }, { onConflict: "service_type,signal_type,signal_key" });

    // Detect action-type patterns
    const actionTypes = [...new Set(feedback.map((f: any) => f.action_type))];
    for (const at of actionTypes) {
      const atF = feedback.filter((f: any) => f.action_type === at);
      const atAcc = atF.filter((f: any) => f.outcome === "accepted").length;
      const atTot = atF.filter((f: any) => f.outcome !== "pending").length;
      if (atTot < 3) continue;
      const atRate = atAcc / atTot;
      
      if (atRate < 0.3) {
        await supabase.from("kayla_learning_signals").upsert({
          service_type: serviceType,
          signal_type: "avoidance",
          signal_key: at,
          signal_value: { rejection_rate: 1 - atRate, sample_size: atTot },
          confidence: Math.min(0.99, 0.5 + (atTot / 50)),
          sample_count: atTot,
          last_updated_at: new Date().toISOString(),
        }, { onConflict: "service_type,signal_type,signal_key" });
      } else if (atRate > 0.8) {
        await supabase.from("kayla_learning_signals").upsert({
          service_type: serviceType,
          signal_type: "preference",
          signal_key: at,
          signal_value: { acceptance_rate: atRate, sample_size: atTot },
          confidence: Math.min(0.99, 0.5 + (atTot / 50)),
          sample_count: atTot,
          last_updated_at: new Date().toISOString(),
        }, { onConflict: "service_type,signal_type,signal_key" });
      }
    }

    // Save performance snapshot
    const now = new Date();
    await supabase.from("kayla_performance_metrics").insert({
      service_type: serviceType,
      period_start: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      period_end: now.toISOString(),
      total_actions: total,
      accepted_count: accepted,
      rejected_count: rejected,
      modified_count: feedback.filter((f: any) => f.outcome === "modified").length,
      ignored_count: feedback.filter((f: any) => f.outcome === "ignored").length,
      success_rate: Math.round(successRate * 100),
    });
  } catch (e) {
    console.warn("Learning signal update error:", e);
  }
}

// ══════════════════════════════════════════
// SERVICE 1: Smart Review Responder
// ══════════════════════════════════════════
async function runReviewResponder(supabase: any) {
  const results: string[] = [];

  // Find reviews without a draft response
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, business_id, rating, review_text, customer_id")
    .not("review_text", "is", null)
    .neq("review_text", "")
    .order("created_at", { ascending: false })
    .limit(20);

  if (!reviews?.length) return { results: ["No new reviews to process"], count: 0 };

  // Get existing drafts to skip
  const reviewIds = reviews.map((r: any) => r.id);
  const { data: existingDrafts } = await supabase
    .from("kayla_review_drafts")
    .select("review_id")
    .in("review_id", reviewIds);

  const draftedIds = new Set((existingDrafts || []).map((d: any) => d.review_id));
  const newReviews = reviews.filter((r: any) => !draftedIds.has(r.id));

  if (!newReviews.length) return { results: ["All recent reviews already have drafts"], count: 0 };

  // Load adaptive learning context for reviews
  const reviewCtx = await getLearningContext(supabase, "reviews");

  let drafted = 0;
  for (const review of newReviews.slice(0, 10)) {
    // Get business name
    const { data: biz } = await supabase
      .from("businesses")
      .select("business_name, name, category")
      .eq("id", review.business_id)
      .single();

    const bizName = biz?.business_name || biz?.name || "the business";
    const sentiment = review.rating >= 4 ? "positive" : review.rating >= 3 ? "neutral" : "negative";

    const basePrompt = `You draft professional, warm review responses for "${bizName}" (${biz?.category || "business"}). 
Keep responses 2-3 sentences. For positive reviews: thank them genuinely, mention something specific they said. 
For negative reviews: apologize sincerely, acknowledge the issue, offer to make it right. 
Never be defensive. Sound human, not corporate. Sign off with the business name.`;

    const draft = await callAI(
      `Review (${review.rating}/5 stars): "${review.review_text}"`,
      applyLearningToPrompt(basePrompt, reviewCtx)
    );

    if (draft) {
      await supabase.from("kayla_review_drafts").insert({
        review_id: review.id,
        business_id: review.business_id,
        draft_response: draft,
        sentiment,
      });
      drafted++;
      results.push(`✍️ Drafted ${sentiment} response for ${bizName}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  return { results, count: drafted };
}

// ══════════════════════════════════════════
// SERVICE 2: Onboarding Concierge
// ══════════════════════════════════════════
async function runOnboardingConcierge(supabase: any) {
  const results: string[] = [];

  // Find businesses created in last 7 days that are incomplete
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: newBiz } = await supabase
    .from("businesses")
    .select("id, name, business_name, owner_id, description, logo_url, banner_url, website, category, city, state")
    .gte("created_at", sevenDaysAgo)
    .not("owner_id", "is", null)
    .limit(10);

  if (!newBiz?.length) return { results: ["No new businesses needing onboarding"], count: 0 };

  let helped = 0;
  for (const biz of newBiz) {
    const name = biz.business_name || biz.name || "Unknown";
    const updates: Record<string, any> = {};

    // Auto-generate description if missing
    if (!biz.description) {
      const desc = await callAI(
        `Write a description for: "${name}"${biz.category ? `, category: ${biz.category}` : ""}${biz.city ? `, in ${biz.city}${biz.state ? `, ${biz.state}` : ""}` : ""}`,
        "Write concise, warm, professional business descriptions. 2-3 sentences max. Be specific and authentic."
      );
      if (desc && desc.length > 20) {
        updates.description = desc;
        results.push(`📝 Generated description for new business "${name}"`);
      }
    }

    if (Object.keys(updates).length > 0) {
      updates.updated_at = new Date().toISOString();
      await supabase.from("businesses").update(updates).eq("id", biz.id);
      helped++;
    }

    // Send welcome notification if they haven't received one
    if (biz.owner_id) {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .eq("user_id", biz.owner_id)
        .eq("type", "kayla_welcome");

      if (!count) {
        const missing: string[] = [];
        if (!biz.logo_url || isPlaceholder(biz.logo_url)) missing.push("logo");
        if (!biz.banner_url || isPlaceholder(biz.banner_url)) missing.push("banner photo");
        if (!biz.website) missing.push("website");

        const welcomeMsg = missing.length > 0
          ? `Welcome to the 1325 community, ${name}! 🎉 I'm Kayla, your AI concierge. I've started setting up your profile. To get 3x more visibility, add your ${missing.join(", ")}. Need help? Just ask!`
          : `Welcome to the 1325 community, ${name}! 🎉 I'm Kayla, your AI concierge. Your profile looks great! I'll keep an eye on your reviews and help you grow.`;

        await supabase.from("notifications").insert({
          user_id: biz.owner_id,
          type: "kayla_welcome",
          title: "Welcome! Kayla here 👋",
          message: welcomeMsg,
          metadata: { business_id: biz.id },
        });
        results.push(`👋 Sent welcome to "${name}"`);
        helped++;
      }
    }

    await new Promise(r => setTimeout(r, 500));
  }

  return { results, count: helped };
}

// ══════════════════════════════════════════
// SERVICE 3: Churn Predictor
// ══════════════════════════════════════════
async function runChurnPredictor(supabase: any) {
  const results: string[] = [];

  // Find business owners who haven't logged in or had activity in 30+ days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: inactiveOwners } = await supabase
    .from("businesses")
    .select("id, name, business_name, owner_id, updated_at")
    .not("owner_id", "is", null)
    .lt("updated_at", thirtyDaysAgo)
    .limit(20);

  if (!inactiveOwners?.length) return { results: ["No inactive businesses detected"], count: 0 };

  let nudged = 0;
  for (const biz of inactiveOwners) {
    if (!biz.owner_id) continue;
    const name = biz.business_name || biz.name || "Unknown";

    // Check if we already nudged in last 14 days
    const { count: recentNudge } = await supabase
      .from("notifications")
      .select("id", { count: "exact" })
      .eq("user_id", biz.owner_id)
      .eq("type", "kayla_reengagement")
      .gte("created_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());

    if ((recentNudge || 0) > 0) continue;

    await supabase.from("notifications").insert({
      user_id: biz.owner_id,
      type: "kayla_reengagement",
      title: "We miss you! 💛",
      message: `Hey! It's Kayla. "${name}" hasn't been updated in a while. Businesses that update weekly get 5x more customer engagement. Want me to refresh your listing or generate some social media content?`,
      metadata: { business_id: biz.id, days_inactive: Math.floor((Date.now() - new Date(biz.updated_at).getTime()) / 86400000) },
    });
    nudged++;
    results.push(`📬 Re-engagement nudge sent to "${name}" owner`);
  }

  return { results, count: nudged };
}

// ══════════════════════════════════════════
// SERVICE 4: AI Business Matchmaker
// ══════════════════════════════════════════
async function runBusinessMatchmaker(supabase: any) {
  const results: string[] = [];

  // Get open needs
  const { data: needs } = await supabase
    .from("business_needs")
    .select("id, business_id, title, category, subcategory, description, urgency")
    .eq("status", "open")
    .limit(10);

  if (!needs?.length) return { results: ["No open business needs to match"], count: 0 };

  let matched = 0;
  for (const need of needs) {
    // Find capabilities matching the category
    const { data: capabilities } = await supabase
      .from("business_capabilities")
      .select("id, business_id, title, category, subcategory, description, service_area")
      .eq("category", need.category)
      .eq("is_active", true)
      .neq("business_id", need.business_id)
      .limit(5);

    if (!capabilities?.length) continue;

    for (const cap of capabilities) {
      // Check if match already exists
      const { count: existing } = await supabase
        .from("kayla_b2b_matches")
        .select("id", { count: "exact" })
        .eq("buyer_business_id", need.business_id)
        .eq("supplier_business_id", cap.business_id)
        .eq("need_id", need.id);

      if ((existing || 0) > 0) continue;

      // Get business names
      const { data: buyerBiz } = await supabase.from("businesses").select("business_name, name").eq("id", need.business_id).single();
      const { data: supplierBiz } = await supabase.from("businesses").select("business_name, name").eq("id", cap.business_id).single();

      const buyerName = buyerBiz?.business_name || buyerBiz?.name || "Business";
      const supplierName = supplierBiz?.business_name || supplierBiz?.name || "Business";

      const matchReason = await callAI(
        `Buyer needs: "${need.title}" (${need.description || need.category}). Supplier offers: "${cap.title}" (${cap.description || cap.category}).`,
        "Write a 1-sentence explanation of why these two businesses should connect. Be specific and actionable. Example: 'Soul Tacos needs catering for events and Trap Kitchen offers full-service catering within the same area.'"
      );

      if (matchReason) {
        const score = need.category === cap.category && need.subcategory === cap.subcategory ? 90 : 70;

        await supabase.from("kayla_b2b_matches").insert({
          buyer_business_id: need.business_id,
          supplier_business_id: cap.business_id,
          need_id: need.id,
          capability_id: cap.id,
          match_reason: matchReason,
          match_score: score,
        });

        // Notify both parties
        const buyerOwner = await supabase.from("businesses").select("owner_id").eq("id", need.business_id).single();
        const supplierOwner = await supabase.from("businesses").select("owner_id").eq("id", cap.business_id).single();

        if (buyerOwner.data?.owner_id) {
          await supabase.from("notifications").insert({
            user_id: buyerOwner.data.owner_id,
            type: "kayla_b2b_match",
            title: "New business match! 🤝",
            message: `Kayla found a match: ${supplierName} can help with your need "${need.title}". ${matchReason}`,
            metadata: { match_business_id: cap.business_id, need_id: need.id },
          });
        }

        if (supplierOwner.data?.owner_id) {
          await supabase.from("notifications").insert({
            user_id: supplierOwner.data.owner_id,
            type: "kayla_b2b_match",
            title: "New business opportunity! 💰",
            message: `Kayla matched you: ${buyerName} needs "${need.title}" and your "${cap.title}" is a great fit!`,
            metadata: { match_business_id: need.business_id, capability_id: cap.id },
          });
        }

        matched++;
        results.push(`🤝 Matched "${buyerName}" with "${supplierName}" for "${need.title}"`);
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return { results, count: matched };
}

// ══════════════════════════════════════════
// SERVICE 5: Content Generator
// ══════════════════════════════════════════
async function runContentGenerator(supabase: any) {
  const results: string[] = [];

  // Generate content for businesses that haven't had content in 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, business_name, category, description, city, state")
    .eq("is_verified", true)
    .not("owner_id", "is", null)
    .limit(10);

  if (!businesses?.length) return { results: ["No businesses for content generation"], count: 0 };

  let generated = 0;
  for (const biz of businesses) {
    const name = biz.business_name || biz.name || "Unknown";

    // Check if content was recently generated
    const { count: recentContent } = await supabase
      .from("kayla_generated_content")
      .select("id", { count: "exact" })
      .eq("business_id", biz.id)
      .gte("created_at", sevenDaysAgo);

    if ((recentContent || 0) > 0) continue;

    // Generate social media post
    const post = await callAI(
      `Business: "${name}", Category: ${biz.category || "general"}, Location: ${biz.city || ""}${biz.state ? `, ${biz.state}` : ""}, Description: ${biz.description || "N/A"}`,
      `You create engaging social media posts for Black-owned businesses. Write a single Instagram/Facebook-ready post (under 200 characters) that:
- Highlights what makes them special
- Includes 2-3 relevant hashtags
- Has a call to action
- Feels authentic, not salesy
- Uses 1-2 emojis naturally`
    );

    if (post) {
      await supabase.from("kayla_generated_content").insert({
        business_id: biz.id,
        content_type: "social_post",
        content: post,
        platform: "instagram",
      });

      // Notify owner
      const { data: bizOwner } = await supabase.from("businesses").select("owner_id").eq("id", biz.id).single();
      if (bizOwner?.owner_id) {
        await supabase.from("notifications").insert({
          user_id: bizOwner.owner_id,
          type: "kayla_content_ready",
          title: "Fresh content ready! 📱",
          message: `Kayla created a social media post for ${name}. Review and publish it from your dashboard!`,
          metadata: { business_id: biz.id },
        });
      }

      generated++;
      results.push(`📱 Generated social post for "${name}"`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  return { results, count: generated };
}

// ══════════════════════════════════════════
// SERVICE 6: Listing Quality Scorer
// ══════════════════════════════════════════
async function runQualityScorer(supabase: any) {
  const results: string[] = [];

  const { data: businesses, error: bizError } = await supabase
    .from("businesses")
    .select("id, name, business_name, description, logo_url, banner_url, website, phone, email, address, city, state, zip_code, category, average_rating, review_count")
    .limit(50);

  if (bizError) {
    console.error("Scorer query error:", bizError);
    return { results: [`Error querying businesses: ${bizError.message}`], count: 0 };
  }

  if (!businesses?.length) return { results: ["No businesses to score"], count: 0 };

  let scored = 0;
  for (const biz of businesses) {
    const name = biz.business_name || biz.name || "Unknown";
    const breakdown: Record<string, { score: number; max: number; label: string }> = {};
    const tips: string[] = [];

    // Description (15 pts)
    if (biz.description && biz.description.length > 50) {
      breakdown.description = { score: 15, max: 15, label: "Description" };
    } else if (biz.description) {
      breakdown.description = { score: 8, max: 15, label: "Description" };
      tips.push("Expand your description to at least 50 characters for better SEO");
    } else {
      breakdown.description = { score: 0, max: 15, label: "Description" };
      tips.push("Add a business description — it's the #1 factor for discovery");
    }

    // Logo (10 pts)
    if (biz.logo_url && !isPlaceholder(biz.logo_url)) {
      breakdown.logo = { score: 10, max: 10, label: "Logo" };
    } else {
      breakdown.logo = { score: 0, max: 10, label: "Logo" };
      tips.push("Upload your business logo for instant brand recognition");
    }

    // Banner (10 pts)
    if (biz.banner_url && !isPlaceholder(biz.banner_url)) {
      breakdown.banner = { score: 10, max: 10, label: "Banner Image" };
    } else {
      breakdown.banner = { score: 0, max: 10, label: "Banner Image" };
      tips.push("Add a banner photo — listings with images get 3x more clicks");
    }

    // Contact info (15 pts)
    let contactScore = 0;
    if (biz.phone) contactScore += 5;
    else tips.push("Add your phone number so customers can reach you");
    if (biz.email) contactScore += 5;
    else tips.push("Add your email for customer inquiries");
    if (biz.website) contactScore += 5;
    else tips.push("Link your website to drive traffic");
    breakdown.contact = { score: contactScore, max: 15, label: "Contact Info" };

    // Address (15 pts)
    let addressScore = 0;
    if (biz.address) addressScore += 5;
    if (biz.city) addressScore += 5;
    if (biz.state && biz.zip_code) addressScore += 5;
    if (addressScore < 15) tips.push("Complete your full address for local search visibility");
    breakdown.address = { score: addressScore, max: 15, label: "Location" };

    // Category (10 pts)
    if (biz.category) {
      breakdown.category = { score: 10, max: 10, label: "Category" };
    } else {
      breakdown.category = { score: 0, max: 10, label: "Category" };
      tips.push("Set your business category to appear in filtered searches");
    }

    // Hours (10 pts) - column may not exist, skip gracefully
    breakdown.hours = { score: 0, max: 10, label: "Business Hours" };
    tips.push("Add your hours of operation — customers check this first");

    // Reviews (15 pts)
    const reviewScore = Math.min(15, (biz.review_count || 0) * 3);
    breakdown.reviews = { score: reviewScore, max: 15, label: "Customer Reviews" };
    if (reviewScore < 15) tips.push(`Get ${Math.ceil((15 - reviewScore) / 3)} more reviews to maximize your profile score`);

    const totalScore = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0);
    const maxScore = Object.values(breakdown).reduce((sum, b) => sum + b.max, 0);

    // Upsert score
    const { data: existing } = await supabase
      .from("kayla_profile_scores")
      .select("id")
      .eq("business_id", biz.id)
      .maybeSingle();

    if (existing) {
      await supabase.from("kayla_profile_scores").update({
        score: totalScore,
        max_score: maxScore,
        breakdown,
        tips,
        last_calculated_at: new Date().toISOString(),
      }).eq("id", existing.id);
    } else {
      await supabase.from("kayla_profile_scores").insert({
        business_id: biz.id,
        score: totalScore,
        max_score: maxScore,
        breakdown,
        tips,
      });
    }

    scored++;
    if (totalScore < 50) {
      results.push(`⚠️ "${name}": ${totalScore}/${maxScore} — needs attention`);
    }
  }

  results.unshift(`📊 Scored ${scored} businesses`);
  return { results, count: scored };
}

// ══════════════════════════════════════════
// MAIN HANDLER
// ══════════════════════════════════════════
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Authentication: require service role key or valid admin JWT ──
  const authHeader = req.headers.get("Authorization");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const isServiceRole = authHeader === `Bearer ${serviceRoleKey}`;

  if (!isServiceRole) {
    // Check for admin JWT
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const { data: isAdmin } = await userClient.rpc("is_admin_secure");
    if (isAdmin !== true) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as any!,
      serviceRoleKey,
    );

    const body = await req.json().catch(() => ({}));
    const service = body.service || "all";

    const allResults: Record<string, { results: string[]; count: number }> = {};

    if (service === "all" || service === "reviews") {
      console.log("Running: Review Responder");
      allResults.reviews = await runReviewResponder(supabase);
    }
    if (service === "all" || service === "onboarding") {
      console.log("Running: Onboarding Concierge");
      allResults.onboarding = await runOnboardingConcierge(supabase);
    }
    if (service === "all" || service === "churn") {
      console.log("Running: Churn Predictor");
      allResults.churn = await runChurnPredictor(supabase);
    }
    if (service === "all" || service === "matchmaker") {
      console.log("Running: Business Matchmaker");
      allResults.matchmaker = await runBusinessMatchmaker(supabase);
    }
    if (service === "all" || service === "content") {
      console.log("Running: Content Generator");
      allResults.content = await runContentGenerator(supabase);
    }
    if (service === "all" || service === "scorer") {
      console.log("Running: Quality Scorer");
      allResults.scorer = await runQualityScorer(supabase);
    }

    const totalActions = Object.values(allResults).reduce((s, r) => s + r.count, 0);
    const elapsed = Date.now() - startTime;

    // Save report
    const summaryLines = Object.entries(allResults).map(([key, val]) => {
      const icon = { reviews: "✍️", onboarding: "👋", churn: "📬", matchmaker: "🤝", content: "📱", scorer: "📊" }[key] || "🤖";
      return `${icon} ${key}: ${val.count} actions\n${val.results.join("\n")}`;
    });

    await supabase.from("kayla_agent_reports").insert({
      report_type: "kayla_services",
      status: "completed",
      summary: `🤖 Kayla Services Report\n${summaryLines.join("\n\n")}`,
      issues_found: totalActions,
      issues_fixed: totalActions,
      issues_requiring_review: 0,
      details: allResults,
      actions_taken: Object.entries(allResults).flatMap(([key, val]) => val.results),
    });

    // ── Adaptive Learning: update signals from recent outcomes ──
    console.log("Updating adaptive learning signals...");
    const servicesToLearn = Object.keys(allResults);
    for (const svc of servicesToLearn) {
      await updateLearningSignals(supabase, svc);
    }

    console.log(`Kayla services completed in ${elapsed}ms. Total actions: ${totalActions}. Learning signals updated for ${servicesToLearn.length} services.`);

    return new Response(
      JSON.stringify({ success: true, services: allResults, total_actions: totalActions, elapsed_ms: elapsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("kayla-services error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? (error as Error).message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
