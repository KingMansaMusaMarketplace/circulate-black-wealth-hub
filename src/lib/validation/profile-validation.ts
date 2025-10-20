import { z } from 'zod';

// Profile validation schema
export const profileCreationSchema = z.object({
  id: z.string().uuid(),
  user_type: z.enum(['customer', 'business', 'sponsor', 'sales_agent']),
  full_name: z.string().trim().min(1).max(200),
  email: z.string().email().max(255),
  phone: z.string().trim().max(50).optional().default(''),
  address: z.string().trim().max(500).optional().default(''),
  subscription_status: z.string().trim().max(50),
  subscription_tier: z.string().trim().max(50),
  subscription_start_date: z.string().datetime(),
  subscription_end_date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

// Business creation schema
export const businessCreationSchema = z.object({
  owner_id: z.string().uuid(),
  business_name: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().default(''),
  address: z.string().trim().max(500).optional().default(''),
  phone: z.string().trim().max(50).optional().default(''),
  email: z.string().email().max(255).optional().default(''),
  category: z.string().trim().max(100),
  subscription_status: z.string().trim().max(50),
  subscription_start_date: z.string().datetime(),
  subscription_end_date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

// Sponsor creation schema
export const sponsorCreationSchema = z.object({
  user_id: z.string().uuid(),
  company_name: z.string().trim().min(1).max(200),
  contact_name: z.string().trim().max(200),
  contact_title: z.string().trim().max(100).optional().default(''),
  email: z.string().email().max(255),
  phone: z.string().trim().max(50).optional().default(''),
  company_address: z.string().trim().max(500).optional().default(''),
  company_city: z.string().trim().max(100).optional().default(''),
  company_state: z.string().trim().max(50).optional().default(''),
  company_zip_code: z.string().trim().max(20).optional().default(''),
  company_website: z.string().url().max(255).optional().or(z.literal('')).default(''),
  industry: z.string().trim().max(100).optional().default(''),
  company_size: z.string().trim().max(50).optional().default(''),
  sponsorship_tier: z.string().trim().max(50),
  message: z.string().trim().max(1000).optional().default(''),
  subscription_status: z.string().trim().max(50),
  subscription_start_date: z.string().datetime(),
  subscription_end_date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

// Validation functions
export const validateProfileCreation = (data: unknown) => {
  return profileCreationSchema.parse(data);
};

export const validateBusinessCreation = (data: unknown) => {
  return businessCreationSchema.parse(data);
};

export const validateSponsorCreation = (data: unknown) => {
  return sponsorCreationSchema.parse(data);
};

// Safe validation functions (returns result object instead of throwing)
export const safeValidateProfileCreation = (data: unknown) => {
  return profileCreationSchema.safeParse(data);
};

export const safeValidateBusinessCreation = (data: unknown) => {
  return businessCreationSchema.safeParse(data);
};

export const safeValidateSponsorCreation = (data: unknown) => {
  return sponsorCreationSchema.safeParse(data);
};
