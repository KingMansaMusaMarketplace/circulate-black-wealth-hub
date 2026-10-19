import { createClient } from 'npm:@supabase/supabase-js@2';
import { createUIMessageStream, createUIMessageStreamResponse } from 'npm:ai@6.0.309';
import { authorizeClinicalPreview } from '../_shared/clinical-preview-auth.ts';
import { PRODUCT_HELP } from '../_shared/clinical-product-catalog.ts';
import { buildClinicalProductHelpPrompt, loadApprovedImprovements } from '../_shared/kayla-brain.ts';
import { readHelpHistory, sealReply } from '../_shared/clinical-help-history.ts';
import { createResponsesCall } from '../_shared/clinical-help-responses.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-csrf-token, x-hc-preview-token, x-hc-preview-device' };
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
  const key = `${serviceKey}:${data.user.id}`;
  let history;
  try { history = await readHelpHistory(body.turns, key); } catch (e) { return json(e instanceof Error ? e.message : 'Invalid product history', 400); }
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) return json('Kayla AI configuration is missing. Contact Thomas@1325.ai.', 401);
  const lessons = await loadApprovedImprovements(service);
  const catalogue = PRODUCT_HELP.map(t => ({ feature: t.feature, answer: t.answer, steps: t.steps, boundary: t.boundary, status: t.status, destination: t[body.surface as 'demo' | 'workspace'] ?? 'Not a separate screen in this view' }));
  const { result } = createResponsesCall(req, { baseURL: 'https://ai.gateway.lovable.dev/v1', apiKey, model: 'openai/gpt-6-astra' }, history, buildClinicalProductHelpPrompt(JSON.stringify(catalogue), lessons));
  // AI SDK owns all streaming/parsing; the completion receipt authenticates browser-held history.
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.merge(result.toUIMessageStream({ sendReasoning: true }));
      const text = await result.text;
      if (!text.trim()) throw new Error('Kayla returned no answer. This request has stopped.');
      if (!await authorizeClinicalPreview(service, req, data.user)) throw new Error('Private viewing has ended. Request fresh approval.');
      const selection = body.turns[body.turns.length - 1].selection;
      writer.write({ type: 'data-receipt', data: await sealReply(key, selection, text) });
    },
    onError: error => error instanceof Error ? error.message : 'Kayla could not complete this request.',
  });
  return createUIMessageStreamResponse({ stream, headers: cors });
});