-- Remove tables from realtime publication that have no client-side subscribers
-- This prevents unnecessary data broadcast and resolves the topic authorization mismatch
ALTER PUBLICATION supabase_realtime DROP TABLE public.kayla_business_insights;
ALTER PUBLICATION supabase_realtime DROP TABLE public.qr_scans;