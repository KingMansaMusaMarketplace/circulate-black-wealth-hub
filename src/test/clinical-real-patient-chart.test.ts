import { describe, expect, it } from 'vitest';
import {
  REAL_PATIENT_IDLE_LOCK_MINUTES, REAL_SIGN_PASSWORD_WINDOW_SECONDS, chartWritable, dictationAllowed, idleLockMinutes,
  latestLabs, validateChartExtras, validateStopMedicine,
} from '@/lib/clinical/real-patient-chart';
import { validatePilotRecord } from '@/lib/clinical/pilot-records';
import { IDLE_LOCK_MINUTES, filterChartLog } from '@/lib/clinical/pilot-visit-notes';

const today = new Date('2026-11-08T12:00:00');

describe('real-patient chart timer', () => {
  it('locks a real-patient chart after 5 idle minutes', () => {
    expect(REAL_PATIENT_IDLE_LOCK_MINUTES).toBe(5);
    expect(idleLockMinutes(true, IDLE_LOCK_MINUTES)).toBe(5);
  });
  it('keeps the test-patient timer unchanged', () => {
    expect(idleLockMinutes(false, IDLE_LOCK_MINUTES)).toBe(IDLE_LOCK_MINUTES);
  });
  it('requires a password sign-in within 10 minutes to sign a real-patient note', () => {
    expect(REAL_SIGN_PASSWORD_WINDOW_SECONDS).toBe(600);
  });
});

describe('real-patient chart is only writable while go-live is unlocked', () => {
  it('real patient, unlocked → writable', () => expect(chartWritable(true, true)).toBe(true));
  it('real patient, locked → read only', () => expect(chartWritable(true, false)).toBe(false));
  it('real patient, status still loading → read only', () => expect(chartWritable(true, null)).toBe(false));
  it('test patient → always writable', () => expect(chartWritable(false, false)).toBe(true));
});

describe('talk-to-type', () => {
  it('is off for real patients', () => expect(dictationAllowed(true)).toBe(false));
  it('stays on for test patients', () => expect(dictationAllowed(false)).toBe(true));
});

describe('real-patient entry rules', () => {
  it('real lab results need a value', () => {
    expect(validateChartExtras({ record_type: 'lab_result', lab_value: '' }, { real: true })).toMatch(/result value/);
    expect(validateChartExtras({ record_type: 'lab_result', lab_value: '7.2' }, { real: true })).toBeNull();
  });
  it('test lab results may skip the value', () => {
    expect(validateChartExtras({ record_type: 'lab_result' }, { real: false })).toBeNull();
  });
  it('real allergies need a severity', () => {
    expect(validateChartExtras({ record_type: 'allergy' }, { real: true })).toMatch(/severity/);
    expect(validateChartExtras({ record_type: 'allergy', allergy_severity: 'unknown' }, { real: true })).toBeNull();
  });
  it('rejects an invented severity or lab flag', () => {
    expect(validateChartExtras({ record_type: 'allergy', allergy_severity: 'extreme' }, { real: false })).toMatch(/severity/);
    expect(validateChartExtras({ record_type: 'lab_result', lab_flag: 'weird' }, { real: false })).toMatch(/flag/);
  });
  it('blocks Social Security numbers in lab fields', () => {
    expect(validatePilotRecord({ record_type: 'lab_result', recorded_on: '2026-11-01', title: 'A1C', lab_value: '123-45-6789' }, today, { real: true })).toMatch(/Social Security/);
  });
});

describe('stopping a medicine', () => {
  it('needs a reason of 3+ characters', () => {
    expect(validateStopMedicine({ started_on: '2026-10-01', stopped_on: '2026-11-01', reason: 'no' }, today)).toMatch(/reason/);
    expect(validateStopMedicine({ started_on: '2026-10-01', stopped_on: '2026-11-01', reason: 'Side effects' }, today)).toBeNull();
  });
  it('cannot stop before it started', () => {
    expect(validateStopMedicine({ started_on: '2026-10-01', stopped_on: '2026-09-01', reason: 'Side effects' }, today)).toMatch(/Stop date/);
  });
});

describe('latest lab results', () => {
  it('shows only the newest active result per test', () => {
    const rows = [
      { id: 'a', record_type: 'lab_result', status: 'active', title: 'A1C', recorded_on: '2026-09-01', created_at: '1' },
      { id: 'b', record_type: 'lab_result', status: 'active', title: 'a1c', recorded_on: '2026-11-01', created_at: '2' },
      { id: 'c', record_type: 'lab_result', status: 'entered_in_error', title: 'LDL', recorded_on: '2026-11-02', created_at: '3' },
    ];
    expect(latestLabs(rows).map((r) => r.id)).toEqual(['b']);
  });
});

describe('chart-opened log separates real and test patients', () => {
  const audit = [
    { action: 'chart_opened', patient_id: 'real1', created_at: '2026-11-07T10:00:00' },
    { action: 'chart_opened', patient_id: 'test1', created_at: '2026-11-07T11:00:00' },
  ];
  const isReal = (id: string) => id === 'real1';
  it('real only', () => expect(filterChartLog(audit, { kind: 'real', isReal }).map((a) => a.patient_id)).toEqual(['real1']));
  it('test only', () => expect(filterChartLog(audit, { kind: 'test', isReal }).map((a) => a.patient_id)).toEqual(['test1']));
});
