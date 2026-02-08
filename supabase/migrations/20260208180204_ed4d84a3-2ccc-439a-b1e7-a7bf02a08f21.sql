-- =============================================
-- MANSA STAYS FEATURES - INCREMENTAL MIGRATION
-- =============================================

-- =============================================
-- 1. CANCELLATION POLICY ENUM (if not exists)
-- =============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cancellation_policy_type') THEN
        CREATE TYPE public.cancellation_policy_type AS ENUM ('flexible', 'moderate', 'strict');
    END IF;
END $$;

-- Add cancellation policy to vacation_properties
ALTER TABLE public.vacation_properties 
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'moderate';

-- Add security deposit to vacation_properties
ALTER TABLE public.vacation_properties 
ADD COLUMN IF NOT EXISTS security_deposit NUMERIC(10,2) DEFAULT 0;

-- =============================================
-- 2. DYNAMIC PRICING RULES
-- =============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_rule_type') THEN
        CREATE TYPE public.pricing_rule_type AS ENUM ('weekend', 'seasonal', 'last_minute', 'length_of_stay', 'custom');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.property_pricing_rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL,
    name TEXT NOT NULL,
    adjustment_type TEXT NOT NULL DEFAULT 'percent',
    adjustment_value NUMERIC(10,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    days_of_week INTEGER[],
    min_days_before INTEGER,
    min_nights INTEGER,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.property_pricing_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view pricing rules for active properties" ON public.property_pricing_rules;
CREATE POLICY "Anyone can view pricing rules for active properties"
ON public.property_pricing_rules FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.vacation_properties 
        WHERE id = property_pricing_rules.property_id 
        AND is_active = true
    )
);

DROP POLICY IF EXISTS "Hosts can manage their pricing rules" ON public.property_pricing_rules;
CREATE POLICY "Hosts can manage their pricing rules"
ON public.property_pricing_rules FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.vacation_properties 
        WHERE id = property_pricing_rules.property_id 
        AND host_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.vacation_properties 
        WHERE id = property_pricing_rules.property_id 
        AND host_id = auth.uid()
    )
);

-- =============================================
-- 3. GUEST-HOST MESSAGING
-- =============================================
CREATE TABLE IF NOT EXISTS public.stays_conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL,
    host_id UUID NOT NULL,
    booking_id UUID REFERENCES public.vacation_bookings(id) ON DELETE SET NULL,
    subject TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    guest_unread_count INTEGER DEFAULT 0,
    host_unread_count INTEGER DEFAULT 0,
    is_archived_by_guest BOOLEAN DEFAULT false,
    is_archived_by_host BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stays_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.stays_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    attachments JSONB DEFAULT '[]',
    message_type TEXT DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stays_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants can view their conversations" ON public.stays_conversations;
CREATE POLICY "Participants can view their conversations"
ON public.stays_conversations FOR SELECT TO authenticated
USING (guest_id = auth.uid() OR host_id = auth.uid());

DROP POLICY IF EXISTS "Guests can start conversations" ON public.stays_conversations;
CREATE POLICY "Guests can start conversations"
ON public.stays_conversations FOR INSERT TO authenticated
WITH CHECK (guest_id = auth.uid());

DROP POLICY IF EXISTS "Participants can update their conversations" ON public.stays_conversations;
CREATE POLICY "Participants can update their conversations"
ON public.stays_conversations FOR UPDATE TO authenticated
USING (guest_id = auth.uid() OR host_id = auth.uid());

DROP POLICY IF EXISTS "Participants can view messages" ON public.stays_messages;
CREATE POLICY "Participants can view messages"
ON public.stays_messages FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.stays_conversations 
        WHERE id = stays_messages.conversation_id 
        AND (guest_id = auth.uid() OR host_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Participants can send messages" ON public.stays_messages;
CREATE POLICY "Participants can send messages"
ON public.stays_messages FOR INSERT TO authenticated
WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.stays_conversations 
        WHERE id = stays_messages.conversation_id 
        AND (guest_id = auth.uid() OR host_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Participants can update messages" ON public.stays_messages;
CREATE POLICY "Participants can update messages"
ON public.stays_messages FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.stays_conversations 
        WHERE id = stays_messages.conversation_id 
        AND (guest_id = auth.uid() OR host_id = auth.uid())
    )
);

CREATE INDEX IF NOT EXISTS idx_stays_messages_conversation ON public.stays_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stays_conversations_guest ON public.stays_conversations(guest_id);
CREATE INDEX IF NOT EXISTS idx_stays_conversations_host ON public.stays_conversations(host_id);

-- =============================================
-- 4. REVIEWS SYSTEM
-- =============================================
CREATE TABLE IF NOT EXISTS public.stays_reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.vacation_bookings(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL,
    reviewer_type TEXT NOT NULL,
    reviewee_id UUID NOT NULL,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    checkin_rating INTEGER CHECK (checkin_rating >= 1 AND checkin_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    review_text TEXT,
    host_response TEXT,
    host_response_at TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN DEFAULT true,
    is_flagged BOOLEAN DEFAULT false,
    flag_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stays_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public reviews" ON public.stays_reviews;
CREATE POLICY "Anyone can view public reviews"
ON public.stays_reviews FOR SELECT
USING (is_public = true);

DROP POLICY IF EXISTS "Users can create their own reviews" ON public.stays_reviews;
CREATE POLICY "Users can create their own reviews"
ON public.stays_reviews FOR INSERT TO authenticated
WITH CHECK (reviewer_id = auth.uid());

DROP POLICY IF EXISTS "Reviewers and hosts can update reviews" ON public.stays_reviews;
CREATE POLICY "Reviewers and hosts can update reviews"
ON public.stays_reviews FOR UPDATE TO authenticated
USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_stays_reviews_property ON public.stays_reviews(property_id, created_at DESC);

-- =============================================
-- 5. HOUSE RULES ACCEPTANCE
-- =============================================
CREATE TABLE IF NOT EXISTS public.stays_house_rules_acceptance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.vacation_bookings(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL,
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    rules_text TEXT NOT NULL,
    rules_version TEXT DEFAULT '1.0',
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ip_address INET
);

ALTER TABLE public.stays_house_rules_acceptance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guests can view their acceptances" ON public.stays_house_rules_acceptance;
CREATE POLICY "Guests can view their acceptances"
ON public.stays_house_rules_acceptance FOR SELECT TO authenticated
USING (guest_id = auth.uid());

DROP POLICY IF EXISTS "Guests can accept house rules" ON public.stays_house_rules_acceptance;
CREATE POLICY "Guests can accept house rules"
ON public.stays_house_rules_acceptance FOR INSERT TO authenticated
WITH CHECK (guest_id = auth.uid());

-- =============================================
-- 6. SECURITY DEPOSITS
-- =============================================
CREATE TABLE IF NOT EXISTS public.stays_security_deposits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.vacation_bookings(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL,
    host_id UUID NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending',
    held_at TIMESTAMP WITH TIME ZONE,
    released_at TIMESTAMP WITH TIME ZONE,
    stripe_payment_intent_id TEXT,
    claimed_amount NUMERIC(10,2),
    claim_reason TEXT,
    claim_evidence JSONB DEFAULT '[]',
    claimed_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stays_security_deposits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guests and hosts can view their deposits" ON public.stays_security_deposits;
CREATE POLICY "Guests and hosts can view their deposits"
ON public.stays_security_deposits FOR SELECT TO authenticated
USING (guest_id = auth.uid() OR host_id = auth.uid());

DROP POLICY IF EXISTS "System can create deposits" ON public.stays_security_deposits;
CREATE POLICY "System can create deposits"
ON public.stays_security_deposits FOR INSERT TO authenticated
WITH CHECK (guest_id = auth.uid());

DROP POLICY IF EXISTS "Hosts can update deposit claims" ON public.stays_security_deposits;
CREATE POLICY "Hosts can update deposit claims"
ON public.stays_security_deposits FOR UPDATE TO authenticated
USING (host_id = auth.uid() OR guest_id = auth.uid());

-- =============================================
-- 7. HOST PAYOUT TRACKING
-- =============================================
CREATE TABLE IF NOT EXISTS public.stays_host_payouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID NOT NULL,
    booking_id UUID REFERENCES public.vacation_bookings(id) ON DELETE SET NULL,
    gross_amount NUMERIC(10,2) NOT NULL,
    platform_fee NUMERIC(10,2) NOT NULL,
    net_amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending',
    scheduled_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    stripe_transfer_id TEXT,
    stripe_payout_id TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stays_host_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Hosts can view their payouts" ON public.stays_host_payouts;
CREATE POLICY "Hosts can view their payouts"
ON public.stays_host_payouts FOR SELECT TO authenticated
USING (host_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_stays_host_payouts_host ON public.stays_host_payouts(host_id, created_at DESC);

-- =============================================
-- 8. HOST ANALYTICS (Property Views)
-- =============================================
CREATE TABLE IF NOT EXISTS public.stays_property_views (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    viewer_id UUID,
    session_id TEXT,
    view_type TEXT DEFAULT 'detail',
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stays_property_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Hosts can view their property analytics" ON public.stays_property_views;
CREATE POLICY "Hosts can view their property analytics"
ON public.stays_property_views FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.vacation_properties 
        WHERE id = stays_property_views.property_id 
        AND host_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Anyone can log property views" ON public.stays_property_views;
CREATE POLICY "Anyone can log property views"
ON public.stays_property_views FOR INSERT
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_stays_property_views_property ON public.stays_property_views(property_id, created_at DESC);

-- =============================================
-- 9. AUTOMATED MESSAGE TEMPLATES
-- =============================================
CREATE TABLE IF NOT EXISTS public.stays_message_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID NOT NULL,
    property_id UUID REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    trigger_type TEXT NOT NULL,
    trigger_hours_before INTEGER,
    subject TEXT NOT NULL,
    message_body TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stays_message_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Hosts can manage their templates" ON public.stays_message_templates;
CREATE POLICY "Hosts can manage their templates"
ON public.stays_message_templates FOR ALL TO authenticated
USING (host_id = auth.uid())
WITH CHECK (host_id = auth.uid());

-- =============================================
-- 10. ID VERIFICATION
-- =============================================
CREATE TABLE IF NOT EXISTS public.stays_id_verification (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    verification_type TEXT NOT NULL,
    verification_status TEXT DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    verification_data JSONB DEFAULT '{}',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stays_id_verification ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own verification" ON public.stays_id_verification;
CREATE POLICY "Users can view their own verification"
ON public.stays_id_verification FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can request verification" ON public.stays_id_verification;
CREATE POLICY "Users can request verification"
ON public.stays_id_verification FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- =============================================
-- 11. UPDATE VACATION_BOOKINGS FOR CANCELLATION
-- =============================================
ALTER TABLE public.vacation_bookings 
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_by UUID,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT NULL;

-- =============================================
-- 12. TRIGGER: Update property ratings
-- =============================================
CREATE OR REPLACE FUNCTION public.update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.vacation_properties
    SET 
        average_rating = (
            SELECT COALESCE(AVG(overall_rating), 0)
            FROM public.stays_reviews
            WHERE property_id = NEW.property_id
            AND is_public = true
            AND reviewer_type = 'guest'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.stays_reviews
            WHERE property_id = NEW.property_id
            AND is_public = true
            AND reviewer_type = 'guest'
        ),
        updated_at = now()
    WHERE id = NEW.property_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_property_rating_trigger ON public.stays_reviews;
CREATE TRIGGER update_property_rating_trigger
AFTER INSERT OR UPDATE ON public.stays_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_property_rating();

-- =============================================
-- 13. TRIGGER: Update conversation on new message
-- =============================================
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.stays_conversations
    SET 
        last_message_at = NEW.created_at,
        guest_unread_count = CASE 
            WHEN NEW.sender_id = host_id THEN guest_unread_count + 1 
            ELSE guest_unread_count 
        END,
        host_unread_count = CASE 
            WHEN NEW.sender_id = guest_id THEN host_unread_count + 1 
            ELSE host_unread_count 
        END
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_conversation_on_message ON public.stays_messages;
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON public.stays_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();