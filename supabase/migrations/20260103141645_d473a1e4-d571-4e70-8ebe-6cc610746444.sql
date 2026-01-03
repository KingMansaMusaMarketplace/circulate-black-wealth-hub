-- Add profile completion tracking fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Add listing status to businesses table for draft/live workflow
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS listing_status TEXT DEFAULT 'draft' CHECK (listing_status IN ('draft', 'live', 'pending')),
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Create function to calculate profile completion percentage
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(profile_row public.profiles)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  completion INTEGER := 0;
  total_fields INTEGER := 5;
BEGIN
  -- Each field adds to completion
  IF profile_row.full_name IS NOT NULL AND profile_row.full_name != '' THEN
    completion := completion + 1;
  END IF;
  
  IF profile_row.phone IS NOT NULL AND profile_row.phone != '' THEN
    completion := completion + 1;
  END IF;
  
  IF profile_row.address IS NOT NULL AND profile_row.address != '' THEN
    completion := completion + 1;
  END IF;
  
  IF profile_row.avatar_url IS NOT NULL AND profile_row.avatar_url != '' THEN
    completion := completion + 1;
  END IF;
  
  IF profile_row.city IS NOT NULL AND profile_row.city != '' THEN
    completion := completion + 1;
  END IF;
  
  RETURN (completion * 100) / total_fields;
END;
$$;

-- Create trigger to auto-update profile completion percentage
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.profile_completion_percentage := public.calculate_profile_completion(NEW);
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_update_profile_completion ON public.profiles;
CREATE TRIGGER trigger_update_profile_completion
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_completion();