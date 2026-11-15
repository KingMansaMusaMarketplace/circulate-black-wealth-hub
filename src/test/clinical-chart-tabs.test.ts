import { describe, expect, it } from 'vitest';
import { LEGACY_CHART_TABS, MAIN_CHART_TABS, resolveChartTab, visibleMoreTabs } from '@/lib/clinical/chart-tabs';

describe('pilot chart tabs', () => {
  it('keeps the main bar to six tabs so it fits on one row', () => {
    expect(MAIN_CHART_TABS).toHaveLength(6);
  });

  it('puts prescriptions and home medicines on one Medications tab', () => {
    expect(resolveChartTab('rx', true)).toBe('meds');
    expect(resolveChartTab('meds', true)).toBe('meds');
  });

  it('puts lab orders and lab results on one Orders & results tab', () => {
    expect(resolveChartTab('orders', true)).toBe('results');
    expect(resolveChartTab('labs', true)).toBe('results');
  });

  it('still reaches every one of the eleven original screens', () => {
    const original = ['summary', 'notes', 'rx', 'orders', 'vitals', 'meds', 'problems', 'labs', 'social', 'portal', 'all'];
    for (const t of original) expect(resolveChartTab(t, true)).toBe(LEGACY_CHART_TABS[t] ?? t);
  });

  it('hides the patient portal tab from roles that cannot use it', () => {
    expect(visibleMoreTabs(false).map((t) => t.id)).toEqual(['social', 'all']);
    expect(resolveChartTab('portal', false)).toBe('summary');
    expect(resolveChartTab('portal', true)).toBe('portal');
  });
});
