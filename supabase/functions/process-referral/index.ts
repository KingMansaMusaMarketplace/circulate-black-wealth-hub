/**
 * PATENT-PROTECTED IMPLEMENTATION
 * 
 * This edge function implements claims from:
 * "System and Method for a Multi-Tenant Vertical Marketplace Operating System"
 * 
 * CLAIM 7: Multi-Tier Commission Cascade System
 * A computer-implemented system for automatically calculating and distributing
 * commission payments across multiple tiers of sales agents, comprising:
 * - Primary agent commission calculation based on referral conversion
 * - Secondary "override" commissions for recruiting agents
 * - Tertiary recruitment bonuses triggered upon agent qualification
 * - Automatic payment scheduling with configurable due dates
 * - Audit trail generation for regulatory compliance
 * 
 * Protected Elements:
 * - process_pending_referrals() RPC function for atomic processing
 * - Cascading commission calculations with configurable percentages
 * - Team override mechanism (recruiter earns from recruited agent's referrals)
 * - Activity logging for complete audit trail
 * 
 * © 2024-2025 1325.ai - All Rights Reserved
 * Filing Date: January 2025
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to log errors to a table
async function logError(supabase: any, error: any, operation: string, details: any = {}) {
  try {
    await supabase
      .from('error_logs')
      .insert({
        error_message: error.message,
        error_code: error.code,
        operation,
        details: JSON.stringify(details),
        service: 'edge-function',
        function_name: 'process-referral'
      });
  } catch (logError) {
    // If we can't log to the database, at least console log the error
    console.error('Failed to log error:', logError);
    console.error('Original error:', error);
  }
}

// Helper function to generate a reference ID
function generateReference() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  let supabaseClient;
  const startTime = Date.now();
  const requestId = generateReference();
  
  try {
    console.log(`[${requestId}] Starting process-referral function`);
    
    // Create a Supabase client with the Auth context of the logged in user
    supabaseClient = createClient(
      // Supabase API URL - env var exported by default
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies will be applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Log the start of processing
    await supabaseClient.from('activity_logs').insert({
      activity_type: 'process_referrals_start',
      entity_type: 'system',
      entity_id: requestId,
      details: { source: 'edge-function' }
    });
    
    // Now we can run queries in the context of the authenticated user
    const { data, error } = await supabaseClient.rpc('process_pending_referrals')
    
    if (error) {
      throw error
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] Completed processing in ${processingTime}ms`);
    
    // Log successful completion
    await supabaseClient.from('activity_logs').insert({
      activity_type: 'process_referrals_complete',
      entity_type: 'system',
      entity_id: requestId,
      details: { 
        processing_time_ms: processingTime,
        results: data
      }
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      data,
      request_id: requestId,
      processing_time_ms: processingTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error(`[${requestId}] Error in process-referral: ${error?.message || error}`);
    
    // Log error to database if possible
    if (supabaseClient) {
      await logError(supabaseClient, error, 'process_referrals', {
        request_id: requestId,
        processing_time_ms: processingTime
      });
    }
    
    return new Response(JSON.stringify({ 
      error: error?.message || 'Unknown error',
      request_id: requestId,
      processing_time_ms: processingTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
