/**
 * @fileoverview Multi-Model Fraud Consensus Validator
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Extends Claim 4 (Velocity-Based Fraud Detection) with multi-model
 * consensus validation. Primary model (Gemini) flags alerts, secondary
 * model (GPT-5) independently validates before auto-actions execute.
 * 
 * © 2024-2025. All rights reserved. Unauthorized replication prohibited.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ConsensusRequest {
  alert_ids?: string[];
  review_all_pending?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ========== AUTHENTICATION CHECK ==========
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: isAdmin } = await supabaseAuth.rpc('is_admin_secure');
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // ========== END AUTHENTICATION CHECK ==========

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') as any!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body: ConsensusRequest = await req.json();

    // Fetch alerts needing consensus review
    let query = supabase
      .from('fraud_alerts')
      .select('*')
      .is('consensus_score', null)
      .in('severity', ['critical', 'high'])
      .order('created_at', { ascending: false })
      .limit(20);

    if (body.alert_ids?.length) {
      query = supabase
        .from('fraud_alerts')
        .select('*')
        .in('id', body.alert_ids.slice(0, 20))
        .is('consensus_score', null);
    }

    const { data: alerts, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No alerts pending consensus review',
        reviewed: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Consensus review: ${alerts.length} alerts to validate with GPT-5`);

    // Process each alert through secondary model
    const results: Array<{
      alert_id: string;
      agreement: boolean;
      secondary_confidence: number;
      consensus_score: number;
      assessment: any;
    }> = [];

    for (const alert of alerts) {
      try {
        const result = await reviewAlertWithSecondaryModel(alert, LOVABLE_API_KEY);
        results.push(result);

        // Update the alert with consensus data
        const { error: updateError } = await supabase
          .from('fraud_alerts')
          .update({
            secondary_model: 'openai/gpt-5',
            secondary_model_assessment: result.assessment,
            secondary_confidence_score: result.secondary_confidence,
            model_agreement: result.agreement,
            consensus_score: result.consensus_score,
            consensus_reviewed_at: new Date().toISOString(),
          })
          .eq('id', alert.id);

        if (updateError) {
          console.error(`Failed to update alert ${alert.id}:`, updateError);
        }

        // If models DISAGREE on a critical alert, auto-escalate to investigating
        if (!result.agreement && alert.severity === 'critical') {
          await supabase
            .from('fraud_alerts')
            .update({
              status: 'investigating',
              resolution_notes: `[AUTO] Models disagree — escalated for human review. Gemini confidence: ${alert.ai_confidence_score}, GPT-5 confidence: ${result.secondary_confidence}`,
            })
            .eq('id', alert.id);

          console.log(`Alert ${alert.id} escalated: model disagreement on critical alert`);
        }

      } catch (reviewError) {
        console.error(`Consensus review failed for alert ${alert.id}:`, reviewError);
      }
    }

    const agreed = results.filter(r => r.agreement).length;
    const disagreed = results.filter(r => !r.agreement).length;

    console.log(`Consensus complete: ${agreed} agreed, ${disagreed} disagreed out of ${results.length}`);

    return new Response(JSON.stringify({
      success: true,
      reviewed: results.length,
      agreed,
      disagreed,
      escalated: results.filter(r => !r.agreement).length,
      results: results.map(r => ({
        alert_id: r.alert_id,
        agreement: r.agreement,
        consensus_score: r.consensus_score,
      })),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Consensus review error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? (error as Error).message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function reviewAlertWithSecondaryModel(
  alert: any,
  apiKey: string
): Promise<{
  alert_id: string;
  agreement: boolean;
  secondary_confidence: number;
  consensus_score: number;
  assessment: any;
}> {
  const systemPrompt = `You are an independent fraud validation AI for a Black business marketplace platform. 
Your role is to INDEPENDENTLY assess whether a fraud alert is legitimate or a false positive.

You are the SECOND OPINION — a different AI model already flagged this activity. 
You must evaluate the evidence objectively without anchoring to the original assessment.

Be skeptical but fair. Consider:
- Could this be normal user behavior misinterpreted?
- Is the evidence statistically significant or coincidental?
- What's the base rate of this type of activity on the platform?
- Are there innocent explanations that fit the data equally well?`;

  const userPrompt = `Review this fraud alert independently:

Alert Type: ${alert.alert_type}
Severity Assigned: ${alert.severity}
Description: ${alert.description}
Evidence: ${JSON.stringify(alert.evidence, null, 2)}
Original AI Confidence: ${alert.ai_confidence_score}

Provide your independent assessment.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'submit_consensus_review',
          description: 'Submit independent fraud alert review',
          parameters: {
            type: 'object',
            properties: {
              is_legitimate_threat: {
                type: 'boolean',
                description: 'Whether you independently agree this is a real fraud threat',
              },
              confidence_score: {
                type: 'number',
                description: 'Your independent confidence score (0.0-1.0)',
              },
              reasoning: {
                type: 'string',
                description: 'Detailed reasoning for your assessment',
              },
              suggested_severity: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'critical'],
                description: 'Your suggested severity level',
              },
              false_positive_indicators: {
                type: 'array',
                items: { type: 'string' },
                description: 'Any indicators this could be a false positive',
              },
              recommended_action: {
                type: 'string',
                enum: ['auto_action', 'human_review', 'dismiss', 'monitor'],
                description: 'Recommended next step',
              },
            },
            required: ['is_legitimate_threat', 'confidence_score', 'reasoning', 'suggested_severity', 'recommended_action'],
          },
        },
      }],
      tool_choice: { type: 'function', function: { name: 'submit_consensus_review' } },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const text = await response.text();
    console.error('Secondary model error:', status, text);

    if (status === 429) throw new Error('Rate limited — retry later');
    if (status === 402) throw new Error('AI credits exhausted');
    throw new Error(`Secondary model error: ${status}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

  if (!toolCall) {
    throw new Error('No assessment generated by secondary model');
  }

  const assessment = JSON.parse(toolCall.function.arguments);

  // Calculate consensus score: weighted average of both models
  const primaryWeight = 0.5;
  const secondaryWeight = 0.5;
  const primaryScore = alert.ai_confidence_score || 0;
  const secondaryScore = assessment.confidence_score || 0;

  // If they agree, boost consensus. If they disagree, lower it.
  const agreementBonus = assessment.is_legitimate_threat ? 0.1 : -0.1;
  const rawConsensus = (primaryScore * primaryWeight) + (secondaryScore * secondaryWeight) + agreementBonus;
  const consensusScore = Math.max(0, Math.min(1, rawConsensus));

  return {
    alert_id: alert.id,
    agreement: assessment.is_legitimate_threat,
    secondary_confidence: assessment.confidence_score,
    consensus_score: parseFloat(consensusScore.toFixed(3)),
    assessment,
  };
}
