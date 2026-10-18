import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { scheduleDay } from '@/pages/health/workspace/schedule-date';
import { clinicalRequestHeaders } from '@/pages/health/clinical-request';
import { SAMPLE_VISITS, validateNoteLines } from '../../supabase/functions/health-kayla-notes/sample-visits';
import { validateSources } from '../../supabase/functions/health-kayla-review/sample-case';
import { useRows } from '@/pages/health/workspace/hc';

const mock = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: () => ({ select: () => ({ eq: () => ({ order: mock.query }) }) }) } }));

afterEach(() => { localStorage.clear(); vi.clearAllMocks(); });
describe('clinical correction safeguards', () => {
  it('keeps appointments in different years separate', () => {
    expect(scheduleDay('2025-10-18T09:00:00')).not.toBe(scheduleDay('2026-10-18T09:00:00'));
    expect(scheduleDay('2026-10-18T09:00:00')).toContain('2026');
  });
  it('forwards the current device and grant, but not after ending the session', () => {
    localStorage.setItem('hc_preview_access', 'a'.repeat(48)); localStorage.setItem('hc_preview_device', 'b'.repeat(32));
    expect(clinicalRequestHeaders()).toEqual({ 'x-hc-preview-token': 'a'.repeat(48), 'x-hc-preview-device': 'b'.repeat(32) });
    localStorage.setItem('hc_preview_session_closed', '1'); expect(clinicalRequestHeaders()).toEqual({});
  });
  it('rejects an unsupported diagnosis despite a valid citation', () => {
    const note = { subjective: [{ text: SAMPLE_VISITS[2].lines[1], lines: [2] }], objective: [], assessment: [{ text: 'Confirmed meniscus tear.', lines: [6] }], plan: [{ text: SAMPLE_VISITS[2].lines[6], lines: [7] }], flags: [] };
    expect(() => validateNoteLines(note, SAMPLE_VISITS[2].lines)).toThrow('Unsupported');
    note.assessment[0].text = SAMPLE_VISITS[2].lines[5]; expect(() => validateNoteLines(note, SAMPLE_VISITS[2].lines)).not.toThrow();
  });
  it('rejects flags with no evidence', () => {
    expect(() => validateNoteLines({ subjective: [{ text: 'sample', lines: [2] }], objective: [], assessment: [], plan: [{ text: 'sample', lines: [8] }], flags: [{ text: 'Invented allergy', lines: [] }] }, 9)).toThrow('Uncited');
  });
  it('rejects contradicted review text despite an exact quote', () => {
    expect(() => validateSources({ findings: [{ category: 'timeline', date: '2025-01-10', finding: 'No prior back pain.', sources: [{ page: 1, quote: 'Intermittent low back pain documented.' }] }], questions_for_exam: [], report_outline: [] }, true)).toThrow('Unsupported');
  });
  it('surfaces a failed read and permits retry instead of implying an empty chart', async () => {
    mock.query.mockResolvedValueOnce({ error: { message: 'denied' }, data: null }).mockResolvedValueOnce({ error: null, data: [{ id: 'fixture' }] });
    const { result } = renderHook(() => useRows('hc_patients', 'clinic'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBe(''); expect(result.current.rows).toEqual([]);
    await act(async () => { await result.current.reload(); });
    expect(result.current.error).toBe(''); expect(result.current.rows).toEqual([{ id: 'fixture' }]);
  });
  it('ignores obsolete clinic reads', async () => {
    let finish: ((value: unknown) => void) | undefined;
    mock.query.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValueOnce({ data: [{ id: 'new' }], error: null });
    const { result, rerender } = renderHook(({ clinic }) => useRows('hc_patients', clinic), { initialProps: { clinic: 'old' } });
    rerender({ clinic: 'new' }); await waitFor(() => expect(result.current.rows).toEqual([{ id: 'new' }]));
    await act(async () => { finish?.({ data: [{ id: 'old' }], error: null }); });
    expect(result.current.rows).toEqual([{ id: 'new' }]);
  });
});