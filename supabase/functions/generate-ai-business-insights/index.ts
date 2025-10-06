import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors

Headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessId } = await req.json();

    if (!businessId) {
      throw new Error('Business ID is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch business data
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    // Fetch bookings data (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('business_id', businessId)
      .gte('booking_date', ninetyDaysAgo.toISOString());

    // Fetch transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('business_id', businessId)
      .gte('transaction_date', ninetyDaysAgo.toISOString());

    // Fetch QR scans
    const { data: qrScans } = await supabase
      .from('qr_scans')
      .select('*')
      .eq('business_id', businessId)
      .gte('scan_date', ninetyDaysAgo.toISOString());

    // Fetch reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId);

    // Calculate metrics
    const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
    const avgBookingValue = bookings?.length ? totalRevenue / bookings.length : 0;
    const avgRating = business?.average_rating || 0;
    const totalScans = qrScans?.length || 0;
    const conversionRate = totalScans > 0 ? (bookings?.length || 0) / totalScans : 0;

    // Prepare data for AI
    const analyticsData = {
      businessName: business?.business_name,
      category: business?.category,
      metrics: {
        totalRevenue: totalRevenue.toFixed(2),
        totalBookings: bookings?.length || 0,
        avgBookingValue: avgBookingValue.toFixed(2),
        avgRating: avgRating.toFixed(1),
        reviewCount: reviews?.length || 0,
        qrScans: totalScans,
        conversionRate: (conversionRate * 100).toFixed(1) + '%'
      },
      recentTrends: {
        bookingsByStatus: bookings?.reduce((acc: any, b: any) => {
          acc[b.status] = (acc[b.status] || 0) + 1;
          return acc;
        }, {}),
        revenueByMonth: bookings?.reduce((acc: any, b: any) => {
          const month = new Date(b.booking_date).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + Number(b.amount);
          return acc;
        }, {})
      }
    };

    // Call Lovable AI for insights
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert business coach for Black-owned businesses. Analyze the provided business data and provide 3-5 actionable insights to help them grow. Focus on revenue optimization, customer engagement, and operational efficiency. Be specific and practical.`
          },
          {
            role: 'user',
            content: `Analyze this business data and provide actionable growth insights:\n\n${JSON.stringify(analyticsData, null, 2)}`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_business_insights",
            description: "Provide structured business insights and recommendations",
            parameters: {
              type: "object",
              properties: {
                insights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["revenue", "customer_engagement", "operations", "marketing", "growth"] },
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] },
                      recommendations: {
                        type: "array",
                        items: { type: "string" }
                      },
                      expectedImpact: { type: "string" }
                    },
                    required: ["type", "title", "description", "priority", "recommendations"]
                  }
                }
              },
              required: ["insights"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "provide_business_insights" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    const insights = toolCall ? JSON.parse(toolCall.function.arguments).insights : [];

    // Store insights in database
    for (const insight of insights) {
      await supabase.from('business_insights').insert({
        business_id: businessId,
        insight_type: insight.type,
        title: insight.title,
        description: insight.description,
        priority: insight.priority,
        recommendations: insight.recommendations,
        metrics: analyticsData.metrics
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        insights,
        metrics: analyticsData.metrics 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating insights:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});