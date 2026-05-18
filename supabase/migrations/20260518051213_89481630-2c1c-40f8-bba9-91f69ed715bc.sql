CREATE OR REPLACE FUNCTION public.validate_lease_property_type()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.listing_mode = 'yearly_lease' AND NEW.property_type::text NOT IN
    ('apartment','house','condo','loft','townhouse','office_space','warehouse') THEN
    RAISE EXCEPTION 'Invalid property_type for yearly_lease. Must be one of: apartment, house, condo, loft, townhouse, office_space, warehouse';
  END IF;
  RETURN NEW;
END;
$$;