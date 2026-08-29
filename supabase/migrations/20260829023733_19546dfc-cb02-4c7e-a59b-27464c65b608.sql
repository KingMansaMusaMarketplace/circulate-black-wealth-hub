ALTER TABLE public.businesses DROP CONSTRAINT IF EXISTS businesses_listing_status_check;
ALTER TABLE public.businesses ADD CONSTRAINT businesses_listing_status_check
  CHECK (listing_status = ANY (ARRAY['draft'::text, 'live'::text, 'pending'::text, 'pending_review'::text, 'rejected'::text]));