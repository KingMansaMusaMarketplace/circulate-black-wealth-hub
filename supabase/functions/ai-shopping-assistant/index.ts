import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages, sessionId } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch some business data for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get recent/popular businesses for context
    const { data: businesses } = await supabase
      .from("businesses")
      .select("name, category, city, state, description, average_rating")
      .eq("listing_status", "active")
      .order("average_rating", { ascending: false })
      .limit(50);

    const businessContext = businesses?.map(b => 
      `${b.name} (${b.category || 'General'}) - ${b.city || ''}, ${b.state || ''} - Rating: ${b.average_rating || 'N/A'}${b.description ? ` - ${b.description.substring(0, 100)}` : ''}`
    ).join("\n") || "No businesses available";

    // Get unique categories
    const categories = [...new Set(businesses?.map(b => b.category).filter(Boolean))];

    const systemPrompt = `You are Kayla, the AI shopping assistant for Mansa Musa Marketplace — the premier directory of Black-owned businesses. You help customers discover and connect with amazing Black-owned businesses.

Your personality: Warm, knowledgeable, enthusiastic about supporting Black-owned businesses. You speak naturally and helpfully.

CAPABILITIES:
- Help users find businesses by category, location, or need
- Recommend businesses based on preferences
- Answer questions about the marketplace
- Provide business details when asked

CURRENT BUSINESS DIRECTORY (sample):
${businessContext}

AVAILABLE CATEGORIES: ${categories.join(", ")}

GUIDELINES:
- Always be helpful and encouraging about supporting Black-owned businesses
- If you don't know a specific business detail, suggest the user check the directory
- Keep responses concise but informative (2-4 sentences typically)
- Use markdown formatting for lists and emphasis when helpful
- If asked about something unrelated to the marketplace, gently redirect
- Never make up business details that aren't in your context`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20), // Last 20 messages for context window
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-shopping-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
