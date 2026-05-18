CREATE OR REPLACE FUNCTION public.validate_lease_property_type()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.listing_mode = 'yearly_lease' THEN
    IF NEW.property_type IS NULL OR LOWER(NEW.property_type::text) NOT IN ('apartment','house','condo','loft','townhouse') THEN
      RAISE EXCEPTION 'Invalid property_type for yearly_lease. Must be one of: apartment, house, condo, loft, townhouse';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_lease_property_type ON public.vacation_properties;
CREATE TRIGGER trg_validate_lease_property_type
BEFORE INSERT OR UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.validate_lease_property_type();

CREATE OR REPLACE FUNCTION public.search_lease_listings(
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_min_rent NUMERIC DEFAULT NULL,
  p_max_rent NUMERIC DEFAULT NULL,
  p_bedrooms INTEGER DEFAULT NULL,
  p_pets BOOLEAN DEFAULT NULL,
  p_section_8 BOOLEAN DEFAULT NULL,
  p_available_by DATE DEFAULT NULL,
  p_furnished BOOLEAN DEFAULT NULL,
  p_property_type TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
) RETURNS SETOF public.vacation_properties
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT *
  FROM public.vacation_properties
  WHERE listing_mode = 'yearly_lease'
    AND is_active = true
    AND (p_city IS NULL OR city ILIKE '%' || p_city || '%')
    AND (p_state IS NULL OR state ILIKE p_state)
    AND (p_min_rent IS NULL OR monthly_rent >= p_min_rent)
    AND (p_max_rent IS NULL OR monthly_rent <= p_max_rent)
    AND (p_bedrooms IS NULL OR bedrooms >= p_bedrooms)
    AND (p_pets IS NULL OR pets_allowed = p_pets)
    AND (p_section_8 IS NULL OR section_8_accepted = p_section_8)
    AND (p_available_by IS NULL OR available_from <= p_available_by)
    AND (p_furnished IS NULL OR furnished = p_furnished)
    AND (p_property_type IS NULL OR LOWER(property_type::text) = LOWER(p_property_type))
  ORDER BY is_verified DESC, created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;