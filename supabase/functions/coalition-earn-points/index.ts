/**
 * PATENT-PROTECTED IMPLEMENTATION
 * 
 * This edge function implements claims from:
 * "System and Method for a Multi-Tenant Vertical Marketplace Operating System"
 * 
 * CLAIM 3: Economic Circulation Multiplier Attribution Engine (CMAL)
 * A computer-implemented method for calculating and attributing economic impact
 * using a proprietary circulation multiplier, comprising:
 * - Base points calculation from transaction value
 * - Tier-based multiplier application (Bronze 1.0x, Silver 1.25x, Gold 1.5x, Platinum 2.0x)
 * - Coalition-wide point pooling and redemption tracking
 * - Real-time balance updates with atomic database operations
 * 
 * CLAIM 8: Coalition Loyalty Network with Cross-Business Redemption
 * A computer-implemented loyalty system enabling point earning and redemption
 * across multiple independent businesses, comprising:
 * - Unified point currency across coalition members
 * - Tier progression based on lifetime points earned
 * - Cross-business reward redemption without point conversion
 * - Member business revenue sharing based on redemption patterns
 * 
 * Protected Elements:
 * - award_coalition_points() RPC function with tier multiplier
 * - Coalition member verification before point award
 * - Atomic point balance updates
 * 
 * © 2024-2025 1325.ai - All Rights Reserved
 * Filing Date: January 2025
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;

    // Verify the JWT and get user claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    if (claimsError || !claimsData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { customer_id, business_id, transaction_id, description } = await req.json();

    // Validate inputs
    if (!customer_id || !business_id || !transaction_id) {
      return new Response(
        JSON.stringify({ error: "customer_id, business_id and transaction_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authorization: verify the caller owns or is associated with the business
    const callerUserId = claimsData.user.id;
    const { data: businessOwner, error: ownerError } = await supabase
      .from("businesses")
      .select("owner_id")
      .eq("id", business_id)
      .single();

    if (ownerError || !businessOwner) {
      return new Response(
        JSON.stringify({ error: "Business not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only the business owner or an admin can award points
    const { data: isAdmin } = await supabase.rpc("is_admin_secure");
    if (businessOwner.owner_id !== callerUserId && !isAdmin) {
      return new Response(
        JSON.stringify({ error: "You are not authorized to award points for this business" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if business is a coalition member
    const { data: member, error: memberError } = await supabase
      .from("coalition_members")
      .select("id, is_active")
      .eq("business_id", business_id)
      .single();

    if (memberError || !member?.is_active) {
      return new Response(
        JSON.stringify({ error: "Business is not an active coalition member" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Points are derived from a stored, completed transaction for this business —
    // never from a value supplied by the caller.
    const { data: txn } = await supabase
      .from("transactions")
      .select("id, customer_id, business_id, amount, points_earned, created_at")
      .eq("id", transaction_id)
      .eq("business_id", business_id)
      .eq("customer_id", customer_id)
      .maybeSingle();

    if (!txn) {
      return new Response(
        JSON.stringify({ error: "No matching transaction found for this customer and business" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // One award per transaction.
    const { data: alreadyAwarded } = await supabase
      .from("coalition_transactions")
      .select("id")
      .eq("customer_id", customer_id)
      .eq("source_business_id", business_id)
      .contains("metadata", { transaction_id })
      .maybeSingle();
    if (alreadyAwarded) {
      return new Response(
        JSON.stringify({ error: "Points were already awarded for this transaction" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const derivedPoints = Math.min(
      Math.max(Math.round(Number(txn.points_earned ?? Number(txn.amount ?? 0))), 1),
      10000
    );

    // Use the database function to award points
    const { data, error } = await supabase.rpc("award_coalition_points", {
      p_customer_id: customer_id,
      p_business_id: business_id,
      p_base_points: derivedPoints,
      p_description: description || "Points earned",
    });

    if (error) {
      console.error("Error awarding coalition points:", error);
      return new Response(
        JSON.stringify({ error: (error as Error).message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Coalition points awarded:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Coalition earn points error:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
