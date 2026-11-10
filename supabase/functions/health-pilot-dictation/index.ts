// Pilot talk-to-type: turns a short doctor recording into words for a draft
// visit note about a MADE-UP test patient. Audio goes straight to 1325.AI's own
// OpenAI organization (the one named in the BAA request), never through Lovable AI.
// Nothing is stored: no audio, no words, and the words are never logged.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders as sdkCorsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { authorizeClinicalPreview } from '../_shared/clinical-preview-auth.ts';
import { MAX_BYTES, checkWav, makeRateLimiter, openAiHeaders, parsePurpose } from './rules.ts';

const corsHeaders = { ...sdkCorsHeaders, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-hc-preview-token, x-hc-preview-device' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const allow = makeRateLimiter();
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MODEL = 'gpt-transcribe';
const HINT = 'Doctor dictating a clinic visit note for a made-up test patient. Medical terms, medicine names, doses and vital signs.';
// Spoken Ask Kayla question: the words go back to the question box and pass the same
// product-only check as typed questions before anything reaches Kayla.
const QUESTION_HINT = 'A doctor asking Kayla a short question about 1325 Clinical EMR / EHR features, such as Doctor Day, Delegation Desk, chart prep, AI note-taking, billing or prior authorization.';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  try {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return json({ error: 'Please sign in again, then try talk-to-type.' }, 401);
    const length = Number(req.headers.get('content-length') ?? '0');
    if (length > MAX_BYTES + 4096) return json({ error: 'That recording was too long. Keep each recording under 2 minutes.' }, 413);

    const url = Deno.env.get('SUPABASE_URL'), anon = Deno.env.get('SUPABASE_ANON_KEY'), serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const headers = openAiHeaders(Deno.env.get('OPENAI_API_KEY') ?? '', Deno.env.get('OPENAI_ORG_ID'), Deno.env.get('OPENAI_PROJECT_ID'));
    if (!url || !anon || !serviceKey || !headers) return json({ error: 'Talk-to-type is not set up yet. You can still type the note.' }, 503);

    const caller = createClient(url, anon, { global: { headers: { Authorization: auth, 'x-hc-preview-token': req.headers.get('x-hc-preview-token') ?? '', 'x-hc-preview-device': req.headers.get('x-hc-preview-device') ?? '' } } });
    const { data: userData, error: authError } = await caller.auth.getUser();
    if (authError || !userData.user) return json({ error: 'Please sign in again, then try talk-to-type.' }, 401);
    const service = createClient(url, serviceKey, { auth: { persistSession: false } });
    if (!await authorizeClinicalPreview(service, req, userData.user)) return json({ error: 'Talk-to-type needs a current approved viewing on your approved device.' }, 403);

    const form = await req.formData().catch(() => null);
    const clinicId = form?.get('clinic_id');
    const file = form?.get('file');
    const purpose = parsePurpose(form?.get('purpose'));
    if (typeof clinicId !== 'string' || !UUID.test(clinicId) || !(file instanceof File)) return json({ error: 'The recording did not arrive. Please try again.' }, 400);
    const { data: member } = await caller.from('hc_members').select('role').eq('clinic_id', clinicId).eq('user_id', userData.user.id).maybeSingle();
    if (!member) return json({ error: 'Talk-to-type is only for members of this pilot clinic.' }, 403);
    if (!allow(userData.user.id)) return json({ error: 'Too many recordings in a short time. Wait a minute and try again.' }, 429);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const wav = checkWav(bytes, purpose);
    if (!wav.ok) return json({ error: wav.error }, 400);

    const upstream = new FormData();
    upstream.append('file', new Blob([bytes], { type: 'audio/wav' }), 'dictation.wav');
    upstream.append('model', MODEL);
    upstream.append('language', 'en');
    upstream.append('prompt', purpose === 'question' ? QUESTION_HINT : HINT);
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers, body: upstream });
    // Status and organization only — never the words.
    console.log('pilot dictation', { purpose, status: response.status, seconds: Math.round(wav.seconds), org: response.headers.get('openai-organization') });
    if (!response.ok) {
      await response.body?.cancel();
      if (response.status === 429 || response.status >= 500) return json({ error: 'The voice service is busy. Wait a moment and try again.' }, 503);
      if (response.status === 400) return json({ error: "We couldn't understand that recording. Please try again." }, 400);
      return json({ error: 'Talk-to-type is not available right now. You can still type the note.' }, 503);
    }
    const result = await response.json().catch(() => null);
    const text = typeof result?.text === 'string' ? result.text.trim() : '';
    if (!text) return json({ error: "We didn't catch any words. Please try again a little closer to the microphone." }, 422);
    return json({ text });
  } catch (error) {
    console.error('pilot dictation failed', error instanceof Error ? error.name : 'unknown');
    return json({ error: 'Talk-to-type is not available right now. You can still type the note.' }, 500);
  }
});
