import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateMetricsRequest {
  subscription_id: string;
  businesses_supported?: number;
  total_transactions?: number;
  community_reach?: number;
  economic_impact?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      subscription_id, 
      businesses_supported, 
      total_transactions, 
      community_reach, 
      economic_impact 
    }: UpdateMetricsRequest = await req.json();

    if (!subscription_id) {
      throw new Error('subscription_id is required');
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log('Manually updating metrics for subscription:', subscription_id);

    // Verify subscription exists
    const { data: subscription, error: subError } = await supabaseClient
      .from('corporate_subscriptions')
      .select('*')
      .eq('id', subscription_id)
      .single();

    if (subError || !subscription) {
      throw new Error('Subscription not found');
    }

    // Get current metrics
    const { data: currentMetrics } = await supabaseClient
      .from('sponsor_impact_metrics')
      .select('*')
      .eq('subscription_id', subscription_id)
      .order('metric_date', { ascending: false })
      .limit(1)
      .single();

    // Build update object with only provided fields
    const updates: any = {
      subscription_id,
      metric_date: new Date().toISOString().split('T')[0],
    };

    if (businesses_supported !== undefined) {
      updates.businesses_supported = businesses_supported;
    } else if (currentMetrics) {
      updates.businesses_supported = currentMetrics.businesses_supported;
    }

    if (total_transactions !== undefined) {
      updates.total_transactions = total_transactions;
    } else if (currentMetrics) {
      updates.total_transactions = currentMetrics.total_transactions;
    }

    if (community_reach !== undefined) {
      updates.community_reach = community_reach;
    } else if (currentMetrics) {
      updates.community_reach = currentMetrics.community_reach;
    }

    if (economic_impact !== undefined) {
      updates.economic_impact = economic_impact;
    } else if (currentMetrics) {
      updates.economic_impact = currentMetrics.economic_impact;
    }

    // Upsert metrics
    const { data, error } = await supabaseClient
      .from('sponsor_impact_metrics')
      .upsert(updates, {
        onConflict: 'subscription_id,metric_date',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Metrics updated successfully:', data);

    return new Response(JSON.stringify({ 
      success: true, 
      data,
      message: 'Metrics updated successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error updating metrics:", error);
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
