
CREATE OR REPLACE FUNCTION public.link_business_to_enterprise_org()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    RETURN NEW;
  END IF;

  UPDATE public.enterprise_org_members
     SET business_id = NEW.id,
         member_type = 'business_owner',
         updated_at = now()
   WHERE user_id = NEW.owner_id
     AND business_id IS NULL;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS link_business_to_enterprise_org_trg ON public.businesses;
CREATE TRIGGER link_business_to_enterprise_org_trg
AFTER INSERT ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.link_business_to_enterprise_org();
