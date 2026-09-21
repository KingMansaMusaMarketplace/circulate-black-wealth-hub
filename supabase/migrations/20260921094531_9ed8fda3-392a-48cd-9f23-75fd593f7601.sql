-- 1. coalition_members: also guard INSERT (rates/points forced to defaults for non-admins)
CREATE OR REPLACE FUNCTION public.enforce_coalition_member_insert_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_admin_secure() THEN
    RETURN NEW;
  END IF;
  NEW.contribution_rate := 2.5;
  NEW.redemption_rate := 100;
  NEW.total_points_generated := 0;
  NEW.total_points_redeemed := 0;
  NEW.joined_at := now();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_coalition_member_insert_cols() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_coalition_member_insert_cols ON public.coalition_members;
CREATE TRIGGER trg_enforce_coalition_member_insert_cols
BEFORE INSERT ON public.coalition_members
FOR EACH ROW EXECUTE FUNCTION public.enforce_coalition_member_insert_cols();

-- make sure the existing update guard is actually attached for updates
DROP TRIGGER IF EXISTS trg_protect_coalition_member_financials ON public.coalition_members;
CREATE TRIGGER trg_protect_coalition_member_financials
BEFORE UPDATE ON public.coalition_members
FOR EACH ROW EXECUTE FUNCTION public.protect_coalition_member_financials();

-- 2. referral_campaign_participants: earnings start at zero, only admin/system can change
CREATE OR REPLACE FUNCTION public.enforce_referral_campaign_participant_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public._sec_is_admin_or_system() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.referrals_during_campaign := 0;
    NEW.points_earned := 0;
    NEW.cash_earned := 0;
    NEW.rank := NULL;
    NEW.last_referral_at := NULL;
    NEW.joined_at := now();
  ELSE
    NEW.referrals_during_campaign := OLD.referrals_during_campaign;
    NEW.points_earned := OLD.points_earned;
    NEW.cash_earned := OLD.cash_earned;
    NEW.rank := OLD.rank;
    NEW.last_referral_at := OLD.last_referral_at;
    NEW.user_id := OLD.user_id;
    NEW.campaign_id := OLD.campaign_id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_referral_campaign_participant_cols() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_referral_campaign_participant_cols ON public.referral_campaign_participants;
CREATE TRIGGER trg_enforce_referral_campaign_participant_cols
BEFORE INSERT OR UPDATE ON public.referral_campaign_participants
FOR EACH ROW EXECUTE FUNCTION public.enforce_referral_campaign_participant_cols();

-- 3. user_referrals: rewards must start at zero on insert
CREATE OR REPLACE FUNCTION public.enforce_user_referrals_insert_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN
    RETURN NEW;
  END IF;
  NEW.points_awarded := 0;
  NEW.cash_awarded := 0;
  NEW.status := 'pending';
  NEW.converted_at := NULL;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_user_referrals_insert_cols() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_user_referrals_insert_cols ON public.user_referrals;
CREATE TRIGGER trg_enforce_user_referrals_insert_cols
BEFORE INSERT ON public.user_referrals
FOR EACH ROW EXECUTE FUNCTION public.enforce_user_referrals_insert_cols();

-- 4. sponsor_agreements: validate public form input
CREATE OR REPLACE FUNCTION public.validate_sponsor_agreement_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.company_name := btrim(NEW.company_name);
  NEW.contact_name := btrim(NEW.contact_name);
  NEW.contact_email := lower(btrim(NEW.contact_email));
  NEW.contact_phone := btrim(NEW.contact_phone);

  IF NEW.company_name IS NULL OR length(NEW.company_name) < 2 OR length(NEW.company_name) > 200 THEN
    RAISE EXCEPTION 'Invalid company name';
  END IF;
  IF NEW.contact_name IS NULL OR length(NEW.contact_name) < 2 OR length(NEW.contact_name) > 120 THEN
    RAISE EXCEPTION 'Invalid contact name';
  END IF;
  IF NEW.contact_email IS NULL OR NEW.contact_email !~ '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR length(NEW.contact_email) > 255 THEN
    RAISE EXCEPTION 'Invalid contact email';
  END IF;
  IF NEW.contact_phone IS NOT NULL AND NEW.contact_phone <> '' THEN
    IF length(regexp_replace(NEW.contact_phone, '\D', '', 'g')) NOT BETWEEN 7 AND 15 THEN
      RAISE EXCEPTION 'Invalid contact phone';
    END IF;
  END IF;
  IF NEW.billing_address IS NOT NULL AND length(NEW.billing_address) > 500 THEN
    RAISE EXCEPTION 'Billing address too long';
  END IF;
  IF NEW.company_website IS NOT NULL AND NEW.company_website <> ''
     AND NEW.company_website !~* '^(https?://)?[a-z0-9.-]+\.[a-z]{2,}(/.*)?$' THEN
    RAISE EXCEPTION 'Invalid company website';
  END IF;
  IF NEW.signature_typed_name IS NOT NULL AND length(NEW.signature_typed_name) > 120 THEN
    RAISE EXCEPTION 'Invalid signature';
  END IF;
  IF NEW.signer_name IS NOT NULL AND length(NEW.signer_name) > 120 THEN
    RAISE EXCEPTION 'Invalid signer name';
  END IF;
  IF NEW.po_number IS NOT NULL AND length(NEW.po_number) > 60 THEN
    RAISE EXCEPTION 'Invalid PO number';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.validate_sponsor_agreement_input() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_validate_sponsor_agreement_input ON public.sponsor_agreements;
CREATE TRIGGER trg_validate_sponsor_agreement_input
BEFORE INSERT OR UPDATE ON public.sponsor_agreements
FOR EACH ROW EXECUTE FUNCTION public.validate_sponsor_agreement_input();