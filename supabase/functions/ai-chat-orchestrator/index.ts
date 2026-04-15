import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Generate embedding for a query via OpenAI
async function getQueryEmbedding(text: string, openaiApiKey: string): Promise<number[] | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text.substring(0, 2000),
        model: "text-embedding-3-small",
        dimensions: 768,
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data?.[0]?.embedding || null;
  } catch (e) {
    console.error("Embedding generation failed:", e);
    return null;
  }
}

// Retrieve relevant context from RAG embeddings
async function retrieveRAGContext(
  userMessage: string,
  openaiApiKey: string,
  supabaseUrl: string,
  supabaseServiceKey: string
): Promise<string> {
  try {
    const embedding = await getQueryEmbedding(userMessage, openaiApiKey);
    if (!embedding) return '';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.rpc('match_embeddings', {
      query_embedding: `[${embedding.join(',')}]`,
      match_threshold: 0.4,
      match_count: 8,
    });

    if (error || !data || data.length === 0) {
      console.log("No RAG context found");
      return '';
    }

    console.log(`RAG: Found ${data.length} relevant results`);

    const contextParts = data.map((item: any) => {
      const type = item.content_type;
      const meta = item.metadata || {};
      const sim = (item.similarity * 100).toFixed(0);
      if (type === 'business') {
        return `[Business: ${meta.business_name || 'Unknown'} | ${meta.category || ''} | ${meta.city || ''}, ${meta.state || ''} | Relevance: ${sim}%]\n${item.content_text}`;
      } else if (type === 'review') {
        return `[Review for ${meta.business_name || 'Unknown'} | Rating: ${meta.rating}/5 | Relevance: ${sim}%]\n${item.content_text}`;
      } else if (type === 'event') {
        return `[Event: ${meta.title || 'Unknown'} | ${meta.location || ''} | Relevance: ${sim}%]\n${item.content_text}`;
      }
      return item.content_text;
    });

    return '\n\n[PLATFORM KNOWLEDGE - Use this to answer accurately about businesses, reviews, and events on the platform]:\n' + contextParts.join('\n\n');
  } catch (e) {
    console.error("RAG retrieval error:", e);
    return '';
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting store
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

function sanitizeForPrompt(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[\x00-\x1F\x7F]/g, '').substring(0, 10000).replace(/\{\{|\}\}/g, '').trim();
}

function sanitizeMessages(messages: any[]): any[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(msg => msg && typeof msg === 'object' && msg.role && msg.content)
    .slice(0, 50)
    .map(msg => {
      const role = String(msg.role).substring(0, 20);
      
      // Handle multimodal content (array of text + image_url)
      if (Array.isArray(msg.content)) {
        const sanitizedContent = msg.content
          .filter((part: any) => part && (part.type === 'text' || part.type === 'image_url'))
          .map((part: any) => {
            if (part.type === 'text') {
              return { type: 'text', text: sanitizeForPrompt(String(part.text || '')) };
            }
            if (part.type === 'image_url' && part.image_url?.url) {
              // Validate it's a data URL (base64)
              const url = String(part.image_url.url);
              if (url.startsWith('data:image/')) {
                return { type: 'image_url', image_url: { url } };
              }
            }
            return null;
          })
          .filter(Boolean);
        
        return { role, content: sanitizedContent };
      }
      
      return { role, content: sanitizeForPrompt(String(msg.content)) };
    });
}

// Extract text from a message (handles both string and multimodal content)
function getMessageText(content: any): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.filter((p: any) => p.type === 'text').map((p: any) => p.text || '').join(' ');
  }
  return '';
}

// Check if a message contains an image
function hasImage(content: any): boolean {
  if (Array.isArray(content)) {
    return content.some((p: any) => p.type === 'image_url');
  }
  return false;
}

type QueryCategory = 'simple' | 'complex' | 'search' | 'critical';

// Classify query intent using Gemini Flash Lite (fast & cheap)
async function classifyQuery(userMessage: string, lovableApiKey: string): Promise<QueryCategory> {
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Classify this user query into exactly one category. Reply with ONLY the category word, nothing else.

Categories:
- simple: greetings, FAQs, navigation, basic how-to questions, feature descriptions
- complex: business strategy, analysis, comparisons, multi-step reasoning, detailed advice
- search: questions about current events, trending topics, external businesses, real-time data, market research, "what are the best...", location-specific queries about external things
- critical: high-stakes business decisions needing both reasoning AND real-time data, investment decisions, market comparisons with current data`
          },
          { role: "user", content: userMessage }
        ],
        max_tokens: 10,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      console.error("Classification failed, defaulting to simple:", response.status);
      return 'simple';
    }

    const data = await response.json();
    const category = data.choices?.[0]?.message?.content?.trim()?.toLowerCase() as QueryCategory;
    
    if (['simple', 'complex', 'search', 'critical'].includes(category)) {
      console.log(`Query classified as: ${category}`);
      return category;
    }
    
    console.log(`Unknown classification "${category}", defaulting to simple`);
    return 'simple';
  } catch (e) {
    console.error("Classification error, defaulting to simple:", e);
    return 'simple';
  }
}

// Call Gemini via Lovable AI Gateway (streaming)
async function callGemini(messages: any[], systemPrompt: string, lovableApiKey: string): Promise<Response> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    }),
  });
  return response;
}

// Call Claude via Anthropic API (streaming, convert to OpenAI SSE format)
async function callClaude(messages: any[], systemPrompt: string, anthropicApiKey: string): Promise<Response> {
  // Convert messages to Anthropic format, handling multimodal content
  const anthropicMessages = messages
    .map(m => {
      const role = m.role === 'system' ? 'user' : m.role;
      if (role !== 'user' && role !== 'assistant') return null;

      // Handle multimodal content (array format)
      if (Array.isArray(m.content)) {
        const anthropicContent = m.content.map((part: any) => {
          if (part.type === 'text') {
            return { type: 'text', text: part.text };
          }
          if (part.type === 'image_url' && part.image_url?.url) {
            // Convert data URL to Anthropic's base64 format
            const dataUrl = part.image_url.url;
            const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
            if (match) {
              return {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: match[1],
                  data: match[2],
                },
              };
            }
          }
          return null;
        }).filter(Boolean);

        return { role, content: anthropicContent };
      }

      return { role, content: m.content };
    })
    .filter(Boolean);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicApiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  // Transform Anthropic SSE stream to OpenAI-compatible SSE stream
  const reader = response.body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;

            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'content_block_delta' && event.delta?.text) {
                // Convert to OpenAI format
                const openAIChunk = {
                  choices: [{ delta: { content: event.delta.text }, index: 0 }],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(openAIChunk)}\n\n`));
              } else if (event.type === 'message_stop') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              }
            } catch { /* skip unparseable lines */ }
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}

// Call Perplexity (non-streaming, returns content + citations)
async function callPerplexity(userMessage: string, systemPrompt: string, perplexityApiKey: string): Promise<{ content: string; citations: string[] }> {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${perplexityApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: systemPrompt + "\n\nProvide well-sourced answers with citations." },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || '',
    citations: data.citations || [],
  };
}

// Convert a string response to OpenAI-compatible SSE stream
function stringToSSEStream(text: string, model: string): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      // Send content in chunks for a streaming feel
      const chunkSize = 20;
      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.slice(i, i + chunkSize);
        const data = { choices: [{ delta: { content: chunk }, index: 0 }], model };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });
}

// Build the Kayla system prompt (reused from ai-chat)
function buildSystemPrompt(isAdmin: boolean): string {
  let systemPrompt = `You are Kayla, Ph.D. — a distinguished AI concierge and senior platform strategist for 1325.AI. You hold the equivalent of a doctorate in Economic Systems & Community Infrastructure, and you bring that level of intellectual rigor, precision, and authority to every interaction. You are warm yet commanding, approachable yet authoritative — the kind of expert people trust implicitly.

**Response Length:**
- Simple questions: 30-40 words (2-3 sentences)
- Moderate questions: 60-80 words (4-6 sentences)
- Complex questions: 100-150 words max

**YOUR PROFESSIONAL IDENTITY:**
You are not a chatbot. You are a credentialed expert — a doctoral-level strategist who understands economic infrastructure, platform economics, community finance, and business growth at a systems level. You speak with the confidence of someone who has studied these topics exhaustively. When you explain something, it carries the weight of deep expertise. You never guess — you know.

**WHY "1325":**
The name refers to 1325 AD — when Mansa Musa I, Emperor of Mali, was at the height of his power and wealth. He is widely regarded as the richest person in history. His famous 1324 pilgrimage distributed so much gold it caused inflation across the Mediterranean. His economic influence inspires the platform's mission of building modern economic infrastructure.

**FOUNDER:**
Thomas D. Bowling — Inventor, Founder & Chief Architect of Economic Infrastructure. 40+ years of experience since the 1980s. Mission: "Leave blueprints, not breadcrumbs, for the next generation of builders."

**CORE IDENTITY — PaaS:**
1325.AI is an Economic Operating System — a Platform as a Service positioned as the "Stripe for circular economies." It's the intelligence layer and economic infrastructure powering wealth circulation in an underserved $1.6 TRILLION market. The dollar circulates within the community for less than six hours vs 28+ days in others. The platform uses a proprietary three-layer architecture: Infrastructure Layer, Data Platform Layer, and Application Layer.

**COMMUNICATION GUIDELINE - CRITICAL:**
Do NOT repeatedly reference race or community in every answer. State the mission once if relevant, then focus entirely on features, benefits, savings, earnings, and user value. You are a product expert and economic strategist, not an activist.

**VALUE PROPOSITION:**
Businesses receive exceptional ROI — the platform delivers multiples of value compared to the subscription cost, measured through profile views, QR scans, customer inquiries, and reviews. This value framework is protected under our patent portfolio.

**PATENT PORTFOLIO:**
1325.AI holds a comprehensive patent portfolio filed with the USPTO covering the platform's core innovations. Key protections include: our proprietary economic impact algorithm, B2B matching technology, Voice AI architecture (that's me!), geospatial fraud detection, loyalty and QR systems, digital savings escrow, economic scoring and gamification, and the partner referral system. This portfolio creates a significant competitive moat — our core technology is legally protected.

**COMPETITIVE POSITIONING:**
1325.AI is the "Economic Super-App" — a functional superset that goes beyond simple directories. Five pillars: Discovery, Transactions, Banking, Community Finance, and Gamification. The platform serves a $1.6 TRILLION addressable market.

**MAIN FEATURES:**
1. **QR Code Check-ins** — Scan QR codes → earn points + discounts. Daily limits. Manage at /qr-code-management.
2. **Business Directory** — Flagship feature at /directory. Verified listings, interactive map, filters (category, distance, rating). Grid/List/Map views. Categories: Restaurants, Beauty, Health, Banking, Insurance, Legal, Tech, Real Estate, and more.
3. **Rewards System** — Points, achievements, streaks, leaderboards at /rewards, /loyalty-history, /leaderboard.
4. **Booking System** — Appointments with secure payments and modest platform fee.
5. **AI Recommendations** — Personalized business suggestions at /recommendations.
6. **Reviews & Ratings** — 5-star system with AI sentiment analysis. Only verified QR scan users can review.
7. **Mansa Stays** — Full vacation & monthly rental marketplace (details below).

**MANSA STAYS — VACATION & MONTHLY RENTALS:**
Community-focused alternative to Airbnb AND FurnishedFinder. Non-Bias hosting.
- Hosts keep 92.5% — only 7.5% platform fee (significantly less than major competitors)
- Short-term (1-29 days) AND long-term monthly rentals (30+ days)
- Secure payouts 1-3 business days after checkout
- FREE to list — no subscription fee
- Guest identity verification at booking
- Real-time messaging at /stays/messages with typing indicators and read receipts
- Co-host system: invite helpers via email
- Experiences at /stays/experiences: cooking, art, music, photography, outdoors
- Wishlist at /stays/favorites
- For guests: Browse /stays → dates → verify identity → pay → message host
- For hosts: /stays/list-property → Host Dashboard at /stays/host

**NOIRE RIDESHARE — COMMUNITY RIDE SERVICE:**
Premium alternative to Uber/Lyft. "Never Surge" pricing — flat transparent rates regardless of demand, weather, or events. Drivers keep significantly more of every fare compared to major competitors. Features: Favorite Driver Booking, Community Rewards (credits at local businesses), Kayla AI Dispatching (concierge-style updates), Social Impact Dashboard. Referral bonuses available. Real-time tracking, professional experience.

**CONFIDENTIALITY — NEVER REVEAL (CRITICAL):**
You are a brilliant expert who teaches the WHAT and WHY but never gives away the proprietary details. NEVER share:
- Patent claim numbers, application numbers, or filing dates (say "patent-protected" or "proprietary technology")
- Internal architecture, database schemas, table names, API endpoint structures, Edge Function names
- Algorithm specifics (how economic scoring calculates, how decay works mathematically, how lead scoring formulas work)
- Revenue projections, specific valuation numbers, or investor-facing financial models
- Exact commission percentage structures (say "competitive commissions" and direct them to the relevant page)
- Internal growth targets, partnership pipeline details, or partnership target numbers
- Technical stack details (frameworks, databases, hosting providers) — say "enterprise-grade infrastructure"
- Admin dashboard capabilities or internal tools
- Competitive strategy documents or positioning details
- Exact pricing formulas or fee breakdowns for internal operations

IF ASKED ABOUT PROPRIETARY DETAILS:
Respond with scholarly confidence: "That falls within our proprietary methodology — what I can tell you is how it benefits you directly..." Then redirect to the user-facing value.

YOU CAN SHARE: All user-facing features, public pricing tiers, how to use the platform, general AI capabilities, contact info, the Mansa Musa inspiration, that tech is patent-protected.

**BUSINESS DIRECTORY — DEEP KNOWLEDGE:**
Flagship feature at /directory. Economic Operating System for verified businesses.
- Search by name, category, address. Filter: category, distance (Near Me with geolocation), star rating, discount %, featured.
- View modes: Grid (photo cards), List (compact), Map (interactive). 16 per page.
- Verified businesses first, then newest. Only verified/live listings shown.
- Each listing: name, category badge, verified checkmark, star rating, banner + logo, address, phone, website, hours, description, services, photo gallery, reviews with AI sentiment, interactive map, QR code, "Get Directions", social links, discount %.
- Getting listed: /business/register → 4-step process → admin review → first month FREE!
- Business Dashboard: views, scans, bookings, revenue, customer analytics, QR management, review responses, financial tools, multi-location support, workflow automation.

**SUSU SAVINGS CIRCLES:**
Traditional African rotating savings — digitized! Groups contribute weekly/monthly, take turns getting the full pot. Modest platform fee for secure escrow. Patent-protected secure escrow system. At /susu-circles.

**ECONOMIC KARMA:**
Proprietary impact scoring system. Earn by: shopping local, referring friends, Susu circles, community activity. Designed with built-in engagement mechanics to encourage continued participation. Leaderboards, better recommendations at higher scores. At /karma.

**CLOSED-LOOP WALLET:**
Internal wallet for Susu payouts and business spending. Enterprise-grade security with full audit trail. Withdrawal available with modest fee and minimum threshold.

**WEALTH CIRCULATION TICKER:**
Real-time display tracking platform's wealth multiplier impact.

**VIRAL REFERRAL CAMPAIGNS:**
Time-limited campaigns with milestone rewards. Points, discounts, cash prizes, badges. Leaderboards.

**PARTNER PROGRAM:**
Earn per-signup fees plus recurring revenue share on subscriptions — for life! "Founding Partner" status available for early adopters. Auto-branded Marketing Hub. Multi-tier system with full dashboard. Visit /partner for details.

**MANSA AMBASSADOR PROGRAM:**
Generous recurring commissions for an extended period. Recruitment bonuses and team overrides available. Multi-tier advancement: Bronze → Silver → Gold → Platinum → Diamond. Training at /ambassador-resources. Visit /ambassador for full details.

**CORPORATE SPONSORSHIP:**
Bronze/Silver/Gold/Platinum tiers at /corporate-sponsorship. Dashboard at /corporate-dashboard.

**BOOKING SYSTEM:**
Service appointments with secure payments. Modest platform fee. Email confirmations, booking history.

**B2B MARKETPLACE:**
Business connections at /b2b. Capability/need matching, messaging, reviews. Supply chain building.

**AGENTIC AI:**
AI Agent Dashboard — autonomous lead scoring, churn prediction, B2B deal scoring, automated support. Custom rules. AI as active operations participant.

**WORKFLOW BUILDER:**
No-code automation at /workflow-builder. If/then rules for business operations.

**BUSINESS OWNER FEATURES:**
Dashboard, multi-location support, QR management, financial tools (invoicing, expenses, budgets, bank reconciliation).

**SUBSCRIPTION TIERS (Current Pricing):**
- Essentials: $19/mo ($190/yr) — Verified listing, basic Kayla AI, 5 QR codes. 30-day free trial.
- Starter: $49/mo ($470/yr) — Full analytics, priority placement, 25 QR codes, records management. 30-day free trial.
- Pro: $149/mo ($1,430/yr) — Everything in Starter plus advanced AI coaching, B2B matching, churn alerts, unlimited QR. 14-day free trial.
- Enterprise: $599/mo — Multi-location, white-labeling, dedicated support, API access. 14-day free trial.
- Visit /subscription for full details and to choose a plan.

**COALITION:**
Organizations, churches, HBCUs at /coalition. Collective buying power, HBCU badging, campus proximity alerts.

**COMMUNITY FINANCE:**
Investment platform at /community-finance. Collective funding of community projects.

**DEVELOPER PROGRAM:**
License patent-protected technology via APIs at /developers. Multiple pricing tiers available.

**GROUP CHALLENGES:**
Team competitions at /group-challenges. Bonus points, badges, leaderboard recognition.

**LEARNING HUB:** /learning-hub — education. /ambassador-resources — training with progress tracking.
**USER GUIDE:** /user-guide — comprehensive interactive guide + exportable PDF.
**HELP:** /help-center, /faq, /knowledge-base, /submit-ticket, /my-tickets.

**INVESTMENT:**
/investor and /pitch-deck. The platform addresses a $1.6T market with a proven economic model.

**MOBILE APP:** Native iOS/Android app. QR scanning, push notifications, geolocation, offline caching. /install.

**AI-POWERED BUSINESS IMPORT:**
AI discovers businesses by city/state/category. Validates data, scores quality. Bulk email campaigns with claim tokens.

**ONBOARDING TOURS:**
Guided tours for each user type: Customer, Business Owner, Sales Agent.

**USER TYPES:**
- Customers: Browse, scan QR, earn rewards
- Business Owners: List business, manage customers, track analytics (first month free)
- Mansa Ambassadors: Earn commissions for referrals
- Corporate Sponsors: Support community (Bronze/Silver/Gold/Platinum)

**BLOG & MEDIA:** /blog, /media-kit, /case-studies, /economic-impact.
**ABOUT & LEGAL:** /about, /founders-wall, /privacy-policy, /terms-of-service, /cookie-policy, /accessibility, /contact.
**PROFILE & SETTINGS:** /profile, /settings.
**HOW IT WORKS:** /how-it-works, /features, /user-guide.

**CONTACT:**
Phone: 312.709.6006 | Email: contact@1325.ai | Support: support@1325.ai | Business: business@1325.ai | Partners: partners@1325.ai | Website: 1325.ai

**YOUR STYLE:**
You speak with the measured confidence of a doctoral-level expert. Professional, warm, and precise. Use contractions naturally. Be concise. When discussing economic concepts, draw on your deep expertise to explain them in accessible yet intellectually rigorous terms. You never sound uncertain — you sound like the foremost authority on this platform and its economic model.`;

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

  return systemPrompt;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ========== AUTHENTICATION ==========
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!checkRateLimit(user.id, 20, 60000)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log(`Authenticated user: ${user.id}`);

    // ========== PARSE & VALIDATE ==========
    const requestBody = await req.json();
    const messages = sanitizeMessages(requestBody.messages);
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ========== CHECK API KEYS ==========
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check admin status
    let isAdmin = false;
    try {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").single();
      if (!roleError && roleData) isAdmin = true;
    } catch { /* not admin */ }

    let systemPrompt = buildSystemPrompt(isAdmin);
    const lastMessage = messages[messages.length - 1];
    const lastUserMessage = getMessageText(lastMessage?.content || '');
    const messageHasImage = hasImage(lastMessage?.content);

    // ========== CLASSIFY QUERY ==========
    // If message has an image, route to Claude (vision) by default
    let category: QueryCategory;
    if (messageHasImage) {
      category = 'complex'; // Claude handles vision
      console.log(`Image detected, routing to Claude vision`);
    } else {
      category = await classifyQuery(lastUserMessage, LOVABLE_API_KEY);
    }
    console.log(`Routing to: ${category} | Message: "${lastUserMessage.substring(0, 80)}..." | Image: ${messageHasImage}`);

    // ========== RAG CONTEXT RETRIEVAL ==========
    if (category !== 'simple' || lastUserMessage.toLowerCase().match(/business|restaurant|shop|store|find|near|recommend|review|event/)) {
      const ragContext = await retrieveRAGContext(lastUserMessage, OPENAI_API_KEY || '', supabaseUrl, supabaseServiceKey);
      if (ragContext) {
        systemPrompt += ragContext;
        console.log("RAG context injected into system prompt");
      }
    }

    // ========== ROUTE TO PROVIDER(S) ==========
    let responseStream: Response;
    let modelUsed = 'gemini';

    try {
      switch (category) {
        case 'simple': {
          // Gemini — fast & cheap
          responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
          modelUsed = 'gemini';
          if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
          break;
        }

        case 'complex': {
          // Claude — deep reasoning (fallback to Gemini)
          if (ANTHROPIC_API_KEY) {
            try {
              responseStream = await callClaude(messages, systemPrompt, ANTHROPIC_API_KEY);
              modelUsed = 'claude';
            } catch (e) {
              console.error("Claude failed, falling back to Gemini:", e);
              responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
              modelUsed = 'gemini';
              if (!responseStream.ok) throw new Error(`Gemini fallback error: ${responseStream.status}`);
            }
          } else {
            console.log("No ANTHROPIC_API_KEY, using Gemini for complex query");
            responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
            modelUsed = 'gemini';
            if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
          }
          break;
        }

        case 'search': {
          // Perplexity — real-time web search (fallback to Gemini)
          if (PERPLEXITY_API_KEY) {
            try {
              const result = await callPerplexity(lastUserMessage, systemPrompt, PERPLEXITY_API_KEY);
              let fullContent = result.content;
              if (result.citations.length > 0) {
                fullContent += '\n\n📎 **Sources:**\n' + result.citations.map((c, i) => `${i + 1}. ${c}`).join('\n');
              }
              const stream = stringToSSEStream(fullContent, 'perplexity');
              responseStream = new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
              modelUsed = 'perplexity';
            } catch (e) {
              console.error("Perplexity failed, falling back to Gemini:", e);
              responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
              modelUsed = 'gemini';
              if (!responseStream.ok) throw new Error(`Gemini fallback error: ${responseStream.status}`);
            }
          } else {
            console.log("No PERPLEXITY_API_KEY, using Gemini for search query");
            responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
            modelUsed = 'gemini';
            if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
          }
          break;
        }

        case 'critical': {
          // Claude + Perplexity in parallel (fallback gracefully)
          const hasClaudeKey = !!ANTHROPIC_API_KEY;
          const hasPerplexityKey = !!PERPLEXITY_API_KEY;

          if (hasClaudeKey && hasPerplexityKey) {
            try {
              // Run both in parallel
              const [perplexityResult] = await Promise.all([
                callPerplexity(lastUserMessage, systemPrompt, PERPLEXITY_API_KEY),
              ]);

              // Feed Perplexity context into Claude
              const enrichedMessages = [
                ...messages.slice(0, -1),
                {
                  role: 'user',
                  content: `${lastUserMessage}\n\n[Real-time research data for context]:\n${perplexityResult.content}${
                    perplexityResult.citations.length > 0
                      ? '\n\nSources: ' + perplexityResult.citations.join(', ')
                      : ''
                  }`
                }
              ];

              responseStream = await callClaude(enrichedMessages, systemPrompt + '\n\nYou have been provided real-time research data. Synthesize it with your analysis. Cite sources when using external data.', ANTHROPIC_API_KEY);
              modelUsed = 'claude+perplexity';
            } catch (e) {
              console.error("Critical dual-model failed, falling back:", e);
              // Try Claude alone, then Gemini
              if (hasClaudeKey) {
                try {
                  responseStream = await callClaude(messages, systemPrompt, ANTHROPIC_API_KEY);
                  modelUsed = 'claude';
                } catch {
                  responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
                  modelUsed = 'gemini';
                  if (!responseStream.ok) throw new Error(`Gemini fallback error: ${responseStream.status}`);
                }
              } else {
                responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
                modelUsed = 'gemini';
                if (!responseStream.ok) throw new Error(`Gemini fallback error: ${responseStream.status}`);
              }
            }
          } else if (hasClaudeKey) {
            responseStream = await callClaude(messages, systemPrompt, ANTHROPIC_API_KEY);
            modelUsed = 'claude';
          } else {
            responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
            modelUsed = 'gemini';
            if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
          }
          break;
        }

        default: {
          responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
          modelUsed = 'gemini';
          if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
        }
      }
    } catch (error) {
      console.error("All providers failed:", error);
      // Ultimate fallback — try Gemini one more time
      try {
        responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
        modelUsed = 'gemini';
        if (!responseStream.ok) throw new Error("Final Gemini fallback failed");
      } catch {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    console.log(`Response served by: ${modelUsed}`);

    // Inject model info as first SSE event, then pipe the rest
    const encoder = new TextEncoder();
    const modelInfoChunk = encoder.encode(`data: ${JSON.stringify({ model_used: modelUsed })}\n\n`);
    
    const originalBody = responseStream.body;
    if (!originalBody) {
      return new Response(JSON.stringify({ error: "Empty response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const combinedStream = new ReadableStream({
      async start(controller) {
        // Send model info first
        controller.enqueue(modelInfoChunk);
        
        const reader = originalBody.getReader();
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
      }
    });

    return new Response(combinedStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Orchestrator error:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
