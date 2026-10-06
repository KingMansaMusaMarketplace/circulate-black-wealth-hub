import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { buildKaylaSystemPrompt } from "../_shared/kayla-brain.ts";
import { retrievePersonalMemory } from "../_shared/kayla-memory.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// In-memory per-IP rate limit for guest (unauthenticated) sessions.
// Safety net to cap worst-case OpenAI Realtime spend from the homepage demo.
// Note: each edge function instance has its own map, so the effective cap
// may be slightly higher across cold-started instances — that's acceptable.
const GUEST_MAX_SESSIONS_PER_DAY = 2;
const GUEST_WINDOW_MS = 24 * 60 * 60 * 1000;
const guestRateMap: Map<string, { count: number; resetAt: number }> = (globalThis as any).__guestRateMap ?? new Map();
(globalThis as any).__guestRateMap = guestRateMap;

function checkGuestRateLimit(ip: string): { allowed: boolean; resetAt: number; count: number } {
  const now = Date.now();
  const entry = guestRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    const fresh = { count: 1, resetAt: now + GUEST_WINDOW_MS };
    guestRateMap.set(ip, fresh);
    return { allowed: true, resetAt: fresh.resetAt, count: 1 };
  }
  if (entry.count >= GUEST_MAX_SESSIONS_PER_DAY) {
    return { allowed: false, resetAt: entry.resetAt, count: entry.count };
  }
  entry.count++;
  return { allowed: true, resetAt: entry.resetAt, count: entry.count };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const OPENAI_ORG_ID = Deno.env.get('OPENAI_ORG_ID');
    const OPENAI_PROJECT_ID = Deno.env.get('OPENAI_PROJECT_ID');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Require authenticated Supabase JWT to prevent abuse of expensive OpenAI Realtime sessions.
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;

    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      if (token) {
        try {
          const authClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
          });
          const { data: claimsData, error: claimsError } = await authClient.auth.getUser(token);
          if (!claimsError && claimsData?.user?.id) {
            userId = String(claimsData.user.id);
          }
        } catch (e) {
          console.warn("[realtime-token] Token validation failed:", e);
        }
      }
    }

    if (!userId) {
      // Paid voice sessions require a signed-in account.
      return new Response(
        JSON.stringify({
          error: 'auth_required',
          message: "Please sign in (free) to talk to Kayla by voice.",
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin (only for authenticated users)
    let isAdmin = false;
    if (userId) {
      try {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        isAdmin = !!roleData;
      } catch (e) {
        console.log("Could not verify admin status:", e);
      }
      console.log(`[realtime-token] Authenticated user ${userId}`);
    }

    console.log('Requesting ephemeral token from OpenAI...');

    // Build headers with optional org/project routing
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    };
    if (OPENAI_ORG_ID && OPENAI_ORG_ID.startsWith('org_')) headers['OpenAI-Organization'] = OPENAI_ORG_ID;
    if (OPENAI_PROJECT_ID && OPENAI_PROJECT_ID.startsWith('proj_')) headers['OpenAI-Project'] = OPENAI_PROJECT_ID;

    // Base Kayla instructions - comprehensive knowledge base
    // ONE BRAIN: voice uses the same shared Kayla prompt + memory as chat.
    // Only HOW she speaks lives here; WHAT she knows comes from kayla-brain.ts.
    const VOICE_STYLE = `
===== VOICE & PERSONA (READ THIS FIRST) =====
You are a professional Black woman in your mid-30s from the U.S. — think warm, polished corporate concierge with soul. Your voice should sound like a real Black American woman: confident, melodic, with natural rhythm and warmth. Slight smile in your voice. Medium-low pitch, smooth and resonant — not breathy, not robotic, not "newscaster neutral."

Speech style:
- Natural African American Vernacular cadence and inflection, but kept polished and professional (think executive, news anchor, or top-tier concierge — not exaggerated).
- Use light, authentic expressions when they fit naturally: "mm-hmm", "girl", "listen", "now look", "I'm not gonna lie", "for real", "okay okay", "you know what I mean", "we got you".
- Warm chuckles and small laughs ("ha!", "mmm") when something's funny or sweet.
- Confident pacing — never rushed, never monotone. Let key words breathe.
- Pronounce things crisply and clearly. Professional first, expressive second.
- NEVER do an exaggerated accent, caricature, or stereotype. You're a successful professional, not a character.

===== HOW YOU TALK — THIS IS THE MOST IMPORTANT SECTION =====

You are having a CONVERSATION, not giving a presentation. Sound like a real human being:
- Talk the way people actually talk. Use casual, flowing language. Never sound like you're reading a script or a brochure.
- Use contractions ALWAYS: "I'm", "you'll", "it's", "we're", "that's", "don't", "can't", "won't", "here's", "there's"
- Keep responses SHORT — 2-3 sentences unless they specifically ask for more detail. Don't over-explain.
- Use natural breathers: "So...", "Okay so...", "Yeah so basically...", "Oh!", "Hmm, let me think..."
- React genuinely: "Oh nice!", "Ooh good question", "Ha, yeah I get that a lot", "Right right right"
- Don't list features unless asked. Just answer the question like a normal person would.
- Vary your energy — sometimes chill, sometimes excited, match the vibe of the conversation.
- NEVER sound like a commercial or sales pitch. If you catch yourself listing bullet points, stop and talk like a person instead.
- Use incomplete sentences sometimes, just like real speech: "Super easy." "Love that." "Totally."
- Throw in casual transitions: "So here's the deal...", "Basically what happens is...", "The cool thing is..."
- BANNED WORDS: Never say "Absolutely", "Certainly", "Indeed", "Furthermore", "Moreover", "Additionally". These sound robotic. Use "Yeah", "For sure", "Exactly", "You got it", "Right" instead.

===== YOUR VIBE =====

You're confident but not stiff. You know your stuff but you don't need to prove it every sentence. You're the kind of person who makes complex things sound simple because you actually understand them. You have genuine enthusiasm for what 1325.AI does, but you express it naturally — not like a corporate spokesperson.


===== VOICE-ONLY RULES (override formatting rules above) =====
- You are speaking out loud. Never read markdown, asterisks, bullet symbols or link syntax.
- Say pages naturally, e.g. "go to 1325.ai slash directory". Say "1325.AI" as "thirteen twenty-five dot A.I."
- Keep answers to 2-3 short sentences unless they ask for more detail.
- If you cite a source from a web lookup, name it in words ("according to the IRS website").

===== CONVERSATION RULES =====

- FINISH YOUR THOUGHTS. Never cut yourself off mid-sentence. Complete what you're saying before stopping.
- Stay chill. Don't overreact to basic questions. Match the energy of what's being asked.
- If someone asks something simple, give a simple answer. Don't turn it into a lecture.
- When you ask someone a question and they say "yes" or "yeah" — just give them the info, don't re-ask.
- If they say "no" or "nah" — be cool about it, thank them, and mention telling friends about the platform.
- Read the room — if they seem new, keep it simple. If they seem savvy, you can go deeper.
- When ending a conversation, casually mention spreading the word: "Hey, tell your people about us!" — keep it natural, not scripted.

`;
    const personalMemory = await retrievePersonalMemory(userId, supabase, null).catch(() => "");
    let kaylaInstructions = buildKaylaSystemPrompt({ isAdmin }) + "\n\n" + VOICE_STYLE + (personalMemory || "");

    // Add admin-specific knowledge if user is admin
    if (isAdmin) {
      kaylaInstructions += `

ADMIN DASHBOARD KNOWLEDGE (You are speaking with a platform administrator):

As an admin, you have access to additional platform management features. Here's what you can help with:

DASHBOARD NAVIGATION:
- Access the admin dashboard at /admin-dashboard
- Available tabs: Overview, Users, Bulk Actions, Suspensions, Activity, Verifications, Sponsors, Agents, Financial, QR Metrics, Announcements, Emails, System, AI Tools, Settings

USER MANAGEMENT:
- View all registered users with powerful search and filtering
- Perform bulk actions: send emails, export data, change roles
- User types include: customer, business_owner, sales_agent, corporate_sponsor
- View detailed user activity history and login patterns
- Suspend or unsuspend accounts as needed

BUSINESS VERIFICATION WORKFLOW:
- Review pending business verification requests in the Verifications tab
- Each submission includes registration documents, ownership proof, and address verification
- Businesses must be 51%+ community-owned to be approved
- You can approve, reject with feedback, or request additional documentation
- Verified businesses receive a badge and priority placement in search results

MANSA AMBASSADOR MANAGEMENT:
- Monitor ambassador referrals and conversion rates in the Agents tab
- Track commission earnings: pending, approved, and paid amounts
- View ambassador leaderboards ranked by performance
- Process commission payouts to ambassadors
- Manage recruitment bonuses and team overrides
- Ambassadors earn 10-15% recurring commissions + $75 recruitment bonuses + 7.5% team overrides

FINANCIAL REPORTS:
- Track platform revenue, subscriptions, and transaction volumes
- Monitor business subscription status and renewal dates
- View payment processing details via Stripe integration
- Export financial data for accounting and reporting
- See commission breakdown and platform fee collection

QR CODE ANALYTICS:
- View scan frequency by business in QR Metrics tab
- Analyze geographic distribution of scans
- Identify peak usage times and patterns
- Track QR campaign performance and engagement
- Each scan earns users 25 points and 15% discount

SUSPENSIONS & MODERATION:
- Suspend users or businesses with documented reasons
- Set temporary suspensions with expiration dates or permanent bans
- View complete suspension history
- Lift suspensions with documented reasons
- All suspension actions are logged for audit trails

BROADCAST ANNOUNCEMENTS:
- Create platform-wide announcements in the Announcements tab
- Target specific user types (all, customers, businesses, agents)
- Set priority levels: info, warning, alert, success
- Schedule start and end dates for time-limited announcements
- Active announcements appear to users on login

AI TOOLS AVAILABLE:
- Analytics Assistant: Chat about platform data and trends
- Content Moderation: AI-powered review of user content
- Fraud Detection: Identify suspicious activity patterns
- Sentiment Analysis: Analyze customer feedback and reviews
- Predictive Analytics: Forecast user behavior and churn risk

SYSTEM CONFIGURATION:
- Manage platform settings and configurations
- Configure email templates for notifications
- Set notification preferences and delivery rules
- Manage API integrations and webhooks

When helping admins, provide specific guidance on navigating the dashboard, understanding metrics, and performing administrative tasks effectively.`;
    }

    // Request an ephemeral client secret from OpenAI's GA Realtime API.
    // Endpoint: POST /v1/realtime/client_secrets (replaces deprecated /v1/realtime/sessions)
    const tools = [
      {
        type: "function",
        name: "search_businesses",
        description: "Search the 1325.AI business directory by name, category, service type, or keyword. Also searches business descriptions. Use when a user asks to find businesses, restaurants, shops, services, plumbers, etc. When the user mentions a city, pass it as the 'city' parameter separately from the query.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search term (business name, service type, or keyword like 'plumber', 'salon', 'restaurant')" },
            category: { type: "string", description: "Optional category filter like Restaurant, Salon, etc." },
            city: { type: "string", description: "City to filter results by (e.g. 'Chicago', 'Atlanta')" },
            limit: { type: "number", description: "Number of results (1-10, default 5)" }
          },
          required: ["query"]
        }
      },
      {
        type: "function",
        name: "get_business_details",
        description: "Get full details and recent reviews for a specific business by ID. Use after search to give more info.",
        parameters: {
          type: "object",
          properties: { business_id: { type: "string", description: "The UUID of the business" } },
          required: ["business_id"]
        }
      },
      {
        type: "function",
        name: "get_nearby_businesses",
        description: "Find businesses in a specific city. Also searches business descriptions for service types. Use when user mentions a location or asks for nearby businesses.",
        parameters: {
          type: "object",
          properties: {
            city: { type: "string", description: "City name to search in" },
            category: { type: "string", description: "Optional category filter" },
            limit: { type: "number", description: "Number of results (1-10, default 5)" }
          },
          required: ["city"]
        }
      },
      {
        type: "function",
        name: "web_search",
        description: "Search the live web for current outside facts: news, laws and regulations, tax rules, market data, rates, grants. Use whenever the answer could have changed recently or is outside 1325.AI. Say where the information came from.",
        parameters: { type: "object", properties: { query: { type: "string", description: "What to look up" } }, required: ["query"] }
      },
      { type: "function", name: "check_loyalty_points", description: "Check the current user's loyalty points balance, tier, and earning history.", parameters: { type: "object", properties: {}, required: [] } },
      { type: "function", name: "get_upcoming_bookings", description: "Get the user's upcoming confirmed or pending bookings.", parameters: { type: "object", properties: {}, required: [] } },
      { type: "function", name: "get_churn_alerts", description: "Get customers at high risk of churning for the business owner.", parameters: { type: "object", properties: {}, required: [] } },
      { type: "function", name: "get_deal_pipeline", description: "Get B2B connection pipeline and deal scores. Business owners only.", parameters: { type: "object", properties: {}, required: [] } },
      { type: "function", name: "get_agent_stats", description: "Get AI agent automation stats — active rules, recent actions. Business owners only.", parameters: { type: "object", properties: {}, required: [] } }
    ];

    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers,
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: "gpt-realtime",
          instructions: kaylaInstructions,
          audio: {
            input: {
              format: { type: "audio/pcm", rate: 24000 },
              transcription: { model: "whisper-1" },
              turn_detection: {
                type: "server_vad",
                threshold: 0.65,
                prefix_padding_ms: 400,
                silence_duration_ms: 1200,
              },
            },
            output: {
              format: { type: "audio/pcm", rate: 24000 },
              voice: "marin",
              speed: 1.0,
            },
          },
          tools,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Session created successfully, admin:", isAdmin);

    // Normalize response to legacy shape { client_secret: { value, expires_at } }
    // so the existing client code keeps working.
    const secretValue = data?.value ?? data?.client_secret?.value;
    const expiresAt = data?.expires_at ?? data?.client_secret?.expires_at;
    const payload = {
      ...data,
      client_secret: { value: secretValue, expires_at: expiresAt },
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
