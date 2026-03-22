import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json().catch(() => ({}));
    const { event_type, record_id, target_service } = body;

    // If called without specific event, process pending queue (sweep mode)
    if (!event_type) {
      return await processPendingEvents(supabase, startTime);
    }

    console.log(`[Kayla Event] Processing: ${event_type} → ${target_service} (record: ${record_id})`);

    // Claim the event (set to processing)
    const { data: event } = await supabase
      .from("kayla_event_queue")
      .update({ status: "processing" })
      .eq("record_id", record_id)
      .eq("event_type", event_type)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .select()
      .single();

    if (!event) {
      console.log(`[Kayla Event] No pending event found for ${event_type}:${record_id} — already processed or deduped`);
      return jsonResponse({ success: true, skipped: true, reason: "already_processed" });
    }

    // Route to the correct service
    let result: { success: boolean; message: string };
    try {
      result = await routeToService(supabase, event);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown service error";
      console.error(`[Kayla Event] Service error for ${event_type}:`, errorMsg);

      // Mark as failed
      await supabase
        .from("kayla_event_queue")
        .update({
          status: event.retry_count >= event.max_retries - 1 ? "failed" : "pending",
          error_message: errorMsg,
          retry_count: event.retry_count + 1,
        })
        .eq("id", event.id);

      return jsonResponse({ success: false, error: errorMsg }, 500);
    }

    // Mark as completed
    await supabase
      .from("kayla_event_queue")
      .update({ status: "completed", processed_at: new Date().toISOString() })
      .eq("id", event.id);

    const elapsed = Date.now() - startTime;
    console.log(`[Kayla Event] Completed ${event_type} in ${elapsed}ms: ${result.message}`);

    return jsonResponse({ success: true, event_type, result, elapsed_ms: elapsed });
  } catch (error) {
    console.error("[Kayla Event] Fatal error:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});

// ═══════════════════════════════════════════
// SERVICE ROUTER
// ═══════════════════════════════════════════
async function routeToService(
  supabase: ReturnType<typeof createClient>,
  event: { event_type: string; target_service: string; payload: Record<string, unknown>; record_id: string }
): Promise<{ success: boolean; message: string }> {
  const { event_type, target_service, payload, record_id } = event;

  switch (target_service) {
    case "reviews":
      return await handleReviewEvent(supabase, payload, record_id);
    case "onboarding":
      return await handleOnboardingEvent(supabase, payload, record_id);
    case "content":
      return await handleContentEvent(supabase, payload, record_id);
    case "scorer":
      return await handleScorerEvent(supabase, payload, record_id);
    case "matchmaker":
      return await handleMatchmakerEvent(supabase, payload, record_id);
    case "churn":
      return await handleChurnEvent(supabase, payload, record_id);
    default:
      // Fallback: delegate to kayla-services with specific service param
      return await delegateToKaylaServices(target_service);
  }
}

// ═══════════════════════════════════════════
// INDIVIDUAL SERVICE HANDLERS
// ═══════════════════════════════════════════

async function handleReviewEvent(
  supabase: ReturnType<typeof createClient>,
  payload: Record<string, unknown>,
  recordId: string
): Promise<{ success: boolean; message: string }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return { success: false, message: "No AI API key" };

  // Get the review with business info
  const { data: review } = await supabase
    .from("reviews")
    .select("*, businesses(business_name, category)")
    .eq("id", recordId)
    .single();

  if (!review) return { success: true, message: "Review not found, skipping" };

  // Generate AI response draft
  const prompt = `Write a professional, warm response to this ${review.rating}-star review for "${review.businesses?.business_name}" (${review.businesses?.category}). Review text: "${review.review_text}". Keep it under 100 words, authentic, and grateful.`;

  const aiResponse = await callAI(LOVABLE_API_KEY, prompt, "You are Kayla, an AI business concierge. Write review responses that are warm, professional, and specific to the feedback given.");

  if (aiResponse) {
    await supabase.from("ai_agent_actions").insert({
      action_type: "review_response_draft",
      business_id: review.business_id,
      target_type: "review",
      target_id: recordId,
      action_data: { draft_response: aiResponse, rating: review.rating },
      ai_confidence: review.rating >= 4 ? 0.9 : 0.7,
      ai_reasoning: `Auto-generated response for ${review.rating}-star review`,
      status: review.rating >= 4 ? "auto_approved" : "pending_review",
      requires_approval: review.rating < 4,
    });

    // Surface as business insight
    await supabase.from("kayla_business_insights").insert({
      business_id: review.business_id,
      insight_type: "review_draft",
      title: `${review.rating}★ Review Response Ready`,
      content: aiResponse,
      status: "pending",
      metadata: { review_id: recordId, rating: review.rating, reviewer_text: review.review_text },
    });
  }

  return { success: true, message: `Review response drafted (${review.rating}★)` };
}

async function handleOnboardingEvent(
  supabase: ReturnType<typeof createClient>,
  payload: Record<string, unknown>,
  recordId: string
): Promise<{ success: boolean; message: string }> {
  // Check if user has a business
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, user_type")
    .eq("id", recordId)
    .single();

  if (!profile) return { success: true, message: "Profile not found, skipping" };

  // Create a welcome notification
  await supabase.from("notifications").insert({
    user_id: recordId,
    title: "Welcome to 1325! 🎉",
    message: `Hey ${profile.full_name || "there"}! I'm Kayla, your AI concierge. I'm here to help you discover Black-owned businesses and make the most of our marketplace.`,
    type: "system",
    is_read: false,
  });

  return { success: true, message: `Welcome message sent to ${profile.full_name || recordId}` };
}

async function handleContentEvent(
  supabase: ReturnType<typeof createClient>,
  payload: Record<string, unknown>,
  recordId: string
): Promise<{ success: boolean; message: string }> {
  // Log the booking event for future content generation
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, businesses(business_name, category)")
    .eq("id", recordId)
    .single();

  if (!booking) return { success: true, message: "Booking not found, skipping" };

  // Create a post-booking follow-up notification
  await supabase.from("notifications").insert({
    user_id: booking.user_id,
    title: "Booking Confirmed! 📅",
    message: `Your booking with ${booking.businesses?.business_name || "the business"} is confirmed. Don't forget to leave a review after your visit!`,
    type: "booking",
    is_read: false,
  });

  return { success: true, message: `Booking follow-up queued for ${booking.businesses?.business_name}` };
}

async function handleScorerEvent(
  supabase: ReturnType<typeof createClient>,
  payload: Record<string, unknown>,
  recordId: string
): Promise<{ success: boolean; message: string }> {
  const { data: business } = await supabase
    .from("businesses")
    .select("id, business_name, description, logo_url, banner_image_url, phone, email, website, address, city, state")
    .eq("id", recordId)
    .single();

  if (!business) return { success: true, message: "Business not found, skipping" };

  // Calculate quality score
  let score = 0;
  const fields = ["business_name", "description", "phone", "email", "address", "city", "state"];
  for (const f of fields) {
    if (business[f as keyof typeof business]) score += 10;
  }
  if (business.logo_url) score += 15;
  if (business.banner_image_url) score += 15;

  // Store the quality score
  await supabase.from("ai_agent_actions").insert({
    action_type: "quality_score",
    business_id: recordId,
    target_type: "business",
    target_id: recordId,
    action_data: { quality_score: score, max_score: 100 },
    ai_confidence: 0.95,
    ai_reasoning: `Listing completeness: ${score}/100`,
    status: "completed",
    requires_approval: false,
  });

  return { success: true, message: `Quality scored ${business.business_name}: ${score}/100` };
}

async function handleMatchmakerEvent(
  supabase: ReturnType<typeof createClient>,
  payload: Record<string, unknown>,
  recordId: string
): Promise<{ success: boolean; message: string }> {
  // Log the B2B connection for matchmaker processing
  const { data: connection } = await supabase
    .from("b2b_connections")
    .select("buyer_business_id, supplier_business_id, connection_type, status")
    .eq("id", recordId)
    .single();

  if (!connection) return { success: true, message: "Connection not found, skipping" };

  return { success: true, message: `B2B connection tracked: ${connection.connection_type}` };
}

async function handleChurnEvent(
  supabase: ReturnType<typeof createClient>,
  payload: Record<string, unknown>,
  recordId: string
): Promise<{ success: boolean; message: string }> {
  // Churn is typically batch-processed, so this is a placeholder for individual signals
  return { success: true, message: "Churn signal recorded" };
}

// ═══════════════════════════════════════════
// SWEEP MODE: Process pending events in batch
// ═══════════════════════════════════════════
async function processPendingEvents(
  supabase: ReturnType<typeof createClient>,
  startTime: number
): Promise<Response> {
  console.log("[Kayla Event] Sweep mode: processing pending events");

  // Get pending events, including failed ones ready for retry
  const { data: pendingEvents } = await supabase
    .from("kayla_event_queue")
    .select("*")
    .in("status", ["pending", "failed"])
    .lt("retry_count", 3)
    .order("created_at", { ascending: true })
    .limit(50);

  if (!pendingEvents?.length) {
    return jsonResponse({ success: true, message: "No pending events", processed: 0 });
  }

  let processed = 0;
  let errors = 0;

  for (const event of pendingEvents) {
    try {
      await supabase
        .from("kayla_event_queue")
        .update({ status: "processing" })
        .eq("id", event.id);

      const result = await routeToService(supabase, event);

      await supabase
        .from("kayla_event_queue")
        .update({ status: "completed", processed_at: new Date().toISOString() })
        .eq("id", event.id);

      processed++;
    } catch (err) {
      errors++;
      await supabase
        .from("kayla_event_queue")
        .update({
          status: event.retry_count >= 2 ? "failed" : "pending",
          error_message: err instanceof Error ? err.message : "Unknown error",
          retry_count: event.retry_count + 1,
        })
        .eq("id", event.id);
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[Kayla Event] Sweep complete: ${processed} processed, ${errors} errors in ${elapsed}ms`);

  return jsonResponse({
    success: true,
    mode: "sweep",
    processed,
    errors,
    elapsed_ms: elapsed,
  });
}

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
async function delegateToKaylaServices(service: string): Promise<{ success: boolean; message: string }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const res = await fetch(`${supabaseUrl}/functions/v1/kayla-services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ service }),
  });

  const data = await res.json();
  return { success: data.success, message: `Delegated to kayla-services: ${service}` };
}

async function callAI(apiKey: string, prompt: string, systemPrompt: string): Promise<string | null> {
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
      "Content-Type": "application/json",
    },
  });
}
