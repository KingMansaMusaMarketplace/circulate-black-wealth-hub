/**
 * Shared utilities for 1325.AI Developer Platform APIs
 * 
 * Protected under USPTO Provisional 63/969,202
 * © 2024-2025 1325.ai - All Rights Reserved
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "X-Patent-Notice": "Protected under USPTO Provisional 63/969,202",
};

export interface ApiKeyValidation {
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

export interface ValidationResult {
  valid: boolean;
  developer?: ApiKeyValidation;
  error?: string;
  statusCode?: number;
}

/**
 * Hash API key using SHA-256
 */
export async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Extract API key from request headers
 */
export function extractApiKey(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }
  
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKeyHeader) {
    return apiKeyHeader;
  }
  
  return null;
}

/**
 * Validate API key and check rate limits
 */
export async function validateApiKey(
  req: Request,
  supabase: ReturnType<typeof createClient>,
  requiredScope: string
): Promise<ValidationResult> {
  const apiKey = extractApiKey(req);
  
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
  
  const developer = validationResult[0] as ApiKeyValidation;
  
  if (developer.status !== "active") {
    return { valid: false, error: `Developer account is ${developer.status}`, statusCode: 403 };
  }
  
  if (!developer.scopes.includes(requiredScope)) {
    return { valid: false, error: `API key does not have ${requiredScope} scope`, statusCode: 403 };
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
 * Log API usage for billing
 */
export async function logApiUsage(
  supabase: ReturnType<typeof createClient>,
  developer: ApiKeyValidation,
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
 * Create error response with CORS headers
 */
export function errorResponse(
  message: string, 
  statusCode: number = 400
): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: statusCode, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
}

/**
 * Create success response with CORS headers
 */
export function successResponse<T>(data: T, statusCode: number = 200): Response {
  return new Response(
    JSON.stringify(data),
    { 
      status: statusCode, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
}
