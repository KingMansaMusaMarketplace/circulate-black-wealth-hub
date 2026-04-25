import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey) as any;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, business_id } = body;

    if (!business_id) {
      return new Response(JSON.stringify({ error: "business_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify ownership
    const { data: biz } = await supabase
      .from("businesses")
      .select("id, name, category")
      .eq("id", business_id)
      .eq("owner_id", user.id)
      .single();

    if (!biz) {
      return new Response(JSON.stringify({ error: "Business not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = (data: any, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    // ── GET DASHBOARD ──
    if (action === "get_dashboard") {
      const [rules, campaigns, events, loyaltyPoints, noireCredits] = await Promise.all([
        supabase.from("loyalty_engine_rules").select("*").eq("business_id", business_id).order("priority", { ascending: false }),
        supabase.from("loyalty_engine_campaigns").select("*").eq("business_id", business_id).order("created_at", { ascending: false }),
        supabase.from("loyalty_engine_events").select("*").eq("business_id", business_id).order("created_at", { ascending: false }).limit(50),
        supabase.from("loyalty_points").select("*").eq("business_id", business_id),
        supabase.from("noire_community_credits").select("credits_balance, total_earned, total_redeemed, user_id"),
      ]);

      const totalPointsIssued = (events.data || []).reduce((sum: number, e: any) => sum + (e.total_points || 0), 0);
      const totalNoireCredits = (events.data || []).reduce((sum: number, e: any) => sum + (e.noire_credits_awarded || 0), 0);
      const uniqueCustomers = new Set((loyaltyPoints.data || []).map((lp: any) => lp.customer_id)).size;
      const activeCampaigns = (campaigns.data || []).filter((c: any) => c.status === "active").length;
      const activeRules = (rules.data || []).filter((r: any) => r.is_active).length;

      // Calculate avg multiplier from active rules
      const multiplierRules = (rules.data || []).filter((r: any) => r.is_active && r.rule_type === "multiplier");
      const avgMultiplier = multiplierRules.length > 0
        ? multiplierRules.reduce((sum: number, r: any) => sum + (r.reward_config?.multiplier || 1), 0) / multiplierRules.length
        : 1;

      return json({
        success: true,
        rules: rules.data || [],
        campaigns: campaigns.data || [],
        recent_events: events.data || [],
        stats: {
          total_points_issued: totalPointsIssued,
          total_noire_credits: totalNoireCredits,
          unique_customers: uniqueCustomers,
          active_campaigns: activeCampaigns,
          active_rules: activeRules,
          avg_multiplier: Math.round(avgMultiplier * 10) / 10,
          total_loyalty_members: (loyaltyPoints.data || []).length,
        },
      });
    }

    // ── CREATE RULE ──
    if (action === "create_rule") {
      const { name, description, rule_type, trigger_event, conditions, reward_config, starts_at, ends_at } = body;

      if (!name || !trigger_event) {
        return json({ error: "name and trigger_event required" }, 400);
      }

      const { data, error } = await supabase.from("loyalty_engine_rules").insert({
        business_id,
        name,
        description,
        rule_type: rule_type || "multiplier",
        trigger_event,
        conditions: conditions || {},
        reward_config: reward_config || { multiplier: 2 },
        starts_at,
        ends_at,
      }).select().single();

      if (error) return json({ error: (error as Error).message }, 500);
      return json({ success: true, rule: data });
    }

    // ── TOGGLE RULE ──
    if (action === "toggle_rule") {
      const { rule_id, is_active } = body;
      const { error } = await supabase
        .from("loyalty_engine_rules")
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq("id", rule_id)
        .eq("business_id", business_id);

      if (error) return json({ error: (error as Error).message }, 500);
      return json({ success: true });
    }

    // ── DELETE RULE ──
    if (action === "delete_rule") {
      const { rule_id } = body;
      await supabase.from("loyalty_engine_rules").delete().eq("id", rule_id).eq("business_id", business_id);
      return json({ success: true });
    }

    // ── CREATE CAMPAIGN ──
    if (action === "create_campaign") {
      const { name, campaign_type, description, target_audience, budget_points, starts_at, ends_at, rules: campaignRules } = body;

      if (!name || !campaign_type) {
        return json({ error: "name and campaign_type required" }, 400);
      }

      const { data, error } = await supabase.from("loyalty_engine_campaigns").insert({
        business_id,
        name,
        campaign_type,
        description,
        target_audience: target_audience || {},
        budget_points,
        rules: campaignRules || [],
        starts_at,
        ends_at,
        status: starts_at && new Date(starts_at) > new Date() ? "scheduled" : "active",
      }).select().single();

      if (error) return json({ error: (error as Error).message }, 500);

      // Log to Kayla events
      await supabase.from("kayla_event_queue").insert({
        event_type: "loyalty_campaign_created",
        business_id,
        payload: { campaign_id: data.id, campaign_type, name },
        status: "completed",
      }).catch(() => {});

      return json({ success: true, campaign: data });
    }

    // ── UPDATE CAMPAIGN STATUS ──
    if (action === "update_campaign_status") {
      const { campaign_id, status } = body;
      const { error } = await supabase
        .from("loyalty_engine_campaigns")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", campaign_id)
        .eq("business_id", business_id);

      if (error) return json({ error: (error as Error).message }, 500);
      return json({ success: true });
    }

    // ── PROCESS EVENT (called when QR scan / review / booking happens) ──
    if (action === "process_event") {
      const { customer_id, trigger_event, base_points, metadata } = body;

      if (!customer_id || !trigger_event) {
        return json({ error: "customer_id and trigger_event required" }, 400);
      }

      // Find matching active rules
      const { data: matchingRules } = await supabase
        .from("loyalty_engine_rules")
        .select("*")
        .eq("business_id", business_id)
        .eq("trigger_event", trigger_event)
        .eq("is_active", true)
        .order("priority", { ascending: false });

      let totalMultiplier = 1;
      let bonusPoints = 0;
      let noireCreditsToAward = 0;
      const appliedRules: string[] = [];

      const now = new Date();

      for (const rule of matchingRules || []) {
        // Check time bounds
        if (rule.starts_at && new Date(rule.starts_at) > now) continue;
        if (rule.ends_at && new Date(rule.ends_at) < now) continue;
        // Check max uses
        if (rule.max_uses_total && rule.current_uses >= rule.max_uses_total) continue;

        const config = rule.reward_config || {};

        if (rule.rule_type === "multiplier" && config.multiplier) {
          totalMultiplier = Math.max(totalMultiplier, config.multiplier);
          appliedRules.push(rule.id);
        }
        if (config.bonus_points) {
          bonusPoints += config.bonus_points;
          appliedRules.push(rule.id);
        }
        if (config.noire_credits) {
          noireCreditsToAward += config.noire_credits;
          appliedRules.push(rule.id);
        }

        // Increment usage
        await supabase
          .from("loyalty_engine_rules")
          .update({ current_uses: (rule.current_uses || 0) + 1 })
          .eq("id", rule.id);
      }

      const inputPoints = base_points || 10;
      const totalPoints = Math.round(inputPoints * totalMultiplier) + bonusPoints;

      // Update loyalty_points
      const { data: existingLP } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("customer_id", customer_id)
        .eq("business_id", business_id)
        .maybeSingle();

      if (existingLP) {
        await supabase
          .from("loyalty_points")
          .update({ points: existingLP.points + totalPoints, updated_at: new Date().toISOString() })
          .eq("id", existingLP.id);
      } else {
        await supabase.from("loyalty_points").insert({
          customer_id,
          business_id,
          points: totalPoints,
        });
      }

      // Award Noire Community Credits if applicable
      if (noireCreditsToAward > 0) {
        const { data: existingCredits } = await supabase
          .from("noire_community_credits")
          .select("*")
          .eq("user_id", customer_id)
          .maybeSingle();

        if (existingCredits) {
          await supabase
            .from("noire_community_credits")
            .update({
              credits_balance: existingCredits.credits_balance + noireCreditsToAward,
              total_earned: existingCredits.total_earned + noireCreditsToAward,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingCredits.id);
        } else {
          await supabase.from("noire_community_credits").insert({
            user_id: customer_id,
            credits_balance: noireCreditsToAward,
            total_earned: noireCreditsToAward,
          });
        }

        // Log noire credit transaction
        await supabase.from("noire_credit_transactions").insert({
          user_id: customer_id,
          business_id,
          amount: noireCreditsToAward,
          transaction_type: "loyalty_engine_reward",
          description: `Loyalty Engine: ${trigger_event} reward`,
        }).catch(() => {});
      }

      // Log loyalty event
      await supabase.from("loyalty_engine_events").insert({
        business_id,
        customer_id,
        rule_id: appliedRules[0] || null,
        event_type: totalMultiplier > 1 ? "multiplier_applied" : "points_earned",
        base_points: inputPoints,
        bonus_points: bonusPoints,
        multiplier: totalMultiplier,
        total_points: totalPoints,
        noire_credits_awarded: noireCreditsToAward,
        metadata: {
          trigger: trigger_event,
          applied_rules: appliedRules,
          ...metadata,
        },
      });

      return json({
        success: true,
        points_awarded: totalPoints,
        noire_credits_awarded: noireCreditsToAward,
        multiplier: totalMultiplier,
        rules_applied: appliedRules.length,
      });
    }

    // ── AI SUGGEST CAMPAIGNS ──
    if (action === "suggest_campaigns") {
      const [loyaltyData, eventsData] = await Promise.all([
        supabase.from("loyalty_points").select("customer_id, points").eq("business_id", business_id),
        supabase.from("loyalty_engine_events").select("event_type, total_points, created_at").eq("business_id", business_id).order("created_at", { ascending: false }).limit(100),
      ]);

      const members = (loyaltyData.data || []).length;
      const avgPoints = members > 0
        ? Math.round((loyaltyData.data || []).reduce((s: number, lp: any) => s + lp.points, 0) / members)
        : 0;
      const recentActivity = (eventsData.data || []).length;

      const suggestions = [];

      // Low engagement → winback campaign
      if (recentActivity < 10) {
        suggestions.push({
          name: "Win-Back Blitz",
          campaign_type: "winback",
          description: "Re-engage inactive customers with 3x points on their next visit",
          ai_reasoning: `Only ${recentActivity} loyalty events recently. A win-back campaign with multiplied points can reactivate lapsed customers.`,
          rules: [{ rule_type: "multiplier", trigger_event: "qr_scan", reward_config: { multiplier: 3 } }],
        });
      }

      // Good base → streak challenge
      if (members >= 5) {
        suggestions.push({
          name: "5-Visit Streak Challenge",
          campaign_type: "streak_challenge",
          description: "Customers who visit 5 times in 30 days earn 100 bonus points + 5 Noire Credits",
          ai_reasoning: `${members} active loyalty members make this a prime time for a streak challenge to increase visit frequency.`,
          rules: [{ rule_type: "streak", trigger_event: "qr_scan", reward_config: { bonus_points: 100, noire_credits: 5 } }],
        });
      }

      // Cross-platform opportunity
      suggestions.push({
        name: "Ride & Reward",
        campaign_type: "cross_platform",
        description: "Customers who take a Noire ride to your business earn double loyalty points + Noire Credits",
        ai_reasoning: "Cross-platform campaigns between Noire Rideshare and your business increase foot traffic while rewarding community transportation choices.",
        rules: [{ rule_type: "cross_reward", trigger_event: "noire_ride", reward_config: { multiplier: 2, noire_credits: 10 } }],
      });

      // Happy hour
      suggestions.push({
        name: "Happy Hour Double Points",
        campaign_type: "happy_hour",
        description: "2x points every Friday 5-9 PM",
        ai_reasoning: "Time-based multiplier campaigns drive predictable traffic during slower periods.",
        rules: [{ rule_type: "multiplier", trigger_event: "qr_scan", conditions: { day_of_week: "friday", time_range: ["17:00", "21:00"] }, reward_config: { multiplier: 2 } }],
      });

      return json({ success: true, suggestions });
    }

    return json({ error: "Invalid action" }, 400);
  } catch (err) {
    console.error("Loyalty engine error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
