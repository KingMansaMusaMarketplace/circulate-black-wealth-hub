import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { rider_name, pickup, dropoff, favorite_drivers, context } = await req.json();

    const systemPrompt = `You are Kayla, the AI concierge for Noire Rideshare — a premium, community-centric ride-share platform. 
You provide proactive, personalized dispatch updates. Your tone is warm, professional, and premium — like a high-end concierge.

Key brand values:
- Drivers keep 80% of every fare (flat 20% platform fee)
- Never surge pricing
- Community-first: riders earn credits when visiting Black-owned businesses
- "Favorite Driver" feature lets riders build relationships with drivers

When providing updates:
- Use the driver's first name naturally
- Reference the rider's habits when relevant
- Mention community businesses near the destination
- Keep messages concise but warm (2-3 sentences max)
- Include estimated time when available`;

    const userPrompt = `Generate a proactive dispatch update for this ride:
Rider: ${rider_name || 'Rider'}
Pickup: ${pickup || 'Current location'}
Dropoff: ${dropoff || 'Destination'}
${favorite_drivers?.length ? `Favorite drivers nearby: ${favorite_drivers.map((d: any) => `${d.name} (${d.vehicle}, ${d.rating}★, ${d.distance_min} min away)`).join('; ')}` : 'No favorite drivers currently nearby.'}
${context || ''}

Provide a natural, conversational dispatch message.`;

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "Your ride is being prepared. We'll update you shortly.";

    return new Response(JSON.stringify({ success: true, message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("kayla-dispatch error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
