
import * as z from 'zod';

export const signupFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  referralCode: z.string().optional(),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
