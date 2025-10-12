
import { z } from 'zod';

export const signupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  referralCode: z.string().optional(),
  isHBCUMember: z.boolean().default(false),
  confirmPassword: z.string().optional(),
  user_type: z.enum(['customer', 'business']).optional(),
  // Business-specific fields
  business_name: z.string().optional(),
  business_description: z.string().optional(),
  business_address: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  // Updated subscription tier to support all tiers
  subscription_tier: z.enum(['free', 'business_starter', 'business', 'business_multi_location', 'enterprise']).optional()
}).superRefine((data, ctx) => {
  // Make phone required for business signups
  if (data.user_type === 'business' && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Phone number is required for business accounts',
      path: ['phone']
    });
  }
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
