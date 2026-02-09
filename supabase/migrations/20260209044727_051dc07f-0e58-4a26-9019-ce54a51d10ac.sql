-- =====================================================
-- HOST VERIFICATION REQUESTS TABLE
-- =====================================================
CREATE TABLE public.host_verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL DEFAULT 'identity', -- identity, address, background_check
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, expired
    
    -- ID verification details
    id_document_type TEXT, -- passport, drivers_license, national_id
    id_document_url TEXT,
    id_selfie_url TEXT,
    
    -- Address verification
    address_document_url TEXT,
    
    -- Admin review
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    
    -- Timestamps
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    CONSTRAINT valid_verification_type CHECK (verification_type IN ('identity', 'address', 'background_check'))
);

-- Enable RLS
ALTER TABLE public.host_verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own verification requests"
    ON public.host_verification_requests FOR SELECT
    TO authenticated
    USING (host_id = auth.uid());

CREATE POLICY "Users can create their own verification requests"
    ON public.host_verification_requests FOR INSERT
    TO authenticated
    WITH CHECK (host_id = auth.uid());

CREATE POLICY "Admins can view all verification requests"
    ON public.host_verification_requests FOR SELECT
    TO authenticated
    USING (public.is_admin_secure());

CREATE POLICY "Admins can update verification requests"
    ON public.host_verification_requests FOR UPDATE
    TO authenticated
    USING (public.is_admin_secure());

-- Indexes
CREATE INDEX idx_host_verification_host ON public.host_verification_requests(host_id);
CREATE INDEX idx_host_verification_status ON public.host_verification_requests(status);

-- =====================================================
-- SECURITY DEPOSIT HOLDS TABLE
-- =====================================================
CREATE TABLE public.security_deposit_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.vacation_bookings(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL,
    host_id UUID NOT NULL,
    
    -- Amounts
    deposit_amount NUMERIC(10,2) NOT NULL,
    amount_held NUMERIC(10,2) NOT NULL DEFAULT 0,
    amount_deducted NUMERIC(10,2) NOT NULL DEFAULT 0,
    amount_refunded NUMERIC(10,2) NOT NULL DEFAULT 0,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending', -- pending, held, partially_claimed, claimed, released, disputed
    
    -- Stripe payment
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    
    -- Claim details
    claim_reason TEXT,
    claim_evidence_urls TEXT[],
    claim_submitted_at TIMESTAMPTZ,
    claim_reviewed_at TIMESTAMPTZ,
    claim_reviewed_by UUID,
    
    -- Dispute
    dispute_reason TEXT,
    dispute_submitted_at TIMESTAMPTZ,
    dispute_resolved_at TIMESTAMPTZ,
    
    -- Timestamps
    held_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_deposit_status CHECK (status IN ('pending', 'held', 'partially_claimed', 'claimed', 'released', 'disputed'))
);

-- Enable RLS
ALTER TABLE public.security_deposit_holds ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Guests can view their own deposit holds"
    ON public.security_deposit_holds FOR SELECT
    TO authenticated
    USING (guest_id = auth.uid());

CREATE POLICY "Hosts can view deposits for their properties"
    ON public.security_deposit_holds FOR SELECT
    TO authenticated
    USING (host_id = auth.uid());

CREATE POLICY "System can create deposit holds"
    ON public.security_deposit_holds FOR INSERT
    TO authenticated
    WITH CHECK (guest_id = auth.uid());

CREATE POLICY "Hosts can update deposits for claims"
    ON public.security_deposit_holds FOR UPDATE
    TO authenticated
    USING (host_id = auth.uid());

CREATE POLICY "Admins can manage all deposits"
    ON public.security_deposit_holds FOR ALL
    TO authenticated
    USING (public.is_admin_secure());

-- Indexes
CREATE INDEX idx_deposit_holds_booking ON public.security_deposit_holds(booking_id);
CREATE INDEX idx_deposit_holds_guest ON public.security_deposit_holds(guest_id);
CREATE INDEX idx_deposit_holds_host ON public.security_deposit_holds(host_id);
CREATE INDEX idx_deposit_holds_status ON public.security_deposit_holds(status);

-- =====================================================
-- ADD VERIFICATION BADGES TO PROFILES (if not exists)
-- =====================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'is_verified_host') THEN
        ALTER TABLE public.profiles ADD COLUMN is_verified_host BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'host_verified_at') THEN
        ALTER TABLE public.profiles ADD COLUMN host_verified_at TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'verification_badges') THEN
        ALTER TABLE public.profiles ADD COLUMN verification_badges TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- =====================================================
-- TRIGGER: Update profile when verification approved
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_host_verification_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        UPDATE public.profiles
        SET 
            is_verified_host = true,
            host_verified_at = now(),
            verification_badges = array_append(
                COALESCE(verification_badges, '{}'),
                NEW.verification_type
            )
        WHERE id = NEW.host_id;
        
        -- Also update all their properties
        UPDATE public.vacation_properties
        SET is_verified = true
        WHERE host_id = NEW.host_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_verification_approved
    AFTER UPDATE ON public.host_verification_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_host_verification_status();

-- Trigger for updated_at
CREATE TRIGGER update_host_verification_requests_updated_at
    BEFORE UPDATE ON public.host_verification_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_vacation_updated_at();

CREATE TRIGGER update_security_deposit_holds_updated_at
    BEFORE UPDATE ON public.security_deposit_holds
    FOR EACH ROW EXECUTE FUNCTION public.update_vacation_updated_at();