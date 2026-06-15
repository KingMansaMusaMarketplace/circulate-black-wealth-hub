import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_secure');
    if (adminError || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('HEYGEN_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'HEYGEN_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const script = String(body.script ?? '').slice(0, 1500).trim();
    const avatar_id = String(body.avatar_id ?? '').trim();
    const voice_id = String(body.voice_id ?? '').trim();
    const title = String(body.title ?? '1325.AI Video').slice(0, 200).trim();

    if (!script || !avatar_id || !voice_id) {
      return new Response(JSON.stringify({ error: 'script, avatar_id, and voice_id are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = {
      title,
      video_inputs: [
        {
          character: { type: 'avatar', avatar_id, avatar_style: 'normal' },
          voice: { type: 'text', input_text: script, voice_id },
        },
      ],
      dimension: { width: 1280, height: 720 },
    };

    const hgRes = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const hgJson = await hgRes.json().catch(() => ({}));

    if (!hgRes.ok) {
      console.error('HeyGen generate error:', hgRes.status, hgJson);
      return new Response(JSON.stringify({
        error: hgJson?.message || hgJson?.error?.message || 'HeyGen request failed',
        status: hgRes.status,
        details: hgJson,
      }), {
        status: hgRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const video_id = hgJson?.data?.video_id || hgJson?.video_id;
    return new Response(JSON.stringify({ video_id, raw: hgJson }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('heygen-generate-video error:', err);
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
