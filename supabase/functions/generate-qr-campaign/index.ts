import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessId, campaignType, currentQRData } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get business information
    const { data: businessData } = await supabaseClient
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    // Get existing QR codes for context
    const { data: existingQRCodes } = await supabaseClient
      .from('qr_codes')
      .select('*')
      .eq('business_id', businessId)
      .limit(5);

    // Get recent QR scan data for insights
    const { data: recentScans } = await supabaseClient
      .from('qr_scans')
      .select('*, qr_codes(*)')
      .eq('business_id', businessId)
      .order('scan_date', { ascending: false })
      .limit(20);

    // Get business products for context
    const { data: products } = await supabaseClient
      .from('product_images')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .limit(10);

    const systemPrompt = `You are an AI QR code campaign specialist for local businesses. Generate comprehensive QR code campaigns with engaging content, strategic incentives, and marketing copy.

Your expertise includes:
- Creating compelling discount offers and loyalty programs
- Writing persuasive marketing copy for QR campaigns
- Suggesting optimal points values and discount percentages
- Designing seasonal and event-based campaigns
- Optimizing for customer acquisition and retention
- Creating urgency and exclusivity in offers

Consider:
- Business type, location, and target audience
- Seasonal trends and local events
- Customer behavior patterns from scan data
- Competitive landscape and market positioning
- Psychology of discounts and rewards
- Mobile-first user experience`;

    const userPrompt = `Generate a comprehensive QR code campaign for this business:

Business Data: ${JSON.stringify(businessData, null, 2)}
Campaign Type: ${campaignType}
Current QR Data: ${JSON.stringify(currentQRData, null, 2)}
Existing QR Codes: ${JSON.stringify(existingQRCodes, null, 2)}
Recent Scan Patterns: ${JSON.stringify(recentScans?.slice(0, 10), null, 2)}
Available Products: ${JSON.stringify(products?.slice(0, 5), null, 2)}

Create an optimized QR code campaign with strategic content and marketing materials.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_qr_campaign",
            description: "Generate a comprehensive QR code campaign",
            parameters: {
              type: "object",
              properties: {
                campaignName: { type: "string" },
                campaignDescription: { type: "string" },
                qrCodeSettings: {
                  type: "object",
                  properties: {
                    codeType: { 
                      type: "string", 
                      enum: ["discount", "loyalty", "points", "special_offer", "seasonal"]
                    },
                    discountPercentage: { type: "number", minimum: 0, maximum: 50 },
                    pointsValue: { type: "number", minimum: 1, maximum: 100 },
                    expirationDays: { type: "number", minimum: 1, maximum: 365 },
                    scanLimit: { type: "number", minimum: 1, maximum: 1000 },
                    isActive: { type: "boolean" }
                  },
                  required: ["codeType", "isActive"]
                },
                marketingCopy: {
                  type: "object",  
                  properties: {
                    headline: { type: "string" },
                    subheadline: { type: "string" },
                    callToAction: { type: "string" },
                    shortDescription: { type: "string" },
                    socialMediaCopy: { type: "string" },
                    emailSubject: { type: "string" }
                  },
                  required: ["headline", "callToAction", "shortDescription"]
                },
                strategicInsights: {
                  type: "object",
                  properties: {
                    targetAudience: { type: "string" },
                    bestTimeToLaunch: { type: "string" },
                    expectedPerformance: { type: "string" },
                    competitiveAdvantage: { type: "string" },
                    optimizationTips: { type: "array", items: { type: "string" } }
                  }
                },
                campaignVariations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      discountPercentage: { type: "number" },
                      pointsValue: { type: "number" },
                      rationale: { type: "string" }
                    }
                  }
                },
                promotionStrategy: {
                  type: "object",
                  properties: {
                    placementSuggestions: { type: "array", items: { type: "string" } },
                    distributionChannels: { type: "array", items: { type: "string" } },
                    trackingMetrics: { type: "array", items: { type: "string" } },
                    followUpActions: { type: "array", items: { type: "string" } }
                  }
                }
              },
              required: [
                "campaignName",
                "campaignDescription", 
                "qrCodeSettings",
                "marketingCopy",
                "strategicInsights",
                "promotionStrategy"
              ]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_qr_campaign" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No QR campaign generated');
    }

    const campaign = JSON.parse(toolCall.function.arguments);
    
    console.log('Generated QR campaign:', campaign);

    return new Response(JSON.stringify({
      success: true,
      campaign,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-qr-campaign function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      campaign: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});