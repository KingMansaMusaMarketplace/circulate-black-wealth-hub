import { z } from 'zod';

export const pilotRequestSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name.').max(120),
  work_email: z.string().trim().email('Enter a valid email.').max(255),
  phone: z.string().trim().min(7, 'Enter your phone number.').max(40),
  role: z.string().trim().min(2, 'Enter your role.').max(80),
  specialty: z.string().trim().min(2, 'Enter your specialty.').max(80),
  organization: z.string().trim().min(2, 'Enter your practice or hospital name.').max(160),
  practice_location: z.string().trim().min(2, 'Enter your city and state or country.').max(120),
  npi: z.string().trim().regex(/^([0-9]{10})?$/, 'NPI must be 10 digits, or leave it blank.'),
});
export type PilotForm = z.infer<typeof pilotRequestSchema>;
