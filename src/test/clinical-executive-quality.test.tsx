import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { executiveQuality } from '@/pages/health/workspace/executive-quality';
import ExecutiveQuality from '@/pages/health/workspace/ExecutiveQuality';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';
afterEach(cleanup);
describe('executive quality evidence safeguards', () => {
  it('never assigns measured performance, savings or quality scores', () => {
    expect(executiveQuality().metrics).toEqual({ accuracyPercent: null, safetyResult: null, reviewTimeMinutes: null, monthlySavings: null, uptimePercent: null, qualityScore: null });
  });
  it('keeps healthcare services and approval/export locked', () => {
    const state = executiveQuality();
    expect(state.live).toEqual({ records: false, calls: false, agreements: false });
    expect([state.clearance, state.canApprove, state.canExport]).toEqual(['not_verified', false, false]);
  });
  it('uses only exact existing fictional sources, without completed evaluations', () => {
    const state = executiveQuality();
    expect(state.cases.map((item) => item.id)).toEqual(SAMPLE_VISITS.map((item) => item.id));
    state.cases.forEach((item, index) => {
      expect(item.lines).toBe(SAMPLE_VISITS[index].lines);
      expect(item.lineCount).toBe(SAMPLE_VISITS[index].lines.length);
      expect(item.evaluation.accuracyResult).toBeNull();
    });
  });
  it('switches source evidence without mixing transcripts', () => {
    render(<ExecutiveQuality />);
    fireEvent.click(screen.getAllByRole('button', { name: 'View source' })[0]);
    expect(within(screen.getByRole('region', { name: 'Selected fictional transcript' })).getByText(SAMPLE_VISITS[0].lines[1])).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'View source' })[2]);
    const source = screen.getByRole('region', { name: 'Selected fictional transcript' });
    expect(within(source).getByText(SAMPLE_VISITS[2].lines[1])).toBeInTheDocument();
    expect(within(source).queryByText(SAMPLE_VISITS[0].lines[1])).not.toBeInTheDocument();
  });
});