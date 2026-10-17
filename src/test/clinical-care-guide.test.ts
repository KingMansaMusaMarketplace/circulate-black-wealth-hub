import { describe, expect, it } from 'vitest';
import { buildSampleCareGuide } from '@/pages/health/workspace/care-guide';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

describe('fictional care guide safeguards', () => {
  it('rejects non-sample records', () => {
    expect(() => buildSampleCareGuide('real-patient', 'en')).toThrow();
  });
  it('retains exact source quotations in both languages', () => {
    for (const visit of SAMPLE_VISITS) for (const language of ['en', 'es'] as const) {
      const guide = buildSampleCareGuide(visit.id, language);
      for (const item of [guide.summary, ...guide.plan]) expect(item.quote).toBe(visit.lines[item.line - 1]);
      expect(guide.plan.map((i) => i.line)).toEqual(visit.id === 'visit-back-pain-v1' ? [8, 9] : [7, 8]);
    }
  });
  it('translation preserves sources and gap flags', () => {
    for (const visit of SAMPLE_VISITS) {
      const en = buildSampleCareGuide(visit.id, 'en');
      const es = buildSampleCareGuide(visit.id, 'es');
      expect(es.plan.map((i) => i.line)).toEqual(en.plan.map((i) => i.line));
      expect(es.gaps.map((g) => g.code)).toEqual(en.gaps.map((g) => g.code));
    }
  });
  it('preparation never grants approval or patient delivery', () => {
    for (const visit of SAMPLE_VISITS) for (const language of ['en', 'es'] as const) expect(buildSampleCareGuide(visit.id, language)).toMatchObject({ status: 'draft', fictional: true, canDeliver: false });
  });
  it('flags missing prescription and monitoring details', () => {
    expect(buildSampleCareGuide('visit-blood-pressure-v1', 'en').gaps.map((g) => g.code)).toEqual(['medicine_details', 'monitoring_frequency', 'urgent_care_instructions']);
  });
  it('flags missing urgent-care instructions in every sample', () => {
    for (const visit of SAMPLE_VISITS) expect(buildSampleCareGuide(visit.id, 'en').gaps.map((g) => g.code)).toContain('urgent_care_instructions');
  });
  it('does not supply missing knee follow-up or ice duration', () => {
    expect(buildSampleCareGuide('visit-knee-v1', 'en').gaps.map((g) => g.code)).toEqual(['ice_and_brace_details', 'follow_up_timing', 'urgent_care_instructions']);
  });
});