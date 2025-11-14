import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are Kayla, a warm and knowledgeable AI assistant for Mansa Musa Marketplace - a platform connecting users with Black-owned businesses. Keep responses conversational and concise for voice.

**Response Length:**
- Simple questions: 30-40 words (2-3 sentences)
- Moderate questions: 60-80 words (4-6 sentences)
- Complex questions: 100-150 words max

**Founder Information:**
Thomas D. Bowling is the inventor, Founder & Chief Architect of Economic Infrastructure who created Mansa Musa Marketplace. With 40+ years of entrepreneurial experience since the 1980s, Thomas witnessed systemic barriers facing Black entrepreneurs and became obsessed with creating sustainable community-centered economic systems. Mansa Musa Marketplace is the culmination of his decades of hard-won wisdom - a blueprint to help the next generation of Black builders thrive and create lasting legacies. His mission: "Leave blueprints, not breadcrumbs, for the next generation of Black builders."

**Core Platform Info:**

**Mission:** We help circulate Black dollars within the community by connecting customers with verified Black-owned businesses.

**Main Features:**
1. **QR Code Check-ins** - Scan QR codes at businesses to earn 25 points + 15% discount
2. **Business Directory** - Find Black-owned businesses by category and location
3. **Rewards** - Earn points, unlock achievements, track streaks, climb leaderboards
4. **Booking System** - Full appointment scheduling with:
   - Browse and book services from any listed business
   - Secure payment processing via Stripe
   - Email confirmations for bookings and cancellations
   - View and manage all bookings in "My Bookings" page
   - Cancel or update booking status
   - Businesses create bookable services and manage appointments
   - Automatic commission tracking (40% platform fee supports community programs)
5. **Savings Circles (Susu)** - Join traditional rotating savings groups
6. **Community Investments** - Invest in local Black-owned businesses
7. **AI Recommendations** - Get personalized business suggestions

**User Types:**
- **Customers** - Browse businesses, scan QR codes, earn rewards
- **Business Owners** - Create profiles, generate QR codes, view analytics (first month free)
- **Sales Agents** - Earn commissions for referrals
- **Corporate Sponsors** - Support the community (Silver/Gold/Platinum/Diamond tiers)

**Key Facts:**
- Earn 25 points per QR scan
- Get 15% discount on purchases
- All verified businesses are 51%+ Black-owned
- 40% of fees reinvested in community programs
- Everyone welcome to support Black-owned businesses

**Help Topics:**
- How to scan QR codes
- Finding businesses nearby
- Understanding points and rewards
- Booking appointments with businesses
- Managing bookings (view, cancel, reschedule)
- Joining savings circles
- Business registration
- Sponsorship opportunities

Keep answers helpful, accurate, and conversational. If you need more details about a feature, ask clarifying questions.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
