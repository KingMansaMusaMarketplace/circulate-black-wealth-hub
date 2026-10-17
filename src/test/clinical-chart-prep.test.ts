import { describe, expect, it } from 'vitest';
import { prepareSampleChart } from '@/pages/health/workspace/chart-prep';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

describe('fictional pre-visit chart preparation', () => {
  it('rejects anything other than a built-in sample identifier', () => {
    expect(() => prepareSampleChart('real-patient-record')).toThrow();
  });
  it('every summary fact is an exact excerpt from its numbered source', () => {
    for (const visit of SAMPLE_VISITS) {
      const prep = prepareSampleChart(visit.id);
      expect(prep.sections.flatMap((s) => s.facts).length).toBeGreaterThan(0);
      for (const fact of prep.sections.flatMap((s) => s.facts)) {
        expect(fact.line).toBeGreaterThan(0);
        expect(fact.text).toBe(visit.lines[fact.line - 1]);
      }
    }
  });
  it('flags missing allergy history rather than asserting no allergies', () => {
    expect(prepareSampleChart(SAMPLE_VISITS[0].id).gaps).toContain('Allergy history is not provided. This does not mean there are no allergies.');
  });
  it('does not turn a planned MRI into a completed imaging result', () => {
    const prep = prepareSampleChart('visit-knee-v1');
    expect(prep.sections[3].facts[1].text).toBe('Doctor: We will order an MRI of the right knee.');
    expect(prep.gaps).toContain('An MRI was planned; no imaging result is included.');
  });
  it('keeps the clinician’s uncertain assessment exactly as stated', () => {
    expect(prepareSampleChart('visit-knee-v1').sections[2].facts[0].text).toBe('Doctor: I am concerned about a possible meniscus injury, but I cannot confirm that today.');
  });
});