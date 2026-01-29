/**
 * Fraud Detection API - 1325.AI Developer Platform
 * 
 * Protected under USPTO Provisional 63/969,202 (Claim 4)
 * © 2024-2025 1325.ai - All Rights Reserved
 * 
 * Endpoints:
 * - POST /v1/fraud/analyze - Analyze transactions for fraud patterns
 * - POST /v1/fraud/verify-location - Verify location consistency
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  validateApiKey,
  logApiUsage,
  errorResponse,
  successResponse,
} from "../_shared/api-gateway-utils.ts";

const REQUIRED_SCOPE = "fraud:read";

// Speed of light in km/h for "impossible travel" detection
const MAX_REALISTIC_SPEED_KMH = 900; // Commercial aircraft

interface AnalyzeRequest {
  transactions: Array<{
    id: string;
    amount: number;
    timestamp: string;
    location?: { lat: number; lng: number };
    merchant_category?: string;
  }>;
  user_activity?: Array<{
    type: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
  timeframe_hours?: number;
}

interface VerifyLocationRequest {
  user_id: string;
  location_a: { lat: number; lng: number; timestamp: string };
  location_b: { lat: number; lng: number; timestamp: string };
}

// Haversine formula to calculate distance between two points
function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Validate API key
  const validation = await validateApiKey(req, supabase, REQUIRED_SCOPE);
  if (!validation.valid) {
    return errorResponse(validation.error!, validation.statusCode);
  }

  const developer = validation.developer!;
  const endpoint = pathParts.slice(1).join("/");

  try {
    let result: any;
    let billedUnits = 1;

    if (req.method === "POST" && endpoint.includes("analyze")) {
      // Analyze transactions for fraud
      const body: AnalyzeRequest = await req.json();

      if (!body.transactions || body.transactions.length === 0) {
        return errorResponse("transactions array is required", 400);
      }

      const alerts: Array<{
        type: string;
        severity: "low" | "medium" | "high" | "critical";
        description: string;
        transaction_ids: string[];
      }> = [];

      const patterns: string[] = [];
      let riskScore = 0;

      // Pattern 1: Velocity check - too many transactions in short time
      const timeframeHours = body.timeframe_hours || 24;
      const txnCount = body.transactions.length;
      if (txnCount > 20) {
        alerts.push({
          type: "high_velocity",
          severity: "medium",
          description: `${txnCount} transactions in ${timeframeHours} hours exceeds normal patterns`,
          transaction_ids: body.transactions.slice(0, 5).map((t) => t.id),
        });
        patterns.push("high_transaction_velocity");
        riskScore += 25;
      }

      // Pattern 2: Large transaction amounts
      const largeTransactions = body.transactions.filter((t) => t.amount > 5000);
      if (largeTransactions.length > 0) {
        alerts.push({
          type: "large_amount",
          severity: "high",
          description: `${largeTransactions.length} transactions exceed $5,000 threshold`,
          transaction_ids: largeTransactions.map((t) => t.id),
        });
        patterns.push("large_transaction_amounts");
        riskScore += 30;
      }

      // Pattern 3: Geographic anomalies (if locations provided)
      const geoTransactions = body.transactions.filter((t) => t.location);
      if (geoTransactions.length >= 2) {
        for (let i = 1; i < geoTransactions.length; i++) {
          const prev = geoTransactions[i - 1];
          const curr = geoTransactions[i];
          
          if (prev.location && curr.location) {
            const distance = calculateDistanceKm(
              prev.location.lat,
              prev.location.lng,
              curr.location.lat,
              curr.location.lng
            );
            
            const timeDiffHours =
              (new Date(curr.timestamp).getTime() -
                new Date(prev.timestamp).getTime()) /
              (1000 * 60 * 60);
            
            if (timeDiffHours > 0) {
              const impliedSpeed = distance / timeDiffHours;
              if (impliedSpeed > MAX_REALISTIC_SPEED_KMH) {
                alerts.push({
                  type: "impossible_travel",
                  severity: "critical",
                  description: `Impossible travel detected: ${Math.round(distance)}km in ${timeDiffHours.toFixed(2)} hours (${Math.round(impliedSpeed)} km/h)`,
                  transaction_ids: [prev.id, curr.id],
                });
                patterns.push("impossible_travel");
                riskScore += 50;
              }
            }
          }
        }
      }

      // Pattern 4: Unusual merchant categories
      const categories = body.transactions
        .map((t) => t.merchant_category)
        .filter(Boolean);
      const uniqueCategories = new Set(categories);
      if (uniqueCategories.size > 10) {
        patterns.push("diverse_merchant_categories");
        riskScore += 10;
      }

      // Cap risk score at 100
      riskScore = Math.min(riskScore, 100);

      result = {
        risk_score: riskScore,
        risk_level:
          riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low",
        alerts,
        patterns_detected: patterns,
        transactions_analyzed: body.transactions.length,
        analysis_timestamp: new Date().toISOString(),
        patent_notice: "Protected under USPTO Provisional 63/969,202 - Claim 4",
      };

      // Bill based on number of transactions analyzed
      billedUnits = Math.max(1, Math.ceil(body.transactions.length / 10));

    } else if (req.method === "POST" && endpoint.includes("verify-location")) {
      // Verify location consistency
      const body: VerifyLocationRequest = await req.json();

      if (!body.user_id || !body.location_a || !body.location_b) {
        return errorResponse(
          "user_id, location_a, and location_b are required",
          400
        );
      }

      const distance = calculateDistanceKm(
        body.location_a.lat,
        body.location_a.lng,
        body.location_b.lat,
        body.location_b.lng
      );

      const timeDiffHours =
        Math.abs(
          new Date(body.location_b.timestamp).getTime() -
            new Date(body.location_a.timestamp).getTime()
        ) /
        (1000 * 60 * 60);

      const impliedVelocity = timeDiffHours > 0 ? distance / timeDiffHours : 0;
      const isPossible = impliedVelocity <= MAX_REALISTIC_SPEED_KMH;

      let confidence: number;
      if (impliedVelocity < 100) {
        confidence = 0.99; // Ground travel, very likely
      } else if (impliedVelocity < 500) {
        confidence = 0.85; // Could be high-speed train
      } else if (impliedVelocity < MAX_REALISTIC_SPEED_KMH) {
        confidence = 0.7; // Likely air travel
      } else {
        confidence = 0.1; // Impossible without teleportation
      }

      result = {
        user_id: body.user_id,
        is_possible: isPossible,
        distance_km: Math.round(distance * 100) / 100,
        time_difference_hours: Math.round(timeDiffHours * 100) / 100,
        implied_velocity_kmh: Math.round(impliedVelocity * 100) / 100,
        confidence,
        travel_mode_estimate: impliedVelocity < 100
          ? "ground"
          : impliedVelocity < 500
          ? "high_speed_rail"
          : impliedVelocity < MAX_REALISTIC_SPEED_KMH
          ? "air"
          : "impossible",
        patent_notice: "Protected under USPTO Provisional 63/969,202",
      };

      billedUnits = 1;

    } else {
      return errorResponse(
        "Unknown endpoint. Available: POST /analyze, POST /verify-location",
        404
      );
    }

    const latencyMs = Date.now() - startTime;

    await logApiUsage(
      supabase,
      developer,
      `/v1/fraud/${endpoint}`,
      req.method,
      200,
      latencyMs,
      billedUnits,
      req
    );

    return successResponse(result);

  } catch (error) {
    console.error("Fraud API error:", error);

    const latencyMs = Date.now() - startTime;
    await logApiUsage(
      supabase,
      developer,
      `/v1/fraud/${endpoint}`,
      req.method,
      500,
      latencyMs,
      0,
      req
    );

    return errorResponse(error.message || "Internal server error", 500);
  }
});
