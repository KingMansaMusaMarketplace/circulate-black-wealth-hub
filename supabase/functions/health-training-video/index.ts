import { createClient } from 'npm:@supabase/supabase-js@2';
import { TRAINING_BUCKET, TRAINING_PATH, videoPermission } from './rules.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-csrf-token, x-hc-preview-token, x-hc-preview-device', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return reply({ error: 'Use POST.' }, 405);
  try {
    const body = await req.json();
    if (body?.action !== 'watch' && body?.action !== 'upload') return reply({ error: 'Invalid action.' }, 400);
    const db = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', { auth: { persistSession: false } });
    let admin = false;
    const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
    if (jwt) {
      const { data, error } = await db.auth.getUser(jwt);
      if (!error && data.user) {
        const role = await db.rpc('has_role', { _user_id: data.user.id, _role: 'admin' });
        admin = !role.error && role.data === true;
      }
    }
    let grant = null;
    if (!admin && body.action === 'watch' && typeof body.token === 'string' && /^[a-f0-9]{48}$/.test(body.token) && typeof body.device === 'string' && /^[a-f0-9]{32}$/.test(body.device)) {
      // Media requests never start a visit or accept confidentiality on the visitor's behalf.
      const row = await db.from('hc_access_requests').select('first_entered_at,nda_accepted_at,viewing_expires_at').eq('access_token', body.token).eq('device_id', body.device).eq('status', 'approved').is('revoked_at', null).maybeSingle();
      if (!row.error && row.data?.first_entered_at && row.data.nda_accepted_at) {
        const checked = await db.rpc('hc_verify_preview_access', { p_token: body.token, p_device: body.device, p_end: false });
        if (!checked.error && checked.data?.ok === true) grant = { ok: true, viewing_expires_at: row.data.viewing_expires_at };
      }
    }
    const permission = videoPermission(body.action, admin, grant);
    if (!permission.allowed) return reply({ error: 'Your approved private viewing is required.' }, 403);
    const storage = db.storage.from(TRAINING_BUCKET);
    if (body.action === 'upload') {
      const result = await storage.createSignedUploadUrl(TRAINING_PATH, { upsert: true });
      if (result.error || !result.data) return reply({ error: 'Could not prepare the private upload.' }, 503);
      return reply({ token: result.data.token, path: TRAINING_PATH });
    }
    const listing = await storage.list('pilot', { search: 'clinical-captioned.mp4', limit: 10 });
    if (listing.error) return reply({ error: 'Could not check the private video.' }, 503);
    if (!listing.data.some(file => file.name === 'clinical-captioned.mp4')) return reply({ available: false, admin });
    const signed = await storage.createSignedUrl(TRAINING_PATH, permission.ttl);
    if (signed.error || !signed.data) return reply({ error: 'Could not open the private video.' }, 503);
    return reply({ available: true, admin, url: signed.data.signedUrl });
  } catch { return reply({ error: 'Could not prepare the private video. Please retry.' }, 503); }
});