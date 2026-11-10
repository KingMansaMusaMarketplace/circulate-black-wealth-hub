import { describe, it, expect } from 'vitest';
import { pilotRequestSchema } from '@/pages/health/pilot-signup';

const ok = { full_name: 'Dr. Test', work_email: 'doc@example.org', phone: '3125550000', role: 'Physician', specialty: 'Family Medicine', organization: 'Test Clinic', practice_location: 'Chicago, IL', npi: '' };

describe('pilot doctor sign-up', () => {
  it('accepts a complete request with NPI left blank', () => {
    expect(pilotRequestSchema.safeParse(ok).success).toBe(true);
  });
  it('rejects an NPI that is not 10 digits', () => {
    expect(pilotRequestSchema.safeParse({ ...ok, npi: '12345' }).success).toBe(false);
  });
  it('requires a specialty', () => {
    expect(pilotRequestSchema.safeParse({ ...ok, specialty: '' }).success).toBe(false);
  });
});
