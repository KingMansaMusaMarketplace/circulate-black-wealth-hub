-- Add missing business-related columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name VARCHAR,
ADD COLUMN IF NOT EXISTS business_description TEXT,
ADD COLUMN IF NOT EXISTS business_category VARCHAR,
ADD COLUMN IF NOT EXISTS business_website VARCHAR,
ADD COLUMN IF NOT EXISTS business_logo_url VARCHAR,
ADD COLUMN IF NOT EXISTS city VARCHAR,
ADD COLUMN IF NOT EXISTS state VARCHAR,
ADD COLUMN IF NOT EXISTS zip_code VARCHAR;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    user_type,
    full_name, 
    email
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'customer'),
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Generate referral codes for existing profiles if they don't have one
UPDATE public.profiles 
SET referral_code = UPPER(SUBSTRING(REPLACE(CAST(gen_random_uuid() AS TEXT), '-', ''), 1, 8))
WHERE referral_code IS NULL;

-- Create function to generate referral code for new profiles
CREATE OR REPLACE FUNCTION public.generate_referral_code_for_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := UPPER(SUBSTRING(REPLACE(CAST(gen_random_uuid() AS TEXT), '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to generate referral codes
DROP TRIGGER IF EXISTS generate_referral_code_trigger ON public.profiles;
CREATE TRIGGER generate_referral_code_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.generate_referral_code_for_profile();