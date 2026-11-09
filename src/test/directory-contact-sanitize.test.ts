import { describe, it, expect } from 'vitest';
import { displayPhone, displayWebsite } from '@/lib/directory/contact-sanitize';

describe('directory placeholder contacts', () => {
  it('hides 555-01xx phones', () => {
    expect(displayPhone('(312) 555-0142')).toBe('');
    expect(displayPhone('+1 773-555-0199')).toBe('');
  });
  it('keeps real phones', () => {
    expect(displayPhone('1-312-900-6004')).toBe('1-312-900-6004');
    expect(displayPhone('(312) 555-1234')).toBe('(312) 555-1234');
  });
  it('hides example.com websites', () => {
    expect(displayWebsite('https://www.example.com/shop')).toBe('');
    expect(displayWebsite('https://harpervine.com')).toBe('https://harpervine.com');
  });
});
