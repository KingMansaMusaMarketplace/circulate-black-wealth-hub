ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS listing_type text NOT NULL DEFAULT 'black_owned';
ALTER TABLE public.businesses DROP CONSTRAINT IF EXISTS businesses_listing_type_check;
ALTER TABLE public.businesses ADD CONSTRAINT businesses_listing_type_check CHECK (listing_type IN ('black_owned','ally'));

-- Approved allies use their own status so every existing 'live' directory query excludes them automatically.
ALTER TABLE public.businesses DROP CONSTRAINT IF EXISTS businesses_listing_status_check;
ALTER TABLE public.businesses ADD CONSTRAINT businesses_listing_status_check
  CHECK (listing_status = ANY (ARRAY['draft','live','pending','pending_review','rejected','ally_live']));

CREATE OR REPLACE FUNCTION public.enforce_businesses_trust_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF public._sec_priv_actor() THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;
  NEW.founding_sponsor_since := OLD.founding_sponsor_since;
  NEW.is_founding_member := OLD.is_founding_member;
  NEW.founding_order := OLD.founding_order;
  NEW.founding_joined_at := OLD.founding_joined_at;
  NEW.claim_status := OLD.claim_status;
  NEW.claimed_at := OLD.claimed_at;
  NEW.listing_status := OLD.listing_status;
  NEW.listing_type := OLD.listing_type;
  NEW.listing_rejection_reason := OLD.listing_rejection_reason;
  NEW.listing_reviewed_by := OLD.listing_reviewed_by;
  NEW.listing_reviewed_at := OLD.listing_reviewed_at;
  NEW.black_owned_confidence := OLD.black_owned_confidence;
  NEW.ownership_flagged := OLD.ownership_flagged;
  NEW.ownership_reviewed_at := OLD.ownership_reviewed_at;
  NEW.average_rating := OLD.average_rating;
  NEW.review_count := OLD.review_count;
  RETURN NEW;
END $function$;

-- An ally listing can never be live in the main directory or marked verified Black-owned.
CREATE OR REPLACE FUNCTION public.enforce_ally_listing_separation()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.listing_type = 'ally' THEN
    IF NEW.listing_status = 'live' THEN NEW.listing_status := 'ally_live'; END IF;
    NEW.is_verified := false;
  ELSIF NEW.listing_status = 'ally_live' THEN
    NEW.listing_status := 'live';
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.enforce_ally_listing_separation() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS zzz_enforce_ally_listing_separation ON public.businesses;
CREATE TRIGGER zzz_enforce_ally_listing_separation
BEFORE INSERT OR UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.enforce_ally_listing_separation();

-- Public lookup for the Allies page (open to everyone, like the directory).
CREATE OR REPLACE FUNCTION public.get_ally_businesses(p_search text DEFAULT NULL, p_limit int DEFAULT 60, p_offset int DEFAULT 0)
RETURNS TABLE (id uuid, name text, category text, city text, state text, website text, phone text, logo_url text, description text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT b.id, COALESCE(b.business_name, b.name), b.category, b.city, b.state, b.website, b.phone, b.logo_url, b.description
  FROM public.businesses b
  WHERE b.listing_type = 'ally' AND b.listing_status = 'ally_live'
    AND (p_search IS NULL OR p_search = '' OR COALESCE(b.business_name, b.name) ILIKE '%' || p_search || '%' OR b.city ILIKE '%' || p_search || '%' OR b.category ILIKE '%' || p_search || '%')
  ORDER BY COALESCE(b.business_name, b.name)
  LIMIT LEAST(GREATEST(p_limit, 1), 100) OFFSET GREATEST(p_offset, 0);
$$;
REVOKE ALL ON FUNCTION public.get_ally_businesses(text, int, int) FROM public;
GRANT EXECUTE ON FUNCTION public.get_ally_businesses(text, int, int) TO anon, authenticated;