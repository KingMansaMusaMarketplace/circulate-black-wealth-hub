// Speaks an Ask Kayla answer in Kayla's own video voice (HeyGen).
// Only answers Kayla wrote for this viewer (signed receipt) can be spoken: nobody can send
// their own text. Only signed-in members of the clinic with a current approved viewing.
// Nothing is stored and the words are never logged; the browser falls back to the device voice on any failure.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders as sdkCorsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { authorizeClinicalPreview } from '../_shared/clinical-preview-auth.ts';
import { helpReceiptKey, verifyReply } from '../_shared/clinical-help-history.ts';
import { HEYGEN_SPEECH_URL, KAYLA_VOICE_ID, MAX_PARTS, makeRateLimiter, parseVoiceRequest, safeAudioUrl, speechFor, speechParts, speechPayload } from './rules.ts';

const corsHeaders = { ...sdkCorsHeaders, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-hc-preview-token, x-hc-preview-device' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const allow = makeRateLimiter();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  if (!req.headers.get('x-csrf-token')) return json({ error: 'Required request header missing' }, 403);
  try {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return json({ error: 'Please sign in again.' }, 401);
    const url = Deno.env.get('SUPABASE_URL'), anon = Deno.env.get('SUPABASE_ANON_KEY'), serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const apiKey = Deno.env.get('HEYGEN_API_KEY');
    if (!url || !anon || !serviceKey || !apiKey) return json({ error: "Kayla's voice is not set up." }, 503);
    const raw = await req.text();
    if (raw.length > 40000) return json({ error: 'That answer is too long to read aloud.' }, 413);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return json({ error: 'Invalid request.' }, 400); }
    const request = parseVoiceRequest(body);
    if (!request) return json({ error: 'Only Kayla answers can be read aloud.' }, 400);

    const caller = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
    const { data: userData, error: authError } = await caller.auth.getUser();
    if (authError || !userData.user) return json({ error: 'Please sign in again.' }, 401);
    const service = createClient(url, serviceKey, { auth: { persistSession: false } });
    if (!await authorizeClinicalPreview(service, req, userData.user)) return json({ error: 'Your approved viewing is not active on this device.' }, 403);
    const { data: member } = await caller.from('hc_members').select('role').eq('clinic_id', request.clinicId).eq('user_id', userData.user.id).maybeSingle();
    if (!member) return json({ error: "Kayla's voice is only for members of this clinic." }, 403);

    const key = helpReceiptKey(serviceKey, userData.user.id, req.headers.get('x-hc-preview-token'), req.headers.get('x-hc-preview-device'));
    if (!await verifyReply(key, request.selection, request.receipt)) return json({ error: 'Only Kayla answers can be read aloud.' }, 403);
    const words = speechFor((request.receipt as { text: string }).text);
    if (!words) return json({ error: 'That answer is too long for Kayla’s voice.' }, 413);
    const parts = speechParts(words);
    if (request.part >= parts.length || parts.length > MAX_PARTS) return json({ error: 'That answer is too long for Kayla’s voice.' }, 413);
    const piece = parts[request.part];
    if (!allow(userData.user.id)) return json({ error: 'Too many spoken answers in a short time.' }, 429);

    const voiceId = Deno.env.get('KAYLA_CLINICAL_VOICE_ID') || KAYLA_VOICE_ID;
    const response = await fetch(HEYGEN_SPEECH_URL, {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(speechPayload(piece, voiceId)),
      signal: AbortSignal.any([req.signal, AbortSignal.timeout(45000)]),
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);
      // Status and HeyGen's error only — never the answer.
      console.error('kayla voice failed', { status: response.status, detail });
      return json({ error: "Kayla's voice is unavailable right now.", status: response.status }, response.status === 429 ? 429 : 502);
    }
    const result = await response.json().catch(() => null);
    const audioUrl = safeAudioUrl(result?.data?.audio_url);
    const seconds = Number(result?.data?.duration) || 0;
    console.log('kayla voice', { part: request.part, parts: parts.length, chars: piece.length, seconds: Math.round(seconds), engine: result?.data?.engine });
    if (!audioUrl) return json({ error: "Kayla's voice is unavailable right now." }, 502);
    return json({ audio_url: audioUrl, seconds, part: request.part, parts: parts.length });
  } catch (error) {
    console.error('kayla voice error', error instanceof Error ? error.name : 'unknown');
    return json({ error: "Kayla's voice is unavailable right now." }, 500);
  }
});
