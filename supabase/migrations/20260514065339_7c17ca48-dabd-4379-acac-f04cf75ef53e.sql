
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS slug text;

CREATE OR REPLACE FUNCTION public.slugify(input text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT trim(both '-' from
    regexp_replace(regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g')
  );
$$;

CREATE OR REPLACE FUNCTION public.build_business_slug(p_name text, p_city text, p_id uuid)
RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE base text; city_part text; id_suffix text;
BEGIN
  base := public.slugify(coalesce(nullif(p_name,''), 'business'));
  city_part := public.slugify(coalesce(p_city,''));
  IF city_part <> '' AND position(city_part in base) = 0 THEN
    base := base || '-' || city_part;
  END IF;
  IF length(base) > 80 THEN
    base := trim(both '-' from substring(base from 1 for 80));
  END IF;
  id_suffix := substring(replace(p_id::text,'-','') from 1 for 6);
  RETURN base || '-' || id_suffix;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_business_slug()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.build_business_slug(coalesce(NEW.name, NEW.business_name), NEW.city, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_business_slug ON public.businesses;
CREATE TRIGGER trg_set_business_slug
BEFORE INSERT OR UPDATE OF name, business_name, city ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.set_business_slug();

CREATE UNIQUE INDEX IF NOT EXISTS businesses_slug_unique_idx
ON public.businesses (slug) WHERE slug IS NOT NULL;

DROP FUNCTION IF EXISTS public.get_directory_business_by_id(uuid);

CREATE OR REPLACE FUNCTION public.get_directory_business_by_id(p_business_id uuid)
RETURNS TABLE(id uuid, slug text, business_name text, name text, description text, category text, address text, city text, state text, zip_code text, phone text, email text, website text, logo_url text, banner_url text, is_verified boolean, is_founding_sponsor boolean, average_rating numeric, review_count integer, location_type text, location_name text, latitude double precision, longitude double precision, listing_status text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.slug::text, b.business_name::text, b.name::text, b.description::text, b.category::text,
    b.address::text, b.city::text, b.state::text, b.zip_code::text, b.phone::text, b.email::text,
    b.website::text, b.logo_url::text, b.banner_url::text, b.is_verified, b.is_founding_sponsor,
    b.average_rating, b.review_count, b.location_type::text, b.location_name::text,
    b.latitude::double precision, b.longitude::double precision, b.listing_status::text, b.created_at, b.updated_at
  FROM public.businesses b
  WHERE b.id = p_business_id AND (b.is_verified = true OR b.listing_status = 'live');
END;
$$;

CREATE OR REPLACE FUNCTION public.get_directory_business_by_slug(p_slug text)
RETURNS TABLE(id uuid, slug text, business_name text, name text, description text, category text, address text, city text, state text, zip_code text, phone text, email text, website text, logo_url text, banner_url text, is_verified boolean, is_founding_sponsor boolean, average_rating numeric, review_count integer, location_type text, location_name text, latitude double precision, longitude double precision, listing_status text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.slug::text, b.business_name::text, b.name::text, b.description::text, b.category::text,
    b.address::text, b.city::text, b.state::text, b.zip_code::text, b.phone::text, b.email::text,
    b.website::text, b.logo_url::text, b.banner_url::text, b.is_verified, b.is_founding_sponsor,
    b.average_rating, b.review_count, b.location_type::text, b.location_name::text,
    b.latitude::double precision, b.longitude::double precision, b.listing_status::text, b.created_at, b.updated_at
  FROM public.businesses b
  WHERE b.slug = p_slug AND (b.is_verified = true OR b.listing_status = 'live') LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_directory_business_by_slug(text) TO anon, authenticated;
