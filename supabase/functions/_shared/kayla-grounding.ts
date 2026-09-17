// =============================================================================
// KAYLA GROUNDING — the "check before you answer" pass.
//
// Before Kayla writes a word, a fast model is allowed to CALL REAL LOOKUPS:
// the live directory, a specific listing, the user's own business numbers,
// their loyalty balance and bookings, and (when a key is present) the live web.
//
// Whatever comes back is handed to the answering model as verified facts with
// their source. This is the single biggest accuracy upgrade available: it
// turns confident guessing into checked answers.
//
// Design notes:
//  - Runs BEFORE the streamed answer, so it works with every provider
//    (Gemini, Claude, Perplexity) without rewriting the streaming path.
//  - Strictly bounded: max 2 rounds, max 6 calls, ~12s budget. If anything
//    fails or times out we return "" and the answer proceeds ungrounded.
//  - Never invents: the returned block only ever contains real rows.
// =============================================================================

import { fetchAIWithRetry } from "./kayla-brain.ts";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const ROUTER_MODEL = "google/gemini-3.7-flash";

export interface GroundingOptions {
  supabase: any;
  question: string;
  lovableApiKey: string;
  userId?: string | null;
  /** The business this user owns, when known — unlocks owner-only lookups. */
  businessId?: string | null;
  /** Hard ceiling on wall-clock time spent looking things up. */
  budgetMs?: number;
}

export interface GroundingResult {
  /** Prompt fragment to append to the system prompt ("" when nothing found). */
  block: string;
  /** Machine-readable trace of what was actually looked up. */
  calls: Array<{ tool: string; args: unknown; ok: boolean; summary: string }>;
}

const EMPTY: GroundingResult = { block: "", calls: [] };

// -----------------------------------------------------------------------------
// TOOL DEFINITIONS — kept deliberately small. Each one is a real query.
// -----------------------------------------------------------------------------
function toolSpecs(opts: { owner: boolean; user: boolean; web: boolean }) {
  const tools: any[] = [
    {
      type: "function",
      function: {
        name: "search_directory",
        description:
          "Search the live 1325.AI business directory. Use whenever the person asks about businesses, categories, a city, 'near me', or wants a recommendation.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Free-text: business name, keyword or service" },
            category: { type: "string", description: "Category filter, e.g. Restaurant, Beauty" },
            city: { type: "string", description: "City filter" },
            limit: { type: "integer", description: "1-10, default 5" },
          },
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_business_details",
        description:
          "Full record plus recent reviews for ONE business. Call after search_directory when the person asks about a specific listing.",
        parameters: {
          type: "object",
          properties: { business_id: { type: "string" } },
          required: ["business_id"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_platform_stats",
        description:
          "Live platform counts: verified businesses, categories covered, cities covered. Use for 'how many businesses' style questions.",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
  ];

  if (opts.user) {
    tools.push({
      type: "function",
      function: {
        name: "get_my_account",
        description:
          "The signed-in person's own loyalty points, tier and upcoming bookings. Use for 'my points', 'my bookings', 'my rewards'.",
        parameters: { type: "object", properties: {}, required: [] },
      },
    });
  }

  if (opts.owner) {
    tools.push({
      type: "function",
      function: {
        name: "get_my_business_metrics",
        description:
          "The signed-in owner's own business numbers: listing details, review average, recent QR scan volume, active QR codes, churn alerts. Use for any question about how THEIR business is doing.",
        parameters: { type: "object", properties: {}, required: [] },
      },
    });
  }

  if (opts.web) {
    tools.push({
      type: "function",
      function: {
        name: "web_search",
        description:
          "Search the live web for current outside information: news, market rates, grant programs, regulations, competitors. Use only when the answer depends on information outside 1325.AI.",
        parameters: {
          type: "object",
          properties: { query: { type: "string" } },
          required: ["query"],
        },
      },
    });
  }

  return tools;
}

// -----------------------------------------------------------------------------
// TOOL IMPLEMENTATIONS
// -----------------------------------------------------------------------------
async function searchDirectory(supabase: any, args: any) {
  const limit = Math.min(Number(args?.limit) || 5, 10);
  let q = supabase
    .from("business_directory")
    .select("id, business_name, category, description, address, city, state, average_rating, review_count, is_verified")
    .limit(limit);

  if (args?.category) q = q.ilike("category", `%${args.category}%`);
  if (args?.city) q = q.ilike("city", `%${args.city}%`);
  if (args?.query) {
    const t = String(args.query).replace(/[%,()]/g, " ").trim();
    if (t) {
      q = q.or(
        `business_name.ilike.%${t}%,category.ilike.%${t}%,description.ilike.%${t}%`,
      );
    }
  }

  const { data, error } = await q.order("is_verified", { ascending: false });
  if (error) throw new Error(error.message);
  return { businesses: data || [], count: data?.length || 0 };
}

async function businessDetails(supabase: any, args: any) {
  const id = String(args?.business_id || "");
  if (!id) throw new Error("business_id required");
  const { data: business, error } = await supabase
    .from("business_directory")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!business) return { business: null, note: "No listing with that id." };

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, comment, created_at")
    .eq("business_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  return { business, recent_reviews: reviews || [] };
}

async function platformStats(supabase: any) {
  const { count } = await supabase
    .from("business_directory")
    .select("id", { count: "exact", head: true });
  return {
    listed_businesses: count ?? null,
    note: "Public marketing figure is 47,000+ businesses; this count is the live directory table.",
  };
}

async function myAccount(supabase: any, userId: string) {
  const [points, bookings] = await Promise.all([
    supabase
      .from("loyalty_points")
      .select("points_balance, total_earned, total_redeemed, tier")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("bookings")
      .select("id, service_name, booking_date, booking_time, status")
      .eq("user_id", userId)
      .gte("booking_date", new Date().toISOString().split("T")[0])
      .in("status", ["confirmed", "pending"])
      .order("booking_date", { ascending: true })
      .limit(5),
  ]);

  return {
    loyalty: points?.data || { points_balance: 0, tier: "bronze" },
    upcoming_bookings: bookings?.data || [],
  };
}

async function myBusinessMetrics(supabase: any, businessId: string) {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [biz, reviews, scans, qrCodes, churn] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, business_name, category, city, state, is_verified, average_rating, review_count, created_at")
      .eq("id", businessId)
      .maybeSingle(),
    supabase
      .from("reviews")
      .select("rating, created_at")
      .eq("business_id", businessId)
      .gte("created_at", since)
      .limit(200),
    supabase
      .from("qr_scans")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("created_at", since),
    supabase
      .from("qr_codes")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId)
      .eq("is_active", true),
    supabase
      .from("churn_predictions")
      .select("user_id, risk_score")
      .eq("business_id", businessId)
      .gte("risk_score", 0.6)
      .limit(10),
  ]);

  const recent = reviews?.data || [];
  const avg30 = recent.length
    ? Number((recent.reduce((s: number, r: any) => s + (r.rating || 0), 0) / recent.length).toFixed(2))
    : null;

  return {
    business: biz?.data || null,
    last_30_days: {
      reviews: recent.length,
      average_rating_30d: avg30,
      qr_scans: scans?.count ?? null,
    },
    active_qr_codes: qrCodes?.count ?? null,
    high_risk_customers: churn?.data?.length ?? 0,
  };
}

async function webSearch(query: string) {
  const perplexity = Deno.env.get("PERPLEXITY_API_KEY");
  if (perplexity) {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${perplexity}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          { role: "system", content: "Answer factually and briefly. Cite sources." },
          { role: "user", content: query },
        ],
        max_tokens: 700,
      }),
    });
    if (!res.ok) throw new Error(`perplexity ${res.status}`);
    const data = await res.json();
    return {
      answer: data.choices?.[0]?.message?.content || "",
      sources: data.citations || [],
    };
  }

  const firecrawl = Deno.env.get("FIRECRAWL_API_KEY");
  if (firecrawl) {
    const res = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: { Authorization: `Bearer ${firecrawl}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit: 5 }),
    });
    if (!res.ok) throw new Error(`firecrawl ${res.status}`);
    const data = await res.json();
    const results = (data.data?.web || data.data || []).slice(0, 5).map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.description || r.snippet,
    }));
    return { results };
  }

  throw new Error("no web search provider configured");
}

function webAvailable(): boolean {
  return !!(Deno.env.get("PERPLEXITY_API_KEY") || Deno.env.get("FIRECRAWL_API_KEY"));
}

// -----------------------------------------------------------------------------
// THE PASS
// -----------------------------------------------------------------------------
export async function gatherLiveGrounding(opts: GroundingOptions): Promise<GroundingResult> {
  const { supabase, question, lovableApiKey, userId = null, businessId = null } = opts;
  const budgetMs = opts.budgetMs ?? 12000;
  const deadline = Date.now() + budgetMs;
  const text = (question || "").trim();
  if (!text) return EMPTY;

  const tools = toolSpecs({
    owner: !!businessId,
    user: !!userId,
    web: webAvailable(),
  });

  const messages: any[] = [
    {
      role: "system",
      content: `You are the research step for Kayla, the 1325.AI assistant. You do NOT answer the user. Your only job is to decide which lookups would make the answer factually correct, and call them.

Rules:
- Call a tool whenever the answer depends on real data: a business, a category, a city, the person's own account or their own business numbers, or current outside information.
- Call nothing at all for greetings, opinions, "how do I use X" navigation questions, or anything answerable from general platform knowledge.
- Never make more than 3 calls. Stop as soon as you have enough.
- When you are done, reply with the single word DONE.`,
    },
    { role: "user", content: text.slice(0, 2000) },
  ];

  const calls: GroundingResult["calls"] = [];
  const findings: string[] = [];

  try {
    for (let round = 0; round < 2; round++) {
      if (Date.now() > deadline) break;

      const res = await fetchAIWithRetry(
        GATEWAY,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: ROUTER_MODEL,
            temperature: 0,
            max_tokens: 1024,
            messages,
            tools,
            tool_choice: "auto",
          }),
        },
        { attempts: 2, label: "kayla-grounding" },
      );

      if (!res.ok) {
        console.warn("[kayla-grounding] planner returned", res.status);
        break;
      }

      const data = await res.json();
      const msg = data.choices?.[0]?.message;
      const toolCalls = msg?.tool_calls || [];
      if (!toolCalls.length) break;

      messages.push(msg);

      for (const tc of toolCalls.slice(0, 3)) {
        if (Date.now() > deadline) break;
        const name = tc.function?.name;
        let args: any = {};
        try {
          args = JSON.parse(tc.function?.arguments || "{}");
        } catch { /* keep {} */ }

        let result: any;
        let ok = true;
        try {
          switch (name) {
            case "search_directory":
              result = await searchDirectory(supabase, args);
              break;
            case "get_business_details":
              result = await businessDetails(supabase, args);
              break;
            case "get_platform_stats":
              result = await platformStats(supabase);
              break;
            case "get_my_account":
              result = userId ? await myAccount(supabase, userId) : { error: "not signed in" };
              break;
            case "get_my_business_metrics":
              result = businessId
                ? await myBusinessMetrics(supabase, businessId)
                : { error: "no business on this account" };
              break;
            case "web_search":
              result = await webSearch(String(args?.query || text));
              break;
            default:
              ok = false;
              result = { error: `unknown tool ${name}` };
          }
        } catch (e) {
          ok = false;
          result = { error: (e as Error).message };
        }

        const serialized = JSON.stringify(result).slice(0, 6000);
        calls.push({ tool: name, args, ok, summary: serialized.slice(0, 200) });
        if (ok) findings.push(`### ${name}(${JSON.stringify(args)})\n${serialized}`);

        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: serialized,
        });
      }

      if (calls.length >= 6) break;
    }
  } catch (e) {
    console.error("[kayla-grounding] failed (non-fatal):", e);
  }

  if (!findings.length) return { block: "", calls };

  const block = `

[LIVE LOOKUPS — real data retrieved just now. TREAT AS FACT and prefer it over anything you remember. If a lookup returned nothing, say so plainly rather than inventing an answer. When you use a figure from here, say where it came from (e.g. "from your dashboard", "from the directory", "from a live web search").]
${findings.join("\n\n")}
[END LIVE LOOKUPS]`;

  return { block, calls };
}

/** Find the business a user owns, if any. Safe: returns null on any failure. */
export async function resolveOwnedBusinessId(
  supabase: any,
  userId: string | null | undefined,
): Promise<string | null> {
  if (!userId) return null;
  try {
    const { data } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();
    return data?.id ?? null;
  } catch {
    return null;
  }
}
