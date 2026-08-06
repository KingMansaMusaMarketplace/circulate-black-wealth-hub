// Image moderation using Lovable AI Gateway (Gemini vision).
// Returns { safe, reason, categories } so the frontend can block bad uploads.
// Requires an authenticated caller — this endpoint spends paid AI credits.

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// ~8 MB of base64 payload ceiling to stop oversized/abusive submissions.
const MAX_BASE64_CHARS = 8 * 1024 * 1024;

interface ModerationResult {
  safe: boolean;
  reason?: string;
  categories?: {
    sexual: boolean;
    nudity: boolean;
    violence: boolean;
    gore: boolean;
    weapons: boolean;
    hate: boolean;
    illegal: boolean;
    not_a_property: boolean;
  };
}

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Require a valid logged-in session before touching the paid AI gateway ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorized();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) return unauthorized();

    // --- Per-user rate limit: 20 moderation calls per 15 minutes ---
    const { data: rl, error: rlError } = await supabase.rpc('check_rate_limit_secure', {
      operation_name: 'moderate_image',
      max_attempts: 20,
      window_minutes: 15,
    });
    if (rlError) {
      console.error('rate limit check failed', rlError.message);
      return new Response(JSON.stringify({ error: 'Rate limit check failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (rl && (rl as { allowed?: boolean }).allowed === false) {
      return new Response(
        JSON.stringify({ error: 'Too many moderation requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }



    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { imageUrl, imageBase64, mimeType } = body as {
      imageUrl?: string;
      imageBase64?: string;
      mimeType?: string;
    };

    if (!imageUrl && !imageBase64) {
      return new Response(JSON.stringify({ error: 'imageUrl or imageBase64 required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (typeof imageBase64 === 'string' && imageBase64.length > MAX_BASE64_CHARS) {
      return new Response(JSON.stringify({ error: 'Image too large' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (typeof imageUrl === 'string' && !/^https:\/\//i.test(imageUrl)) {
      return new Response(JSON.stringify({ error: 'imageUrl must be an https URL' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }


    // Build the image part for the model
    const imagePart = imageBase64
      ? { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}` } }
      : { type: 'image_url', image_url: { url: imageUrl } };

    const systemPrompt = `You are a strict image safety classifier for a real-estate listing platform.
Users upload photos of apartments, houses, condos, office spaces, and warehouses.
Inspect the image and decide if it is APPROPRIATE for a public family-friendly real-estate listing.
Block any image containing: nudity, sexual content, suggestive poses, violence, gore, weapons,
hate symbols, drugs, or illegal activity. Also block images that are clearly NOT a property
(e.g. a selfie, a meme, a screenshot of unrelated content, a pet portrait with no room visible).
Respond ONLY with a single JSON object. No prose.`;

    const userPrompt = `Classify this image. Return JSON with this exact shape:
{
  "safe": boolean,
  "reason": "short human-readable explanation if unsafe, else empty string",
  "categories": {
    "sexual": boolean,
    "nudity": boolean,
    "violence": boolean,
    "gore": boolean,
    "weapons": boolean,
    "hate": boolean,
    "illegal": boolean,
    "not_a_property": boolean
  }
}`;

    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              imagePart,
            ],
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error('AI gateway error', aiResp.status, errText);
      // Fail-open with a flag so we don't block uploads when the gateway is down,
      // but tell the client so it can be queued for manual review.
      return new Response(
        JSON.stringify({
          safe: true,
          reason: 'moderation_unavailable',
          gateway_status: aiResp.status,
        } satisfies ModerationResult & { gateway_status: number }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const aiData = await aiResp.json();
    const raw = aiData?.choices?.[0]?.message?.content ?? '{}';
    let parsed: ModerationResult;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { safe: true, reason: 'parse_error' };
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('moderate-image error', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
