/**
 * @fileoverview AI-Powered B2B Matching Engine
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 * 
 * CLAIM 5: B2B Matching Engine with Multi-Factor Weighted Scoring
 * ----------------------------------------------------------------
 * This module implements a proprietary business-to-business matching algorithm
 * using weighted scoring across category, location, budget, rating, and timeline.
 * 
 * Protected Scoring Weights:
 * - CATEGORY_MATCH: 30 points
 * - SAME_CITY: 20 points, SAME_STATE: 10 points
 * - SERVICE_AREA_OVERLAP: 15 points
 * - BUDGET_COMPATIBILITY: 15 points
 * - RATING_BONUS_MAX: 15 points (3 pts/star)
 * - TIMELINE_MATCH: 10 points
 * 
 * © 2024-2026 Thomas D. Bowling. All rights reserved.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Zod schema for input validation
const B2BMatchRequestSchema = z.object({
  need_id: z.string().regex(uuidRegex, 'Invalid UUID format for need_id'),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Apply rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    if (!checkRateLimit(clientIP, 10, 60000)) { // 10 requests per minute
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment before trying again.' }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = B2BMatchRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(i => i.message).join(', ');
      console.log('Validation error:', errors);
      return new Response(
        JSON.stringify({ error: `Validation error: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { need_id } = parseResult.data;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the need details
    const { data: need, error: needError } = await supabase
      .from("business_needs")
      .select(`
        *,
        business:business_id(business_name, city, state)
      `)
      .eq("id", need_id)
      .single();

    if (needError || !need) {
      return new Response(
        JSON.stringify({ error: "Need not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get potential suppliers
    const { data: capabilities, error: capError } = await supabase
      .from("business_capabilities")
      .select(`
        *,
        business:business_id(id, business_name, city, state, average_rating, review_count)
      `)
      .eq("is_active", true)
      .eq("category", need.category)
      .neq("business_id", need.business_id);

    if (capError) {
      throw capError;
    }

    // Score each capability
    const scoredMatches = (capabilities || []).map((cap) => {
      let score = 0;
      const reasons: string[] = [];

      // Category match (base score)
      score += 30;
      reasons.push("Category match");

      // Location proximity
      if (cap.business?.city === need.business?.city) {
        score += 20;
        reasons.push("Same city");
      } else if (cap.business?.state === need.business?.state) {
        score += 10;
        reasons.push("Same state");
      }

      // Service area match
      if (cap.service_area && need.preferred_location) {
        const hasOverlap = cap.service_area.some((area: string) =>
          need.preferred_location.includes(area)
        );
        if (hasOverlap) {
          score += 15;
          reasons.push("Serves your area");
        }
      }

      // Budget compatibility
      if (need.budget_max && cap.price_range_min) {
        if (cap.price_range_min <= need.budget_max) {
          score += 15;
          reasons.push("Within budget");
        }
      }

      // Rating bonus
      if (cap.business?.average_rating) {
        const ratingBonus = Math.min(cap.business.average_rating * 3, 15);
        score += ratingBonus;
        if (cap.business.average_rating >= 4) {
          reasons.push("Highly rated");
        }
      }

      // Lead time vs urgency
      if (cap.lead_time_days && need.urgency) {
        const urgencyDays: Record<string, number> = {
          immediate: 3,
          within_week: 7,
          within_month: 30,
          planning: 90,
          flexible: 180,
        };
        const maxDays = urgencyDays[need.urgency] || 180;
        if (cap.lead_time_days <= maxDays) {
          score += 10;
          reasons.push("Can meet timeline");
        }
      }

      return {
        capability: cap,
        score: Math.min(score, 100),
        reasons,
      };
    });

    // Sort by score
    scoredMatches.sort((a, b) => b.score - a.score);

    // Take top 10 matches
    const topMatches = scoredMatches.slice(0, 10);

    // Optionally use AI to enhance match descriptions
    if (lovableApiKey && topMatches.length > 0) {
      try {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "You are a B2B matchmaker helping Black-owned businesses connect. Given a business need and top supplier matches, provide a brief 1-sentence recommendation for the top match.",
              },
              {
                role: "user",
                content: `Need: ${need.title} - ${need.description}\n\nTop Match: ${topMatches[0].capability.business?.business_name} - ${topMatches[0].capability.title}\n\nProvide a brief recommendation.`,
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const recommendation = aiData.choices?.[0]?.message?.content;
          if (recommendation) {
            topMatches[0].ai_recommendation = recommendation;
          }
        }
      } catch (aiError) {
        console.log("AI enhancement skipped:", aiError);
      }
    }

    return new Response(
      JSON.stringify({
        need,
        matches: topMatches,
        total_found: capabilities?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("B2B match error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
