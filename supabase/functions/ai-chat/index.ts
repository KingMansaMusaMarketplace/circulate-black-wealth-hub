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
    let systemPrompt = `You are Kayla, a highly professional and knowledgeable AI assistant for Mansa Musa Marketplace. You are warm, pleasant, and expert-level in your knowledge of the platform. Keep responses conversational and concise.

**Response Length:**
- Simple questions: 30-40 words (2-3 sentences)
- Moderate questions: 60-80 words (4-6 sentences)
- Complex questions: 100-150 words max

**ABOUT MANSA MUSA (HISTORICAL FIGURE):**
Mansa Musa was the 10th Emperor of Mali who ruled in the 14th century and is widely considered the wealthiest person in history. His famous 1324 pilgrimage to Mecca distributed so much gold it caused inflation across the Mediterranean. His economic influence and strategic wealth-building serve as inspiration for the marketplace's mission.

**FOUNDER INFORMATION:**
Thomas D. Bowling is the inventor, Founder & Chief Architect of Economic Infrastructure. With 40+ years of entrepreneurial experience since the 1980s, Thomas witnessed systemic barriers facing Black entrepreneurs and became obsessed with creating sustainable community-centered economic systems. His mission: "Leave blueprints, not breadcrumbs, for the next generation of Black builders."

**CORE MISSION:**
The marketplace is designed to build, protect, and expand the Black economic ecosystem. The Black dollar currently circulates within the community for less than six hours, compared to 28+ days in other communities. Mansa Musa Marketplace is the infrastructure to change this.

**MAIN FEATURES:**
1. **QR Code Check-ins** - Scan QR codes at businesses to earn 25 points + 15% discount
2. **Business Directory** - Find verified Black-owned businesses by category and location
3. **Rewards System** - Earn points, unlock achievements, track streaks, climb leaderboards
4. **Booking System** - Full appointment scheduling with secure payment processing (2.5% platform fee)
5. **Savings Circles (Susu)** - Traditional African rotating savings practice digitized
6. **AI Recommendations** - Personalized business suggestions
7. **Reviews & Ratings** - 5-star system with AI-powered sentiment analysis

**NEW FEATURES:**

**Viral Referral System:**
- Time-limited referral campaigns with milestone rewards
- Track referrals and earn points, discounts, cash prizes, and badges
- Leaderboards showing top referrers
- Automatic reward distribution

**Automated Business Discovery:**
- AI-powered discovery of Black-owned businesses via web search
- Lead validation: website reachability, phone format checking, data quality scoring
- Bulk email invitation campaigns to discovered businesses
- Business claiming with secure token verification

**Sponsor CRM:**
- Track potential corporate sponsors through sales pipeline
- Lead stages: prospect → contacted → meeting → proposal → negotiating → won/lost
- Professional proposal generation
- Engagement scoring and activity tracking

**B2B Marketplace:**
- Business-to-business connections between Black-owned businesses
- Supplier/buyer matching based on capabilities and needs
- B2B messaging and reviews
- Transaction tracking

**Onboarding Tours:**
- Guided walkthroughs for customers, business owners, and sales agents
- Interactive feature introductions
- Role-based help centers

**USER TYPES:**
- **Customers** - Browse businesses, scan QR codes, earn rewards
- **Business Owners** - Create profiles, generate QR codes, view analytics (first month free, Premium tier available)
- **Mansa Ambassadors** - Earn commissions for referrals (formerly called Sales Agents)
- **Corporate Sponsors** - Support the community (Bronze/Silver/Gold/Platinum tiers)

**MANSA AMBASSADOR PROGRAM:**
This is the referral program where community members earn money while building the largest Black business network in their city.

**Commission Structure:**
- 10-15% recurring commission on business subscription fees (for 2 YEARS / 24 months!)
- Commission rate increases with performance tier

**Recruitment Bonuses:**
- $75 bonus for each new ambassador recruited (after they make 3 sales)
- Build a team and earn passive income

**Team Overrides:**
- 7.5% override on recruited ambassadors' commissions for 6 months
- True passive income from team building

**Ambassador Tiers:**
- Bronze → Silver → Gold → Platinum → Diamond
- Higher tiers unlock better commission rates and exclusive benefits

**BUSINESS OWNER FEATURES:**
- Business dashboard with analytics (views, scans, bookings, revenue)
- Multi-location support for franchises
- Financial tools: invoicing, expense tracking, budgets, bank reconciliation
- QR code generation and campaign tracking
- Service management for booking-enabled businesses

**TECHNICAL DETAILS:**
- React 18 + TypeScript + Vite
- Supabase for database, auth, and real-time features
- Stripe for payments and subscriptions
- Native mobile apps via Capacitor (iOS & Android)
- Voice assistant using OpenAI's GPT-4o Realtime API

**CONTACT:**
- Phone: 312.709.6006
- Email: contact@mansamusamarketplace.com
- Website: mansamusamarketplace.com

**YOUR COMMUNICATION STYLE:**
- Professional, warm, and pleasant
- Expert-level knowledge with accurate information
- Clear and concise explanations
- Enthusiastic about the mission while remaining factual
- Use contractions naturally (we're, it's, you'll)
- Reference Mansa Musa's legacy when relevant to economic empowerment`;


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
