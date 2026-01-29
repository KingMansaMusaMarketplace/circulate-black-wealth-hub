/**
 * PATENT-PROTECTED IMPLEMENTATION
 * 
 * Public CMAL Engine API for 1325.AI Developer Platform
 * 
 * This edge function implements claims from:
 * "System and Method for a Multi-Tenant Vertical Marketplace Operating System"
 * 
 * CLAIM 2: Economic Circulation Multiplier Attribution Logic (CMAL)
 * CLAIM 3: Tier-based multiplier application
 * 
 * Protected Elements:
 * - Economic impact calculation using proprietary 2.3x multiplier
 * - Tier-based multiplier adjustment (Bronze 1.0x, Silver 1.25x, Gold 1.5x, Platinum 2.0x)
 * - Attribution chain tracking for multi-business transactions
 * 
 * © 2024-2025 1325.ai - All Rights Reserved
 * USPTO Provisional Application 63/969,202
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "X-Patent-Notice": "Protected under USPTO Provisional 63/969,202",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// CMAL Constants (Patent-Protected)
const BASE_CIRCULATION_MULTIPLIER = 2.3;
const TIER_MULTIPLIERS: Record<string, number> = {
  bronze: 1.0,
  silver: 1.25,
  gold: 1.5,
  platinum: 2.0,
};

// Category-specific adjustments
const CATEGORY_MULTIPLIERS: Record<string, number> = {
  restaurant: 1.1,
  retail: 1.0,
  services: 1.15,
  healthcare: 1.2,
  education: 1.25,
  entertainment: 0.95,
  technology: 1.1,
  manufacturing: 1.3,
  construction: 1.35,
  finance: 1.0,
  default: 1.0,
};

interface CalculateRequest {
  transaction_amount: number;
  business_category?: string;
  user_tier?: string;
  location?: string;
  metadata?: Record<string, unknown>;
}

interface CalculateResponse {
  original_amount: number;
  multiplied_impact: number;
  circulation_score: number;
  base_multiplier: number;
  tier_multiplier: number;
  category_multiplier: number;
  effective_multiplier: number;
  attribution: {
    local_retention: number;
    community_benefit: number;
    economic_velocity: number;
  };
  patent_notice: string;
}

interface AttributeRequest {
  transaction_id: string;
  chain_of_businesses: Array<{
    business_id: string;
    amount: number;
    category?: string;
  }>;
}

interface AttributeResponse {
  transaction_id: string;
  total_circulation: number;
  velocity_score: number;
  attribution_breakdown: Array<{
    business_id: string;
    amount: number;
    impact: number;
    percentage: number;
  }>;
  patent_notice: string;
}

/**
 * Hash API key using SHA-256
 */
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Extract and validate API key
 */
async function validateRequest(
  req: Request,
  supabase: ReturnType<typeof createClient>
): Promise<{ valid: boolean; developer?: any; error?: string; statusCode?: number }> {
  const authHeader = req.headers.get("authorization");
  const apiKeyHeader = req.headers.get("x-api-key");
  
  const apiKey = authHeader?.startsWith("Bearer ") 
    ? authHeader.replace("Bearer ", "") 
    : apiKeyHeader;
  
  if (!apiKey) {
    return { 
      valid: false, 
      error: "Missing API key. Use Authorization: Bearer <key> or X-API-Key header.",
      statusCode: 401 
    };
  }
  
  const keyHash = await hashApiKey(apiKey);
  
  const { data: validationResult, error: validationError } = await supabase
    .rpc("validate_api_key", { p_key_hash: keyHash });
  
  if (validationError || !validationResult || validationResult.length === 0) {
    return { valid: false, error: "Invalid or revoked API key", statusCode: 401 };
  }
  
  const developer = validationResult[0];
  
  if (developer.status !== "active") {
    return { valid: false, error: `Developer account is ${developer.status}`, statusCode: 403 };
  }
  
  if (!developer.scopes.includes("cmal")) {
    return { valid: false, error: "API key does not have CMAL scope", statusCode: 403 };
  }
  
  // Check rate limit
  const { data: rateLimitOk } = await supabase.rpc("check_api_rate_limit", {
    p_api_key_id: developer.api_key_id,
    p_limit_per_minute: developer.rate_limit_per_minute,
  });
  
  if (!rateLimitOk) {
    return { 
      valid: false, 
      error: `Rate limit exceeded. Max ${developer.rate_limit_per_minute}/min.`,
      statusCode: 429 
    };
  }
  
  return { valid: true, developer };
}

/**
 * Log API usage
 */
async function logUsage(
  supabase: ReturnType<typeof createClient>,
  developer: any,
  endpoint: string,
  method: string,
  status: number,
  latencyMs: number,
  billedUnits: number,
  req: Request
): Promise<void> {
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || null;
  const userAgent = req.headers.get("user-agent") || null;
  
  await supabase.rpc("log_api_usage", {
    p_api_key_id: developer.api_key_id,
    p_developer_id: developer.developer_id,
    p_endpoint: endpoint,
    p_method: method,
    p_response_status: status,
    p_latency_ms: latencyMs,
    p_billed_units: billedUnits,
    p_ip_address: ipAddress,
    p_user_agent: userAgent,
  });
}

/**
 * Calculate CMAL impact for a transaction
 */
function calculateCmalImpact(input: CalculateRequest): CalculateResponse {
  const { transaction_amount, business_category, user_tier } = input;
  
  // Get multipliers
  const tierMultiplier = TIER_MULTIPLIERS[user_tier?.toLowerCase() || "bronze"] || 1.0;
  const categoryMultiplier = CATEGORY_MULTIPLIERS[business_category?.toLowerCase() || "default"] || 1.0;
  
  // Calculate effective multiplier
  const effectiveMultiplier = BASE_CIRCULATION_MULTIPLIER * tierMultiplier * categoryMultiplier;
  
  // Calculate multiplied impact
  const multipliedImpact = transaction_amount * effectiveMultiplier;
  
  // Calculate circulation score (0-100 based on impact)
  const circulationScore = Math.min(100, Math.round((effectiveMultiplier / 6.9) * 100));
  
  // Attribution breakdown
  const localRetention = multipliedImpact * 0.4;
  const communityBenefit = multipliedImpact * 0.35;
  const economicVelocity = multipliedImpact * 0.25;
  
  return {
    original_amount: transaction_amount,
    multiplied_impact: Math.round(multipliedImpact * 100) / 100,
    circulation_score: circulationScore,
    base_multiplier: BASE_CIRCULATION_MULTIPLIER,
    tier_multiplier: tierMultiplier,
    category_multiplier: categoryMultiplier,
    effective_multiplier: Math.round(effectiveMultiplier * 1000) / 1000,
    attribution: {
      local_retention: Math.round(localRetention * 100) / 100,
      community_benefit: Math.round(communityBenefit * 100) / 100,
      economic_velocity: Math.round(economicVelocity * 100) / 100,
    },
    patent_notice: "Protected under USPTO Provisional 63/969,202",
  };
}

/**
 * Calculate attribution across a chain of businesses
 */
function calculateAttribution(input: AttributeRequest): AttributeResponse {
  const { transaction_id, chain_of_businesses } = input;
  
  let totalCirculation = 0;
  const breakdown = chain_of_businesses.map((business) => {
    const categoryMultiplier = CATEGORY_MULTIPLIERS[business.category?.toLowerCase() || "default"] || 1.0;
    const impact = business.amount * BASE_CIRCULATION_MULTIPLIER * categoryMultiplier;
    totalCirculation += impact;
    
    return {
      business_id: business.business_id,
      amount: business.amount,
      impact: Math.round(impact * 100) / 100,
      percentage: 0, // Will be calculated after total
    };
  });
  
  // Calculate percentages
  breakdown.forEach((b) => {
    b.percentage = Math.round((b.impact / totalCirculation) * 10000) / 100;
  });
  
  // Velocity score based on chain length and total circulation
  const velocityScore = Math.min(100, Math.round(
    (chain_of_businesses.length * 15) + (totalCirculation / 1000)
  ));
  
  return {
    transaction_id,
    total_circulation: Math.round(totalCirculation * 100) / 100,
    velocity_score: velocityScore,
    attribution_breakdown: breakdown,
    patent_notice: "Protected under USPTO Provisional 63/969,202",
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const url = new URL(req.url);
  const path = url.pathname.replace("/cmal-api", "");
  
  // Validate API key
  const validation = await validateRequest(req, supabase);
  if (!validation.valid) {
    return new Response(
      JSON.stringify({ error: validation.error }),
      { 
        status: validation.statusCode || 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
  
  try {
    let response: Response;
    let billedUnits = 1;
    
    // Route to appropriate handler
    if (req.method === "POST" && (path === "/calculate" || path === "" || path === "/")) {
      const input: CalculateRequest = await req.json();
      
      if (!input.transaction_amount || input.transaction_amount <= 0) {
        response = new Response(
          JSON.stringify({ error: "transaction_amount is required and must be positive" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        const result = calculateCmalImpact(input);
        response = new Response(
          JSON.stringify(result),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (req.method === "POST" && path === "/attribute") {
      const input: AttributeRequest = await req.json();
      
      if (!input.transaction_id || !input.chain_of_businesses?.length) {
        response = new Response(
          JSON.stringify({ error: "transaction_id and chain_of_businesses are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        const result = calculateAttribution(input);
        billedUnits = Math.max(1, input.chain_of_businesses.length); // Bill per business in chain
        response = new Response(
          JSON.stringify(result),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (req.method === "GET" && path === "/health") {
      billedUnits = 0; // Health check is free
      response = new Response(
        JSON.stringify({ 
          status: "healthy", 
          version: "1.0.0",
          engine: "CMAL",
          patent: "USPTO Provisional 63/969,202"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      response = new Response(
        JSON.stringify({ 
          error: "Not found",
          available_endpoints: [
            "POST /cmal-api/calculate",
            "POST /cmal-api/attribute",
            "GET /cmal-api/health"
          ]
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Log usage
    const latencyMs = Date.now() - startTime;
    await logUsage(
      supabase,
      validation.developer,
      `/v1/cmal${path || "/calculate"}`,
      req.method,
      response.status,
      latencyMs,
      billedUnits,
      req
    );
    
    return response;
    
  } catch (error) {
    console.error("CMAL API error:", error);
    
    // Log error usage
    const latencyMs = Date.now() - startTime;
    await logUsage(
      supabase,
      validation.developer,
      `/v1/cmal${path}`,
      req.method,
      500,
      latencyMs,
      0,
      req
    );
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
