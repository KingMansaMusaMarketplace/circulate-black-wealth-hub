import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AgentTask {
  type: 'lead_qualification' | 'churn_prediction' | 'deal_scoring' | 'ticket_resolution' | 'full_analysis';
  businessId: string;
  targetId?: string;
  context?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify auth
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, businessId, targetId, context } = await req.json() as AgentTask;

    // Verify user owns this business
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, business_name, owner_id")
      .eq("id", businessId)
      .single();

    if (bizError || !business || business.owner_id !== user.id) {
      return new Response(JSON.stringify({ error: "Business not found or unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result: Record<string, unknown> = {};

    switch (type) {
      case 'lead_qualification':
        result = await qualifyLeads(supabase, lovableApiKey, businessId, targetId);
        break;
      case 'churn_prediction':
        result = await predictChurn(supabase, lovableApiKey, businessId, targetId);
        break;
      case 'deal_scoring':
        result = await scoreDeals(supabase, lovableApiKey, businessId, targetId);
        break;
      case 'ticket_resolution':
        result = await resolveTickets(supabase, lovableApiKey, businessId, targetId);
        break;
      case 'full_analysis':
        result = await runFullAnalysis(supabase, lovableApiKey, businessId);
        break;
      default:
        throw new Error(`Unknown task type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Agent error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Lead Qualification Agent
async function qualifyLeads(supabase: any, apiKey: string, businessId: string, targetId?: string) {
  // Fetch customers/leads to score
  let query = supabase
    .from("customers")
    .select(`
      id, name, email, phone, status, tags, total_spent, visit_count, 
      last_visit_date, created_at, customer_interactions(interaction_type, created_at)
    `)
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(targetId ? 1 : 20);

  if (targetId) {
    query = query.eq("id", targetId);
  }

  const { data: customers, error } = await query;
  if (error) throw error;

  if (!customers?.length) {
    return { message: "No customers to qualify", scores: [] };
  }

  // Ask AI to score each customer
  const scores = [];
  for (const customer of customers) {
    const prompt = `You are a lead qualification AI agent. Analyze this customer and provide a lead score.

Customer Data:
- Name: ${customer.name || 'Unknown'}
- Email: ${customer.email || 'None'}
- Phone: ${customer.phone || 'None'}
- Status: ${customer.status || 'active'}
- Tags: ${JSON.stringify(customer.tags || [])}
- Total Spent: $${customer.total_spent || 0}
- Visit Count: ${customer.visit_count || 0}
- Last Visit: ${customer.last_visit_date || 'Never'}
- Created: ${customer.created_at}
- Recent Interactions: ${customer.customer_interactions?.length || 0}

Provide your analysis as JSON with these exact fields:
{
  "score": <0-100>,
  "engagement_score": <0-100>,
  "fit_score": <0-100>,
  "intent_score": <0-100>,
  "recommended_action": "<one of: nurture, qualify, prioritize, close, archive>",
  "reasoning": "<brief explanation>"
}`;

    const aiResponse = await callLovableAI(apiKey, prompt);
    const analysis = parseJsonResponse(aiResponse);

    if (analysis) {
      // Save to database
      const { data: scoreRecord, error: insertError } = await supabase
        .from("lead_scores")
        .upsert({
          business_id: businessId,
          customer_id: customer.id,
          score: analysis.score,
          engagement_score: analysis.engagement_score,
          fit_score: analysis.fit_score,
          intent_score: analysis.intent_score,
          recommended_action: analysis.recommended_action,
          ai_reasoning: analysis.reasoning,
          score_factors: {
            total_spent: customer.total_spent,
            visit_count: customer.visit_count,
            interaction_count: customer.customer_interactions?.length || 0
          },
          scored_at: new Date().toISOString()
        }, {
          onConflict: 'customer_id'
        })
        .select()
        .single();

      // Log the action
      await logAgentAction(supabase, businessId, {
        action_type: 'lead_qualification',
        target_type: 'customer',
        target_id: customer.id,
        ai_confidence: analysis.score / 100,
        ai_reasoning: analysis.reasoning,
        action_data: analysis,
        status: 'executed'
      });

      scores.push({
        customerId: customer.id,
        customerName: customer.name,
        ...analysis
      });
    }
  }

  return { scores, qualified: scores.length };
}

// Churn Prediction Agent
async function predictChurn(supabase: any, apiKey: string, businessId: string, targetId?: string) {
  // Fetch customers with activity data
  let query = supabase
    .from("customers")
    .select(`
      id, name, email, status, total_spent, visit_count, last_visit_date, created_at,
      customer_interactions(interaction_type, created_at)
    `)
    .eq("business_id", businessId)
    .eq("status", "active")
    .order("last_visit_date", { ascending: true, nullsFirst: true })
    .limit(targetId ? 1 : 30);

  if (targetId) {
    query = query.eq("id", targetId);
  }

  const { data: customers, error } = await query;
  if (error) throw error;

  if (!customers?.length) {
    return { message: "No customers to analyze", predictions: [] };
  }

  const predictions = [];
  const now = new Date();

  for (const customer of customers) {
    const lastVisit = customer.last_visit_date ? new Date(customer.last_visit_date) : null;
    const daysSinceLastActivity = lastVisit 
      ? Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const prompt = `You are a churn prediction AI agent. Analyze this customer's risk of churning.

Customer Data:
- Name: ${customer.name || 'Unknown'}
- Total Spent: $${customer.total_spent || 0}
- Visit Count: ${customer.visit_count || 0}
- Days Since Last Visit: ${daysSinceLastActivity}
- Account Age Days: ${Math.floor((now.getTime() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24))}
- Recent Interactions: ${customer.customer_interactions?.length || 0}

Provide your analysis as JSON with these exact fields:
{
  "churn_probability": <0.0-1.0>,
  "risk_level": "<one of: low, medium, high, critical>",
  "risk_factors": ["<factor1>", "<factor2>"],
  "recommended_actions": ["<action1>", "<action2>"],
  "reasoning": "<brief explanation>"
}`;

    const aiResponse = await callLovableAI(apiKey, prompt);
    const analysis = parseJsonResponse(aiResponse);

    if (analysis) {
      // Save prediction
      await supabase
        .from("churn_predictions")
        .insert({
          business_id: businessId,
          customer_id: customer.id,
          churn_probability: analysis.churn_probability,
          risk_level: analysis.risk_level,
          risk_factors: analysis.risk_factors,
          days_since_last_activity: daysSinceLastActivity,
          lifetime_value: customer.total_spent || 0,
          recommended_actions: analysis.recommended_actions,
          ai_reasoning: analysis.reasoning
        });

      // Log action
      await logAgentAction(supabase, businessId, {
        action_type: 'churn_prediction',
        target_type: 'customer',
        target_id: customer.id,
        ai_confidence: 1 - analysis.churn_probability,
        ai_reasoning: analysis.reasoning,
        action_data: analysis,
        status: 'executed'
      });

      // If high risk, trigger retention workflow
      if (analysis.risk_level === 'high' || analysis.risk_level === 'critical') {
        await triggerWorkflow(supabase, businessId, 'churn_prevention', customer.id, analysis);
      }

      predictions.push({
        customerId: customer.id,
        customerName: customer.name,
        ...analysis
      });
    }
  }

  const highRisk = predictions.filter(p => p.risk_level === 'high' || p.risk_level === 'critical');
  return { 
    predictions, 
    analyzed: predictions.length,
    highRiskCount: highRisk.length
  };
}

// Deal Scoring Agent
async function scoreDeals(supabase: any, apiKey: string, businessId: string, targetId?: string) {
  // Fetch B2B connections as "deals"
  let query = supabase
    .from("b2b_connections")
    .select(`
      id, status, match_score, estimated_value, actual_value, connection_type, created_at,
      buyer:buyer_business_id(id, business_name),
      supplier:supplier_business_id(id, business_name),
      b2b_messages(created_at)
    `)
    .or(`buyer_business_id.eq.${businessId},supplier_business_id.eq.${businessId}`)
    .in("status", ["pending", "connected", "negotiating"])
    .limit(targetId ? 1 : 20);

  if (targetId) {
    query = query.eq("id", targetId);
  }

  const { data: deals, error } = await query;
  if (error) throw error;

  if (!deals?.length) {
    return { message: "No active deals to score", scores: [] };
  }

  const scores = [];
  for (const deal of deals) {
    const otherParty = deal.buyer?.id === businessId ? deal.supplier : deal.buyer;
    const messageCount = deal.b2b_messages?.length || 0;
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(deal.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    const prompt = `You are a deal scoring AI agent. Predict the likelihood this B2B deal will close.

Deal Data:
- Partner: ${otherParty?.business_name || 'Unknown'}
- Status: ${deal.status}
- Match Score: ${deal.match_score || 'N/A'}
- Estimated Value: $${deal.estimated_value || 0}
- Messages Exchanged: ${messageCount}
- Days in Pipeline: ${daysSinceCreated}
- Connection Type: ${deal.connection_type || 'general'}

Provide your analysis as JSON with these exact fields:
{
  "close_probability": <0.0-1.0>,
  "expected_close_days": <number>,
  "competitor_risk": "<one of: none, low, medium, high>",
  "engagement_signals": ["<signal1>", "<signal2>"],
  "recommended_next_steps": ["<step1>", "<step2>"],
  "reasoning": "<brief explanation>"
}`;

    const aiResponse = await callLovableAI(apiKey, prompt);
    const analysis = parseJsonResponse(aiResponse);

    if (analysis) {
      const expectedCloseDate = new Date();
      expectedCloseDate.setDate(expectedCloseDate.getDate() + (analysis.expected_close_days || 30));

      // Save score
      await supabase
        .from("deal_scores")
        .upsert({
          business_id: businessId,
          connection_id: deal.id,
          deal_name: `Partnership with ${otherParty?.business_name}`,
          deal_value: deal.estimated_value || 0,
          close_probability: analysis.close_probability,
          expected_close_date: expectedCloseDate.toISOString().split('T')[0],
          competitor_risk: analysis.competitor_risk,
          engagement_signals: analysis.engagement_signals,
          recommended_next_steps: analysis.recommended_next_steps,
          ai_reasoning: analysis.reasoning,
          score_factors: { messageCount, daysSinceCreated, matchScore: deal.match_score }
        }, {
          onConflict: 'connection_id'
        });

      // Log action
      await logAgentAction(supabase, businessId, {
        action_type: 'deal_scoring',
        target_type: 'deal',
        target_id: deal.id,
        ai_confidence: analysis.close_probability,
        ai_reasoning: analysis.reasoning,
        action_data: analysis,
        status: 'executed'
      });

      scores.push({
        dealId: deal.id,
        partnerName: otherParty?.business_name,
        ...analysis
      });
    }
  }

  const highProbability = scores.filter(s => s.close_probability >= 0.7);
  return { 
    scores, 
    analyzed: scores.length,
    hotDeals: highProbability.length
  };
}

// Ticket Auto-Resolution Agent
async function resolveTickets(supabase: any, apiKey: string, businessId: string, targetId?: string) {
  // Fetch open tickets
  let query = supabase
    .from("support_tickets")
    .select("id, subject, description, priority, status, created_at, user_id")
    .eq("status", "open")
    .order("created_at", { ascending: true })
    .limit(targetId ? 1 : 10);

  if (targetId) {
    query = query.eq("id", targetId);
  }

  const { data: tickets, error } = await query;
  if (error) throw error;

  if (!tickets?.length) {
    return { message: "No open tickets to analyze", resolutions: [] };
  }

  // Fetch resolution templates
  const { data: templates } = await supabase
    .from("ticket_resolution_templates")
    .select("*")
    .or(`business_id.eq.${businessId},business_id.is.null`)
    .eq("is_active", true);

  const resolutions = [];
  for (const ticket of tickets) {
    const prompt = `You are a customer support AI agent. Analyze this support ticket and suggest a resolution.

Ticket:
- Subject: ${ticket.subject}
- Description: ${ticket.description}
- Priority: ${ticket.priority}
- Created: ${ticket.created_at}

${templates?.length ? `Available Resolution Templates:\n${templates.map((t: any) => `- ${t.category}: ${t.issue_pattern}`).join('\n')}` : ''}

Provide your analysis as JSON with these exact fields:
{
  "can_auto_resolve": <true/false>,
  "confidence": <0.0-1.0>,
  "category": "<issue category>",
  "suggested_response": "<response to send to customer>",
  "internal_notes": "<notes for support team>",
  "escalate_reason": "<if can't auto-resolve, why>",
  "reasoning": "<brief explanation>"
}`;

    const aiResponse = await callLovableAI(apiKey, prompt);
    const analysis = parseJsonResponse(aiResponse);

    if (analysis) {
      const action: any = {
        action_type: 'ticket_resolution',
        target_type: 'ticket',
        target_id: ticket.id,
        ai_confidence: analysis.confidence,
        ai_reasoning: analysis.reasoning,
        action_data: analysis,
        requires_approval: !analysis.can_auto_resolve || analysis.confidence < 0.8
      };

      if (analysis.can_auto_resolve && analysis.confidence >= 0.8) {
        // Auto-resolve: add response and close ticket
        await supabase.from("ticket_responses").insert({
          ticket_id: ticket.id,
          responder_id: null, // AI response
          response: analysis.suggested_response,
          is_internal: false
        });

        await supabase
          .from("support_tickets")
          .update({ status: "resolved", resolved_at: new Date().toISOString() })
          .eq("id", ticket.id);

        action.status = 'executed';
      } else {
        // Queue for human review
        action.status = 'pending';
      }

      await logAgentAction(supabase, businessId, action);

      resolutions.push({
        ticketId: ticket.id,
        subject: ticket.subject,
        ...analysis
      });
    }
  }

  const autoResolved = resolutions.filter(r => r.can_auto_resolve && r.confidence >= 0.8);
  return { 
    resolutions, 
    analyzed: resolutions.length,
    autoResolved: autoResolved.length,
    needsReview: resolutions.length - autoResolved.length
  };
}

// Full Analysis - Run all agents
async function runFullAnalysis(supabase: any, apiKey: string, businessId: string) {
  const [leads, churn, deals, tickets] = await Promise.all([
    qualifyLeads(supabase, apiKey, businessId),
    predictChurn(supabase, apiKey, businessId),
    scoreDeals(supabase, apiKey, businessId),
    resolveTickets(supabase, apiKey, businessId)
  ]);

  return {
    summary: {
      leadsQualified: leads.qualified || 0,
      churnRisksIdentified: churn.highRiskCount || 0,
      hotDeals: deals.hotDeals || 0,
      ticketsAutoResolved: tickets.autoResolved || 0
    },
    leads,
    churn,
    deals,
    tickets
  };
}

// Helper: Call Lovable AI
async function callLovableAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an autonomous AI agent that analyzes business data and makes decisions. Always respond with valid JSON only, no markdown or extra text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI API error: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// Helper: Parse JSON from AI response
function parseJsonResponse(text: string): any {
  try {
    // Try direct parse
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        console.error("Failed to parse JSON from code block:", jsonMatch[1]);
      }
    }
    // Try to find JSON object in text
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        console.error("Failed to parse JSON object:", objectMatch[0]);
      }
    }
    console.error("Could not parse AI response as JSON:", text);
    return null;
  }
}

// Helper: Log agent action
async function logAgentAction(supabase: any, businessId: string, action: any) {
  await supabase.from("ai_agent_actions").insert({
    business_id: businessId,
    ...action,
    executed_at: action.status === 'executed' ? new Date().toISOString() : null
  });
}

// Helper: Trigger workflow
async function triggerWorkflow(supabase: any, businessId: string, triggerType: string, customerId: string, data: any) {
  // Find matching active workflow
  const { data: workflows } = await supabase
    .from("workflows")
    .select("id, name")
    .eq("business_id", businessId)
    .eq("trigger_type", triggerType)
    .eq("is_active", true)
    .limit(1);

  if (workflows?.length) {
    await supabase.from("workflow_executions").insert({
      workflow_id: workflows[0].id,
      customer_id: customerId,
      trigger_data: data,
      status: 'pending'
    });
  }
}
