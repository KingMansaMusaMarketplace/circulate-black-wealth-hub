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

    const { video_id } = await req.json();
    if (!video_id || typeof video_id !== 'string') {
      return new Response(JSON.stringify({ error: 'video_id is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(video_id)}`;
    const hgRes = await fetch(url, {
      method: 'GET',
      headers: { 'X-Api-Key': apiKey },
    });

    const hgJson = await hgRes.json().catch(() => ({}));
    if (!hgRes.ok) {
      console.error('HeyGen status error:', hgRes.status, hgJson);
      return new Response(JSON.stringify({
        error: hgJson?.message || 'HeyGen status request failed',
        status: hgRes.status,
        details: hgJson,
      }), {
        status: hgRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const d = hgJson?.data ?? {};
    return new Response(JSON.stringify({
      status: d.status,
      video_url: d.video_url ?? null,
      thumbnail_url: d.thumbnail_url ?? null,
      duration: d.duration ?? null,
      error: d.error ?? null,
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('heygen-video-status error:', err);
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
