import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SamplePatientChart from '@/pages/health/workspace/SamplePatientChart';
import { buildSamplePatientChart } from '@/pages/health/workspace/sample-chart';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

afterEach(cleanup);
const tab = (name: string) => fireEvent.mouseDown(screen.getByRole('tab', { name }), { button: 0, ctrlKey: false });

describe('expanded fictional chart', () => {
  it('keeps every chart excerpt attached to its exact original source', () => {
    for (const visit of SAMPLE_VISITS) {
      const chart = buildSamplePatientChart(visit.id);
      for (const fact of chart.sections.flatMap((section) => section.facts)) expect(visit.lines[fact.line - 1]).toBe(fact.text);
      for (const fact of [...chart.medications.excerpts, ...chart.results.planned]) expect(visit.lines[fact.line - 1]).toBe(fact.text);
      expect(chart.documents[0].id).toBe(visit.id);
    }
  });
  it('does not infer no allergies from a missing allergy history', () => {
    const chart = buildSamplePatientChart('visit-back-pain-v1');
    expect(chart.allergies.status).toBe('not_documented');
    expect(chart.allergies.entries).toEqual([]);
  });
  it('does not invent medication names, doses or completed reconciliation', () => {
    const chart = buildSamplePatientChart('visit-blood-pressure-v1');
    expect(chart.medications.namesAndDoses).toEqual([]);
    expect(chart.medications.reconciliation).toBe('not_completed');
    expect(chart.medications.excerpts.map((item) => item.line)).toEqual([2, 7]);
  });
  it('keeps planned imaging separate from received results', () => {
    const chart = buildSamplePatientChart('visit-knee-v1');
    expect(chart.results.received).toEqual([]);
    expect(chart.results.planned.map((item) => item.line)).toEqual([8]);
    expect(chart.clinicalDate).toBeNull();
    expect(chart.currentStatusVerified).toBe(false);
  });
  it('does not fabricate saved edits, actors or timestamps in sample history', () => {
    const chart = buildSamplePatientChart('visit-knee-v1');
    expect(chart.isAuditTrail).toBe(false);
    expect(chart.sourceHistory.map((item) => [item.kind, item.actor, item.timestamp])).toEqual([['fixture_baseline', null, null]]);
    expect(chart.canEdit).toBe(false);
    expect(chart.canUpload).toBe(false);
  });
  it('rejects unknown patient records', () => {
    expect(() => buildSamplePatientChart('external-record')).toThrow();
  });
  it('opens source evidence and clears it on a case change', () => {
    render(<SamplePatientChart />);
    fireEvent.click(screen.getByRole('button', { name: /Patient: The pain is better/ }));
    expect(screen.getByRole('region', { name: 'Chart source transcript' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Knee injury — Riley Demo' }));
    expect(screen.queryByRole('region', { name: 'Chart source transcript' })).not.toBeInTheDocument();
    tab('Results');
    fireEvent.click(screen.getByRole('button', { name: /Doctor: We will order an MRI/ }));
    expect(screen.getByRole('region', { name: 'Chart source transcript' })).toHaveTextContent('Doctor: We will order an MRI of the right knee.');
    expect(screen.getByRole('button', { name: 'Edit patient chart' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Upload patient records' })).toBeDisabled();
  });
});