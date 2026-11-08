import { describe, expect, it } from 'vitest';
import { findConflict, nextApptSteps, validateAppointment, validateCancelReason } from '@/lib/clinical/scheduling';
import {
  claimTotalCents, dollarsToCents, formatCents, nextClaimSteps, summarizeClaims, validateClaimDraft, validatePaidAmount,
} from '@/lib/clinical/practice-billing';
import { unreadFor, validatePortalMessage } from '@/lib/clinical/patient-portal';
import { boostInsights, isSandboxServer, latestCreatinine, BOOST_SANDBOX_ISS } from '@/lib/clinical/boost-smart';
import { pilotPermissions } from '@/lib/clinical/pilot-roles';
import { summarizeMilestones } from '@/lib/clinical/compliance-milestones';

const now = new Date('2026-11-09T12:00:00');

describe('scheduling', () => {
  it('blocks double-booking the same provider', () => {
    const existing = [{ id: 'a', provider_id: 'doc', starts_at: '2026-11-10T15:00:00.000Z', duration_min: 30, status: 'scheduled' }];
    expect(findConflict(existing, { provider_id: 'doc', starts_at: '2026-11-10T15:20:00.000Z', duration_min: 20, status: 'scheduled' })).not.toBeNull();
    expect(findConflict(existing, { provider_id: 'doc', starts_at: '2026-11-10T15:30:00.000Z', duration_min: 20, status: 'scheduled' })).toBeNull();
    expect(findConflict(existing, { provider_id: 'nurse', starts_at: '2026-11-10T15:00:00.000Z', duration_min: 20, status: 'scheduled' })).toBeNull();
  });
  it('ignores cancelled appointments when checking overlap', () => {
    const existing = [{ id: 'a', provider_id: 'doc', starts_at: '2026-11-10T15:00:00.000Z', duration_min: 30, status: 'cancelled' }];
    expect(findConflict(existing, { provider_id: 'doc', starts_at: '2026-11-10T15:00:00.000Z', duration_min: 30, status: 'scheduled' })).toBeNull();
  });
  it('allows booked → checked in → done, and closes after', () => {
    expect(nextApptSteps('scheduled')).toEqual(['checked_in', 'no_show', 'cancelled']);
    expect(nextApptSteps('checked_in')).toEqual(['completed', 'cancelled']);
    expect(nextApptSteps('completed')).toEqual([]);
  });
  it('rejects bookings more than a day in the past and requires a cancel reason', () => {
    const base = { patient_id: 'p', provider_id: 'd', time: '09:00', duration_min: 20, visit_type: 'follow_up', reason: '' };
    expect(validateAppointment({ ...base, date: '2026-11-07' }, now)).toMatch(/past/);
    expect(validateAppointment({ ...base, date: '2026-11-10' }, now)).toBeNull();
    expect(validateCancelReason('no')).toMatch(/reason/);
  });
});

describe('practice billing', () => {
  const line = { code: '99213', modifier: null, units: 1, charge_cents: 12500, dx_pointers: [1] };
  it('validates ICD-10 and CPT formats and links', () => {
    expect(validateClaimDraft({ payer_name: 'Self-pay', member_id: null, diagnosis_codes: ['E11.9'], lines: [line] })).toBeNull();
    expect(validateClaimDraft({ payer_name: 'Self-pay', member_id: null, diagnosis_codes: ['diabetes'], lines: [line] })).toMatch(/ICD-10/);
    expect(validateClaimDraft({ payer_name: 'Self-pay', member_id: null, diagnosis_codes: ['E11.9'], lines: [{ ...line, code: '9921' }] })).toMatch(/CPT/);
    expect(validateClaimDraft({ payer_name: 'Self-pay', member_id: null, diagnosis_codes: ['E11.9'], lines: [{ ...line, dx_pointers: [2] }] })).toMatch(/listed codes/);
  });
  it('needs a diagnosis and a charge before marking ready', () => {
    expect(validateClaimDraft({ payer_name: 'Self-pay', member_id: null, diagnosis_codes: [], lines: [] }, { ready: true })).toMatch(/before marking/);
  });
  it('totals units × charge and parses dollars', () => {
    expect(claimTotalCents([line, { ...line, code: '36415', units: 2, charge_cents: 1500 }])).toBe(15500);
    expect(dollarsToCents('$1,250.50')).toBe(125050);
    expect(dollarsToCents('12.345')).toBeNull();
    expect(formatCents(15500)).toBe('$155.00');
  });
  it('paid amount cannot exceed the claim total', () => {
    expect(validatePaidAmount(15600, 15500)).not.toBeNull();
    expect(validatePaidAmount(9000, 15500)).toBeNull();
  });
  it('follows draft → ready → sent → paid/denied steps', () => {
    expect(nextClaimSteps('draft')).toEqual(['ready', 'void']);
    expect(nextClaimSteps('practice_submitted')).toEqual(['practice_paid', 'practice_denied', 'void']);
    expect(nextClaimSteps('practice_paid')).toEqual([]);
  });
  it('leaves void claims out of money totals', () => {
    const s = summarizeClaims([
      { status: 'practice_paid', total_cents: 10000, paid_cents: 8000 },
      { status: 'practice_submitted', total_cents: 5000, paid_cents: null },
      { status: 'void', total_cents: 99999, paid_cents: null },
    ]);
    expect(s.billed).toBe(15000); expect(s.paid).toBe(8000); expect(s.waiting).toBe(5000); expect(s.counts.void).toBe(1);
  });
});

describe('patient portal', () => {
  it('counts unread per side', () => {
    const m = [{ sender_kind: 'patient', read_by_clinic_at: null }, { sender_kind: 'clinic', read_by_patient_at: null }, { sender_kind: 'patient', read_by_clinic_at: 'x' }];
    expect(unreadFor('clinic', m)).toBe(1);
    expect(unreadFor('patient', m)).toBe(1);
  });
  it('rejects empty, too long and SSN messages', () => {
    expect(validatePortalMessage('  ')).not.toBeNull();
    expect(validatePortalMessage('x'.repeat(2001))).not.toBeNull();
    expect(validatePortalMessage('my ssn 123-45-6789')).toMatch(/Social Security/);
  });
});

describe('roles for phase 2', () => {
  it('front desk books and runs the portal but cannot bill; biller bills but cannot book', () => {
    const fd = pilotPermissions('front_desk'); const b = pilotPermissions('biller'); const n = pilotPermissions('nurse');
    expect([fd.bookAppointments, fd.portalTeam, fd.workClaims, fd.useBoost]).toEqual([true, true, false, false]);
    expect([b.bookAppointments, b.portalTeam, b.workClaims]).toEqual([false, false, true]);
    expect([n.workClaims, n.useBoost]).toEqual([false, true]);
  });
});

describe('BOOST sandbox', () => {
  it('only accepts the fixed public sandbox', () => {
    expect(isSandboxServer(BOOST_SANDBOX_ISS)).toBe(true);
    expect(isSandboxServer('https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4')).toBe(true);
    expect(isSandboxServer('https://evil.example.com/fhir')).toBe(false);
    expect(isSandboxServer('https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/x')).toBe(false);
  });
  it('computes race-free eGFR from the newest creatinine and flags interactions once', () => {
    const cr = latestCreatinine([
      { resourceType: 'Observation', code: { coding: [{ code: '2160-0' }] }, valueQuantity: { value: 2.0, unit: 'mg/dL' }, effectiveDateTime: '2020-01-01' },
      { resourceType: 'Observation', code: { coding: [{ code: '2160-0' }] }, valueQuantity: { value: 1.0, unit: 'mg/dL' }, effectiveDateTime: '2024-06-01T10:00:00Z' },
    ]);
    expect(cr?.value).toBe(1.0);
    const out = boostInsights({ birthDate: '1974-06-01', gender: 'female', medicines: ['warfarin 5 mg', 'ibuprofen 400 mg'], allergies: [], creatinine: cr });
    expect('egfr' in out.egfr && out.egfr.egfr).toBe(69);
    expect(out.medicineWarnings.filter((w) => w.includes('Interaction')).length).toBe(1);
  });
});

describe('outside approvals tracker', () => {
  it('leaves "not needed yet" out of the total', () => {
    const s = summarizeMilestones([{ status: 'passed', target_date: null }, { status: 'not_needed_yet', target_date: null }, { status: 'in_progress', target_date: '2026-01-01' }], now);
    expect(s).toMatchObject({ total: 2, done: 1, overdue: 1 });
  });
});
