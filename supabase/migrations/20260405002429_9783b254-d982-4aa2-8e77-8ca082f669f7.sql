-- Remove plaintext OTP storage - only keep the hashed version
ALTER TABLE public.phone_verification_otps DROP COLUMN otp_code;

-- Make otp_hash NOT NULL since it's now the only verification column
ALTER TABLE public.phone_verification_otps ALTER COLUMN otp_hash SET NOT NULL;