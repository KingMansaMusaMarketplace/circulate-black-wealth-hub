/**
 * @fileoverview Sponsor Impact Metrics Calculator
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 *        Featuring Temporal Incentives, Circulatory Multiplier Attribution, and
 *        Geospatial Velocity Fraud Detection
 * 
 * CLAIM 3: Economic Circulation Multiplier & Impact Attribution
 * -------------------------------------------------------------
 * This module implements a proprietary method for calculating community economic
 * impact wherein transaction values are multiplied by a culturally-specific
 * circulation factor (2.3x) representing the number of times currency circulates
 * within the target demographic before leaving the community.
 * 
 * Key Protected Elements:
 * - The 2.3x economic multiplier constant (line ~83: totalEconomicImpact = economicImpact * 2.3)
 * - Real-time aggregation into automated Impact Reports for corporate sponsors
 * - Attribution of "social ROI velocity" metrics
 * 
 * © 2024-2025. All rights reserved. Unauthorized replication prohibited.
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImpactMetrics {
  businesses_supported: number;
  total_transactions: number;
  community_reach: number;
  economic_impact: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log('Starting impact metrics calculation...');

    // Get all active corporate subscriptions
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('corporate_subscriptions')
      .select('*')
      .eq('status', 'active');

    if (subError) {
      throw new Error(`Failed to fetch subscriptions: ${subError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No active subscriptions found');
      return new Response(JSON.stringify({ message: 'No active subscriptions to process' }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing ${subscriptions.length} active subscriptions`);

    // Calculate metrics for each subscription
    for (const subscription of subscriptions) {
      const startDate = new Date(subscription.created_at);
      const today = new Date();
      
      console.log(`Calculating metrics for subscription ${subscription.id}...`);

      // Get all transactions since subscription started
      const { data: transactions, error: txError } = await supabaseClient
        .from('platform_transactions')
        .select('business_id, amount_total, customer_id')
        .gte('created_at', startDate.toISOString())
        .eq('status', 'succeeded');

      if (txError) {
        console.error(`Error fetching transactions for ${subscription.id}:`, txError);
        continue;
      }

      // Calculate unique businesses supported
      const uniqueBusinesses = new Set(transactions?.map(t => t.business_id) || []);
      const businessesSupported = uniqueBusinesses.size;

      // Total transactions
      const totalTransactions = transactions?.length || 0;

      // Calculate economic impact (sum of all transaction amounts)
      const economicImpact = transactions?.reduce((sum, t) => sum + (t.amount_total || 0), 0) || 0;

      // Estimate community reach (unique customers * multiplier effect)
      const uniqueCustomers = new Set(transactions?.filter(t => t.customer_id).map(t => t.customer_id) || []);
      const communityReach = uniqueCustomers.size * 10; // Estimate 10 people impacted per customer

      // Apply economic multiplier (Black dollar circulates 2.3 times in community)
      const totalEconomicImpact = economicImpact * 2.3;

      const metrics: ImpactMetrics = {
        businesses_supported: businessesSupported,
        total_transactions: totalTransactions,
        community_reach: communityReach,
        economic_impact: totalEconomicImpact,
      };

      console.log(`Metrics for ${subscription.company_name}:`, metrics);

      // Update or insert today's metrics
      const { error: metricsError } = await supabaseClient
        .from('sponsor_impact_metrics')
        .upsert({
          subscription_id: subscription.id,
          metric_date: today.toISOString().split('T')[0],
          ...metrics,
        }, {
          onConflict: 'subscription_id,metric_date',
        });

      if (metricsError) {
        console.error(`Error updating metrics for ${subscription.id}:`, metricsError);
        continue;
      }

      console.log(`✓ Metrics updated for ${subscription.company_name}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: subscriptions.length,
      message: 'Impact metrics calculated successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error calculating impact metrics:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
