UPDATE public.businesses
SET address = NULL
WHERE address IS NOT NULL
  AND (btrim(address) = '' OR lower(btrim(address)) IN ('unknown','n/a','na','none','null','-','--','.','n.a.','not available','no address','tbd'));