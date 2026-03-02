import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// --- Tool Handlers ---

async function searchBusinesses(
  supabase: ReturnType<typeof createClient>,
  args: { query: string; category?: string; limit?: number }
) {
  const limit = Math.min(args.limit || 5, 10);
  let query = supabase
    .from("business_directory")
    .select("id, business_name, category, address, city, state, average_rating, review_count, is_verified, logo_url")
    .limit(limit);

  if (args.category) {
    query = query.ilike("category", `%${args.category}%`);
  }
  if (args.query) {
    query = query.or(
      `business_name.ilike.%${args.query}%,category.ilike.%${args.query}%,city.ilike.%${args.query}%`
    );
  }

  const { data, error } = await query.order("is_verified", { ascending: false });
  if (error) throw new Error(error.message);
  return { businesses: data, count: data?.length || 0 };
}

async function getBusinessDetails(
  supabase: ReturnType<typeof createClient>,
  args: { business_id: string }
) {
  const { data: business, error } = await supabase
    .from("business_directory")
    .select("*")
    .eq("id", args.business_id)
    .single();
  if (error) throw new Error(error.message);

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, comment, created_at")
    .eq("business_id", args.business_id)
    .order("created_at", { ascending: false })
    .limit(5);

  return { business, recent_reviews: reviews || [] };
}

async function checkLoyaltyPoints(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  const { data, error } = await supabase
    .from("loyalty_points")
    .select("points_balance, total_earned, total_redeemed, tier")
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data || { points_balance: 0, total_earned: 0, total_redeemed: 0, tier: "bronze" };
}

async function getUpcomingBookings(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, service_name, booking_date, booking_time, status, business:businesses(business_name)")
    .eq("user_id", userId)
    .gte("booking_date", new Date().toISOString().split("T")[0])
    .in("status", ["confirmed", "pending"])
    .order("booking_date", { ascending: true })
    .limit(5);
  if (error) throw new Error(error.message);
  return { bookings: data || [], count: data?.length || 0 };
}

async function getNearbyBusinesses(
  supabase: ReturnType<typeof createClient>,
  args: { city: string; category?: string; limit?: number }
) {
  const limit = Math.min(args.limit || 5, 10);
  let query = supabase
    .from("business_directory")
    .select("id, business_name, category, address, city, state, average_rating, is_verified")
    .ilike("city", `%${args.city}%`)
    .limit(limit);

  if (args.category) {
    query = query.ilike("category", `%${args.category}%`);
  }

  const { data, error } = await query.order("average_rating", { ascending: false });
  if (error) throw new Error(error.message);
  return { businesses: data, count: data?.length || 0 };
}

// --- Business-owner tools ---

async function getChurnAlerts(
  supabase: ReturnType<typeof createClient>,
  businessId: string
) {
  const { data, error } = await supabase
    .from("churn_predictions")
    .select("user_id, risk_score, risk_factors, predicted_at")
    .eq("business_id", businessId)
    .gte("risk_score", 0.6)
    .order("risk_score", { ascending: false })
    .limit(5);
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return { alerts: data || [], count: data?.length || 0 };
}

async function getDealPipeline(
  supabase: ReturnType<typeof createClient>,
  businessId: string
) {
  const { data, error } = await supabase
    .from("b2b_connections")
    .select("id, buyer_business_id, supplier_business_id, match_score, status, estimated_value, connection_type")
    .or(`buyer_business_id.eq.${businessId},supplier_business_id.eq.${businessId}`)
    .order("match_score", { ascending: false })
    .limit(10);
  if (error) throw new Error(error.message);
  return { deals: data || [], count: data?.length || 0 };
}

async function getAgentStats(
  supabase: ReturnType<typeof createClient>,
  businessId: string
) {
  const { data: actions } = await supabase
    .from("ai_agent_actions")
    .select("id, action_type, status, created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: rules } = await supabase
    .from("ai_agent_rules")
    .select("id, name, is_active, execution_count, last_executed_at")
    .eq("business_id", businessId)
    .eq("is_active", true);

  return {
    recent_actions: actions || [],
    active_rules: rules || [],
    total_actions: actions?.length || 0,
    active_rules_count: rules?.length || 0,
  };
}

// --- Determine user role ---

async function getUserRole(supabase: ReturnType<typeof createClient>, userId: string) {
  // Check admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  // Check business owner
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", userId)
    .limit(1)
    .maybeSingle();

  return {
    isAdmin,
    isBusinessOwner: !!business,
    businessId: business?.id || null,
  };
}

// --- Main Handler ---

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { tool, arguments: toolArgs } = await req.json();
    if (!tool) {
      return new Response(JSON.stringify({ error: "Missing tool name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { isAdmin, isBusinessOwner, businessId } = await getUserRole(supabase, user.id);

    // Public tools (all authenticated users)
    const publicTools: Record<string, () => Promise<any>> = {
      search_businesses: () => searchBusinesses(supabase, toolArgs),
      get_business_details: () => getBusinessDetails(supabase, toolArgs),
      get_nearby_businesses: () => getNearbyBusinesses(supabase, toolArgs),
      check_loyalty_points: () => checkLoyaltyPoints(supabase, user.id),
      get_upcoming_bookings: () => getUpcomingBookings(supabase, user.id),
    };

    // Business owner tools
    const ownerTools: Record<string, () => Promise<any>> = {
      get_churn_alerts: () => getChurnAlerts(supabase, businessId!),
      get_deal_pipeline: () => getDealPipeline(supabase, businessId!),
      get_agent_stats: () => getAgentStats(supabase, businessId!),
    };

    let result: any;

    if (publicTools[tool]) {
      result = await publicTools[tool]();
    } else if (ownerTools[tool] && (isBusinessOwner || isAdmin)) {
      result = await ownerTools[tool]();
    } else if (ownerTools[tool]) {
      return new Response(
        JSON.stringify({ error: "This tool is only available to business owners" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(JSON.stringify({ error: `Unknown tool: ${tool}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("kayla-tools error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
