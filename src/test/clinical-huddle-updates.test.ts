// Four daily huddles with patient updates (including discharges and against-medical-advice
// departures), counts only; and the visit rules for discharging or recording an AMA departure.
import { describe, expect, it } from 'vitest';
import { huddleCounts, huddleUpdates, sessionScript, updatesSentence, updatesWindow, NO_UPDATES } from '../../supabase/functions/_shared/clinical-huddle';
import { nextApptSteps, validateAmaReason } from '@/lib/clinical/scheduling';
import { pilotPermissions } from '@/lib/clinical/pilot-roles';

const c = { visitsToday: 8, checkedIn: 2, openLabs: 3, urgentLabs: 1, draftNotes: 2, completed: 4, tomorrowVisits: 6 };

describe('patient updates since the last huddle', () => {
  it('counts discharges and AMA departures closed inside the window only', () => {
    const w = { from: new Date('2026-11-11T13:00:00Z'), to: new Date('2026-11-11T19:00:00Z') };
    const inside = '2026-11-11T15:00:00Z', before = '2026-11-11T09:00:00Z';
    const u = huddleUpdates(w, [
      { status: 'discharged', created_at: before, checked_in_at: before, updated_at: inside },
      { status: 'left_ama', created_at: before, checked_in_at: inside, updated_at: inside },
      { status: 'left_ama', created_at: before, checked_in_at: before, updated_at: before },
      { status: 'scheduled', created_at: inside, checked_in_at: null, updated_at: inside },
    ], [{ status: 'active', created_at: inside, updated_at: inside }, { status: 'stopped', created_at: before, updated_at: inside }], [{ created_at: inside }]);
    expect(u).toMatchObject({ discharged: 1, leftAma: 1, booked: 1, checkedIn: 1, newPrescriptions: 1, stoppedMedicines: 1, newLabs: 1 });
  });

  it('says discharges and AMA aloud, and asks for the AMA risks discussion to be documented', () => {
    const s = updatesSentence('evening', { ...NO_UPDATES, discharged: 2, leftAma: 1 });
    expect(s).toBe('Patient updates since the 1 PM huddle: 2 patients discharged and 1 patient left against medical advice. Please review each against-medical-advice departure and confirm the risks discussion is documented in the chart.');
  });

  it('says plainly when nothing changed', () => {
    expect(updatesSentence('morning', NO_UPDATES)).toBe('No patient updates since the 11 PM huddle.');
  });

  it('each huddle covers the time since the huddle before it (Chicago clock)', () => {
    const now = new Date('2026-11-11T16:00:00Z'); // 10:00 AM in Chicago
    expect(updatesWindow('morning', 360, now).from.toISOString()).toBe('2026-11-11T05:00:00.000Z'); // 11 PM last night
    expect(updatesWindow('afternoon', 360, now).from.toISOString()).toBe('2026-11-11T13:00:00.000Z'); // 7 AM today
    expect(updatesWindow('night', 360, now).from.toISOString()).toBe('2026-11-11T01:00:00.000Z'); // 7 PM last night
  });

  it('the four huddles say different things and each includes its update', () => {
    const scripts = (['morning', 'afternoon', 'evening', 'night'] as const).map((s) => sessionScript(s, c, 9, { ...NO_UPDATES, leftAma: 1 }));
    expect(new Set(scripts).size).toBe(4);
    for (const s of scripts) expect(s).toContain('1 patient left against medical advice');
    expect(scripts[3]).toContain('6 visits booked for tomorrow');
  });

  it('discharged and AMA visits count as finished visits', () => {
    expect(huddleCounts([{ status: 'completed' }, { status: 'discharged' }, { status: 'left_ama' }, { status: 'checked_in' }], [], []).completed).toBe(3);
  });
});

describe('discharge and against-medical-advice rules', () => {
  it('doctors and nurses can discharge or record AMA; front desk cannot', () => {
    expect(nextApptSteps('checked_in', pilotPermissions('nurse').dischargePatients)).toEqual(['completed', 'discharged', 'left_ama', 'cancelled']);
    expect(nextApptSteps('checked_in', pilotPermissions('front_desk').dischargePatients)).toEqual(['completed', 'cancelled']);
    expect(nextApptSteps('discharged', true)).toEqual([]);
    expect(nextApptSteps('left_ama', true)).toEqual([]);
  });

  it('an AMA departure needs a reason of at least 3 characters and no Social Security number', () => {
    expect(validateAmaReason('')).not.toBeNull();
    expect(validateAmaReason('ok')).not.toBeNull();
    expect(validateAmaReason('Declined admission 123-45-6789')).not.toBeNull();
    expect(validateAmaReason('Declined admission after risks explained')).toBeNull();
  });
});
