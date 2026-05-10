import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
};

type Preset = 'banner' | 'social' | 'flyer' | 'logo';

const PRESET_GUIDANCE: Record<Preset, string> = {
  banner: 'Wide horizontal marketing banner, 1200x400 aspect, bold focal point on the right third, leave clear left-side space for a headline. Premium editorial feel.',
  social: 'Square 1:1 social media post, eye-catching, scroll-stopping, high contrast, ready for Instagram or Facebook feed.',
  flyer: 'Vertical promotional flyer, 1080x1350 aspect, layered composition with hero subject and clean breathing room for promo copy.',
  logo: 'Clean centered logo-style mark on a solid white background, simple, scalable, modern.',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, preset = 'social', brandHint } = await req.json();
    if (!prompt || typeof prompt !== 'string' || prompt.length < 4) {
      return new Response(JSON.stringify({ error: 'Prompt is required (min 4 chars)' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const guidance = PRESET_GUIDANCE[preset as Preset] ?? PRESET_GUIDANCE.social;
    const fullPrompt = `${prompt}. ${guidance}${brandHint ? ` Brand vibe: ${brandHint}.` : ''} Photo-real where appropriate, no text, no watermarks.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [{ role: 'user', content: fullPrompt }],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image gen error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit reached. Try again shortly.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Add credits in Workspace settings.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error(`Image gen failed: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) throw new Error('No image returned');

    return new Response(JSON.stringify({ success: true, imageUrl, preset }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('generate-marketing-image error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
