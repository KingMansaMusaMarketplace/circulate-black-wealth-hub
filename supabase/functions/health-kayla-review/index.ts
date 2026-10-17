// Fixed fictional records only. No uploaded text or patient data accepted.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders as sdkCorsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { buildClinicalRecordReviewPrompt, fetchAIWithRetry, loadApprovedImprovements } from '../_shared/kayla-brain.ts';
import { canReview, SAMPLE_CASE_ID, SAMPLE_PAGES, validateSources } from './sample-case.ts';

const corsHeaders = { ...sdkCorsHeaders, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const RequestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('generate'), clinic_id: z.string().uuid(), sample_case_id: z.literal(SAMPLE_CASE_ID) }).strict(),
  z.object({ action: z.literal('decision'), review_id: z.string().uuid(), decision: z.enum(['accepted', 'revision_requested']) }).strict(),
]);
const ResultSchema = z.object({
  findings: z.array(z.object({ category: z.enum(['timeline', 'pre_existing', 'conflict', 'gap']), date: z.string(), finding: z.string().min(1), sources: z.array(z.object({ page: z.number().int().min(1).max(SAMPLE_PAGES.length), quote: z.string().min(8) })).min(1) })).min(1),
  questions_for_exam: z.array(z.string()), report_outline: z.array(z.string()),
});
const str = { type: 'string' };
const obj = (properties: Record<string, unknown>) => ({ type: 'object', additionalProperties: false, properties, required: Object.keys(properties) });
const arr = (items: unknown) => ({ type: 'array', items });
const schema = obj({ findings: arr(obj({ category: { type: 'string', enum: ['timeline', 'pre_existing', 'conflict', 'gap'] }, date: str, finding: str, sources: arr(obj({ page: { type: 'integer' }, quote: str })) })), questions_for_exam: arr(str), report_outline: arr(str) });

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
    const caller = createClient(url, anon, { global: { headers: { Authorization: auth } } });
    const { data: userData, error: authError } = await caller.auth.getUser();
    if (authError || !userData.user) return json({ error: 'Sign in required' }, 401);
    const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: 'Only the built-in fictional case and review decisions are allowed. Uploaded text and patient records are blocked.' }, 400);
    const body = parsed.data;
    const service = createClient(url, serviceKey, { auth: { persistSession: false } });
    let clinicId: string;
    let review: { id: string; clinic_id: string } | null = null;
    if (body.action === 'decision') {
      const { data, error } = await caller.from('hc_reviews').select('id, clinic_id').eq('id', body.review_id).maybeSingle();
      if (error || !data) return json({ error: 'Review not found' }, 404);
      review = data; clinicId = data.clinic_id;
    } else clinicId = body.clinic_id;
    const { data: member } = await caller.from('hc_members').select('role').eq('clinic_id', clinicId).eq('user_id', userData.user.id).maybeSingle();
    if (!member) return json({ error: 'Clinic access required' }, 403);
    if (body.action === 'decision') {
      if (!canReview(member.role) || !review) return json({ error: 'A clinic doctor or owner must record the sample review decision' }, 403);
      const { data, error } = await service.from('hc_review_decisions').insert({ clinic_id: clinicId, review_id: review.id, reviewer_id: userData.user.id, decision: body.decision }).select().single();
      if (error) throw error;
      return json({ decision: data });
    }
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) return json({ error: 'AI not configured' }, 503);
    const model = 'google/gemini-3.1-pro-preview';
    const improvements = await loadApprovedImprovements(service);
    const ai = await fetchAIWithRetry('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, temperature: 0, max_tokens: 8000,
        messages: [{ role: 'system', content: buildClinicalRecordReviewPrompt() + improvements }, { role: 'user', content: SAMPLE_PAGES.map(p => `[Bundle Page ${p.page}] ${p.file}\n${p.text}`).join('\n\n') }],
        response_format: { type: 'json_schema', json_schema: { name: 'clinical_draft', strict: true, schema } },
      }),
    }, { label: 'clinical-record-review' });
    if (!ai.ok) return json({ error: ai.status === 429 ? 'Kayla is busy. Try again shortly.' : 'Kayla could not generate the draft. Try again.' }, ai.status === 429 ? 429 : 502);
    const response = await ai.json();
    const result = ResultSchema.parse(JSON.parse(response.choices?.[0]?.message?.content ?? 'null'));
    validateSources(result);
    const { data: doc, error: docError } = await service.from('hc_documents').insert({ clinic_id: clinicId, file_name: 'Fictional CME case — six-page bundle', pages: SAMPLE_PAGES.length, status: 'draft_ready', created_by: userData.user.id }).select().single();
    if (docError || !doc) throw docError ?? new Error('Document save failed');
    const { data: saved, error: saveError } = await service.from('hc_reviews').insert({ clinic_id: clinicId, document_id: doc.id, model, result: { ...result, sample_case_id: SAMPLE_CASE_ID, source_pages: SAMPLE_PAGES, citation_check: 'Exact quotations and page bounds checked; clinical interpretation requires physician review.' } }).select().single();
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
