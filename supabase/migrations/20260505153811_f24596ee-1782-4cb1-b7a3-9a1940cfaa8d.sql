
ALTER TABLE public.b2b_external_leads
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending','verified','needs_review','rejected','promoted')),
  ADD COLUMN IF NOT EXISTS verification_notes jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS normalized_name text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS price_range text,
  ADD COLUMN IF NOT EXISTS website_domain text,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_phone text,
  ADD COLUMN IF NOT EXISTS verified_address text,
  ADD COLUMN IF NOT EXISTS perplexity_raw jsonb;

CREATE OR REPLACE FUNCTION public.normalize_business_name(p_name text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(coalesce(p_name,''), '\b(llc|inc|inc\.|corp|corporation|co\.|ltd|the)\b', '', 'gi'),
        '[^a-z0-9 ]', '', 'gi'),
      '\s+', ' ', 'g'));
$$;

CREATE OR REPLACE FUNCTION public.b2b_leads_normalize_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.normalized_name := public.normalize_business_name(NEW.business_name);
  IF NEW.website_url IS NOT NULL THEN
    NEW.website_domain := lower(regexp_replace(regexp_replace(NEW.website_url, '^https?://(www\.)?', ''), '/.*$', ''));
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS b2b_leads_normalize ON public.b2b_external_leads;
CREATE TRIGGER b2b_leads_normalize
BEFORE INSERT OR UPDATE OF business_name, website_url ON public.b2b_external_leads
FOR EACH ROW EXECUTE FUNCTION public.b2b_leads_normalize_trigger();

CREATE INDEX IF NOT EXISTS b2b_leads_norm_city_state_idx
  ON public.b2b_external_leads (normalized_name, lower(city), lower(state));
CREATE INDEX IF NOT EXISTS b2b_leads_domain_idx
  ON public.b2b_external_leads (website_domain);
CREATE INDEX IF NOT EXISTS b2b_leads_verification_status_idx
  ON public.b2b_external_leads (verification_status, created_at DESC);

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS normalized_name text,
  ADD COLUMN IF NOT EXISTS website_domain text;

CREATE OR REPLACE FUNCTION public.businesses_normalize_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.normalized_name := public.normalize_business_name(coalesce(NEW.business_name, NEW.name));
  IF NEW.website IS NOT NULL AND NEW.website <> '' THEN
    NEW.website_domain := lower(regexp_replace(regexp_replace(NEW.website, '^https?://(www\.)?', ''), '/.*$', ''));
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS businesses_normalize ON public.businesses;
CREATE TRIGGER businesses_normalize
BEFORE INSERT OR UPDATE OF business_name, name, website ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.businesses_normalize_trigger();

CREATE INDEX IF NOT EXISTS businesses_norm_city_state_idx
  ON public.businesses (normalized_name, lower(city), lower(state));
CREATE INDEX IF NOT EXISTS businesses_domain_idx
  ON public.businesses (website_domain);
