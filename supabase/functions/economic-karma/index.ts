/**
 * @fileoverview Economic Karma Decay Edge Function
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 *        Featuring Temporal Incentives, Circulatory Multiplier Attribution, and
 *        Geospatial Velocity Fraud Detection
 * 
 * CLAIM 14: Economic Karma Scoring System
 * ----------------------------------------
 * This module implements a proprietary economic karma system that applies a
 * configurable decay rate (default 5% monthly) to user karma scores, incentivizing
 * continued platform engagement and community participation.
 * 
 * Protected Technical Elements:
 * 1. KARMA_DECAY_RATE constant (5% per month)
 * 2. Batch processing of karma decay across all users
 * 3. Karma transaction audit logging for transparency
 * 4. Minimum karma floor (10.0) to prevent complete score elimination
 * 
 * © 2024-2025. All rights reserved. Unauthorized replication prohibited.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PATENT PROTECTED CONSTANT: 5% monthly karma decay rate
const KARMA_DECAY_RATE = 0.05;
const KARMA_MINIMUM_FLOOR = 10.0;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[KARMA DECAY] Starting monthly karma decay process...');

    // Get all users whose karma hasn't been decayed in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: usersToDecay, error: fetchError } = await supabase
      .from('profiles')
      .select('id, economic_karma, karma_last_decay_at')
      .gt('economic_karma', KARMA_MINIMUM_FLOOR)
      .lt('karma_last_decay_at', thirtyDaysAgo.toISOString());

    if (fetchError) {
      console.error('[KARMA DECAY] Error fetching users:', fetchError);
      throw fetchError;
    }

    console.log(`[KARMA DECAY] Found ${usersToDecay?.length || 0} users eligible for karma decay`);

    let decayedCount = 0;
    const karmaTransactions: Array<{
      user_id: string;
      previous_karma: number;
      new_karma: number;
      change_amount: number;
      change_reason: string;
    }> = [];

    for (const user of usersToDecay || []) {
      const previousKarma = Number(user.economic_karma);
      const decayAmount = previousKarma * KARMA_DECAY_RATE;
      const newKarma = Math.max(previousKarma - decayAmount, KARMA_MINIMUM_FLOOR);

      // Update user karma
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          economic_karma: newKarma,
          karma_last_decay_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error(`[KARMA DECAY] Error updating user ${user.id}:`, updateError);
        continue;
      }

      // Queue transaction for batch insert
      karmaTransactions.push({
        user_id: user.id,
        previous_karma: previousKarma,
        new_karma: newKarma,
        change_amount: -(previousKarma - newKarma),
        change_reason: `Monthly karma decay (${KARMA_DECAY_RATE * 100}% rate)`,
      });

      decayedCount++;
    }

    // Batch insert karma transactions for audit trail
    if (karmaTransactions.length > 0) {
      const { error: transactionError } = await supabase
        .from('karma_transactions')
        .insert(karmaTransactions);

      if (transactionError) {
        console.error('[KARMA DECAY] Error inserting transactions:', transactionError);
      }
    }

    console.log(`[KARMA DECAY] Successfully decayed karma for ${decayedCount} users`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: decayedCount,
        decay_rate: KARMA_DECAY_RATE,
        message: `Applied ${KARMA_DECAY_RATE * 100}% karma decay to ${decayedCount} users`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[KARMA DECAY] Fatal error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
