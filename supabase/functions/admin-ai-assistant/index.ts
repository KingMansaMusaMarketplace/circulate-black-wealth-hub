import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sanitize user input for AI prompts to prevent injection attacks
function sanitizeForPrompt(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, 10000) // Limit length
    .replace(/\{\{|\}\}/g, '') // Remove template markers
    .trim();
}

// Sanitize data object for AI prompts - removes potential injection content
function sanitizeDataForPrompt(data: any, maxDepth = 3, currentDepth = 0): any {
  if (currentDepth >= maxDepth) return '[truncated]';
  
  if (data === null || data === undefined) return null;
  
  if (typeof data === 'string') {
    return sanitizeForPrompt(data);
  }
  
  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.slice(0, 100).map(item => sanitizeDataForPrompt(item, maxDepth, currentDepth + 1));
  }
  
  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    const keys = Object.keys(data).slice(0, 50); // Limit number of keys
    for (const key of keys) {
      const sanitizedKey = sanitizeForPrompt(key).substring(0, 100);
      sanitized[sanitizedKey] = sanitizeDataForPrompt(data[key], maxDepth, currentDepth + 1);
    }
    return sanitized;
  }
  
  return String(data).substring(0, 1000);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_secure');
    if (adminError || !isAdmin) {
      console.error('Admin check failed:', adminError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await req.json();
    
    // Validate and sanitize inputs
    const type = typeof requestBody.type === 'string' ? requestBody.type.substring(0, 50) : '';
    const prompt = sanitizeForPrompt(requestBody.prompt || '');
    const data = sanitizeDataForPrompt(requestBody.data);

    if (!type) {
      return new Response(
        JSON.stringify({ error: 'Invalid request type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = prompt;

    switch (type) {
      case "analytics_chat":
        systemPrompt = `You are an AI analytics assistant for the Mansa Musa Marketplace admin dashboard. 
You help administrators understand their platform data, identify trends, and make data-driven decisions.
You have access to the following data context:
${JSON.stringify(data, null, 2)}

Provide clear, actionable insights. Use numbers and percentages when relevant. Be concise but thorough.`;
        break;

      case "generate_insights":
        systemPrompt = `You are an AI insights generator for the Mansa Musa Marketplace.
Analyze the provided data and generate a brief executive summary with:
1. Key highlights (2-3 bullet points)
2. Concerns or anomalies (if any)
3. Recommended actions (1-2 items)
Keep it concise and actionable.`;
        userPrompt = `Generate insights from this data:\n${JSON.stringify(data, null, 2)}`;
        break;

      case "content_moderation":
        systemPrompt = `You are a content moderation AI for Mansa Musa Marketplace.
Review the provided content and determine:
1. approval_recommendation: "approve", "reject", or "needs_review"
2. confidence_score: 0-100
3. flags: array of any concerning issues found
4. reasoning: brief explanation

Be fair but vigilant about spam, inappropriate content, fake reviews, and policy violations.
Respond ONLY with valid JSON matching this structure.`;
        userPrompt = `Review this content:\n${JSON.stringify(data, null, 2)}`;
        break;

      case "draft_announcement":
        systemPrompt = `You are a professional communications writer for Mansa Musa Marketplace.
Create engaging, clear announcements for the platform. Match the tone to the announcement type.
- info: friendly and informative
- warning: clear but not alarming
- alert: urgent but professional
- success: celebratory and positive`;
        userPrompt = `Draft an announcement with these details:\nType: ${sanitizeForPrompt(data?.type || '')}\nTopic: ${sanitizeForPrompt(data?.topic || '')}\nTarget: ${sanitizeForPrompt(data?.audience || '')}\nKey points: ${sanitizeForPrompt(data?.keyPoints || '')}`;
        break;

      case "fraud_analysis":
        systemPrompt = `You are a fraud detection AI for Mansa Musa Marketplace.
Analyze the provided activity data and assess fraud risk.
Respond with JSON:
{
  "risk_score": 0-100,
  "risk_level": "low" | "medium" | "high" | "critical",
  "indicators": ["list of suspicious patterns"],
  "recommendation": "action to take",
  "confidence": 0-100
}`;
        userPrompt = `Analyze this activity for fraud:\n${JSON.stringify(data, null, 2)}`;
        break;

      case "sentiment_analysis":
        systemPrompt = `You are a sentiment analysis AI for Mansa Musa Marketplace.
Analyze the provided reviews/feedback and provide:
{
  "overall_sentiment": "positive" | "neutral" | "negative",
  "sentiment_score": -1 to 1,
  "key_themes": ["array of recurring themes"],
  "positive_highlights": ["what customers love"],
  "areas_for_improvement": ["constructive feedback"],
  "summary": "brief 2-sentence summary"
}`;
        userPrompt = `Analyze sentiment from:\n${JSON.stringify(data, null, 2)}`;
        break;

      case "predictive_analytics":
        systemPrompt = `You are a predictive analytics AI for Mansa Musa Marketplace.
Based on the provided user/business data, predict:
{
  "churn_risk": "low" | "medium" | "high",
  "churn_probability": 0-100,
  "engagement_trend": "increasing" | "stable" | "declining",
  "success_likelihood": 0-100,
  "key_factors": ["factors influencing prediction"],
  "retention_suggestions": ["actionable recommendations"]
}`;
        userPrompt = `Predict outcomes for:\n${JSON.stringify(data, null, 2)}`;
        break;

      case "dashboard_help":
        systemPrompt = sanitizeForPrompt(data?.context) || `You are a helpful assistant for the Mansa Musa Marketplace Admin Dashboard.
Help administrators understand dashboard features, navigation, and functionality.
Be concise and helpful. If you're unsure about something, say so.`;
        break;

      default:
        systemPrompt = "You are a helpful AI assistant for the Mansa Musa Marketplace admin dashboard.";
    }

    console.log(`Processing ${type} request`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    console.log(`${type} response generated successfully`);

    return new Response(JSON.stringify({ content, result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in admin-ai-assistant:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing your request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
