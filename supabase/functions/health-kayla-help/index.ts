import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createUIMessageStream, createUIMessageStreamResponse } from 'npm:ai@6.0.309';
import { authorizeClinicalPreview } from '../_shared/clinical-preview-auth.ts';
import { PRODUCT_HELP } from '../_shared/clinical-product-catalog.ts';
import { buildClinicalProductHelpPrompt, loadApprovedImprovements } from '../_shared/kayla-brain.ts';
import { readHelpHistory, sealReply } from '../_shared/clinical-help-history.ts';
import { createResponsesCall } from '../_shared/clinical-help-responses.ts';
import { withLovableAiGatewayRunIdHeader } from '../_shared/clinical-help-run-id.ts';

const cors = { ...corsHeaders, 'Access-Control-Allow-Headers': `${corsHeaders['Access-Control-Allow-Headers']}, x-csrf-token, x-hc-preview-token, x-hc-preview-device` };
const json = (error: string, status: number) => new Response(JSON.stringify({ error }), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json('Use POST', 405);
  if (!req.headers.get('x-csrf-token')) return json('Required request header missing', 403);
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return json('Sign in with your approved email to ask Kayla.', 401);
  const url = Deno.env.get('SUPABASE_URL'), anon = Deno.env.get('SUPABASE_ANON_KEY'), serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !anon || !serviceKey) return json('Clinical help service is not configured.', 503);
  const caller = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
  const { data, error } = await caller.auth.getUser();
  if (error || !data.user) return json('Sign in with your approved email to ask Kayla.', 401);
  const service = createClient(url, serviceKey, { auth: { persistSession: false } });
  if (!await authorizeClinicalPreview(service, req, data.user)) return json('Your owner-approved private visit is not active on this device.', 403);
  const raw = await req.text();
  if (raw.length > 250000) return json('Conversation is too large. Clear it before continuing.', 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json('Invalid product request.', 400); }
  if (!body || Object.keys(body).sort().join(',') !== 'surface,turns' || !['demo','workspace'].includes(body.surface)) return json('Only product topic selections are accepted. Patient text is blocked.', 400);
  const key = `${serviceKey}:${data.user.id}:${req.headers.get('x-hc-preview-token') ?? 'admin'}:${req.headers.get('x-hc-preview-device') ?? ''}`;
  let history;
  try { history = await readHelpHistory(body.turns, key); } catch (e) { return json(e instanceof Error ? e.message : 'Invalid product history', 400); }
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) return json('Kayla AI configuration is missing. Contact Thomas@1325.ai.', 401);
  const { data: pause, error: pauseError } = await service.from('system_settings').select('setting_value').eq('setting_key', 'clinical_help_ai_pause').maybeSingle();
  if (pauseError) return json('Kayla availability could not be verified. Contact Thomas@1325.ai.', 503);
  if (pause?.setting_value?.paused) return json(pause.setting_value.message ?? 'Kayla AI is paused pending administrator action.', pause.setting_value.status === 402 ? 402 : 403);
  const lessons = await loadApprovedImprovements(service);
  const catalogue = PRODUCT_HELP.map(t => ({ feature: t.feature, answer: t.answer, steps: t.steps, boundary: t.boundary, status: t.status, destination: t[body.surface as 'demo' | 'workspace'] ?? 'Not a separate screen in this view' }));
  const accessAbort = new AbortController();
  const modelRequest = new Request(req.url, { headers: req.headers, signal: AbortSignal.any([req.signal, accessAbort.signal]) });
  const call = createResponsesCall(modelRequest, { baseURL: 'https://ai.gateway.lovable.dev/v1', apiKey, model: 'openai/gpt-6-astra', onBlocked: async failure => {
    const { error } = await service.from('system_settings').upsert({ setting_key: 'clinical_help_ai_pause', setting_value: { ...failure, paused: true }, setting_type: 'json', category: 'clinical', is_public: false, description: 'Terminal AI access pause; administrator must restore access and explicitly clear pause.' }, { onConflict: 'setting_key' });
    if (error) throw new Error('Could not record the terminal AI pause. Contact Thomas@1325.ai.');
  } }, history, buildClinicalProductHelpPrompt(JSON.stringify(catalogue), lessons));
  const { result } = call;
  await call.headersReady;
  const upstreamFailure = call.failure();
  if (upstreamFailure) return json(upstreamFailure.message, upstreamFailure.status);
  // AI SDK owns all streaming/parsing; the completion receipt authenticates browser-held history.
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const guarded = result.toUIMessageStream({ sendReasoning: false }).pipeThrough(new TransformStream({
        async transform(chunk, controller) {
          if (!await authorizeClinicalPreview(service, req, data.user)) {
            accessAbort.abort();
            controller.error(new Error('Private viewing has ended. Request fresh approval.'));
            return;
          }
          controller.enqueue(chunk);
        },
      }));
      writer.merge(guarded);
      const text = await result.text;
      if (!text.trim()) throw new Error('Kayla returned no answer. This request has stopped.');
      if (!await authorizeClinicalPreview(service, req, data.user)) throw new Error('Private viewing has ended. Request fresh approval.');
      const selection = body.turns[body.turns.length - 1].selection;
      writer.write({ type: 'data-receipt', data: await sealReply(key, selection, text) });
    },
    onError: error => error instanceof Error ? error.message : 'Kayla could not complete this request.',
  });
  return withLovableAiGatewayRunIdHeader(createUIMessageStreamResponse({ stream }), call.gateway, cors);
});