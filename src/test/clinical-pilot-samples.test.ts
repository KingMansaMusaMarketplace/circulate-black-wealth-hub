import { describe, expect, it } from 'vitest';
import { AUDIT_LABELS, SAMPLE_PATIENT_COUNT, shouldLoadSamples } from '@/lib/clinical/pilot-records';
import { readPreviewPass, signinCodeMessage } from '@/pages/health/preview-credentials';

describe('pilot sample patients', () => {
  it('every new pilot clinic starts with 3 sample patients', () => {
    expect(SAMPLE_PATIENT_COUNT).toBe(3);
  });
  it('loads samples only into a clinic that has never had a patient', () => {
    const base = { loading: false, error: null, totalPatients: 0, alreadyTried: false };
    expect(shouldLoadSamples(base)).toBe(true);
    expect(shouldLoadSamples({ ...base, totalPatients: 1 })).toBe(false);
    expect(shouldLoadSamples({ ...base, loading: true })).toBe(false);
    expect(shouldLoadSamples({ ...base, error: new Error('x') })).toBe(false);
    expect(shouldLoadSamples({ ...base, alreadyTried: true })).toBe(false);
  });
  it('the activity log names a pilot reset', () => {
    expect(AUDIT_LABELS.pilot_reset).toMatch(/reset/i);
  });
});

describe('emailed sign-in code', () => {
  it('needs a well-formed viewing pass in this browser', () => {
    localStorage.clear();
    expect(readPreviewPass()).toBeNull();
    localStorage.setItem('hc_preview_access', 'not-a-pass');
    expect(readPreviewPass()).toBeNull();
    localStorage.setItem('hc_preview_access', 'a'.repeat(48));
    const pass = readPreviewPass();
    expect(pass?.token).toBe('a'.repeat(48));
    expect(pass?.device).toMatch(/^[a-f0-9]{32}$/);
    localStorage.clear();
  });
  it('explains wrong codes with tries left', () => {
    expect(signinCodeMessage('wrong', 4)).toContain('4 tries left');
    expect(signinCodeMessage('wrong', 1)).toContain('1 try left');
    expect(signinCodeMessage('locked')).toMatch(/new code/);
  });
});
