
-- Remove user-facing SELECT policy - OTP validation is server-side only
DROP POLICY IF EXISTS "Users can view their own OTPs" ON public.phone_verification_otps;

-- Remove user-facing UPDATE policy - only service_role (edge functions) should update
DROP POLICY IF EXISTS "Users can update their own OTPs" ON public.phone_verification_otps;

-- Remove user-facing INSERT policy - only service_role (edge functions) should insert
DROP POLICY IF EXISTS "Users can create their own OTPs" ON public.phone_verification_otps;
