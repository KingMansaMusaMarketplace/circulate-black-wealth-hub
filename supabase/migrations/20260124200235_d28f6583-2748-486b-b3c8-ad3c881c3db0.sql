-- =============================================
-- PATENT CLAIM 14: Economic Karma Scoring System
-- PATENT CLAIM 15: Susu Digital Escrow System
-- =============================================

-- 1. Add economic_karma column to profiles for Claim 14
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS economic_karma numeric DEFAULT 100.0,
ADD COLUMN IF NOT EXISTS karma_last_decay_at timestamptz DEFAULT now();

COMMENT ON COLUMN public.profiles.economic_karma IS 
  'PATENT PROTECTED: Economic Karma score with 5% monthly decay (Claim 14)';
COMMENT ON COLUMN public.profiles.karma_last_decay_at IS 
  'PATENT PROTECTED: Last karma decay calculation timestamp (Claim 14)';

-- 2. Create karma_transactions audit log
CREATE TABLE IF NOT EXISTS public.karma_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  previous_karma numeric NOT NULL,
  new_karma numeric NOT NULL,
  change_amount numeric NOT NULL,
  change_reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.karma_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own karma transactions"
  ON public.karma_transactions FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.karma_transactions IS 
  'PATENT PROTECTED: Economic Karma transaction audit log (Claim 14)';

-- 3. Create Susu circles table for Claim 15
CREATE TABLE IF NOT EXISTS public.susu_circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  creator_id uuid NOT NULL REFERENCES public.profiles(id),
  contribution_amount numeric NOT NULL CHECK (contribution_amount > 0),
  frequency text NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  max_members integer NOT NULL DEFAULT 12 CHECK (max_members >= 2 AND max_members <= 24),
  current_round integer DEFAULT 1,
  status text DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'paused', 'completed')),
  start_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.susu_circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active susu circles"
  ON public.susu_circles FOR SELECT
  USING (status IN ('forming', 'active'));

CREATE POLICY "Creators can manage their circles"
  ON public.susu_circles FOR ALL
  USING (auth.uid() = creator_id);

COMMENT ON TABLE public.susu_circles IS 
  'PATENT PROTECTED: Susu Digital Savings Circle definitions (Claim 15)';

-- 4. Create Susu memberships table
CREATE TABLE IF NOT EXISTS public.susu_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.susu_circles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  payout_position integer NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'completed')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(circle_id, user_id),
  UNIQUE(circle_id, payout_position)
);

ALTER TABLE public.susu_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their circle memberships"
  ON public.susu_memberships FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.susu_circles sc 
    WHERE sc.id = circle_id AND sc.creator_id = auth.uid()
  ));

CREATE POLICY "Users can join circles"
  ON public.susu_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Create Susu escrow transactions
CREATE TABLE IF NOT EXISTS public.susu_escrow (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.susu_circles(id),
  round_number integer NOT NULL,
  contributor_id uuid NOT NULL REFERENCES public.profiles(id),
  recipient_id uuid REFERENCES public.profiles(id),
  amount numeric NOT NULL,
  platform_fee numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'refunded')),
  held_at timestamptz,
  released_at timestamptz,
  stripe_transfer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.susu_escrow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their escrow transactions"
  ON public.susu_escrow FOR SELECT
  USING (auth.uid() = contributor_id OR auth.uid() = recipient_id);

COMMENT ON TABLE public.susu_escrow IS 
  'PATENT PROTECTED: Susu Digital Escrow with 1.5% platform fee (Claim 15)';