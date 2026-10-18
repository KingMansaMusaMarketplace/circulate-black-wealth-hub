// Fixed fictional records only. No uploaded text or patient data accepted.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders as sdkCorsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { buildClinicalRecordReviewPrompt, fetchAIWithRetry, loadApprovedImprovements } from '../_shared/kayla-brain.ts';
import { canReview, SAMPLE_CASE_ID, SAMPLE_PAGES, validateSources } from './sample-case.ts';
import { PILOT_LOCK, pilotInsert } from './pilot-policy.ts';
import { authorizeClinicalPreview } from '../_shared/clinical-preview-auth.ts';

const corsHeaders = { ...sdkCorsHeaders, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-hc-preview-token, x-hc-preview-device' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const RequestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('generate'), clinic_id: z.string().uuid(), sample_case_id: z.literal(SAMPLE_CASE_ID) }).strict(),
  z.object({ action: z.literal('decision'), review_id: z.string().uuid(), decision: z.enum(['accepted', 'revision_requested']) }).strict(),
  z.object({ action: z.literal('pilot_request'), clinic_id: z.string().uuid(), checklist: z.object({ clinic_baa_reported: z.boolean(), vendor_baas_reported: z.boolean(), attorney_review_reported: z.boolean(), safeguards_reported: z.boolean(), doctor_assigned_reported: z.boolean() }).strict() }).strict(),
]);
const ResultSchema = z.object({
  findings: z.array(z.object({ category: z.enum(['timeline', 'pre_existing', 'conflict', 'gap']), date: z.string(), finding: z.string().min(1), sources: z.array(z.object({ page: z.number().int().min(1).max(SAMPLE_PAGES.length), quote: z.string().min(8) })).min(1) })).min(1),
  questions_for_exam: z.array(z.string()), report_outline: z.array(z.string()),
});
const str = { type: 'string' };
const obj = (properties: Record<string, unknown>) => ({ type: 'object', additionalProperties: false, properties, required: Object.keys(properties) });
const arr = (items: unknown) => ({ type: 'array', items });
const schema = obj({ findings: arr(obj({ category: { type: 'string', enum: ['timeline', 'pre_existing', 'conflict', 'gap'] }, date: str, finding: str, sources: arr(obj({ page: { type: 'integer' }, quote: str })) })), questions_for_exam: arr(str), report_outline: arr(str) });

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
    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !anon || !serviceKey) return json({ error: 'Review service unavailable' }, 503);
    const caller = createClient(url, anon, { global: { headers: { Authorization: auth, 'x-hc-preview-token': req.headers.get('x-hc-preview-token') ?? '', 'x-hc-preview-device': req.headers.get('x-hc-preview-device') ?? '' } } });
    const { data: userData, error: authError } = await caller.auth.getUser();
    if (authError || !userData.user) return json({ error: 'Sign in required' }, 401);
    const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: 'Only the built-in fictional case and review decisions are allowed. Uploaded text and patient records are blocked.' }, 400);
    const body = parsed.data;
    const service = createClient(url, serviceKey, { auth: { persistSession: false } });
    if (!await authorizeClinicalPreview(service, req, userData.user)) return json({ error: 'Current owner-approved viewing on your approved device is required. Sign in with your approved email.' }, 403);
    let clinicId: string;
    let review: { id: string; clinic_id: string } | null = null;
    if (body.action === 'decision') {
      const { data, error } = await caller.from('hc_reviews').select('id, clinic_id').eq('id', body.review_id).maybeSingle();
      if (error || !data) return json({ error: 'Review not found' }, 404);
      review = data; clinicId = data.clinic_id;
    } else clinicId = body.clinic_id;
    const { data: member } = await caller.from('hc_members').select('role').eq('clinic_id', clinicId).eq('user_id', userData.user.id).maybeSingle();
    if (!member) return json({ error: 'Clinic access required' }, 403);
    if (body.action === 'pilot_request') {
      if (!canReview(member.role)) return json({ error: 'A clinic doctor or owner must submit pilot readiness' }, 403);
      const { data, error } = await service.from('hc_pilot_requests').upsert(pilotInsert(clinicId, userData.user.id, body.checklist), { onConflict: 'clinic_id' }).select().single();
      if (error) throw error;
      return json({ request: data, ...PILOT_LOCK });
    }
    if (body.action === 'decision') {
      if (!canReview(member.role) || !review) return json({ error: 'A clinic doctor or owner must record the sample review decision' }, 403);
      const { data, error } = await service.from('hc_review_decisions').insert({ clinic_id: clinicId, review_id: review.id, reviewer_id: userData.user.id, decision: body.decision }).select().single();
      if (error) return json({ error: 'This draft already has a decision or could not be saved.' }, 409);
      return json({ decision: data });
    }
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) return json({ error: 'AI not configured' }, 503);
    const model = 'openai/gpt-6-astra';
    const improvements = await loadApprovedImprovements(service);
    const ai = await fetchAIWithRetry('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST', headers: { 'Lovable-API-Key': key, Authorization: `Bearer ${key}`, 'X-Lovable-AIG-SDK': 'fetch', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, stream: true, store: false,
        reasoning: { effort: 'medium', summary: 'auto' }, include: ['reasoning.encrypted_content'],
        input: [{ role: 'system', content: buildClinicalRecordReviewPrompt() + improvements }, { role: 'user', content: SAMPLE_PAGES.map(p => `[Bundle Page ${p.page}] ${p.file}\n${p.text}`).join('\n\n') }],
        text: { format: { type: 'json_schema', name: 'clinical_draft', strict: true, schema } },
      }),
    }, { label: 'clinical-record-review' });
    if (!ai.ok) return json({ error: ai.status === 429 ? 'Kayla is busy. Try again shortly.' : 'Kayla could not generate the draft. Try again.' }, ai.status === 429 ? 429 : 502);
    const result = ResultSchema.parse(JSON.parse(await readStream(ai)));
    validateSources(result, true);
    for (const finding of result.findings) {
      finding.finding = finding.sources.map(source => source.quote).join(' ');
      finding.date = [...new Set(finding.sources.map(source => SAMPLE_PAGES.find(page => page.page === source.page)?.date ?? 'Not stated'))].join(' / ');
    }
    result.questions_for_exam = ['Review the cited pages and reconcile documentation differences; no clinical or legal conclusion is supplied.'];
    result.report_outline = ['Source excerpts', 'Independent physician review'];
    validateSources(result, true);
    if (!await authorizeClinicalPreview(service, req, userData.user)) return json({ error: 'Your private viewing ended before the review was saved.' }, 403);
    const { data: doc, error: docError } = await service.from('hc_documents').insert({ clinic_id: clinicId, file_name: 'Fictional CME case — six-page bundle', pages: SAMPLE_PAGES.length, status: 'draft_ready', created_by: userData.user.id }).select().single();
    if (docError || !doc) throw docError ?? new Error('Document save failed');
    const { data: saved, error: saveError } = await service.from('hc_reviews').insert({ clinic_id: clinicId, document_id: doc.id, model, result: { ...result, sample_case_id: SAMPLE_CASE_ID, source_pages: SAMPLE_PAGES, citation_check: 'Saved findings contain only exact cited excerpts; grouping is AI-selected and requires independent review. This is not a clinical-correctness guarantee.' } }).select().single();
    if (saveError) {
      await service.from('hc_documents').delete().eq('id', doc.id);
      throw saveError;
    }
    return json({ review: saved });
  } catch {
    // Never log record text or AI drafts.
    return json({ error: 'Draft could not be validated or saved. No completed review was recorded. Please retry.' }, 502);
  }
});
