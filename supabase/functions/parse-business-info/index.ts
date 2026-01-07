import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Parsing business info from text:', text.substring(0, 200));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are a data extraction assistant. Extract business contact information from the provided text. 
            
Always respond with a JSON object containing these fields (use null for missing values):
- business_name: The name of the business
- owner_name: The owner's name or contact person name
- owner_email: Email address
- phone_number: Phone number (format as provided)
- website_url: Website URL (include https:// if not present)
- city: City name
- state: State abbreviation or full name
- category: Business category (e.g., Restaurant, Salon, Retail, Professional Services)
- business_description: Brief description of what the business does

Only return the JSON object, no other text.`
          },
          {
            role: 'user',
            content: `Extract business information from this text:\n\n${text}`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_business_info',
              description: 'Extract and return structured business contact information',
              parameters: {
                type: 'object',
                properties: {
                  business_name: { type: 'string', description: 'Name of the business' },
                  owner_name: { type: 'string', description: 'Owner or contact person name' },
                  owner_email: { type: 'string', description: 'Email address' },
                  phone_number: { type: 'string', description: 'Phone number' },
                  website_url: { type: 'string', description: 'Website URL' },
                  city: { type: 'string', description: 'City' },
                  state: { type: 'string', description: 'State' },
                  category: { type: 'string', description: 'Business category' },
                  business_description: { type: 'string', description: 'Brief description' }
                },
                required: ['business_name']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_business_info' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to parse business info' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));

    // Extract the tool call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsedInfo = JSON.parse(toolCall.function.arguments);
      console.log('Extracted business info:', parsedInfo);
      
      return new Response(
        JSON.stringify({ success: true, data: parsedInfo }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: try to parse content directly
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const parsedInfo = JSON.parse(content);
        return new Response(
          JSON.stringify({ success: true, data: parsedInfo }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch {
        console.error('Failed to parse AI response as JSON');
      }
    }

    return new Response(
      JSON.stringify({ error: 'Could not extract business information' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-business-info:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
