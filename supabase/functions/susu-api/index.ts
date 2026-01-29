/**
 * Susu Protocol API - 1325.AI Developer Platform
 * 
 * Protected under USPTO Provisional 63/969,202 (Claim 15)
 * © 2024-2025 1325.ai - All Rights Reserved
 * 
 * Endpoints:
 * - POST /v1/susu/circle/create - Create a new Susu circle
 * - POST /v1/susu/contribution - Record a contribution
 * - POST /v1/susu/payout/release - Release payout to recipient
 * - GET /v1/susu/circle/:id - Get circle details
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  validateApiKey,
  logApiUsage,
  errorResponse,
  successResponse,
} from "../_shared/api-gateway-utils.ts";

const REQUIRED_SCOPE = "susu:read";
const PLATFORM_FEE_PERCENTAGE = 0.015; // 1.5% platform fee

interface CreateCircleRequest {
  name: string;
  contribution_amount: number;
  frequency: "weekly" | "biweekly" | "monthly";
  member_count: number;
  currency?: string;
}

interface ContributionRequest {
  circle_id: string;
  contributor_id: string;
  amount: number;
}

interface PayoutRequest {
  circle_id: string;
  round_number: number;
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
  
  // Parse endpoint
  const endpoint = pathParts.slice(1).join("/");

  try {
    let result: any;
    let billedUnits = 1;

    if (req.method === "POST" && endpoint.includes("circle/create")) {
      // Create a new Susu circle
      const body: CreateCircleRequest = await req.json();
      
      if (!body.name || !body.contribution_amount || !body.frequency || !body.member_count) {
        return errorResponse("Missing required fields: name, contribution_amount, frequency, member_count", 400);
      }

      const circleId = crypto.randomUUID();
      const escrowAddress = `escrow_${circleId.slice(0, 8)}`;
      
      // Calculate total pool and payout schedule
      const totalPool = body.contribution_amount * body.member_count;
      const platformFee = totalPool * PLATFORM_FEE_PERCENTAGE;
      const netPayout = totalPool - platformFee;

      result = {
        circle_id: circleId,
        escrow_address: escrowAddress,
        name: body.name,
        terms: {
          contribution_amount: body.contribution_amount,
          frequency: body.frequency,
          member_count: body.member_count,
          currency: body.currency || "USD",
          total_pool_per_round: totalPool,
          platform_fee_percentage: PLATFORM_FEE_PERCENTAGE * 100,
          platform_fee_amount: platformFee,
          net_payout_per_round: netPayout,
        },
        payout_schedule: Array.from({ length: body.member_count }, (_, i) => ({
          round: i + 1,
          payout_amount: netPayout,
          status: "pending",
        })),
        status: "awaiting_members",
        created_at: new Date().toISOString(),
        patent_notice: "Protected under USPTO Provisional 63/969,202 - Claim 15",
      };

      billedUnits = 1;

    } else if (req.method === "POST" && endpoint.includes("contribution")) {
      // Record a contribution
      const body: ContributionRequest = await req.json();
      
      if (!body.circle_id || !body.contributor_id || !body.amount) {
        return errorResponse("Missing required fields: circle_id, contributor_id, amount", 400);
      }

      const receiptId = crypto.randomUUID();
      const platformFee = body.amount * PLATFORM_FEE_PERCENTAGE;

      result = {
        receipt_id: receiptId,
        circle_id: body.circle_id,
        contributor_id: body.contributor_id,
        amount: body.amount,
        platform_fee: platformFee,
        net_contribution: body.amount - platformFee,
        escrow_status: "held",
        next_payout_info: {
          estimated_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          position_in_queue: Math.floor(Math.random() * 10) + 1,
        },
        recorded_at: new Date().toISOString(),
        patent_notice: "Protected under USPTO Provisional 63/969,202",
      };

      billedUnits = 1;

    } else if (req.method === "POST" && endpoint.includes("payout/release")) {
      // Release payout
      const body: PayoutRequest = await req.json();
      
      if (!body.circle_id || body.round_number === undefined) {
        return errorResponse("Missing required fields: circle_id, round_number", 400);
      }

      const payoutId = crypto.randomUUID();
      // Simulate payout calculation
      const grossAmount = 1000; // Would come from circle data
      const platformFee = grossAmount * PLATFORM_FEE_PERCENTAGE;

      result = {
        payout_id: payoutId,
        circle_id: body.circle_id,
        round_number: body.round_number,
        recipient_id: `recipient_${body.round_number}`,
        gross_amount: grossAmount,
        platform_fee: platformFee,
        net_amount: grossAmount - platformFee,
        status: "released",
        released_at: new Date().toISOString(),
        patent_notice: "Protected under USPTO Provisional 63/969,202",
      };

      billedUnits = 1;

    } else if (req.method === "GET" && endpoint.includes("circle/")) {
      // Get circle details
      const circleId = pathParts[pathParts.length - 1];
      
      result = {
        circle_id: circleId,
        name: "Community Savings Circle",
        status: "active",
        terms: {
          contribution_amount: 100,
          frequency: "monthly",
          member_count: 10,
          currency: "USD",
          platform_fee_percentage: PLATFORM_FEE_PERCENTAGE * 100,
        },
        current_round: 3,
        total_rounds: 10,
        escrow_balance: 300,
        members: [],
        patent_notice: "Protected under USPTO Provisional 63/969,202",
      };

      billedUnits = 1;

    } else {
      return errorResponse(
        "Unknown endpoint. Available: POST /circle/create, POST /contribution, POST /payout/release, GET /circle/:id",
        404
      );
    }

    const latencyMs = Date.now() - startTime;

    await logApiUsage(
      supabase,
      developer,
      `/v1/susu/${endpoint}`,
      req.method,
      200,
      latencyMs,
      billedUnits,
      req
    );

    return successResponse(result);

  } catch (error) {
    console.error("Susu API error:", error);
    
    const latencyMs = Date.now() - startTime;
    await logApiUsage(
      supabase,
      developer,
      `/v1/susu/${endpoint}`,
      req.method,
      500,
      latencyMs,
      0,
      req
    );

    return errorResponse(error.message || "Internal server error", 500);
  }
});
