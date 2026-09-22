import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdmin, authErrorResponse } from "../_shared/auth-guard.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token, x-job-token',
};

const MIN_BYTES = 600;

const SKIP_HOSTS = ['placehold.co', 'placehold.it', 'via.placeholder.com', 'ui-avatars.com', 'dummyimage.com'];

async function checkImage(url: string): Promise<{ ok: boolean; reason: string }> {
  try {
    if (SKIP_HOSTS.some((h) => url.includes(h))) return { ok: true, reason: 'generated_placeholder' };
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    const res = await fetch(url, { signal: ctl.signal, redirect: 'follow' });
    clearTimeout(t);
    if (!res.ok) { try { await res.body?.cancel(); } catch { /* ignore */ } return { ok: false, reason: `http_${res.status}` }; }
    const type = (res.headers.get('content-type') ?? '').toLowerCase();
    const buf = new Uint8Array(await res.arrayBuffer());
    if (!type.startsWith('image/')) return { ok: false, reason: 'not_an_image' };
    if (buf.byteLength < MIN_BYTES) return { ok: false, reason: 'too_small' };
    return { ok: true, reason: 'ok' };
  } catch (_e) {
    return { ok: false, reason: 'unreachable' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Auth: internal job token OR admin JWT
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

  let batchSize = 40;
  let dryRun = false;
  try {
    const body = await req.json();
    if (body?.batchSize) batchSize = Math.min(Math.max(Number(body.batchSize) || 40, 1), 100);
    if (body?.dryRun) dryRun = true;
  } catch { /* no body is fine */ }

  const { data: rows, error } = await supabase
    .from('businesses')
    .select('id, logo_url, banner_url')
    .is('image_audit_at', null)
    .not('logo_url', 'is', null)
    .limit(batchSize);

  if (error) {
    return new Response(JSON.stringify({ success: false, error: 'fetch_failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!rows?.length) {
    return new Response(JSON.stringify({ success: true, processed: 0, cleared: 0, done: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let cleared = 0;
  const reasons: Record<string, number> = {};

  await Promise.all(rows.map(async (row: { id: string; logo_url: string | null; banner_url: string | null }) => {
    const result = await checkImage(row.logo_url as string);
    reasons[result.reason] = (reasons[result.reason] ?? 0) + 1;
    if (dryRun) return;

    const patch: Record<string, unknown> = {
      image_audit_at: new Date().toISOString(),
      image_audit_result: result.reason,
    };
    if (!result.ok) {
      patch.logo_url = null;
      if (row.banner_url === row.logo_url) patch.banner_url = null;
      cleared += 1;
    }
    await supabase.from('businesses').update(patch).eq('id', row.id);
  }));

  return new Response(JSON.stringify({ success: true, processed: rows.length, cleared, reasons }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
