import { describe, expect, it } from 'vitest';
import { addMonthsIso, ageOn, careReminders, hasDiabetes, qualitySnapshot } from '@/lib/clinical/care-reminders';
import { isJoinableRoom, pickVideoAppointment, planSignals, videoBlockReason } from '@/lib/clinical/video-visits';
import { buildHandoffPreview, claimDate, insuranceType, pointerLetter } from '@/lib/clinical/claim-handoff';
import { pilotPermissions } from '@/lib/clinical/pilot-roles';

const NOW = new Date(2026, 10, 15, 12, 0, 0); // Nov 15 2026, local time
const ids = (r: { id: string; status: string }[], status?: string) => r.filter((x) => !status || x.status === status).map((x) => x.id);

describe('care reminders follow the guideline ages', () => {
  it('computes whole-year age', () => {
    expect(ageOn('1981-11-15', NOW)).toBe(45);
    expect(ageOn('1981-11-16', NOW)).toBe(44);
    expect(ageOn(null, NOW)).toBeNull();
  });
  it('colon screening starts at 45 and stops after 75', () => {
    expect(ids(careReminders({ date_of_birth: '1981-11-15', sex: 'male' }, [], NOW))).toContain('colorectal');
    expect(ids(careReminders({ date_of_birth: '1981-11-16', sex: 'male' }, [], NOW))).not.toContain('colorectal');
    expect(ids(careReminders({ date_of_birth: '1951-11-15', sex: 'male' }, [], NOW))).toContain('colorectal'); // exactly 75
    expect(ids(careReminders({ date_of_birth: '1950-11-15', sex: 'male' }, [], NOW))).not.toContain('colorectal'); // 76
  });
  it('mammogram is for women 40 to 74 and lasts 2 years', () => {
    expect(ids(careReminders({ date_of_birth: '1986-11-15', sex: 'female' }, [], NOW))).toContain('breast');
    expect(ids(careReminders({ date_of_birth: '1987-11-16', sex: 'female' }, [], NOW))).not.toContain('breast'); // 38
    expect(ids(careReminders({ date_of_birth: '1980-01-01', sex: 'male' }, [], NOW))).not.toContain('breast');
    const recent = careReminders({ date_of_birth: '1970-01-01', sex: 'female' }, [{ record_type: 'lab_result', title: 'Screening mammogram', recorded_on: '2025-01-10' }], NOW);
    expect(recent.find((r) => r.id === 'breast')).toMatchObject({ status: 'up_to_date', dueAgain: '2027-01-10' });
    const old = careReminders({ date_of_birth: '1970-01-01', sex: 'female' }, [{ record_type: 'lab_result', title: 'Mammogram', recorded_on: '2024-11-15' }], NOW);
    expect(old.find((r) => r.id === 'breast')?.status).toBe('due');
  });
  it('cervical screening is women 21 to 65; HPV counts only from 30', () => {
    expect(ids(careReminders({ date_of_birth: '2005-11-15', sex: 'female' }, [], NOW))).toContain('cervical');
    expect(ids(careReminders({ date_of_birth: '2006-11-16', sex: 'female' }, [], NOW))).not.toContain('cervical');
    const young = careReminders({ date_of_birth: '2000-01-01', sex: 'female' }, [{ record_type: 'lab_result', title: 'HPV test', recorded_on: '2025-06-01' }], NOW);
    expect(young.find((r) => r.id === 'cervical')?.status).toBe('due');
    const older = careReminders({ date_of_birth: '1990-01-01', sex: 'female' }, [{ record_type: 'lab_result', title: 'HPV test', recorded_on: '2022-06-01' }], NOW);
    expect(older.find((r) => r.id === 'cervical')).toMatchObject({ status: 'up_to_date', dueAgain: '2027-06-01' });
  });
  it('bone density is women 65+, hepatitis C 18–79, HIV 15–65', () => {
    expect(ids(careReminders({ date_of_birth: '1961-11-15', sex: 'female' }, [], NOW))).toContain('osteoporosis');
    expect(ids(careReminders({ date_of_birth: '1962-11-16', sex: 'female' }, [], NOW))).not.toContain('osteoporosis');
    expect(ids(careReminders({ date_of_birth: '1946-11-16', sex: 'male' }, [], NOW))).toContain('hepatitis_c'); // 79
    expect(ids(careReminders({ date_of_birth: '1946-11-15', sex: 'male' }, [], NOW))).not.toContain('hepatitis_c'); // 80
    expect(ids(careReminders({ date_of_birth: '1960-11-16', sex: 'male' }, [], NOW))).toContain('hiv'); // 65
    expect(ids(careReminders({ date_of_birth: '1960-11-15', sex: 'male' }, [], NOW))).not.toContain('hiv'); // 66
  });
  it('diabetes needs A1c every 6 months and a kidney check yearly; prediabetes does not count', () => {
    expect(hasDiabetes({ conditions: ['Type 2 diabetes'] }, [])).toBe(true);
    expect(hasDiabetes({ conditions: ['Prediabetes'] }, [])).toBe(false);
    const r = careReminders({ date_of_birth: '1967-03-14', sex: 'male', conditions: ['Type 2 diabetes'] },
      [{ record_type: 'lab_result', title: 'Hemoglobin A1c', recorded_on: '2026-11-10' }], NOW);
    expect(r.find((x) => x.id === 'diabetes_a1c')).toMatchObject({ status: 'up_to_date', dueAgain: '2027-05-10' });
    expect(r.find((x) => x.id === 'diabetes_kidney')?.status).toBe('due');
    const late = careReminders({ date_of_birth: '1967-03-14', conditions: ['Type 2 diabetes'] }, [{ record_type: 'lab_result', title: 'Hemoglobin A1c', recorded_on: '2026-05-15' }], NOW);
    expect(late.find((x) => x.id === 'diabetes_a1c')?.status).toBe('due');
  });
  it('ignores records marked entered in error', () => {
    const r = careReminders({ date_of_birth: '1970-01-01', sex: 'male' }, [{ record_type: 'lab_result', title: 'HIV screen', recorded_on: '2026-01-01', status: 'entered_in_error' }], NOW);
    expect(r.find((x) => x.id === 'hiv')?.status).toBe('due');
  });
  it('adds months with month-end clamping', () => { expect(addMonthsIso('2026-08-31', 6)).toBe('2027-02-28'); });
  it('quality snapshot counts eligible and up-to-date patients', () => {
    const rows = qualitySnapshot([{ id: 'a', date_of_birth: '1970-01-01', sex: 'male' }, { id: 'b', date_of_birth: '1975-01-01', sex: 'male' }],
      [{ patient_id: 'a', record_type: 'lab_result', title: 'Colonoscopy', recorded_on: '2020-01-01' }], NOW);
    expect(rows.find((r) => r.id === 'colorectal')).toMatchObject({ eligible: 2, upToDate: 1 });
  });
});

describe('video visits', () => {
  const tele = { id: 't', visit_type: 'telehealth', status: 'scheduled', starts_at: '2026-11-15T15:00:00Z' };
  it('only test patients with an open Telehealth appointment, started by clinical staff', () => {
    expect(videoBlockReason({ is_real: true }, [tele], true)).toMatch(/test patients only/);
    expect(videoBlockReason({ is_real: false }, [tele], false)).toMatch(/owner, doctors and nurses/);
    expect(videoBlockReason({ is_real: false }, [{ ...tele, visit_type: 'follow_up' }], true)).toMatch(/Telehealth appointment/);
    expect(videoBlockReason({ is_real: false }, [{ ...tele, status: 'completed' }], true)).toMatch(/Telehealth appointment/);
    expect(videoBlockReason({ is_real: false }, [tele], true)).toBeNull();
    expect(pilotPermissions('nurse').videoVisits).toBe(true);
    expect(pilotPermissions('front_desk').videoVisits).toBe(false);
    expect(pilotPermissions('biller').videoVisits).toBe(false);
  });
  it('picks the Telehealth appointment closest to now', () => {
    const a = pickVideoAppointment([{ ...tele, id: 'far', starts_at: '2026-11-20T15:00:00Z' }, { ...tele, id: 'near', starts_at: '2026-11-15T13:00:00Z' }], new Date('2026-11-15T12:00:00Z'));
    expect(a?.id).toBe('near');
  });
  it('a room closes when ended or after expiry', () => {
    expect(isJoinableRoom({ ended_at: null, expires_at: '2026-11-15T14:00:00Z' }, new Date('2026-11-15T13:00:00Z'))).toBe(true);
    expect(isJoinableRoom({ ended_at: '2026-11-15T13:10:00Z', expires_at: '2026-11-15T14:00:00Z' }, new Date('2026-11-15T13:20:00Z'))).toBe(false);
    expect(isJoinableRoom({ ended_at: null, expires_at: '2026-11-15T14:00:00Z' }, new Date('2026-11-15T14:00:01Z'))).toBe(false);
  });
  const offer = (id: number) => ({ id, sender_side: 'clinic', kind: 'offer', payload: { type: 'offer', sdp: 'v=0' } });
  it('clinic makes one offer per patient hello and ignores its own notes', () => {
    expect(planSignals('clinic', [{ id: 1, sender_side: 'patient', kind: 'hello', payload: null }, { id: 2, sender_side: 'patient', kind: 'hello', payload: null }, offer(3)]))
      .toEqual([{ do: 'make_offer' }]);
  });
  it('patient answers only the newest offer and skips hello when an offer followed', () => {
    const plan = planSignals('patient', [{ id: 1, sender_side: 'clinic', kind: 'hello', payload: null }, offer(2), offer(4)]);
    expect(plan).toEqual([{ do: 'answer', offerId: 4, offer: { type: 'offer', sdp: 'v=0' } }]);
    expect(planSignals('patient', [{ id: 5, sender_side: 'clinic', kind: 'hello', payload: null }])).toEqual([{ do: 'send_hello' }]);
  });
  it('a goodbye counts only when nothing newer came after it', () => {
    expect(planSignals('clinic', [{ id: 1, sender_side: 'patient', kind: 'bye', payload: null }])).toEqual([{ do: 'peer_left' }]);
    expect(planSignals('clinic', [{ id: 1, sender_side: 'patient', kind: 'bye', payload: null }, { id: 2, sender_side: 'patient', kind: 'hello', payload: null }])).toEqual([{ do: 'make_offer' }]);
  });
  it('rejects malformed answers', () => {
    expect(planSignals('clinic', [{ id: 9, sender_side: 'patient', kind: 'answer', payload: { type: 'answer', sdp: 'v=0' } }])).toEqual([]);
    expect(planSignals('clinic', [{ id: 9, sender_side: 'patient', kind: 'answer', payload: { type: 'answer', sdp: 'v=0', ref: 4 } }]))
      .toEqual([{ do: 'accept_answer', ref: 4, answer: { type: 'answer', sdp: 'v=0' } }]);
  });
});

describe('billing partner hand-off preview', () => {
  const claim = { id: 'c1', service_date: '2026-11-09', payer_name: 'Blue Example Health', member_id: 'XYZ123', status: 'ready', paid_cents: null,
    diagnosis_codes: ['e11.9', 'I10'], lines: [{ code: '99214', modifier: '25', units: 1, charge_cents: 18500, dx_pointers: [1, 2] }, { code: '83036', modifier: null, units: 2, charge_cents: 2500, dx_pointers: [1] }] };
  const patient = { id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', date_of_birth: '1967-03-14', sex: 'male', address_line: '1 Example St', city: 'Chicago', state_region: 'IL', postal_code: '60628' };
  const p = buildHandoffPreview({ claim, patient, patientName: 'BELL, MARCUS', clinicName: 'Sample Clinic', signerEmail: 'dr@example.com', pos: '10' });
  const box = (b: string) => p.boxes.find((x) => x.box === b)!;
  it('maps diagnosis letters, dates and totals', () => {
    expect(pointerLetter(1)).toBe('A'); expect(pointerLetter(12)).toBe('L'); expect(pointerLetter(13)).toBe('?');
    expect(claimDate('2026-11-09')).toBe('11 09 26'); expect(claimDate('2026-11-09', true)).toBe('11 09 2026');
    expect(box('21').value).toBe('A. E11.9   B. I10');
    expect(box('3').value).toBe('03 14 1967 · M');
    expect(box('28').value).toBe('$235.00');
    expect(p.totalCents).toBe(23500);
    expect(p.lines.map((l) => [l.pointers, l.charge, l.pos])).toEqual([['AB', '$185.00', '10'], ['A', '$50.00', '10']]);
  });
  it('flags items the partner must supply instead of inventing them', () => {
    expect(box('25').missing).toBe(true);
    expect(box('33a').missing).toBe(true);
    expect(box('1a')).toMatchObject({ value: 'XYZ123' });
    expect(box('1a').missing).toBeUndefined();
    const none = buildHandoffPreview({ claim: { ...claim, member_id: null }, patient: null, patientName: 'X', pos: '11' });
    expect(none.boxes.find((x) => x.box === '1a')?.missing).toBe(true);
  });
  it('labels the payer type', () => {
    expect(insuranceType('Self-pay')).toMatch(/Self-pay/);
    expect(insuranceType('Medicare Part B')).toBe('Medicare');
    expect(insuranceType('Blue Example Health')).toBe('Group health plan');
  });
});
