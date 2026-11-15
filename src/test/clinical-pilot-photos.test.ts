import { describe, expect, it } from 'vitest';
import { photoDisplay, photoInitials, photoKey, samplePhotoKey, validatePhotoChoice } from '@/lib/clinical/pilot-photos';

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

describe('pilot sample-face gallery', () => {
  const typed = { first_name: 'Jane', last_name: 'Test', is_sample: false, is_real: false };
  it('lets a typed-in test patient show one of the eight bundled faces', () => {
    expect(photoKey({ ...typed, photo_choice: 'face-03' })).toBe('face-03');
    expect(photoDisplay({ ...typed, photo_choice: 'face-08' }, false)).toBe('photo');
    expect(photoDisplay({ ...typed, photo_choice: 'face-08' }, true)).toBe('hidden');
  });
  it('never shows a gallery face for a real patient, even if one were saved', () => {
    expect(photoKey({ ...typed, is_real: true, photo_choice: 'face-01' })).toBeNull();
    expect(validatePhotoChoice('face-01', true)).toBe('Real patients cannot be given a sample face.');
  });
  it('only accepts face-01 to face-08', () => {
    expect(validatePhotoChoice('face-09', false)).toBe('Choose one of the sample faces.');
    expect(validatePhotoChoice('https://example.com/me.jpg', false)).toBe('Choose one of the sample faces.');
    expect(photoKey({ ...typed, photo_choice: 'face-09' })).toBeNull();
    expect(validatePhotoChoice(null, true)).toBeNull();
  });
  it('keeps the fixed sample face ahead of any gallery choice', () => {
    expect(photoKey({ ...marcus, photo_choice: 'face-02' })).toBe('marcus-bell');
  });
});
