// Speaks an Ask Kayla answer, or the morning huddle, in Kayla's own video voice (HeyGen).
// Only answers Kayla wrote for this viewer (signed receipt) or the huddle this service builds
// itself from counts (never names), or an order read-back it builds itself for a made-up test patient, can be spoken: nobody can send their own text. Only signed-in members of the clinic with a current approved viewing.
// Nothing is stored and the words are never logged; the browser falls back to the device voice on any failure.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders as sdkCorsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { authorizeClinicalPreview } from '../_shared/clinical-preview-auth.ts';
import { helpReceiptKey, verifyReply } from '../_shared/clinical-help-history.ts';
import { huddleCounts, sessionScript, localDay } from '../_shared/clinical-huddle.ts';
import { parseReadBackRequest, readBackWords } from '../_shared/clinical-readback.ts';
import { HEYGEN_SPEECH_URL, KAYLA_VOICE_ID, MAX_PARTS, makeRateLimiter, parseHuddleRequest, parseVoiceRequest, safeAudioUrl, speechFor, speechParts, speechPayload, type VoiceRequest } from './rules.ts';

const corsHeaders = { ...sdkCorsHeaders, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-hc-preview-token, x-hc-preview-device' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const allow = makeRateLimiter();
/** A refusal, logged by reason code and status only (never words), so a silent voice can be traced. */
const refuse = (reason: string, body: unknown, status: number) => { console.warn('kayla voice refused', { reason, status }); return json(body, status); };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  if (!req.headers.get('x-csrf-token')) return json({ error: 'Required request header missing' }, 403);
  try {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return refuse('no-sign-in', { error: 'Please sign in again.' }, 401);
    const url = Deno.env.get('SUPABASE_URL'), anon = Deno.env.get('SUPABASE_ANON_KEY'), serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const apiKey = Deno.env.get('HEYGEN_API_KEY');
    if (!url || !anon || !serviceKey || !apiKey) return refuse('not-set-up', { error: "Kayla's voice is not set up." }, 503);
    const raw = await req.text();
    if (raw.length > 40000) return refuse('body-too-long', { error: 'That answer is too long to read aloud.' }, 413);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return refuse('bad-json', { error: 'Invalid request.' }, 400); }
    const huddle = parseHuddleRequest(body);
    const readBack = huddle ? null : parseReadBackRequest(body, MAX_PARTS);
    // An order with unusual characters is read on the doctor's device instead of being sent.
    if (!huddle && !readBack && body && typeof body === 'object' && 'readback' in body) return json({ error: 'Read-back uses this device’s voice for this order.', device_only: true }, 400);
    const request = huddle ?? readBack ?? parseVoiceRequest(body);
    if (!request) return refuse('bad-request', { error: 'Only Kayla answers can be read aloud.' }, 400);

    const caller = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
    const { data: userData, error: authError } = await caller.auth.getUser();
    if (authError || !userData.user) return refuse('expired-sign-in', { error: 'Please sign in again.' }, 401);
    const service = createClient(url, serviceKey, { auth: { persistSession: false } });
    if (!await authorizeClinicalPreview(service, req, userData.user)) return refuse('viewing-not-active', { error: 'Your approved viewing is not active on this device.' }, 403);
    const { data: member } = await caller.from('hc_members').select('role').eq('clinic_id', request.clinicId).eq('user_id', userData.user.id).maybeSingle();
    if (!member) return refuse('not-member', { error: "Kayla's voice is only for members of this clinic." }, 403);

    let words: string | null;
    if (huddle) {
      // Counts only, read with the caller's own access so the huddle matches what they may see.
      const day = localDay(huddle.tzOffset);
      const [appts, labs, notes] = await Promise.all([
        caller.from('hc_pilot_appointments').select('status').eq('clinic_id', huddle.clinicId).gte('starts_at', day.start.toISOString()).lt('starts_at', day.end.toISOString()),
        caller.from('hc_pilot_lab_orders').select('priority').eq('clinic_id', huddle.clinicId).in('status', ['ordered', 'collected']),
        caller.from('hc_pilot_visit_notes').select('status').eq('clinic_id', huddle.clinicId).eq('status', 'draft'),
      ]);
      if (appts.error || labs.error || notes.error) return refuse('huddle-counts', { error: 'The huddle could not be prepared.' }, 502);
      words = sessionScript(huddle.session, huddleCounts(appts.data ?? [], labs.data ?? [], notes.data ?? []), day.hour);
    } else if (readBack) {
      // Kayla's voice reads orders for made-up test patients only, and never once the clinic is cleared
      // for real patients (no signed privacy agreement with the voice company): the screen then uses the device voice.
      const [allowed, patient, records] = await Promise.all([
        caller.rpc('hc_real_patients_allowed', { _clinic: readBack.clinicId }),
        caller.from('hc_pilot_patients').select('is_real, allergies').eq('clinic_id', readBack.clinicId).eq('id', readBack.patientId).maybeSingle(),
        caller.from('hc_pilot_records').select('title').eq('clinic_id', readBack.clinicId).eq('patient_id', readBack.patientId).eq('record_type', 'allergy').eq('status', 'active'),
      ]);
      if (allowed.error || allowed.data !== false || patient.error || !patient.data || patient.data.is_real !== false || records.error) {
        return json({ error: 'Read-back uses this device’s voice for this chart.', device_only: true }, 403);
      }
      const allergies = [...((patient.data.allergies ?? []) as unknown[]), ...((records.data ?? []) as { title: unknown }[]).map((r) => r.title)]
        .filter((a): a is string => typeof a === 'string' && a.trim() !== '').map((a) => a.trim().slice(0, 80)).slice(0, 12);
      words = readBackWords(readBack, allergies);
    } else {
      const key = helpReceiptKey(serviceKey, userData.user.id, req.headers.get('x-hc-preview-token'), req.headers.get('x-hc-preview-device'));
      const answer = request as VoiceRequest;
      if (!await verifyReply(key, answer.selection, answer.receipt)) return refuse('receipt-mismatch', { error: 'Only Kayla answers can be read aloud. Please ask the question again.' }, 403);
      words = speechFor((answer.receipt as { text: string }).text);
    }
    if (!words) return refuse('no-words', { error: 'That answer has nothing to read aloud.' }, 413);
    const parts = speechParts(words);
    if (request.part >= parts.length || parts.length > MAX_PARTS) return refuse('too-many-parts', { error: 'That answer is too long for Kayla’s voice.' }, 413);
    const piece = parts[request.part];
    if (!allow(userData.user.id)) return refuse('rate-limit', { error: 'Too many spoken answers in a short time. Please wait a minute.' }, 429);

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
    console.log('kayla voice', { kind: huddle ? 'huddle' : readBack ? `readback-${readBack.kind}` : 'answer', part: request.part, parts: parts.length, chars: piece.length, seconds: Math.round(seconds), engine: result?.data?.engine });
    if (!audioUrl) return json({ error: "Kayla's voice is unavailable right now." }, 502);
    return json({ audio_url: audioUrl, seconds, part: request.part, parts: parts.length, ...(huddle || readBack ? { text: words } : {}) });
  } catch (error) {
    console.error('kayla voice error', error instanceof Error ? error.name : 'unknown');
    return json({ error: "Kayla's voice is unavailable right now." }, 500);
  }
});
