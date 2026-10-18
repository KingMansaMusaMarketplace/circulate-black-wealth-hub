// AI note-taking on FIXED fictional visit transcripts only. No recordings, uploads or patient text accepted.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders as sdkCorsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { buildClinicalVisitNotePrompt, fetchAIWithRetry, loadApprovedImprovements } from '../_shared/kayla-brain.ts';
import { canSign, findVisit, SAMPLE_VISITS, validateNoteLines } from './sample-visits.ts';
import { authorizeClinicalPreview } from '../_shared/clinical-preview-auth.ts';

const corsHeaders = { ...sdkCorsHeaders, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-hc-preview-token, x-hc-preview-device' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const visitIds = SAMPLE_VISITS.map((v) => v.id) as [string, ...string[]];
const RequestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('generate'), clinic_id: z.string().uuid(), sample_visit_id: z.enum(visitIds) }).strict(),
  z.object({ action: z.literal('decision'), note_id: z.string().uuid(), decision: z.enum(['signed', 'rejected']), signer_name: z.string().trim().min(2).max(100) }).strict(),
]);
const Item = z.object({ text: z.string().min(1), lines: z.array(z.number().int()) });
const NoteSchema = z.object({ subjective: z.array(Item), objective: z.array(Item), assessment: z.array(Item), plan: z.array(Item), flags: z.array(Item) });
const item = { type: 'object', additionalProperties: false, properties: { text: { type: 'string' }, lines: { type: 'array', items: { type: 'integer' } } }, required: ['text', 'lines'] };
const list = { type: 'array', items: item };
const schema = { type: 'object', additionalProperties: false, properties: { subjective: list, objective: list, assessment: list, plan: list, flags: list }, required: ['subjective', 'objective', 'assessment', 'plan', 'flags'] };

async function readStream(response: Response): Promise<string> {
  if (!response.body) throw new Error('Empty AI stream');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '', output = '';
  const consume = (line: string) => {
    if (!line.startsWith('data:')) return;
    const payload = line.slice(5).trim();
    if (!payload || payload === '[DONE]') return;
    const event = JSON.parse(payload);
    if (event.type === 'error' || event.type === 'response.failed' || event.type === 'response.incomplete') throw new Error('AI stream failed');
    if (event.type === 'response.output_text.delta') output += event.delta ?? '';
  };
  for (;;) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split('\n'); buffer = lines.pop() ?? '';
    lines.forEach(consume);
    if (done) break;
  }
  if (buffer.trim()) consume(buffer);
  if (!output.trim()) throw new Error('Empty AI output');
  return output;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  try {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return json({ error: 'Sign in required' }, 401);
    const url = Deno.env.get('SUPABASE_URL'), anon = Deno.env.get('SUPABASE_ANON_KEY'), serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !anon || !serviceKey) return json({ error: 'Note service unavailable' }, 503);
    const caller = createClient(url, anon, { global: { headers: { Authorization: auth, 'x-hc-preview-token': req.headers.get('x-hc-preview-token') ?? '', 'x-hc-preview-device': req.headers.get('x-hc-preview-device') ?? '' } } });
    const { data: userData, error: authError } = await caller.auth.getUser();
    if (authError || !userData.user) return json({ error: 'Sign in required' }, 401);
    const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: 'Only the built-in fictional sample visits are allowed. Recordings and patient text are blocked.' }, 400);
    const body = parsed.data;
    const service = createClient(url, serviceKey, { auth: { persistSession: false } });
    if (!await authorizeClinicalPreview(service, req, userData.user)) return json({ error: 'Current owner-approved viewing on your approved device is required. Sign in with your approved email.' }, 403);

    let clinicId: string;
    let noteId = '';
    if (body.action === 'decision') {
      const { data } = await caller.from('hc_visit_notes').select('id, clinic_id, sample_visit_id, note').eq('id', body.note_id).maybeSingle();
      if (!data) return json({ error: 'Note not found' }, 404);
      if (body.decision === 'signed') {
        const source = findVisit(data.sample_visit_id);
        if (!source) return json({ error: 'Only built-in fictional notes can be signed.' }, 400);
        try { validateNoteLines(NoteSchema.parse(data.note), source.lines); }
        catch { return json({ error: 'This older draft does not meet the exact source check. Reject it and create a new version.' }, 409); }
      }
      clinicId = data.clinic_id; noteId = data.id;
    } else clinicId = body.clinic_id;
    const { data: member } = await caller.from('hc_members').select('role').eq('clinic_id', clinicId).eq('user_id', userData.user.id).maybeSingle();
    if (!member) return json({ error: 'Clinic access required' }, 403);

    if (body.action === 'decision') {
      if (!canSign(member.role)) return json({ error: 'Only a clinic doctor or owner can sign a note' }, 403);
      const { data, error } = await service.from('hc_note_signoffs').insert({ clinic_id: clinicId, note_id: noteId, signer_id: userData.user.id, decision: body.decision, signer_name: body.signer_name }).select().single();
      if (!error) await service.from('hc_members').update({ display_name: body.signer_name }).eq('clinic_id', clinicId).eq('user_id', userData.user.id);
      if (error) return json({ error: 'This note already has a decision or could not be signed.' }, 409);
      return json({ signoff: data });
    }

    const visit = findVisit(body.sample_visit_id);
    if (!visit) return json({ error: 'Fictional visit not found' }, 400);
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) return json({ error: 'AI not configured' }, 503);
    const model = 'openai/gpt-6-astra';
    const improvements = await loadApprovedImprovements(service);
    const ai = await fetchAIWithRetry('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST', headers: { 'Lovable-API-Key': key, Authorization: `Bearer ${key}`, 'X-Lovable-AIG-SDK': 'fetch', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, stream: true, store: false,
        reasoning: { effort: 'medium', summary: 'auto' }, include: ['reasoning.encrypted_content'],
        input: [{ role: 'system', content: buildClinicalVisitNotePrompt() + improvements }, { role: 'user', content: visit.lines.map((l, i) => `[L${i + 1}] ${l}`).join('\n') }],
        text: { format: { type: 'json_schema', name: 'visit_note', strict: true, schema } },
      }),
    }, { label: 'clinical-visit-note' });
    if (!ai.ok) {
      const s = ai.status;
      return json({ error: s === 429 ? 'Kayla is busy. Try again shortly.' : s === 402 ? 'AI credits are used up. Add credits in workspace settings.' : 'Kayla could not draft the note. Try again.' }, s === 429 || s === 402 ? s : 502);
    }
    const note = NoteSchema.parse(JSON.parse(await readStream(ai)));
    // Reject paraphrases and unsupported assertions instead of silently accepting/correcting them.
    validateNoteLines(note, visit.lines);
    if (!await authorizeClinicalPreview(service, req, userData.user)) return json({ error: 'Your private viewing ended before the draft was saved.' }, 403);
    const { data: saved, error } = await service.from('hc_visit_notes').insert({ clinic_id: clinicId, sample_visit_id: visit.id, model, note, created_by: userData.user.id }).select().single();
    if (error) throw error;
    return json({ note: saved });
  } catch {
    // Never log transcript text or AI drafts.
    return json({ error: 'The draft note failed its source check and was not saved. Please try again.' }, 502);
  }
});
