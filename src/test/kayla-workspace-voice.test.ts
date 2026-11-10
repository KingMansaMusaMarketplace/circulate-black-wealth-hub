import { describe, expect, it } from 'vitest';
import { huddleScript, labReadBack, prescriptionReadBack, voiceCommand } from '@/lib/clinical/kayla-workspace-voice';

describe('Kayla workspace voice', () => {
  it('huddle speaks counts with team attribution and no names', () => {
    const s = huddleScript({ visitsToday: 8, checkedIn: 2, openLabs: 3, urgentLabs: 1, draftNotes: 1 }, 'Dr. Jones', new Date(2026, 10, 10, 8));
    expect(s).toContain('Good morning, Dr. Jones');
    expect(s).toContain('8 visits');
    expect(s).toContain('3 lab orders waiting, including 1 marked urgent');
    expect(s).toContain('1 visit note still in draft');
    expect(s).toContain('scheduling coordinator');
  });
  it('prescription read-back names dose, frequency, allergies and warnings', () => {
    const s = prescriptionReadBack({ drug_name: 'Amoxicillin', strength: '500 mg', dose: '1 capsule', route: 'by mouth', frequency: 'three times a day', quantity: '30', refills: '0' }, ['w'], []);
    expect(s).toContain('Amoxicillin 500 mg');
    expect(s).toContain('three times a day');
    expect(s).toContain('No allergies are recorded');
    expect(s).toContain('1 warning');
  });
  it('lab read-back says it is never sent', () => {
    expect(labReadBack('CBC', 'Urgent', '')).toContain('never sent to a lab');
  });
  it('hands-free commands open screens only after "Kayla, open/show"', () => {
    expect(voiceCommand('Kayla, open schedule.')).toBe('pilot-patients');
    expect(voiceCommand('Kayla show me the last lab')).toBe('pilot-patients');
    expect(voiceCommand('Kayla, go to billing')).toBe('billing');
    expect(voiceCommand('How do I dictate a note?')).toBeNull();
  });
});
