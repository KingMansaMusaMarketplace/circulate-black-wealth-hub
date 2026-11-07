import { describe, expect, it } from 'vitest';
import {
  IDLE_LOCK_MINUTES, buildDashboardStats, canAddAddendum, canEditNote, dailySeries, filterChartLog,
  maskName, validateAddendum, validateVisitNote, vitalsSeries,
} from '@/lib/clinical/pilot-visit-notes';

const today = new Date('2026-11-07T12:00:00');
const note = { visit_date: '2026-11-07', visit_reason: 'Follow-up visit', subjective: 'Feels well' };

describe('pilot visit notes', () => {
  it('saves a draft without assessment and plan', () => {
    expect(validateVisitNote(note, { today })).toBeNull();
  });
  it('refuses to sign without assessment and plan', () => {
    expect(validateVisitNote(note, { forSigning: true, today })).toMatch(/Assessment and plan/);
  });
  it('signs when assessment and plan are present', () => {
    expect(validateVisitNote({ ...note, assessment: 'Stable', plan: 'Return in 3 months' }, { forSigning: true, today })).toBeNull();
  });
  it('refuses Social Security numbers in any section', () => {
    expect(validateVisitNote({ ...note, plan: 'ID 123-45-6789' }, { today })).toMatch(/Social Security/);
    expect(validateAddendum('ID 123-45-6789')).toMatch(/Social Security/);
  });
  it('refuses future visit dates', () => {
    expect(validateVisitNote({ ...note, visit_date: '2026-11-20' }, { today })).toMatch(/future/);
  });
  it('lets only the author edit a draft, and nobody edit a signed note', () => {
    expect(canEditNote({ status: 'draft', created_by: 'u1' }, 'u1')).toBe(true);
    expect(canEditNote({ status: 'draft', created_by: 'u1' }, 'u2')).toBe(false);
    expect(canEditNote({ status: 'signed', created_by: 'u1' }, 'u1')).toBe(false);
  });
  it('allows addenda only on signed notes', () => {
    expect(canAddAddendum({ status: 'signed' })).toBe(true);
    expect(canAddAddendum({ status: 'draft' })).toBe(false);
    expect(canAddAddendum({ status: 'entered_in_error' })).toBe(false);
  });
});

describe('pilot privacy and dashboard', () => {
  it('locks the screen after 10 idle minutes', () => {
    expect(IDLE_LOCK_MINUTES).toBe(10);
  });
  it('privacy mode shows initials only', () => {
    expect(maskName('Testy', 'Example')).toBe('T. E.');
  });
  it('counts tiles: active patients, visits in last 7 days, drafts, charts opened today', () => {
    const patients = [{ id: 'a' }, { id: 'b' }, { id: 'c', archived_at: '2026-11-01' }];
    const notes = [
      { visit_date: '2026-11-07', status: 'draft' },
      { visit_date: '2026-11-02', status: 'signed' },
      { visit_date: '2026-10-20', status: 'signed' },
      { visit_date: '2026-11-06', status: 'entered_in_error' },
    ];
    const audit = [
      { action: 'chart_opened', created_at: '2026-11-07T09:00:00' },
      { action: 'chart_opened', created_at: '2026-11-06T09:00:00' },
      { action: 'record_added', created_at: '2026-11-07T09:00:00' },
    ];
    expect(buildDashboardStats(patients, notes, audit, today)).toEqual({ activePatients: 2, visitsThisWeek: 2, draftNotes: 1, chartsOpenedToday: 1 });
    expect(buildDashboardStats(patients, notes, null, today).chartsOpenedToday).toBeNull();
  });
  it('builds a 14-day series ending today', () => {
    const s = dailySeries([{ created_at: '2026-11-07T08:00:00' }, { created_at: '2026-11-07T09:00:00' }], 'created_at', 14, today);
    expect(s).toHaveLength(14);
    expect(s[13]).toMatchObject({ day: '2026-11-07', count: 2 });
  });
  it('vitals trend ignores records entered in error', () => {
    const v = vitalsSeries([
      { record_type: 'vitals', status: 'active', recorded_on: '2026-11-05', bp_sys: 130, bp_dia: 85 },
      { record_type: 'vitals', status: 'entered_in_error', recorded_on: '2026-11-06', bp_sys: 200 },
      { record_type: 'vitals', status: 'active', recorded_on: '2026-11-01', bp_sys: 140, bp_dia: 90 },
    ]);
    expect(v.map((p) => p.systolic)).toEqual([140, 130]);
  });
  it('chart-opened log filters by person, patient and date', () => {
    const audit = [
      { action: 'chart_opened', actor_email: 'dr.a@clinic.test', patient_id: 'p1', created_at: '2026-11-07T10:00:00' },
      { action: 'chart_opened', actor_email: 'nurse.b@clinic.test', patient_id: 'p2', created_at: '2026-11-05T10:00:00' },
      { action: 'record_added', actor_email: 'dr.a@clinic.test', patient_id: 'p1', created_at: '2026-11-07T10:00:00' },
    ];
    expect(filterChartLog(audit, {})).toHaveLength(2);
    expect(filterChartLog(audit, { person: 'nurse' })).toHaveLength(1);
    expect(filterChartLog(audit, { patientId: 'p1' })).toHaveLength(1);
    expect(filterChartLog(audit, { from: '2026-11-06', to: '2026-11-07' })).toHaveLength(1);
  });
});
