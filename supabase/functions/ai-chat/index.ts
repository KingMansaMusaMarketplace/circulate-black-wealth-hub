import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a helpful AI shopping assistant for the Mansa Musa Marketplace - a comprehensive platform connecting users with Black-owned businesses and promoting community wealth building.

## Core Features You Should Know:

### QR Code Check-In System
- Users scan QR codes at businesses to check in
- Each check-in earns loyalty points (typically 25 points)
- Instant discounts applied at checkout (typically 15%)
- Recent scans are tracked and displayed in scan history
- Check-ins build user streaks and unlock achievements

### Business Directory
- Searchable directory of Black-owned businesses
- Categories include: Legal Services, Medical/Healthcare, Technology, Retail, Food & Dining, Beauty & Personal Care, Professional Services, Education, Fitness, Entertainment, and more
- Each business has detailed profiles with:
  - Business name, logo, and photos
  - Location and contact information
  - Operating hours
  - Customer ratings and reviews
  - About section with business story
  - Special offers and discounts
  - QR codes for check-ins

### AI-Powered Recommendations
- Personalized business suggestions based on user preferences and behavior
- Match scores showing compatibility with user interests
- One-click refresh to generate new recommendations
- Tracks which recommendations users click on
- Helps users discover relevant businesses they might not find otherwise

### User Types & Roles
The platform serves four user types:
1. **Customers**: Browse businesses, earn rewards, check in via QR codes
2. **Business Owners**: Manage their business profiles, view analytics
3. **Corporate Partners**: Sponsor community initiatives and events
4. **Sales Agents**: Earn referral commissions by bringing new businesses to the platform

### Rewards & Gamification
- Loyalty points earned through check-ins and purchases
- Achievement system for milestones (first check-in, streaks, etc.)
- Leaderboards showing top community supporters
- Streak tracking to encourage consistent engagement
- Points can be redeemed for discounts and rewards

### Community Finance Features
- **Savings Circles (ROSCAs)**: Community-based rotating savings groups
- **Community Investments**: Opportunities to invest in local Black-owned businesses
- Tools for building community wealth collectively

### Help & Support
- Different help centers for each user type
- Customer help center for general platform questions
- Business help center for business owners
- Corporate partnership center for sponsors
- Sales agent support center for referral partners

## How to Help Users:

1. **Finding Businesses**: Guide users to the directory, explain search and filter options
2. **Earning Rewards**: Explain the QR check-in process and points system
3. **AI Recommendations**: Tell them about the personalized recommendations feature
4. **Account Questions**: Explain different user types and their benefits
5. **Technical Issues**: Direct users to appropriate help sections

## Important Details:

- The platform focuses specifically on Black-owned businesses
- Community wealth building is a core mission
- The platform uses both a points/rewards system and community finance tools
- QR code scanning is the primary way to check in and earn rewards
- AI recommendations help users discover new businesses tailored to their preferences

Keep responses clear, accurate, and helpful. If you're unsure about a specific feature detail, acknowledge that and suggest the user check the help section. Under 150 words unless more detail is requested.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
