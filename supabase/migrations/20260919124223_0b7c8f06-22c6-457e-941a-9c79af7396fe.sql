-- 1. Columns
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS category_group text;

-- 2. Category grouping function (50 groups)
CREATE OR REPLACE FUNCTION public.resolve_category_group(p_category text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN c IS NULL OR btrim(c) = '' THEN 'Professional & Other Services'
    WHEN c ~* 'barber' THEN 'Barbershops'
    WHEN c ~* '(hair|braid|loc(s|tician)|weave|wig|extension)' THEN 'Hair Salons'
    WHEN c ~* '(nail|manicure|pedicure|lash|brow)' THEN 'Nail & Lash'
    WHEN c ~* '(spa|massage|skin|esthetic|facial|waxing)' THEN 'Skin, Spa & Massage'
    WHEN c ~* '(cosmetic|makeup|beauty supply|beauty product|perfume|soap|shea)' THEN 'Beauty & Cosmetics'
    WHEN c ~* '(bakery|baker|cake|pastry|dessert|ice cream|candy|chocolat|donut|cookie)' THEN 'Bakeries & Desserts'
    WHEN c ~* '(caterer|catering|food truck|meal prep|personal chef)' THEN 'Catering & Food Trucks'
    WHEN c ~* '(bar |lounge|nightclub|night club|brewery|winery|distiller|cocktail|hookah|pub)' THEN 'Bars & Nightlife'
    WHEN c ~* '(coffee|cafe|caf\u00e9|tea house|juice|smoothie|bubble tea)' THEN 'Coffee, Tea & Juice'
    WHEN c ~* '(grocer|market|butcher|seafood market|deli|convenience store|farmers market)' THEN 'Grocery & Markets'
    WHEN c ~* '(restaurant|soul food|bbq|barbecue|pizzer|diner|eatery|grill|kitchen|cuisine|food service|takeout|carryout)' THEN 'Restaurants & Food'
    WHEN c ~* '(dentist|dental|orthodont|endodont|periodont)' THEN 'Dental'
    WHEN c ~* '(therap(y|ist)|counsel|psycholog|psychiatr|mental health|behavioral)' THEN 'Mental Health & Counseling'
    WHEN c ~* '(gym|fitness|personal train|yoga|pilates|crossfit|martial art|boxing|dance studio)' THEN 'Fitness & Studios'
    WHEN c ~* '(pharmac|supplement|herbal|holistic|wellness|nutrition|apothecary)' THEN 'Pharmacy & Wellness'
    WHEN c ~* '(doctor|physician|medical|clinic|health|hospital|nurs|chiroprac|optometr|podiatr|dermatol|pediatric|urgent care|home care|midwif|doula|acupunctur)' THEN 'Health & Medical'
    WHEN c ~* '(veterinar|pet |grooming.*(dog|pet)|animal)' THEN 'Pets & Veterinary'
    WHEN c ~* '(plumb|hvac|electric(al|ian)|heating|air conditioning)' THEN 'Plumbing, HVAC & Electrical'
    WHEN c ~* '(landscap|lawn|tree service|gardening|irrigation|snow removal)' THEN 'Landscaping & Lawn'
    WHEN c ~* '(clean|janitor|maid|pressure wash|carpet clean)' THEN 'Cleaning Services'
    WHEN c ~* '(moving|mover|storage|junk removal|hauling)' THEN 'Moving & Storage'
    WHEN c ~* '(roof|remodel|renovat|handyman|carpent|paint(ing|er)|flooring|drywall|home improvement|pest|window|fence|interior design)' THEN 'Home Improvement & Contractors'
    WHEN c ~* '(construction|general contractor|developer|excavat|concrete|masonry|architect|engineering firm)' THEN 'Construction & Development'
    WHEN c ~* '(real estate|realtor|property manage|brokerage|apartment|housing)' THEN 'Real Estate'
    WHEN c ~* '(auto repair|mechanic|car repair|tire|body shop|detail|collision|oil change|towing)' THEN 'Automotive Repair'
    WHEN c ~* '(car dealer|auto sales|dealership|car rental|rideshare|limousine|taxi|chauffeur)' THEN 'Auto Sales & Transportation'
    WHEN c ~* '(truck|logistic|freight|courier|delivery service|shipping)' THEN 'Trucking & Logistics'
    WHEN c ~* '(law|attorney|legal|paralegal|notary)' THEN 'Legal Services'
    WHEN c ~* '(account|cpa|tax|bookkeep|payroll|audit)' THEN 'Accounting & Tax'
    WHEN c ~* '(insurance|financial advis|wealth|investment|capital management|mortgage|lending|loan)' THEN 'Financial Services & Insurance'
    WHEN c ~* '(bank|credit union|fintech|payment process)' THEN 'Banking & Credit'
    WHEN c ~* '(consult|coach|business service|staffing|recruit|human resources|executive)' THEN 'Business Consulting'
    WHEN c ~* '(marketing|advertis|public relations|branding|social media|seo)' THEN 'Marketing & Advertising'
    WHEN c ~* '(software|web (design|develop)|app develop|it (services|support|consult)|cyber|data|cloud|technolog|computer)' THEN 'Technology & IT'
    WHEN c ~* '(photograph|videograph|film|production compan|studio recording)' THEN 'Photography & Video'
    WHEN c ~* '(newspaper|magazine|publish|media|podcast|radio|broadcast|journalis)' THEN 'Media & Publishing'
    WHEN c ~* '(music|record label|dj |band|artist manage|theater|theatre|comedy|entertainment)' THEN 'Music & Entertainment'
    WHEN c ~* '(art gallery|museum|artist|gallery|craft|pottery|sculpt|cultural cent)' THEN 'Arts & Galleries'
    WHEN c ~* '(event|wedding|party|venue|banquet|rental compan|balloon|photo booth)' THEN 'Events & Venues'
    WHEN c ~* '(boutique|clothing|apparel|fashion|shoe|streetwear|tailor|designer)' THEN 'Fashion & Apparel'
    WHEN c ~* '(jewel|accessor|watch|handbag)' THEN 'Jewelry & Accessories'
    WHEN c ~* '(bookstore|book shop|stationery|printing|print shop|sign)' THEN 'Books, Print & Signage'
    WHEN c ~* '(tutor|school|academy|education|learning|training cent|college|universit|driving school|test prep)' THEN 'Education & Tutoring'
    WHEN c ~* '(child care|childcare|daycare|day care|preschool|youth|mentor|after school|camp)' THEN 'Childcare & Youth Programs'
    WHEN c ~* '(church|ministr|baptist|methodist|temple|mosque|masjid|faith|christian|gospel|congregation|parish)' THEN 'Churches & Faith'
    WHEN c ~* '(nonprofit|non-profit|charit|foundation|community (organiz|cent|develop)|advocacy|association|chamber)' THEN 'Nonprofits & Community'
    WHEN c ~* '(farm|agricultur|ranch|orchard|apiar|nursery|greenhouse|csa)' THEN 'Farms & Agriculture'
    WHEN c ~* '(hotel|motel|bed and breakfast|travel|tour|resort|vacation|hospitality|airbnb)' THEN 'Travel & Hospitality'
    WHEN c ~* '(funeral|mortuar|cemeter)' THEN 'Funeral & Memorial'
    WHEN c ~* '(laundr|dry clean|alteration|tailoring|shoe repair|barter|repair shop)' THEN 'Laundry & Repair'
    WHEN c ~* '(security|investigat|guard|locksmith)' THEN 'Security Services'
    WHEN c ~* '(store|shop|retail|e-commerce|ecommerce|merchandise|gift|thrift|furniture|toy|sporting goods|hardware)' THEN 'Retail & Shopping'
    ELSE 'Professional & Other Services'
  END
  FROM (SELECT btrim(coalesce(p_category, '')) AS c) t;
$$;

-- 3. State normalisation + country resolution
CREATE OR REPLACE FUNCTION public.normalize_state_code(p_state text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN s IS NULL OR s = '' OR lower(s) IN ('unknown','not specified','not applicable','not publicly available','n/a','none') THEN NULL
    WHEN length(s) <= 4 THEN upper(s)
    ELSE coalesce(
      (SELECT code FROM (VALUES
        ('alabama','AL'),('alaska','AK'),('arizona','AZ'),('arkansas','AR'),('california','CA'),
        ('colorado','CO'),('connecticut','CT'),('delaware','DE'),('florida','FL'),('georgia','GA'),
        ('hawaii','HI'),('idaho','ID'),('illinois','IL'),('indiana','IN'),('iowa','IA'),
        ('kansas','KS'),('kentucky','KY'),('louisiana','LA'),('maine','ME'),('maryland','MD'),
        ('massachusetts','MA'),('michigan','MI'),('minnesota','MN'),('mississippi','MS'),('missouri','MO'),
        ('montana','MT'),('nebraska','NE'),('nevada','NV'),('new hampshire','NH'),('new jersey','NJ'),
        ('new mexico','NM'),('new york','NY'),('north carolina','NC'),('north dakota','ND'),('ohio','OH'),
        ('oklahoma','OK'),('oregon','OR'),('pennsylvania','PA'),('rhode island','RI'),('south carolina','SC'),
        ('south dakota','SD'),('tennessee','TN'),('texas','TX'),('utah','UT'),('vermont','VT'),
        ('virginia','VA'),('washington','WA'),('west virginia','WV'),('wisconsin','WI'),('wyoming','WY'),
        ('district of columbia','DC'),('washington dc','DC'),('puerto rico','PR'),('virgin islands','VI'),
        ('ontario','ON'),('quebec','QC'),('british columbia','BC'),('alberta','AB'),('manitoba','MB'),
        ('nova scotia','NS'),('saskatchewan','SK'),('new brunswick','NB'),
        ('england','ENG'),('scotland','SCT'),('wales','WLS'),('jamaica','JM'),('belize','BZ'),
        ('ghana','GH'),('nigeria','NG'),('bahamas','BS'),('barbados','BB'),('haiti','HT')
      ) AS m(nm, code) WHERE m.nm = lower(s)),
      upper(left(s, 4))
    )
  END
  FROM (SELECT btrim(coalesce(p_state, '')) AS s) t;
$$;

CREATE OR REPLACE FUNCTION public.resolve_country(p_state text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN s IS NULL THEN NULL
    WHEN s IN ('AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC','PR','VI','GU','AS','MP','US') THEN 'US'
    WHEN s IN ('ON','QC','BC','AB','MB','SK','NS','NB','NL','PE','YT','NT','NU') THEN 'CA'
    WHEN s IN ('UK','GB','EN','ENG','SCT','WLS','WM','SE') THEN 'GB'
    WHEN s = 'JM' THEN 'JM'
    WHEN s = 'BS' THEN 'BS'
    WHEN s = 'TT' THEN 'TT'
    WHEN s = 'BB' THEN 'BB'
    WHEN s = 'HT' THEN 'HT'
    WHEN s = 'GH' THEN 'GH'
    WHEN s = 'NG' THEN 'NG'
    WHEN s = 'BM' THEN 'BM'
    WHEN s = 'AG' THEN 'AG'
    WHEN s = 'TC' THEN 'TC'
    WHEN s = 'LC' THEN 'LC'
    WHEN s = 'GD' THEN 'GD'
    WHEN s = 'CW' THEN 'CW'
    WHEN s = 'KN' THEN 'KN'
    WHEN s = 'BZ' THEN 'BZ'
    WHEN s = 'DO' THEN 'DO'
    WHEN s = 'VG' THEN 'VG'
    WHEN s IN ('MX','CDMX','QR','OAX','JL','NL') THEN 'MX'
    ELSE 'OTHER'
  END
  FROM (SELECT public.normalize_state_code(p_state) AS s) t;
$$;

-- 4. Backfill
UPDATE public.businesses
SET state = public.normalize_state_code(state)
WHERE state IS DISTINCT FROM public.normalize_state_code(state);

UPDATE public.businesses
SET category_group = public.resolve_category_group(category),
    country = public.resolve_country(state);

-- 5. Keep new/edited listings sorted automatically
CREATE OR REPLACE FUNCTION public.businesses_set_taxonomy()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.state := public.normalize_state_code(NEW.state);
  NEW.category_group := public.resolve_category_group(NEW.category);
  NEW.country := public.resolve_country(NEW.state);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS businesses_set_taxonomy_trg ON public.businesses;
CREATE TRIGGER businesses_set_taxonomy_trg
BEFORE INSERT OR UPDATE OF category, state ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.businesses_set_taxonomy();

-- 6. Indexes for scale
CREATE INDEX IF NOT EXISTS idx_businesses_group_live ON public.businesses (category_group) WHERE listing_status = 'live';
CREATE INDEX IF NOT EXISTS idx_businesses_place_live ON public.businesses (country, state, city) WHERE listing_status = 'live';
CREATE INDEX IF NOT EXISTS idx_businesses_group_place_live ON public.businesses (category_group, country, state) WHERE listing_status = 'live';

-- 7. Browse functions
CREATE OR REPLACE FUNCTION public.get_directory_groups(
  p_country text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_city text DEFAULT NULL
)
RETURNS TABLE(category_group text, count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT b.category_group, count(*)
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND b.category_group IS NOT NULL
    AND (p_country IS NULL OR p_country = 'all' OR b.country = p_country)
    AND (p_state IS NULL OR p_state = 'all' OR b.state = p_state)
    AND (p_city IS NULL OR p_city = 'all' OR b.city = p_city)
  GROUP BY b.category_group
  ORDER BY count(*) DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_directory_countries()
RETURNS TABLE(country text, count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT b.country, count(*)
  FROM public.businesses b
  WHERE b.listing_status = 'live' AND b.country IS NOT NULL
  GROUP BY b.country
  ORDER BY count(*) DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_directory_states(p_country text DEFAULT 'US')
RETURNS TABLE(state text, count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT b.state, count(*)
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND b.state IS NOT NULL
    AND (p_country IS NULL OR p_country = 'all' OR b.country = p_country)
  GROUP BY b.state
  ORDER BY count(*) DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_directory_cities(p_country text DEFAULT 'US', p_state text DEFAULT NULL, p_limit integer DEFAULT 60)
RETURNS TABLE(city text, state text, count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT b.city, b.state, count(*)
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND b.city IS NOT NULL AND btrim(b.city) <> ''
    AND (p_country IS NULL OR p_country = 'all' OR b.country = p_country)
    AND (p_state IS NULL OR p_state = 'all' OR b.state = p_state)
  GROUP BY b.city, b.state
  ORDER BY count(*) DESC
  LIMIT greatest(1, least(coalesce(p_limit, 60), 500));
$$;

-- 8. Search with place + group filters
DROP FUNCTION IF EXISTS public.search_directory_businesses(text, text, numeric, integer, integer);

CREATE OR REPLACE FUNCTION public.search_directory_businesses(
  p_search_term text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_min_rating numeric DEFAULT NULL,
  p_limit integer DEFAULT 24,
  p_offset integer DEFAULT 0,
  p_category_group text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_city text DEFAULT NULL
)
RETURNS TABLE(id uuid, business_name text, name text, description text, category text, category_group text, address text, city text, state text, country text, zip_code text, website text, logo_url text, banner_url text, is_verified boolean, average_rating numeric, review_count integer, latitude double precision, longitude double precision, created_at timestamptz, updated_at timestamptz, listing_status text, is_founding_member boolean, is_founding_sponsor boolean, total_count bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
SET statement_timeout TO '20s'
AS $function$
DECLARE
  v_term text;
  v_pattern text;
  v_total bigint;
BEGIN
  v_term := nullif(btrim(coalesce(p_search_term, '')), '');
  v_pattern := CASE WHEN v_term IS NULL THEN NULL ELSE '%'||v_term||'%' END;

  SELECT count(*) INTO v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_category_group IS NULL OR p_category_group = 'all' OR b.category_group = p_category_group)
    AND (p_country IS NULL OR p_country = 'all' OR b.country = p_country)
    AND (p_state IS NULL OR p_state = 'all' OR b.state = p_state)
    AND (p_city IS NULL OR p_city = 'all' OR b.city = p_city)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
    AND (
      v_pattern IS NULL
      OR b.business_name ILIKE v_pattern
      OR b.name          ILIKE v_pattern
      OR b.city          ILIKE v_pattern
      OR b.state         ILIKE v_pattern
      OR b.category      ILIKE v_pattern
      OR b.zip_code      ILIKE v_pattern
    );

  RETURN QUERY
  SELECT b.id,
         b.business_name::text, b.name::text, b.description::text, b.category::text, b.category_group::text,
         b.address::text, b.city::text, b.state::text, b.country::text, b.zip_code::text, b.website::text,
         b.logo_url::text, b.banner_url::text, b.is_verified, b.average_rating,
         b.review_count::int, b.latitude::double precision, b.longitude::double precision,
         b.created_at, b.updated_at, b.listing_status::text,
         b.is_founding_member, b.is_founding_sponsor,
         v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_category_group IS NULL OR p_category_group = 'all' OR b.category_group = p_category_group)
    AND (p_country IS NULL OR p_country = 'all' OR b.country = p_country)
    AND (p_state IS NULL OR p_state = 'all' OR b.state = p_state)
    AND (p_city IS NULL OR p_city = 'all' OR b.city = p_city)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
    AND (
      v_pattern IS NULL
      OR b.business_name ILIKE v_pattern
      OR b.name          ILIKE v_pattern
      OR b.city          ILIKE v_pattern
      OR b.state         ILIKE v_pattern
      OR b.category      ILIKE v_pattern
      OR b.zip_code      ILIKE v_pattern
    )
  ORDER BY b.is_verified DESC,
           b.average_rating DESC NULLS LAST,
           b.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 24), 100))
  OFFSET greatest(0, coalesce(p_offset, 0));
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_directory_businesses(text, text, numeric, integer, integer, text, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_directory_groups(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_directory_countries() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_directory_states(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_directory_cities(text, text, integer) TO anon, authenticated;