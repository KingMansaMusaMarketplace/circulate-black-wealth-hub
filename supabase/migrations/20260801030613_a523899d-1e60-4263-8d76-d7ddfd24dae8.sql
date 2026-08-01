-- 1) Backfill private table from any PII still held on the main table
INSERT INTO public.b2b_external_leads_private (lead_id, owner_name, owner_email, phone_number, contact_info)
SELECT l.id, l.owner_name, l.owner_email, l.phone_number, l.contact_info
FROM public.b2b_external_leads l
WHERE l.owner_name IS NOT NULL OR l.owner_email IS NOT NULL OR l.phone_number IS NOT NULL OR l.contact_info IS NOT NULL
ON CONFLICT (lead_id) DO UPDATE SET
  owner_name = COALESCE(public.b2b_external_leads_private.owner_name, EXCLUDED.owner_name),
  owner_email = COALESCE(public.b2b_external_leads_private.owner_email, EXCLUDED.owner_email),
  phone_number = COALESCE(public.b2b_external_leads_private.phone_number, EXCLUDED.phone_number),
  contact_info = COALESCE(public.b2b_external_leads_private.contact_info, EXCLUDED.contact_info),
  updated_at = now();

-- 2) Keep the private table authoritative going forward
CREATE OR REPLACE FUNCTION public.sync_b2b_lead_private_pii()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_name IS NOT NULL OR NEW.owner_email IS NOT NULL
     OR NEW.phone_number IS NOT NULL OR NEW.contact_info IS NOT NULL THEN
    INSERT INTO public.b2b_external_leads_private (lead_id, owner_name, owner_email, phone_number, contact_info)
    VALUES (NEW.id, NEW.owner_name, NEW.owner_email, NEW.phone_number, NEW.contact_info)
    ON CONFLICT (lead_id) DO UPDATE SET
      owner_name = COALESCE(EXCLUDED.owner_name, public.b2b_external_leads_private.owner_name),
      owner_email = COALESCE(EXCLUDED.owner_email, public.b2b_external_leads_private.owner_email),
      phone_number = COALESCE(EXCLUDED.phone_number, public.b2b_external_leads_private.phone_number),
      contact_info = COALESCE(EXCLUDED.contact_info, public.b2b_external_leads_private.contact_info),
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_b2b_lead_private_pii ON public.b2b_external_leads;
CREATE TRIGGER trg_sync_b2b_lead_private_pii
AFTER INSERT OR UPDATE OF owner_name, owner_email, phone_number, contact_info
ON public.b2b_external_leads
FOR EACH ROW EXECUTE FUNCTION public.sync_b2b_lead_private_pii();

-- 3) Remove all residual anon access to lead data (defense in depth on top of admin-only RLS)
REVOKE ALL ON public.b2b_external_leads FROM anon;
REVOKE ALL ON public.b2b_external_leads_private FROM anon;

-- 4) Authenticated users must never read the duplicated PII columns off the main table;
--    admin tooling continues to read them through the private table / service role.
REVOKE SELECT (owner_name, owner_email, phone_number, contact_info)
  ON public.b2b_external_leads FROM authenticated;

GRANT ALL ON public.b2b_external_leads TO service_role;
GRANT ALL ON public.b2b_external_leads_private TO service_role;