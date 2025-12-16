import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
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

    // Base system prompt for all authenticated users
    let systemPrompt = `You are Kayla, a warm and knowledgeable AI assistant for Mansa Musa Marketplace - a platform connecting users with Black-owned businesses. Keep responses conversational and concise for voice.

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
4. **Booking System** - Full appointment scheduling with secure payment processing
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
- Sponsorship opportunities`;

    // Add admin-specific knowledge ONLY if user is verified admin
    if (isAdmin) {
      systemPrompt += `

**ADMIN DASHBOARD KNOWLEDGE (Verified Admin Only):**

You are speaking with a verified platform administrator. You can help them with dashboard features and admin tasks.

**Available Admin Features:**
- User management and bulk actions
- Business verification review
- Sales agent performance tracking
- Financial reporting
- Platform announcements
- System settings

Keep answers helpful, accurate, and conversational. If you need more details about a feature, ask clarifying questions.`;
    } else {
      systemPrompt += `

Keep answers helpful, accurate, and conversational. If you need more details about a feature, ask clarifying questions.`;
    }

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
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
