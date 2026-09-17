import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { routeAgents } from "../_shared/kayla-agent-router.ts";
import { buildKaylaSystemPrompt, classifyQuery, fetchAIWithRetry } from "../_shared/kayla-brain.ts";
import { retrieveRAGContext, retrievePersonalMemory, persistSession, resolveSessionId } from "../_shared/kayla-memory.ts";
import { gatherLiveGrounding, resolveOwnedBusinessId } from "../_shared/kayla-grounding.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// Sanitize user input for AI prompts to prevent injection attacks
function sanitizeForPrompt(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, 10000) // Limit length
    .replace(/\{\{|\}\}/g, '') // Remove template markers
    .trim();
}

// Sanitize message array
function sanitizeMessages(messages: any[]): { role: string; content: string }[] {
  if (!Array.isArray(messages)) return [];
  
  return messages
    .filter(msg => msg && typeof msg === 'object' && msg.role && msg.content)
    .slice(0, 50) // Limit number of messages
    .map(msg => ({
      role: String(msg.role).substring(0, 20),
      content: sanitizeForPrompt(String(msg.content))
    }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ========== AUTHENTICATION CHECK ==========
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit by user ID
    if (!checkRateLimit(user.id, 20, 60000)) {
      console.log(`Rate limit exceeded for user: ${user.id}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Authenticated user: ${user.id}`);
    // ========== END AUTHENTICATION CHECK ==========

    const requestBody = await req.json();
    const messages = sanitizeMessages(requestBody.messages);

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Lovable AI Gateway (auto-provisioned LOVABLE_API_KEY).
    // Per platform policy: never call external AI providers directly from edge functions.
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    let isAdmin = false;
    try {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();
      
      if (!roleError && roleData) {
        isAdmin = true;
        console.log(`User ${user.id} verified as admin`);
      }
    } catch (e) {
      console.log("Admin role check completed, user is not admin");
    }

    // ===== ONE BRAIN: the shared Kayla prompt, identical everywhere =====
    let systemPrompt = buildKaylaSystemPrompt({ isAdmin });

    // ===== MEMORY: this chat used to have none. Now it remembers. =====
    const sessionId = resolveSessionId(requestBody.session_id);
    await persistSession(supabase, sessionId, user.id, messages);

    const lastUserMsg = String(messages[messages.length - 1]?.content || "");

    // ===== ROUTING: how hard should Kayla think about this? =====
    const { category, reason } = await classifyQuery(lastUserMsg, LOVABLE_API_KEY);
    console.log(`[ai-chat] category=${category} (${reason})`);

    // ===== GROUNDING: pull real platform records + personal memory =====
    const ownedBusinessId = await resolveOwnedBusinessId(supabase, user.id);

    const [ragContext, personalMemory, grounding] = await Promise.all([
      category === "simple" && !/business|restaurant|shop|store|find|near|recommend|review|event/i.test(lastUserMsg)
        ? Promise.resolve("")
        : retrieveRAGContext(lastUserMsg, LOVABLE_API_KEY, supabase),
      retrievePersonalMemory(user.id, supabase, sessionId),
      // CHECK BEFORE YOU ANSWER: real lookups against the live directory, the
      // person's own account/business numbers, and the live web.
      gatherLiveGrounding({
        supabase,
        question: lastUserMsg,
        lovableApiKey: LOVABLE_API_KEY,
        userId: user.id,
        businessId: ownedBusinessId,
      }),
    ]);
    if (ragContext) systemPrompt += ragContext;
    if (personalMemory) systemPrompt += personalMemory;
    if (grounding.block) systemPrompt += grounding.block;
    if (grounding.calls.length) {
      console.log(`[ai-chat] grounding: ${grounding.calls.map((c) => c.tool).join(", ")}`);
    }

    // Simple questions stay on the fast model; anything harder gets the
    // deeper one. When the router was unsure it already escalated upward.
    const model = category === "simple"
      ? "google/gemini-3.7-flash"
      : "google/gemini-3.1-pro-preview";
    console.log(`[ai-chat] model=${model}`);

    const response = await fetchAIWithRetry(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      },
      { label: "ai-chat" },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires additional credits. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Server-confirmed orchestration: tell the client which Kayla
    // specialists are contributing, BEFORE any model deltas arrive.
    const agents = routeAgents(lastUserMsg);

    const encoder = new TextEncoder();
    const agentEvent = encoder.encode(
      `data: ${JSON.stringify({ agents, session_id: sessionId, model_used: model, depth: category })}\n\n`,
    );
    const upstream = response.body!;
    const combined = new ReadableStream({
      async start(controller) {
        controller.enqueue(agentEvent);
        const reader = upstream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(combined, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
