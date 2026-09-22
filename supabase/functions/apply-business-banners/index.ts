import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdmin, authErrorResponse } from "../_shared/auth-guard.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token, x-job-token',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const jobToken = req.headers.get('x-job-token');
  let authorized = false;
  if (jobToken) {
    const { data } = await supabase
      .from('internal_job_tokens')
      .select('token')
      .eq('name', 'image_audit')
      .maybeSingle();
    authorized = !!data?.token && data.token === jobToken;
  }
  if (!authorized) {
    const authResult = await requireAdmin(req, corsHeaders);
    if (!authResult.authenticated) return authErrorResponse(authResult, corsHeaders);
  }

  let updates: Array<{ id: string; banner_url: string }> = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.updates)) updates = body.updates;
  } catch (_e) { /* ignore */ }

  if (!updates.length) {
    return new Response(JSON.stringify({ error: 'no updates' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (updates.length > 500) {
    return new Response(JSON.stringify({ error: 'max 500 per call' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let applied = 0;
  const failures: string[] = [];
  for (const u of updates) {
    if (!u?.id || typeof u.banner_url !== 'string' || !u.banner_url.startsWith('http')) continue;
    const { error } = await supabase
      .from('businesses')
      .update({ banner_url: u.banner_url })
      .eq('id', u.id)
      .like('banner_url', '%images.unsplash.com%');
    if (error) failures.push(`${u.id}: ${error.message}`);
    else applied += 1;
  }

  return new Response(JSON.stringify({ applied, failures: failures.slice(0, 5), failureCount: failures.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
