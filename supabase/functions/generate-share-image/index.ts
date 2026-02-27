import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const RequestSchema = z.object({
  businessName: z.string().min(1).max(200),
  businessDescription: z.string().max(500).optional().default(''),
  category: z.string().max(100).optional().default(''),
  style: z.enum(['professional', 'vibrant', 'minimal', 'bold']).optional().default('professional'),
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

    const { businessName, businessDescription, category, style } = parseResult.data;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const stylePrompts: Record<string, string> = {
      professional: 'Clean corporate design with dark navy and gold accents, modern sans-serif typography, subtle geometric patterns',
      vibrant: 'Bold colorful gradients, energetic composition, dynamic shapes, warm African-inspired color palette with golds, greens, and reds',
      minimal: 'Minimalist design with ample white space, elegant thin typography, single accent color, refined and sophisticated',
      bold: 'High contrast black and gold, strong typography, geometric elements, luxury feel with metallic textures',
    };

    const prompt = `Create a 16:9 aspect ratio social media share card / marketing banner for a business called "${businessName}".
${businessDescription ? `Business description: ${businessDescription}.` : ''}
${category ? `Business category: ${category}.` : ''}

Design style: ${stylePrompts[style]}

Requirements:
- Display the business name "${businessName}" prominently and legibly
- Include "Verified on 1325.AI" text badge in a corner
- Professional marketing quality suitable for sharing on social media
- The image should look like a branded social card, not a photograph
- Ultra high resolution, sharp text rendering
- No placeholder text or lorem ipsum`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text'],
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
      console.error('AI image generation error:', response.status, errText);
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    // Upload the base64 image to Supabase storage
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const fileName = `share-cards/${user.id}/${Date.now()}-share-card.png`;

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('marketing-assets')
      .upload(fileName, binaryData, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      // Fall back to returning the base64 image directly
      return new Response(JSON.stringify({
        success: true,
        imageUrl,
        storedUrl: null,
        message: 'Image generated but storage upload failed. Using inline image.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: publicUrlData } = adminClient.storage
      .from('marketing-assets')
      .getPublicUrl(fileName);

    return new Response(JSON.stringify({
      success: true,
      imageUrl,
      storedUrl: publicUrlData?.publicUrl || null,
      fileName,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-share-image:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
