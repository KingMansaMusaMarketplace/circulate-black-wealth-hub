import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SMART-PRICING] ${step}${detailsStr}`);
};

// Seasonality multipliers by month (US vacation market)
const SEASONALITY: Record<number, { label: string; multiplier: number }> = {
  0: { label: 'Winter Low', multiplier: 0.85 },
  1: { label: 'Winter Low', multiplier: 0.85 },
  2: { label: 'Spring Break', multiplier: 1.15 },
  3: { label: 'Spring', multiplier: 1.05 },
  4: { label: 'Pre-Summer', multiplier: 1.10 },
  5: { label: 'Summer Peak', multiplier: 1.30 },
  6: { label: 'Summer Peak', multiplier: 1.35 },
  7: { label: 'Summer', multiplier: 1.20 },
  8: { label: 'Labor Day', multiplier: 1.05 },
  9: { label: 'Fall', multiplier: 0.95 },
  10: { label: 'Thanksgiving', multiplier: 1.10 },
  11: { label: 'Holiday Season', multiplier: 1.25 },
};

// Weekend premium
const WEEKEND_MULTIPLIER = 1.15;

interface PricingFactor {
  name: string;
  impact: number; // percentage change
  description: string;
}

function generateRecommendation(
  baseRate: number,
  property: any,
  targetDate: Date,
): { recommendedRate: number; confidence: number; reason: string; factors: PricingFactor[] } {
  const factors: PricingFactor[] = [];
  let multiplier = 1.0;

  // 1. Seasonality
  const month = targetDate.getMonth();
  const season = SEASONALITY[month];
  if (season.multiplier !== 1.0) {
    factors.push({
      name: 'Seasonality',
      impact: Math.round((season.multiplier - 1) * 100),
      description: `${season.label} demand adjustment`,
    });
    multiplier *= season.multiplier;
  }

  // 2. Weekend premium (Fri/Sat)
  const day = targetDate.getDay();
  if (day === 5 || day === 6) {
    factors.push({
      name: 'Weekend Premium',
      impact: Math.round((WEEKEND_MULTIPLIER - 1) * 100),
      description: 'Higher weekend demand',
    });
    multiplier *= WEEKEND_MULTIPLIER;
  }

  // 3. Property quality signals
  if (property.average_rating >= 4.5 && property.review_count >= 5) {
    const qualityBoost = 1.08;
    factors.push({
      name: 'High Rating Boost',
      impact: 8,
      description: `${property.average_rating}★ rating with ${property.review_count} reviews`,
    });
    multiplier *= qualityBoost;
  }

  // 4. Amenity premium
  const premiumAmenities = ['pool', 'hot_tub', 'ev_charger', 'beach_access', 'lake_access', 'ski_access'];
  const amenities = property.amenities || [];
  const premiumCount = amenities.filter((a: string) => premiumAmenities.includes(a)).length;
  if (premiumCount >= 2) {
    const amenityBoost = 1 + (premiumCount * 0.03);
    factors.push({
      name: 'Premium Amenities',
      impact: Math.round((amenityBoost - 1) * 100),
      description: `${premiumCount} premium amenities (pool, hot tub, etc.)`,
    });
    multiplier *= amenityBoost;
  }

  // 5. Capacity-based adjustment
  if (property.max_guests >= 8) {
    factors.push({
      name: 'Large Group Capacity',
      impact: 5,
      description: `Accommodates ${property.max_guests} guests`,
    });
    multiplier *= 1.05;
  }

  // 6. Instant book discount suggestion
  if (!property.is_instant_book) {
    factors.push({
      name: 'No Instant Book',
      impact: -3,
      description: 'Enable instant book to attract more bookings',
    });
    multiplier *= 0.97;
  }

  const recommendedRate = Math.round(baseRate * multiplier);
  const confidence = Math.min(0.95, 0.6 + (property.review_count || 0) * 0.02 + factors.length * 0.05);

  const topFactor = factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))[0];
  const direction = recommendedRate > baseRate ? 'increase' : recommendedRate < baseRate ? 'decrease' : 'maintain';
  const reason = direction === 'maintain'
    ? 'Your current pricing is well-optimized for this period.'
    : `${topFactor?.description || 'Market conditions'} suggest a ${direction} to $${recommendedRate}/night for this period.`;

  return { recommendedRate, confidence: Math.round(confidence * 100) / 100, reason, factors };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("Not authenticated");

    logStep("User authenticated", { userId: user.id });

    // Get host's properties
    const { data: properties, error: propError } = await supabaseClient
      .from("vacation_properties")
      .select("*")
      .eq("host_id", user.id)
      .eq("is_active", true);

    if (propError) throw new Error(`Error fetching properties: ${propError.message}`);
    if (!properties || properties.length === 0) {
      return new Response(JSON.stringify({ success: true, recommendations: [], message: "No active properties" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Found properties", { count: properties.length });

    const recommendations = [];
    const now = new Date();

    for (const property of properties) {
      // Generate recommendations for next 4 periods (2-week windows)
      for (let period = 0; period < 4; period++) {
        const fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() + period * 14);
        const toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 13);

        const midDate = new Date(fromDate);
        midDate.setDate(midDate.getDate() + 7);

        const result = generateRecommendation(
          property.base_nightly_rate,
          property,
          midDate,
        );

        // Only create recommendation if price differs by more than 3%
        const priceDiff = Math.abs(result.recommendedRate - property.base_nightly_rate) / property.base_nightly_rate;
        if (priceDiff > 0.03) {
          recommendations.push({
            property_id: property.id,
            host_id: user.id,
            current_nightly_rate: property.base_nightly_rate,
            recommended_nightly_rate: result.recommendedRate,
            confidence_score: result.confidence,
            reason: result.reason,
            factors: result.factors,
            applies_from: fromDate.toISOString().split('T')[0],
            applies_to: toDate.toISOString().split('T')[0],
            status: 'pending',
          });
        }
      }
    }

    // Clear old pending recommendations for this host
    await supabaseClient
      .from("pricing_recommendations")
      .delete()
      .eq("host_id", user.id)
      .eq("status", "pending");

    // Insert new recommendations
    if (recommendations.length > 0) {
      const { error: insertError } = await supabaseClient
        .from("pricing_recommendations")
        .insert(recommendations);

      if (insertError) throw new Error(`Insert error: ${insertError.message}`);
    }

    logStep("Generated recommendations", { count: recommendations.length });

    return new Response(JSON.stringify({
      success: true,
      recommendations,
      count: recommendations.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ success: false, error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
