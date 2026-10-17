import { describe, expect, it } from 'vitest';
import { SAMPLE_CASE_ID, SAMPLE_PAGES } from '../../supabase/functions/health-kayla-review/sample-case';
import { buildSampleChronology, filterChronology } from '@/pages/health/workspace/chronology';

describe('fictional medical chronology', () => {
  it('rejects non-sample case identifiers', () => {
    expect(() => buildSampleChronology('uploaded-case')).toThrow();
  });
  it('orders the five dated records and keeps the undated index last', () => {
    const { events } = buildSampleChronology(SAMPLE_CASE_ID);
    expect(events.map((event) => event.date)).toEqual(['2025-01-10', '2025-03-02', '2025-03-18', '2025-04-01', '2025-05-20', null]);
    expect(events[5].page).toBe(6);
  });
  it('every event and flagged quotation matches its exact source page', () => {
    const chronology = buildSampleChronology(SAMPLE_CASE_ID);
    for (const event of chronology.events) expect(event.text).toBe(SAMPLE_PAGES.find((page) => page.page === event.page)?.text);
    for (const flag of chronology.flags) {
      expect(flag.sources.length).toBeGreaterThan(0);
      for (const source of flag.sources) expect(SAMPLE_PAGES.find((page) => page.page === source.page)?.text).toContain(source.quote);
    }
  });
  it('does not create a completed appointment from the planned April 8 visit', () => {
    const chronology = buildSampleChronology(SAMPLE_CASE_ID);
    expect(chronology.events.some((event) => event.date === '2025-04-08')).toBe(false);
    expect(chronology.flags.find((flag) => flag.title === 'Planned attendance is unverified')?.sources[1].quote).toBe('Missing documents do not prove missing treatment.');
  });
  it('preserves both sources for conflicting prior-symptom history', () => {
    expect(buildSampleChronology(SAMPLE_CASE_ID).flags[0].sources.map((source) => source.page)).toEqual([1, 2]);
  });
  it('filters imaging records without adding events', () => {
    const { events } = buildSampleChronology(SAMPLE_CASE_ID);
    expect(filterChronology(events, 'imaging').map((event) => event.page)).toEqual([3]);
    expect(filterChronology(events, 'all')).toHaveLength(6);
  });
});