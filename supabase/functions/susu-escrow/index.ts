/**
 * @fileoverview Susu Digital Escrow System Edge Function
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 *        Featuring Temporal Incentives, Circulatory Multiplier Attribution, and
 *        Geospatial Velocity Fraud Detection
 * 
 * CLAIM 15: Susu Digital Escrow System
 * -------------------------------------
 * This module implements a proprietary digital escrow system for traditional African
 * rotating savings circles (Susu/Esusu). The system manages:
 * 
 * Protected Technical Elements:
 * 1. SUSU_PLATFORM_FEE constant (1.5% of each payout)
 * 2. Atomic escrow hold/release operations
 * 3. Round-robin payout scheduling with position-based ordering
 * 4. Fraud prevention via contribution verification before payout release
 * 
 * © 2024-2025. All rights reserved. Unauthorized replication prohibited.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PATENT PROTECTED CONSTANT: 1.5% platform fee on Susu payouts
const SUSU_PLATFORM_FEE = 0.015;

interface SusuAction {
  action: 'contribute' | 'release_payout' | 'get_circle_status' | 'advance_round';
  circle_id: string;
  user_id?: string;
  amount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, circle_id, user_id, amount }: SusuAction = await req.json();

    console.log(`[SUSU ESCROW] Action: ${action}, Circle: ${circle_id}`);

    // Validate circle exists
    const { data: circle, error: circleError } = await supabase
      .from('susu_circles')
      .select('*, susu_memberships(*)')
      .eq('id', circle_id)
      .single();

    if (circleError || !circle) {
      return new Response(
        JSON.stringify({ success: false, error: 'Circle not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    switch (action) {
      case 'contribute': {
        if (!user_id || !amount) {
          return new Response(
            JSON.stringify({ success: false, error: 'user_id and amount required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Verify user is a member
        const membership = circle.susu_memberships?.find((m: any) => m.user_id === user_id);
        if (!membership) {
          return new Response(
            JSON.stringify({ success: false, error: 'User is not a member of this circle' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }

        // Find recipient for current round
        const recipient = circle.susu_memberships?.find(
          (m: any) => m.payout_position === circle.current_round
        );

        // Create escrow record (funds held)
        const { data: escrowRecord, error: escrowError } = await supabase
          .from('susu_escrow')
          .insert({
            circle_id,
            round_number: circle.current_round,
            contributor_id: user_id,
            recipient_id: recipient?.user_id || null,
            amount,
            platform_fee: amount * SUSU_PLATFORM_FEE,
            status: 'held',
            held_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (escrowError) {
          console.error('[SUSU ESCROW] Contribution error:', escrowError);
          throw escrowError;
        }

        console.log(`[SUSU ESCROW] Contribution held: ${amount} from user ${user_id}`);

        return new Response(
          JSON.stringify({
            success: true,
            escrow_id: escrowRecord.id,
            amount_held: amount,
            platform_fee: amount * SUSU_PLATFORM_FEE,
            message: 'Contribution held in escrow',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'release_payout': {
        // Get all held contributions for current round
        const { data: heldFunds, error: heldError } = await supabase
          .from('susu_escrow')
          .select('*')
          .eq('circle_id', circle_id)
          .eq('round_number', circle.current_round)
          .eq('status', 'held');

        if (heldError) throw heldError;

        const memberCount = circle.susu_memberships?.length || 0;
        const contributionCount = heldFunds?.length || 0;

        // Verify all members have contributed before releasing
        if (contributionCount < memberCount) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Not all members have contributed',
              contributions: contributionCount,
              required: memberCount,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Find recipient for this round
        const recipient = circle.susu_memberships?.find(
          (m: any) => m.payout_position === circle.current_round
        );

        if (!recipient) {
          return new Response(
            JSON.stringify({ success: false, error: 'No recipient found for current round' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Calculate total payout
        const totalAmount = heldFunds.reduce((sum: number, f: any) => sum + Number(f.amount), 0);
        const totalPlatformFee = heldFunds.reduce((sum: number, f: any) => sum + Number(f.platform_fee), 0);
        const netPayout = totalAmount - totalPlatformFee;

        // Release all held funds
        const { error: releaseError } = await supabase
          .from('susu_escrow')
          .update({
            status: 'released',
            released_at: new Date().toISOString(),
          })
          .eq('circle_id', circle_id)
          .eq('round_number', circle.current_round)
          .eq('status', 'held');

        if (releaseError) throw releaseError;

        console.log(`[SUSU ESCROW] Released payout: ${netPayout} to user ${recipient.user_id}`);

        return new Response(
          JSON.stringify({
            success: true,
            recipient_id: recipient.user_id,
            total_contributed: totalAmount,
            platform_fee: totalPlatformFee,
            net_payout: netPayout,
            round: circle.current_round,
            message: `Payout of ${netPayout} released to round ${circle.current_round} recipient`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'advance_round': {
        const nextRound = circle.current_round + 1;
        const isComplete = nextRound > (circle.susu_memberships?.length || 0);

        const { error: advanceError } = await supabase
          .from('susu_circles')
          .update({
            current_round: isComplete ? circle.current_round : nextRound,
            status: isComplete ? 'completed' : 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', circle_id);

        if (advanceError) throw advanceError;

        return new Response(
          JSON.stringify({
            success: true,
            previous_round: circle.current_round,
            new_round: isComplete ? circle.current_round : nextRound,
            circle_completed: isComplete,
            message: isComplete ? 'Circle completed!' : `Advanced to round ${nextRound}`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'get_circle_status': {
        // Get contribution status for current round
        const { data: contributions, error: contribError } = await supabase
          .from('susu_escrow')
          .select('contributor_id, amount, status')
          .eq('circle_id', circle_id)
          .eq('round_number', circle.current_round);

        if (contribError) throw contribError;

        const currentRecipient = circle.susu_memberships?.find(
          (m: any) => m.payout_position === circle.current_round
        );

        return new Response(
          JSON.stringify({
            success: true,
            circle_name: circle.name,
            status: circle.status,
            current_round: circle.current_round,
            total_rounds: circle.susu_memberships?.length || 0,
            contribution_amount: circle.contribution_amount,
            platform_fee_rate: SUSU_PLATFORM_FEE,
            current_recipient_id: currentRecipient?.user_id,
            contributions_this_round: contributions?.length || 0,
            members_count: circle.susu_memberships?.length || 0,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
  } catch (error) {
    console.error('[SUSU ESCROW] Fatal error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
