
-- 1) business_impact_scorecards: remove owner ALL access (read-only via existing SELECT policy)
DROP POLICY IF EXISTS "Business owners can manage their scorecard" ON public.business_impact_scorecards;

-- 2) qr_code_scans: remove permissive user UPDATE policies
DROP POLICY IF EXISTS "Users can update own conversions" ON public.qr_code_scans;
DROP POLICY IF EXISTS "Users can update their converted QR scans" ON public.qr_code_scans;

-- 3) coalition_members: replace owner ALL policy with scoped SELECT/UPDATE + column lock trigger
DROP POLICY IF EXISTS "Business owners can manage their coalition membership" ON public.coalition_members;

CREATE POLICY "Business owners can view their coalition membership"
ON public.coalition_members FOR SELECT TO authenticated
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners can toggle their coalition membership"
ON public.coalition_members FOR UPDATE TO authenticated
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()))
WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.protect_coalition_member_financials()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  NEW.business_id := OLD.business_id;
  NEW.contribution_rate := OLD.contribution_rate;
  NEW.redemption_rate := OLD.redemption_rate;
  NEW.total_points_generated := OLD.total_points_generated;
  NEW.total_points_redeemed := OLD.total_points_redeemed;
  NEW.joined_at := OLD.joined_at;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_coalition_member_financials ON public.coalition_members;
CREATE TRIGGER trg_protect_coalition_member_financials
BEFORE UPDATE ON public.coalition_members
FOR EACH ROW EXECUTE FUNCTION public.protect_coalition_member_financials();
