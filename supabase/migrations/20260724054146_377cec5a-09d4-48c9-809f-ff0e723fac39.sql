
-- 1. qr_code_scans: block edits to reward/attribution columns by non-admins
CREATE OR REPLACE FUNCTION public.protect_qr_code_scans_privileged()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  IF NEW.points_awarded IS DISTINCT FROM OLD.points_awarded
     OR NEW.discount_applied IS DISTINCT FROM OLD.discount_applied
     OR NEW.sales_agent_id IS DISTINCT FROM OLD.sales_agent_id
     OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
     OR NEW.business_id IS DISTINCT FROM OLD.business_id
     OR NEW.qr_code_id IS DISTINCT FROM OLD.qr_code_id
     OR NEW.converted_user_id IS DISTINCT FROM OLD.converted_user_id
  THEN
    RAISE EXCEPTION 'Not allowed: reward and attribution fields on qr_code_scans are admin-only';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_qr_code_scans_privileged_trg ON public.qr_code_scans;
CREATE TRIGGER protect_qr_code_scans_privileged_trg
BEFORE UPDATE ON public.qr_code_scans
FOR EACH ROW EXECUTE FUNCTION public.protect_qr_code_scans_privileged();


-- 2. sales_agents: block self-edits to commission / status / earnings
CREATE OR REPLACE FUNCTION public.protect_sales_agents_privileged()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  IF NEW.commission_rate IS DISTINCT FROM OLD.commission_rate
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.total_earned IS DISTINCT FROM OLD.total_earned
     OR NEW.total_pending IS DISTINCT FROM OLD.total_pending
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.lifetime_referrals IS DISTINCT FROM OLD.lifetime_referrals
     OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
     OR NEW.recruited_by_agent_id IS DISTINCT FROM OLD.recruited_by_agent_id
     OR NEW.recruitment_date IS DISTINCT FROM OLD.recruitment_date
     OR NEW.team_override_end_date IS DISTINCT FROM OLD.team_override_end_date
     OR NEW.last_tier_update IS DISTINCT FROM OLD.last_tier_update
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
  THEN
    RAISE EXCEPTION 'Not allowed: commission, tier, earnings, and status fields on sales_agents are admin-only';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_sales_agents_privileged_trg ON public.sales_agents;
CREATE TRIGGER protect_sales_agents_privileged_trg
BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agents_privileged();


-- 3. user_milestone_progress: users can only claim after system unlock
CREATE OR REPLACE FUNCTION public.protect_user_milestone_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  -- Users may only flip reward_claimed to true, and only after unlock
  IF NEW.reward_claimed IS DISTINCT FROM OLD.reward_claimed THEN
    IF NEW.reward_claimed = true THEN
      IF OLD.unlocked_at IS NULL THEN
        RAISE EXCEPTION 'Cannot claim reward: milestone has not been unlocked yet';
      END IF;
    ELSE
      RAISE EXCEPTION 'Not allowed: only admins can revoke a claimed reward';
    END IF;
  END IF;

  -- Block edits to any other tracked fields
  IF NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.milestone_id IS DISTINCT FROM OLD.milestone_id
     OR NEW.unlocked_at IS DISTINCT FROM OLD.unlocked_at
  THEN
    RAISE EXCEPTION 'Not allowed: progress fields on user_milestone_progress are admin-only';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_milestone_progress_trg ON public.user_milestone_progress;
CREATE TRIGGER protect_user_milestone_progress_trg
BEFORE UPDATE ON public.user_milestone_progress
FOR EACH ROW EXECUTE FUNCTION public.protect_user_milestone_progress();
