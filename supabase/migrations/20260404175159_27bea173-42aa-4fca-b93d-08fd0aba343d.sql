
-- 1. Remove sensitive tables from Realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.activity_log;
ALTER PUBLICATION supabase_realtime DROP TABLE public.kayla_event_queue;

-- 2. Remove businesses and re-add with only non-sensitive columns
ALTER PUBLICATION supabase_realtime DROP TABLE public.businesses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses (
  id, owner_id, business_name, description, category, address, city, state, zip_code,
  website, logo_url, banner_url, is_verified, qr_code_id, qr_code_url,
  average_rating, review_count, created_at, updated_at, name,
  parent_business_id, location_type, location_name, location_manager_id,
  listing_status, onboarding_completed_at, is_founding_member, founding_order,
  founding_joined_at, latitude, longitude
);

-- 3. Add otp_hash column for future hashed OTP storage
ALTER TABLE public.phone_verification_otps ADD COLUMN IF NOT EXISTS otp_hash text;
COMMENT ON COLUMN public.phone_verification_otps.otp_hash IS 'SHA-256 hash of OTP code. Edge functions should store hashed OTPs here instead of plaintext otp_code.';
