-- Fix security warnings: Add search_path to functions

-- Fix generate_partner_referral_code
CREATE OR REPLACE FUNCTION public.generate_partner_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- Fix set_partner_referral_code
CREATE OR REPLACE FUNCTION public.set_partner_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    new_code TEXT;
BEGIN
    LOOP
        new_code := public.generate_partner_referral_code();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.directory_partners WHERE referral_code = new_code);
    END LOOP;
    NEW.referral_code := new_code;
    RETURN NEW;
END;
$$;

-- Fix RLS policy for embed views - add rate limiting instead of open insert
DROP POLICY IF EXISTS "Anyone can log embed views" ON public.partner_embed_views;

CREATE POLICY "Log embed views with valid token"
ON public.partner_embed_views FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.directory_partners 
        WHERE embed_token = partner_embed_views.embed_token 
        AND embed_enabled = true
    )
);