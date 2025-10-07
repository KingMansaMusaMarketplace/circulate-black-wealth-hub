-- Update the app_role enum to include all application roles
-- First, add the new values to the enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'business';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales_agent';

-- Update the grant_role and revoke_role functions to use the updated enum
-- (They already reference app_role, so no changes needed to function signatures)