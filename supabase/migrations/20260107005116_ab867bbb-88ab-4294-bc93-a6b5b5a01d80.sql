-- Add buffer_minutes to business_services for time between appointments
ALTER TABLE public.business_services
ADD COLUMN IF NOT EXISTS buffer_minutes integer DEFAULT 15;

COMMENT ON COLUMN public.business_services.buffer_minutes IS 'Minutes of buffer time between appointments';