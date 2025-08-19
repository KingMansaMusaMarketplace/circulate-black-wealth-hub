-- Create user profiles table with business/customer distinction
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type VARCHAR NOT NULL CHECK (user_type IN ('customer', 'business')),
  full_name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  avatar_url VARCHAR,
  address VARCHAR,
  city VARCHAR,
  state VARCHAR,
  zip_code VARCHAR,
  
  -- Business-specific fields
  business_name VARCHAR,
  business_description TEXT,
  business_category VARCHAR,
  business_website VARCHAR,
  business_logo_url VARCHAR,
  
  -- Customer-specific fields
  is_hbcu_member BOOLEAN DEFAULT false,
  hbcu_verification_status hbcu_verification_status DEFAULT NULL,
  
  -- Subscription and engagement tracking
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_status VARCHAR DEFAULT 'active',
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
  
  -- Referral system
  referred_by UUID REFERENCES public.profiles(id),
  referral_code TEXT UNIQUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Generate referral codes for existing profiles if any
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
CREATE TRIGGER generate_referral_code_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.generate_referral_code_for_profile();