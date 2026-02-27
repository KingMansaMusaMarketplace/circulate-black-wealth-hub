import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const RequestSchema = z.object({
  documentUrl: z.string().url().max(2000),
  documentType: z.enum(['registration', 'ownership', 'address', 'identity', 'license']),
  businessName: z.string().max(200).optional(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rawBody = await req.json();
    const parseResult = RequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: parseResult.error.issues.map(i => i.message).join(', ') }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { documentUrl, documentType, businessName } = parseResult.data;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const docTypeLabels: Record<string, string> = {
      registration: 'Business Registration / Certificate of Formation',
      ownership: 'Ownership Verification / Operating Agreement',
      address: 'Address Verification / Utility Bill',
      identity: 'Government-Issued Photo ID',
      license: 'Business License / Professional License',
    };

    const systemPrompt = `You are a document verification assistant for a business directory platform. 
Analyze uploaded business verification documents and extract key information.
IMPORTANT: Only extract factual data visible in the document. Do not fabricate information.
Flag any concerns about document authenticity or readability.`;

    const userPrompt = `Analyze this ${docTypeLabels[documentType]} document${businessName ? ` for business: ${businessName}` : ''}.

Extract all relevant information and assess the document's validity for business verification purposes.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: documentUrl } },
            ],
          },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'extract_document_data',
            description: 'Extract structured data from a business verification document',
            parameters: {
              type: 'object',
              properties: {
                documentValid: { type: 'boolean', description: 'Whether the document appears to be a valid, readable document of the expected type' },
                documentTypeMatch: { type: 'boolean', description: 'Whether the document matches the expected type (e.g., business registration, ID, etc.)' },
                confidenceScore: { type: 'number', minimum: 0, maximum: 100, description: 'Confidence in the extracted data accuracy (0-100)' },
                businessName: { type: 'string', description: 'Business name found in the document, if any' },
                registrationNumber: { type: 'string', description: 'Registration/license number, if found' },
                issuingAuthority: { type: 'string', description: 'Organization or authority that issued the document' },
                issueDate: { type: 'string', description: 'Date the document was issued' },
                expirationDate: { type: 'string', description: 'Expiration date, if applicable' },
                ownerName: { type: 'string', description: 'Owner/principal name found in the document' },
                address: { type: 'string', description: 'Address found in the document' },
                state: { type: 'string', description: 'State or jurisdiction' },
                documentStatus: { type: 'string', enum: ['active', 'expired', 'unclear'], description: 'Whether the document appears current or expired' },
                concerns: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Any concerns about document authenticity, readability, or validity',
                },
                extractedFields: {
                  type: 'object',
                  additionalProperties: { type: 'string' },
                  description: 'Any additional fields extracted from the document',
                },
                summary: { type: 'string', description: 'Brief summary of what the document contains and its verification value' },
              },
              required: ['documentValid', 'documentTypeMatch', 'confidenceScore', 'concerns', 'summary'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'extract_document_data' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service quota exceeded.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errText = await response.text();
      console.error('AI API error:', response.status, errText);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error('No document analysis generated');
    }

    const extraction = JSON.parse(toolCall.function.arguments);
    console.log('Document extraction result:', extraction);

    return new Response(JSON.stringify({
      success: true,
      extraction,
      documentType,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-verification-document:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
