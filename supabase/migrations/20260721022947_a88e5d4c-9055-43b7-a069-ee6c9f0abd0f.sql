-- =========================================================
-- Reusable admin-only column guard
-- =========================================================
CREATE OR REPLACE FUNCTION public.enforce_admin_only_columns(_cols text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  -- Service role / internal calls (no auth context) are allowed.
  IF _uid IS NULL THEN
    RETURN;
  END IF;
  -- Admins are allowed.
  IF public.has_role(_uid, 'admin'::app_role) THEN
    RETURN;
  END IF;
  -- Non-admin users cannot change any of the listed columns.
  -- The actual per-column comparison happens in each trigger wrapper below,
  -- because trigger functions need OLD/NEW access. This helper just centralizes
  -- the admin gate.
  RAISE EXCEPTION 'Only administrators may modify privileged columns: %', array_to_string(_cols, ', ')
    USING ERRCODE = '42501';
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_admin_only_columns(text[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_admin_only_columns(text[]) TO service_role;

-- =========================================================
-- Generic guard-trigger factory macro (implemented per-table)
-- Each trigger function:
--   1. Returns NEW immediately if auth.uid() is null (service role) or user is admin.
--   2. Otherwise, if any listed column changed, raises 42501.
-- =========================================================

-- ---------- helper macro pattern (repeated per table) ----------
-- CREATE OR REPLACE FUNCTION public.guard_<table>() RETURNS trigger ...
-- CREATE TRIGGER trg_guard_<table> BEFORE UPDATE ON public.<table> ...

-- =========================================================
-- VERIFICATION / APPROVAL TABLES
-- =========================================================

-- business_verifications
CREATE OR REPLACE FUNCTION public.guard_business_verifications() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at THEN
    RAISE EXCEPTION 'Only admins may modify verification decision fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_business_verifications ON public.business_verifications;
CREATE TRIGGER trg_guard_business_verifications BEFORE UPDATE ON public.business_verifications
FOR EACH ROW EXECUTE FUNCTION public.guard_business_verifications();

-- host_verification_requests
CREATE OR REPLACE FUNCTION public.guard_host_verification_requests() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at THEN
    RAISE EXCEPTION 'Only admins may modify host verification decision fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_host_verification_requests ON public.host_verification_requests;
CREATE TRIGGER trg_guard_host_verification_requests BEFORE UPDATE ON public.host_verification_requests
FOR EACH ROW EXECUTE FUNCTION public.guard_host_verification_requests();

-- host_applications
CREATE OR REPLACE FUNCTION public.guard_host_applications() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at THEN
    RAISE EXCEPTION 'Only admins may modify host application decision fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_host_applications ON public.host_applications;
CREATE TRIGGER trg_guard_host_applications BEFORE UPDATE ON public.host_applications
FOR EACH ROW EXECUTE FUNCTION public.guard_host_applications();

-- hbcu_verifications
CREATE OR REPLACE FUNCTION public.guard_hbcu_verifications() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.verified_at IS DISTINCT FROM OLD.verified_at
     OR NEW.verified_by IS DISTINCT FROM OLD.verified_by THEN
    RAISE EXCEPTION 'Only admins may modify HBCU verification decision fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_hbcu_verifications ON public.hbcu_verifications;
CREATE TRIGGER trg_guard_hbcu_verifications BEFORE UPDATE ON public.hbcu_verifications
FOR EACH ROW EXECUTE FUNCTION public.guard_hbcu_verifications();

-- non_bias_certifications
CREATE OR REPLACE FUNCTION public.guard_non_bias_certifications() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.certified_at IS DISTINCT FROM OLD.certified_at
     OR NEW.certified_by IS DISTINCT FROM OLD.certified_by THEN
    RAISE EXCEPTION 'Only admins may modify non-bias certification decision fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_non_bias_certifications ON public.non_bias_certifications;
CREATE TRIGGER trg_guard_non_bias_certifications BEFORE UPDATE ON public.non_bias_certifications
FOR EACH ROW EXECUTE FUNCTION public.guard_non_bias_certifications();

-- verification_certificates
CREATE OR REPLACE FUNCTION public.guard_verification_certificates() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'Verification certificates may only be modified by admins' USING ERRCODE='42501';
END; $$;
DROP TRIGGER IF EXISTS trg_guard_verification_certificates ON public.verification_certificates;
CREATE TRIGGER trg_guard_verification_certificates BEFORE UPDATE ON public.verification_certificates
FOR EACH ROW EXECUTE FUNCTION public.guard_verification_certificates();

-- noir_hotel_partners
CREATE OR REPLACE FUNCTION public.guard_noir_hotel_partners() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
     OR NEW.tier IS DISTINCT FROM OLD.tier THEN
    RAISE EXCEPTION 'Only admins may modify hotel-partner approval fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_noir_hotel_partners ON public.noir_hotel_partners;
CREATE TRIGGER trg_guard_noir_hotel_partners BEFORE UPDATE ON public.noir_hotel_partners
FOR EACH ROW EXECUTE FUNCTION public.guard_noir_hotel_partners();

-- beta_testers
CREATE OR REPLACE FUNCTION public.guard_beta_testers() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by THEN
    RAISE EXCEPTION 'Only admins may modify beta-tester approval fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_beta_testers ON public.beta_testers;
CREATE TRIGGER trg_guard_beta_testers BEFORE UPDATE ON public.beta_testers
FOR EACH ROW EXECUTE FUNCTION public.guard_beta_testers();

-- stays_beta_testers
CREATE OR REPLACE FUNCTION public.guard_stays_beta_testers() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by THEN
    RAISE EXCEPTION 'Only admins may modify stays beta-tester approval fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_stays_beta_testers ON public.stays_beta_testers;
CREATE TRIGGER trg_guard_stays_beta_testers BEFORE UPDATE ON public.stays_beta_testers
FOR EACH ROW EXECUTE FUNCTION public.guard_stays_beta_testers();

-- developer_accounts
CREATE OR REPLACE FUNCTION public.guard_developer_accounts() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by THEN
    RAISE EXCEPTION 'Only admins may modify developer account approval/tier fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_developer_accounts ON public.developer_accounts;
CREATE TRIGGER trg_guard_developer_accounts BEFORE UPDATE ON public.developer_accounts
FOR EACH ROW EXECUTE FUNCTION public.guard_developer_accounts();

-- =========================================================
-- MONEY / PAYOUT TABLES (admin-only for ALL writes)
-- =========================================================

CREATE OR REPLACE FUNCTION public.guard_money_admin_only() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'Financial records may only be modified by admins or backend services' USING ERRCODE='42501';
END; $$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'commission_payments','commission_transactions','agent_commissions','agent_recruitment_bonuses',
    'partner_payouts','partner_invoices','withdrawal_requests','marketing_credits','marketing_credit_ledger',
    'loyalty_points','stays_host_payouts','noire_driver_payouts','coalition_rewards','coalition_redemptions',
    'coalition_transactions'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_guard_money ON public.%I', t);
    EXECUTE format('CREATE TRIGGER trg_guard_money BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.guard_money_admin_only()', t);
  END LOOP;
END $$;

-- =========================================================
-- FINANCIAL ACCOUNT TABLES (owner may edit non-verification fields; verified/status admin-only)
-- =========================================================

-- bank_accounts
CREATE OR REPLACE FUNCTION public.guard_bank_accounts() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.verified IS DISTINCT FROM OLD.verified
     OR NEW.verified_at IS DISTINCT FROM OLD.verified_at THEN
    RAISE EXCEPTION 'Only admins may modify bank account verification fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_bank_accounts ON public.bank_accounts;
CREATE TRIGGER trg_guard_bank_accounts BEFORE UPDATE ON public.bank_accounts
FOR EACH ROW EXECUTE FUNCTION public.guard_bank_accounts();

-- host_payout_methods
CREATE OR REPLACE FUNCTION public.guard_host_payout_methods() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.verified IS DISTINCT FROM OLD.verified
     OR NEW.verified_at IS DISTINCT FROM OLD.verified_at THEN
    RAISE EXCEPTION 'Only admins may modify host payout method verification fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_host_payout_methods ON public.host_payout_methods;
CREATE TRIGGER trg_guard_host_payout_methods BEFORE UPDATE ON public.host_payout_methods
FOR EACH ROW EXECUTE FUNCTION public.guard_host_payout_methods();

-- business_payment_accounts
CREATE OR REPLACE FUNCTION public.guard_business_payment_accounts() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.verified IS DISTINCT FROM OLD.verified
     OR NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Only admins may modify business payment account verification/status' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_business_payment_accounts ON public.business_payment_accounts;
CREATE TRIGGER trg_guard_business_payment_accounts BEFORE UPDATE ON public.business_payment_accounts
FOR EACH ROW EXECUTE FUNCTION public.guard_business_payment_accounts();

-- apple_subscriptions (subscription state must come from StoreKit via service role)
CREATE OR REPLACE FUNCTION public.guard_apple_subscriptions() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'Apple subscriptions may only be modified by StoreKit backend or admins' USING ERRCODE='42501';
END; $$;
DROP TRIGGER IF EXISTS trg_guard_apple_subscriptions ON public.apple_subscriptions;
CREATE TRIGGER trg_guard_apple_subscriptions BEFORE UPDATE ON public.apple_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.guard_apple_subscriptions();

-- =========================================================
-- SPONSORS / PARTNERS
-- =========================================================

-- sponsors
CREATE OR REPLACE FUNCTION public.guard_sponsors() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by THEN
    RAISE EXCEPTION 'Only admins may modify sponsor tier/approval fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_sponsors ON public.sponsors;
CREATE TRIGGER trg_guard_sponsors BEFORE UPDATE ON public.sponsors
FOR EACH ROW EXECUTE FUNCTION public.guard_sponsors();

-- partner_referrals
CREATE OR REPLACE FUNCTION public.guard_partner_referrals() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.commission_amount IS DISTINCT FROM OLD.commission_amount
     OR NEW.paid_at IS DISTINCT FROM OLD.paid_at THEN
    RAISE EXCEPTION 'Only admins may modify partner referral commission/status fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_partner_referrals ON public.partner_referrals;
CREATE TRIGGER trg_guard_partner_referrals BEFORE UPDATE ON public.partner_referrals
FOR EACH ROW EXECUTE FUNCTION public.guard_partner_referrals();

-- =========================================================
-- ADMIN / SYSTEM TABLES (all writes admin-only)
-- =========================================================

CREATE OR REPLACE FUNCTION public.guard_admin_only() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'This table may only be modified by admins' USING ERRCODE='42501';
END; $$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'admin_api_tokens','admin_permissions','api_keys','feature_flags','system_settings',
    'fraud_alerts','account_suspensions','noire_pricing_config'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_guard_admin_only ON public.%I', t);
    EXECUTE format('CREATE TRIGGER trg_guard_admin_only BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.guard_admin_only()', t);
  END LOOP;
END $$;

-- user_roles: block ALL non-admin INSERT/UPDATE/DELETE (roles must never be self-assigned)
CREATE OR REPLACE FUNCTION public.guard_user_roles() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  RAISE EXCEPTION 'Roles may only be assigned by admins' USING ERRCODE='42501';
END; $$;
DROP TRIGGER IF EXISTS trg_guard_user_roles ON public.user_roles;
CREATE TRIGGER trg_guard_user_roles BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.guard_user_roles();

-- =========================================================
-- REVIEWS (moderation fields admin-only)
-- =========================================================
CREATE OR REPLACE FUNCTION public.guard_reviews() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  IF NEW.is_flagged IS DISTINCT FROM OLD.is_flagged
     OR NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.moderation_status IS DISTINCT FROM OLD.moderation_status THEN
    RAISE EXCEPTION 'Only admins may modify review moderation fields' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_reviews ON public.reviews;
CREATE TRIGGER trg_guard_reviews BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.guard_reviews();