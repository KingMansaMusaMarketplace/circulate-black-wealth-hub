import { describe, expect, it } from 'vitest';
import { photoDisplay, photoInitials, samplePhotoKey } from '@/lib/clinical/pilot-photos';

const marcus = { first_name: 'Marcus', last_name: 'Bell', is_sample: true, is_real: false };

describe('pilot patient photos', () => {
  it('gives the three fixed made-up samples a bundled face', () => {
    expect(samplePhotoKey(marcus)).toBe('marcus-bell');
    expect(samplePhotoKey({ first_name: 'Alicia', last_name: 'Grant', is_sample: true })).toBe('alicia-grant');
    expect(samplePhotoKey({ first_name: 'Harold', last_name: 'Jenkins', is_sample: true })).toBe('harold-jenkins');
  });
  it('never shows a face for typed-in test patients or real patients, even with a sample name', () => {
    expect(samplePhotoKey({ ...marcus, is_sample: false })).toBeNull();
    expect(samplePhotoKey({ ...marcus, is_real: true })).toBeNull();
    expect(photoDisplay({ ...marcus, is_real: true }, false)).toBe('placeholder');
  });
  it('hides the sample face whenever names are hidden', () => {
    expect(photoDisplay(marcus, true)).toBe('hidden');
    expect(photoDisplay(marcus, false)).toBe('photo');
  });
  it('uses initials for the placeholder', () => {
    expect(photoInitials({ first_name: 'jane', last_name: 'doe' })).toBe('JD');
  });
});
