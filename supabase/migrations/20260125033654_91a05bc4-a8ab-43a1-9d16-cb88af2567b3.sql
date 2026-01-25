-- Partner Program Schema for Directory Owner Referrals

-- Partner tier enum
CREATE TYPE public.partner_tier AS ENUM ('founding', 'premium', 'standard');

-- Partner status enum  
CREATE TYPE public.partner_status AS ENUM ('pending', 'active', 'suspended', 'inactive');

-- Partners table (directory owners who refer businesses)
CREATE TABLE public.directory_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Partner info
    directory_name TEXT NOT NULL,
    directory_url TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    description TEXT,
    logo_url TEXT,
    
    -- Partner status and tier
    status public.partner_status NOT NULL DEFAULT 'pending',
    tier public.partner_tier NOT NULL DEFAULT 'standard',
    
    -- Referral tracking
    referral_code TEXT UNIQUE NOT NULL,
    referral_link TEXT GENERATED ALWAYS AS ('https://1325.ai/join?ref=' || referral_code) STORED,
    
    -- Commission structure
    flat_fee_per_signup NUMERIC(10,2) NOT NULL DEFAULT 5.00,
    revenue_share_percent NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    
    -- Stats (denormalized for performance)
    total_referrals INTEGER NOT NULL DEFAULT 0,
    total_conversions INTEGER NOT NULL DEFAULT 0,
    total_earnings NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    pending_earnings NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    
    -- Embed widget
    embed_token UUID DEFAULT gen_random_uuid(),
    embed_enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    approved_at TIMESTAMPTZ,
    approved_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partner referrals table (tracks each referred business)
CREATE TABLE public.partner_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES public.directory_partners(id) ON DELETE CASCADE,
    
    -- Referred business/user
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referred_business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    referred_email TEXT NOT NULL,
    referred_business_name TEXT,
    
    -- Tracking
    referral_code TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    
    -- Conversion tracking
    is_converted BOOLEAN NOT NULL DEFAULT false,
    converted_at TIMESTAMPTZ,
    conversion_type TEXT, -- 'signup', 'premium_upgrade', etc.
    
    -- Earnings
    flat_fee_earned NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    revenue_share_earned NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_earned NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending', -- pending, credited, paid
    credited_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partner payouts table
CREATE TABLE public.partner_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES public.directory_partners(id) ON DELETE CASCADE,
    
    amount NUMERIC(12,2) NOT NULL,
    payout_method TEXT NOT NULL DEFAULT 'bank_transfer', -- bank_transfer, paypal, check
    payment_reference TEXT,
    
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ,
    processed_by UUID,
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partner embed views (analytics for embedded widgets)
CREATE TABLE public.partner_embed_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES public.directory_partners(id) ON DELETE CASCADE,
    embed_token UUID NOT NULL,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    referrer_url TEXT,
    ip_address INET
);

-- Indexes
CREATE INDEX idx_directory_partners_user_id ON public.directory_partners(user_id);
CREATE INDEX idx_directory_partners_referral_code ON public.directory_partners(referral_code);
CREATE INDEX idx_directory_partners_status ON public.directory_partners(status);
CREATE INDEX idx_partner_referrals_partner_id ON public.partner_referrals(partner_id);
CREATE INDEX idx_partner_referrals_referral_code ON public.partner_referrals(referral_code);
CREATE INDEX idx_partner_payouts_partner_id ON public.partner_payouts(partner_id);
CREATE INDEX idx_partner_embed_views_partner_id ON public.partner_embed_views(partner_id);
CREATE INDEX idx_partner_embed_views_embed_token ON public.partner_embed_views(embed_token);

-- Enable RLS
ALTER TABLE public.directory_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_embed_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for directory_partners
CREATE POLICY "Partners can view their own record"
ON public.directory_partners FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Partners can update their own record"
ON public.directory_partners FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can apply as partners"
ON public.directory_partners FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all partners"
ON public.directory_partners FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for partner_referrals
CREATE POLICY "Partners can view their own referrals"
ON public.partner_referrals FOR SELECT
USING (partner_id IN (
    SELECT id FROM public.directory_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage all referrals"
ON public.partner_referrals FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for partner_payouts
CREATE POLICY "Partners can view their own payouts"
ON public.partner_payouts FOR SELECT
USING (partner_id IN (
    SELECT id FROM public.directory_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Partners can request payouts"
ON public.partner_payouts FOR INSERT
WITH CHECK (partner_id IN (
    SELECT id FROM public.directory_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage all payouts"
ON public.partner_payouts FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for partner_embed_views (public insert for tracking, partner read)
CREATE POLICY "Anyone can log embed views"
ON public.partner_embed_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Partners can view their embed analytics"
ON public.partner_embed_views FOR SELECT
USING (partner_id IN (
    SELECT id FROM public.directory_partners WHERE user_id = auth.uid()
));

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_partner_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- Trigger to auto-generate referral code
CREATE OR REPLACE FUNCTION public.set_partner_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    new_code TEXT;
BEGIN
    LOOP
        new_code := public.generate_partner_referral_code();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.directory_partners WHERE referral_code = new_code);
    END LOOP;
    NEW.referral_code := new_code;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_partner_referral_code_trigger
BEFORE INSERT ON public.directory_partners
FOR EACH ROW
WHEN (NEW.referral_code IS NULL)
EXECUTE FUNCTION public.set_partner_referral_code();

-- Function to update partner stats when referral is credited
CREATE OR REPLACE FUNCTION public.update_partner_stats_on_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update partner stats
    UPDATE public.directory_partners
    SET 
        total_referrals = total_referrals + 1,
        total_conversions = CASE WHEN NEW.is_converted THEN total_conversions + 1 ELSE total_conversions END,
        pending_earnings = pending_earnings + NEW.total_earned,
        updated_at = now()
    WHERE id = NEW.partner_id;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_partner_stats_trigger
AFTER INSERT ON public.partner_referrals
FOR EACH ROW
EXECUTE FUNCTION public.update_partner_stats_on_referral();

-- Function to update timestamps
CREATE TRIGGER update_directory_partners_updated_at
BEFORE UPDATE ON public.directory_partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_referrals_updated_at
BEFORE UPDATE ON public.partner_referrals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();