import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { business_id } = await req.json();
    if (!business_id) {
      return new Response(JSON.stringify({ error: "business_id is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey) as any;

    // Verify ownership
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    }).auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid auth token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("name, category, description, city, state, phone, email, website, address")
      .eq("id", business_id)
      .eq("owner_id", user.id)
      .single();

    if (!business) {
      return new Response(JSON.stringify({ error: "Business not found or not owned by you" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch reviews for context
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating, review_text")
      .eq("business_id", business_id)
      .eq("is_flagged", false)
      .order("created_at", { ascending: false })
      .limit(30);

    const reviewsContext = reviews?.filter(r => r.review_text)
      .map(r => `"${r.review_text}"`)
      .join("\n") || "No reviews yet";

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
            content: `You generate FAQ entries for businesses. Return a JSON array of objects with "question" and "answer" fields. Generate 5-8 relevant FAQ entries based on the business info and customer reviews. Include common questions like hours, location, services, pricing approach, and anything customers frequently ask about in reviews. Keep answers concise (1-2 sentences). Return ONLY the JSON array, no markdown.`,
          },
          {
            role: "user",
            content: `Generate FAQ entries for this business:

Business: ${business.name}
Category: ${business.category || "General"}
Description: ${business.description || "Not provided"}
Location: ${[business.address, business.city, business.state].filter(Boolean).join(", ") || "Not provided"}
Phone: ${business.phone || "Not provided"}
Website: ${business.website || "Not provided"}

Customer Reviews:
${reviewsContext}`,
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_faqs",
            description: "Generate FAQ question-answer pairs for a business",
            parameters: {
              type: "object",
              properties: {
                faqs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      answer: { type: "string" },
                    },
                    required: ["question", "answer"],
                  },
                },
              },
              required: ["faqs"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_faqs" } },
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
    let faqs = [];

    // Extract from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      faqs = parsed.faqs || [];
    }

    return new Response(JSON.stringify({ faqs }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-faq-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
