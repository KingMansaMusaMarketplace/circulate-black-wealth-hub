/**
 * Public Supplier Search API
 *
 * Read-only endpoint that lets approved partners (procurement teams,
 * Salesforce AppExchange app, bank/city portals) search the 1325.AI
 * verified directory. Authenticated with the existing developer API keys.
 *
 * Protected under U.S. Provisional Patent Application No. 63/969,202 — 45 claims pending.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-csrf-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "X-Patent-Notice": "Protected under USPTO Provisional 63/969,202",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function hashApiKey(key: string): Promise<string> {
  const data = new TextEncoder().encode(key);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function extractApiKey(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return req.headers.get("x-api-key");
}

interface SearchParams {
  query?: string | null;
  category?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  radius_miles?: number | null;
  verified_only?: boolean;
  limit?: number;
  offset?: number;
}

function readParams(req: Request, url: URL, body: Record<string, unknown>): SearchParams {
  const g = (k: string) => {
    const fromBody = body[k];
    if (fromBody !== undefined && fromBody !== null && fromBody !== "") return String(fromBody);
    return url.searchParams.get(k);
  };
  const num = (k: string, fallback: number, max: number) => {
    const raw = g(k);
    const n = raw === null ? NaN : Number(raw);
    if (!Number.isFinite(n) || n < 0) return fallback;
    return Math.min(n, max);
  };
  const clean = (v: string | null) => {
    const s = (v ?? "").trim();
    return s.length ? s.slice(0, 120) : null;
  };

  return {
    query: clean(g("query") ?? g("q")),
    category: clean(g("category")),
    city: clean(g("city")),
    state: clean(g("state")),
    zip: clean(g("zip") ?? g("zip_code")),
    radius_miles: num("radius_miles", 25, 250),
    verified_only: String(g("verified_only") ?? "").toLowerCase() === "true",
    limit: Math.max(1, num("limit", 25, 100)),
    offset: num("offset", 0, 100000),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;
  const url = new URL(req.url);

  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return json({ success: false, error: "Method not allowed", errorCode: "METHOD_NOT_ALLOWED" }, 405);
    }

    const apiKey = extractApiKey(req);
    if (!apiKey) {
      return json(
        {
          success: false,
          error: "Missing API key. Provide via Authorization: Bearer <key> or X-API-Key header.",
          errorCode: "MISSING_API_KEY",
        },
        401,
      );
    }

    const keyHash = await hashApiKey(apiKey);
    const { data: validation, error: validationError } = await supabase.rpc("validate_api_key", {
      p_key_hash: keyHash,
    });

    if (validationError) {
      console.error("validate_api_key failed:", validationError);
      return json({ success: false, error: "Authentication error", errorCode: "AUTH_ERROR" }, 500);
    }
    if (!validation || validation.length === 0) {
      return json({ success: false, error: "Invalid or revoked API key", errorCode: "INVALID_API_KEY" }, 401);
    }

    const developer = validation[0];
    if (developer.status !== "active") {
      return json(
        { success: false, error: `Developer account is ${developer.status}`, errorCode: "ACCOUNT_INACTIVE" },
        403,
      );
    }
    if (!Array.isArray(developer.scopes) || !developer.scopes.includes("supplier-search")) {
      return json(
        { success: false, error: "API key does not have access to supplier search", errorCode: "SCOPE_DENIED" },
        403,
      );
    }

    const { data: rateOk, error: rateError } = await supabase.rpc("check_api_rate_limit", {
      p_api_key_id: developer.api_key_id,
      p_limit_per_minute: developer.rate_limit_per_minute,
    });
    if (rateError) {
      console.error("check_api_rate_limit failed:", rateError);
      return json({ success: false, error: "Rate limit check failed", errorCode: "RATE_LIMIT_ERROR" }, 500);
    }
    if (!rateOk) {
      return json(
        {
          success: false,
          error: `Rate limit exceeded. Maximum ${developer.rate_limit_per_minute} requests per minute.`,
          errorCode: "RATE_LIMIT_EXCEEDED",
        },
        429,
      );
    }

    let body: Record<string, unknown> = {};
    if (req.method === "POST") {
      try {
        body = (await req.json()) ?? {};
      } catch {
        body = {};
      }
    }

    const params = readParams(req, url, body);

    const { data: rows, error: searchError } = await supabase.rpc("supplier_search_api", {
      p_query: params.query,
      p_category: params.category,
      p_city: params.city,
      p_state: params.state,
      p_zip: params.zip,
      p_radius_miles: params.radius_miles,
      p_verified_only: params.verified_only,
      p_limit: params.limit,
      p_offset: params.offset,
    });

    if (searchError) {
      console.error("supplier_search_api failed:", searchError);
      return json({ success: false, error: "Search failed", errorCode: "SEARCH_ERROR" }, 500);
    }

    const results = (rows ?? []).map((r: Record<string, unknown>) => ({
      id: r.id,
      name: r.business_name,
      description: r.description,
      category: r.category,
      city: r.city,
      state: r.state,
      zip_code: r.zip_code,
      phone: r.phone,
      website: r.website,
      verified: r.is_verified === true,
      ownership_verified: r.ownership_verified === true,
      average_rating: r.average_rating,
      review_count: r.review_count,
      distance_miles: r.distance_miles ?? null,
      listing_url: `https://1325.ai/business/${r.slug ?? r.id}`,
    }));

    const total = rows && rows.length > 0 ? Number((rows[0] as Record<string, unknown>).total_count ?? 0) : 0;
    const latencyMs = Date.now() - startTime;

    await supabase.rpc("log_api_usage", {
      p_api_key_id: developer.api_key_id,
      p_developer_id: developer.developer_id,
      p_endpoint: "/supplier-search",
      p_method: req.method,
      p_response_status: 200,
      p_latency_ms: latencyMs,
      p_billed_units: 1,
      p_ip_address: req.headers.get("x-forwarded-for")?.split(",")[0] || null,
      p_user_agent: req.headers.get("user-agent") || null,
    });

    return json({
      success: true,
      total,
      count: results.length,
      limit: params.limit,
      offset: params.offset,
      filters: params,
      results,
      source: "1325.AI verified Black-owned business directory",
      notice: "Protected under U.S. Provisional Patent Application No. 63/969,202 — 45 claims pending.",
    });
  } catch (error) {
    console.error("supplier-search error:", error);
    return json(
      { success: false, error: (error as Error).message || "Internal server error", errorCode: "INTERNAL_ERROR" },
      500,
    );
  }
});
