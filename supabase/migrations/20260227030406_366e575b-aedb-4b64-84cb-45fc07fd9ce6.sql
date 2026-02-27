
-- =============================================
-- SECURITY HARDENING MIGRATION
-- =============================================

-- 1. Fix handle_new_user() missing SET search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _full_name text;
  _avatar_url text;
BEGIN
  _full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    split_part(NEW.email, '@', 1)
  );
  _avatar_url := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'picture'
  );

  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, _full_name, _avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

  RETURN NEW;
END;
$$;

-- 2. Fix handle_new_user_referral() missing SET search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _referral_code text;
  _referrer_id uuid;
BEGIN
  _referral_code := NEW.raw_user_meta_data ->> 'referral_code';
  
  IF _referral_code IS NOT NULL AND _referral_code != '' THEN
    SELECT id INTO _referrer_id
    FROM public.profiles
    WHERE referral_code = _referral_code;
    
    IF _referrer_id IS NOT NULL THEN
      INSERT INTO public.referrals (referrer_id, referred_id, status)
      VALUES (_referrer_id, NEW.id, 'pending')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. Restrict agent_badges to authenticated users only
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON public.agent_badges;
CREATE POLICY "Badges viewable by authenticated users"
  ON public.agent_badges
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 4. Restrict referral_milestones to authenticated users only
DROP POLICY IF EXISTS "Anyone can view milestones" ON public.referral_milestones;
CREATE POLICY "Milestones viewable by authenticated users"
  ON public.referral_milestones
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 5. Restrict referral_tiers to authenticated users only
DROP POLICY IF EXISTS "Anyone can view referral tiers" ON public.referral_tiers;
CREATE POLICY "Referral tiers viewable by authenticated users"
  ON public.referral_tiers
  FOR SELECT
  TO authenticated
  USING (true);

-- 6. Restrict partner_bonus_milestones to authenticated users only
DROP POLICY IF EXISTS "Anyone can view milestones" ON public.partner_bonus_milestones;
CREATE POLICY "Partner milestones viewable by authenticated users"
  ON public.partner_bonus_milestones
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 7. Restrict business_availability to authenticated users only (businesses are publicly viewable via directory view)
DROP POLICY IF EXISTS "Anyone can view availability" ON public.business_availability;
CREATE POLICY "Availability viewable by authenticated users"
  ON public.business_availability
  FOR SELECT
  TO authenticated
  USING (true);

-- 8. Restrict reviews anonymous access to authenticated only
DROP POLICY IF EXISTS "Anonymous users can view reviews" ON public.reviews;
-- Authenticated users can already view reviews via existing policy
