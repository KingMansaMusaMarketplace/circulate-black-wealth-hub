DROP FUNCTION IF EXISTS public.search_lease_listings(
  p_city text,
  p_state text,
  p_min_rent numeric,
  p_max_rent numeric,
  p_bedrooms integer,
  p_pets boolean,
  p_section_8 boolean,
  p_available_by date,
  p_furnished boolean,
  p_limit integer,
  p_offset integer
);