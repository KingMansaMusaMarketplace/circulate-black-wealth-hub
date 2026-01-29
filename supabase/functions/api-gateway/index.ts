/**
 * PATENT-PROTECTED IMPLEMENTATION
 * 
 * Central API Gateway for 1325.AI Developer Platform
 * Handles authentication, rate limiting, and usage logging for all public APIs.
 * 
 * Protected under USPTO Provisional Application 63/969,202
 * © 2024-2025 1325.ai - All Rights Reserved
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "X-Patent-Notice": "Protected under USPTO Provisional 63/969,202",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface ApiKeyValidation {
  developer_id: string;
  api_key_id: string;
  tier: "free" | "pro" | "enterprise";
  status: "pending" | "active" | "suspended";
  rate_limit_per_minute: number;
  scopes: string[];
  monthly_cmal_limit: number;
  monthly_voice_limit: number;
  monthly_susu_limit: number;
  monthly_fraud_limit: number;
}

interface GatewayResponse {
  success: boolean;
  developer?: ApiKeyValidation;
  error?: string;
  errorCode?: string;
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
 * Extract API key from request headers
 */
function extractApiKey(req: Request): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }
  
  // Check X-API-Key header
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKeyHeader) {
    return apiKeyHeader;
  }
  
  return null;
}

/**
 * Validate API key and check rate limits
 */
async function validateAndCheckLimits(
  supabase: ReturnType<typeof createClient>,
  apiKey: string
): Promise<GatewayResponse> {
  const keyHash = await hashApiKey(apiKey);
  
  // Validate API key
  const { data: validationResult, error: validationError } = await supabase
    .rpc("validate_api_key", { p_key_hash: keyHash });
  
  if (validationError) {
    console.error("API key validation error:", validationError);
    return {
      success: false,
      error: "Internal server error during authentication",
      errorCode: "AUTH_ERROR",
    };
  }
  
  if (!validationResult || validationResult.length === 0) {
    return {
      success: false,
      error: "Invalid or revoked API key",
      errorCode: "INVALID_API_KEY",
    };
  }
  
  const developer = validationResult[0] as ApiKeyValidation;
  
  // Check if developer account is active
  if (developer.status !== "active") {
    return {
      success: false,
      error: `Developer account is ${developer.status}`,
      errorCode: "ACCOUNT_INACTIVE",
    };
  }
  
  // Check rate limit
  const { data: rateLimitOk, error: rateLimitError } = await supabase
    .rpc("check_api_rate_limit", {
      p_api_key_id: developer.api_key_id,
      p_limit_per_minute: developer.rate_limit_per_minute,
    });
  
  if (rateLimitError) {
    console.error("Rate limit check error:", rateLimitError);
    return {
      success: false,
      error: "Internal server error during rate limit check",
      errorCode: "RATE_LIMIT_ERROR",
    };
  }
  
  if (!rateLimitOk) {
    return {
      success: false,
      error: `Rate limit exceeded. Maximum ${developer.rate_limit_per_minute} requests per minute.`,
      errorCode: "RATE_LIMIT_EXCEEDED",
    };
  }
  
  return {
    success: true,
    developer,
  };
}

/**
 * Log API usage for billing
 */
async function logUsage(
  supabase: ReturnType<typeof createClient>,
  apiKeyId: string,
  developerId: string,
  endpoint: string,
  method: string,
  responseStatus: number,
  latencyMs: number,
  billedUnits: number = 1,
  req: Request
): Promise<void> {
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || null;
  const userAgent = req.headers.get("user-agent") || null;
  
  await supabase.rpc("log_api_usage", {
    p_api_key_id: apiKeyId,
    p_developer_id: developerId,
    p_endpoint: endpoint,
    p_method: method,
    p_response_status: responseStatus,
    p_latency_ms: latencyMs,
    p_billed_units: billedUnits,
    p_ip_address: ipAddress,
    p_user_agent: userAgent,
  });
}

/**
 * Check scope access
 */
function hasScope(developer: ApiKeyValidation, requiredScope: string): boolean {
  return developer.scopes.includes(requiredScope);
}

/**
 * Get monthly usage for a specific endpoint type
 */
async function getMonthlyUsage(
  supabase: ReturnType<typeof createClient>,
  developerId: string,
  endpointPrefix: string
): Promise<number> {
  const { data, error } = await supabase.rpc("get_developer_monthly_usage", {
    p_developer_id: developerId,
  });
  
  if (error || !data) {
    return 0;
  }
  
  const usage = data.filter((u: { endpoint: string; total_billed_units: number }) => 
    u.endpoint.startsWith(endpointPrefix)
  );
  
  return usage.reduce((sum: number, u: { total_billed_units: number }) => 
    sum + (u.total_billed_units || 0), 0
  );
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // This endpoint is for internal gateway validation only
    // Individual API endpoints should call this function's logic
    const { action, endpoint, scope, billed_units } = await req.json();
    
    if (action === "validate") {
      const apiKey = extractApiKey(req);
      
      if (!apiKey) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Missing API key. Provide via Authorization: Bearer <key> or X-API-Key header.",
            errorCode: "MISSING_API_KEY",
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      const validation = await validateAndCheckLimits(supabase, apiKey);
      
      if (!validation.success) {
        const statusCode = validation.errorCode === "RATE_LIMIT_EXCEEDED" ? 429 : 401;
        return new Response(
          JSON.stringify({
            success: false,
            error: validation.error,
            errorCode: validation.errorCode,
          }),
          { 
            status: statusCode, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Check scope if required
      if (scope && !hasScope(validation.developer!, scope)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `API key does not have access to scope: ${scope}`,
            errorCode: "SCOPE_DENIED",
          }),
          { 
            status: 403, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          developer: validation.developer,
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (action === "log_usage") {
      const apiKey = extractApiKey(req);
      if (!apiKey) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing API key" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const keyHash = await hashApiKey(apiKey);
      const { data: validationResult } = await supabase
        .rpc("validate_api_key", { p_key_hash: keyHash });
      
      if (validationResult && validationResult.length > 0) {
        const developer = validationResult[0] as ApiKeyValidation;
        const latencyMs = Date.now() - startTime;
        
        await logUsage(
          supabase,
          developer.api_key_id,
          developer.developer_id,
          endpoint || "/unknown",
          req.method,
          200,
          latencyMs,
          billed_units || 1,
          req
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("API Gateway error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
        errorCode: "INTERNAL_ERROR",
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
