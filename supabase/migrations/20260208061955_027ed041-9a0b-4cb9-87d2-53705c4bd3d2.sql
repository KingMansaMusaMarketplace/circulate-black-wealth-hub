-- Create property type enum
CREATE TYPE public.property_type AS ENUM ('house', 'apartment', 'cabin', 'villa', 'cottage', 'condo', 'townhouse', 'loft', 'studio', 'other');

-- Create booking status enum
CREATE TYPE public.vacation_booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'refunded');

-- =====================================================
-- 1. VACATION PROPERTIES TABLE
-- =====================================================
CREATE TABLE public.vacation_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    property_type property_type DEFAULT 'house',
    
    -- Location
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Property details
    bedrooms INTEGER DEFAULT 1,
    bathrooms DECIMAL(3, 1) DEFAULT 1,
    max_guests INTEGER DEFAULT 2,
    
    -- Pricing
    base_nightly_rate DECIMAL(10, 2) NOT NULL,
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee_percent DECIMAL(5, 2) DEFAULT 7.5,
    
    -- Amenities and rules
    amenities JSONB DEFAULT '[]'::jsonb,
    house_rules TEXT,
    photos JSONB DEFAULT '[]'::jsonb,
    
    -- Settings
    is_active BOOLEAN DEFAULT false,
    is_instant_book BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER DEFAULT 30,
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    
    -- Pets
    pets_allowed BOOLEAN DEFAULT false,
    pet_fee DECIMAL(10, 2) DEFAULT 0,
    
    -- Stats
    average_rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vacation_properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vacation_properties
CREATE POLICY "Anyone can view active properties"
    ON public.vacation_properties FOR SELECT
    USING (is_active = true);

CREATE POLICY "Hosts can view their own properties"
    ON public.vacation_properties FOR SELECT
    TO authenticated
    USING (host_id = auth.uid());

CREATE POLICY "Hosts can create their own properties"
    ON public.vacation_properties FOR INSERT
    TO authenticated
    WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update their own properties"
    ON public.vacation_properties FOR UPDATE
    TO authenticated
    USING (host_id = auth.uid())
    WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can delete their own properties"
    ON public.vacation_properties FOR DELETE
    TO authenticated
    USING (host_id = auth.uid());

-- Indexes
CREATE INDEX idx_vacation_properties_host ON public.vacation_properties(host_id);
CREATE INDEX idx_vacation_properties_active ON public.vacation_properties(is_active) WHERE is_active = true;
CREATE INDEX idx_vacation_properties_location ON public.vacation_properties(city, state);
CREATE INDEX idx_vacation_properties_price ON public.vacation_properties(base_nightly_rate);

-- =====================================================
-- 2. PROPERTY AVAILABILITY TABLE
-- =====================================================
CREATE TABLE public.property_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    custom_price DECIMAL(10, 2),
    booking_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(property_id, date)
);

-- Enable RLS
ALTER TABLE public.property_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_availability
CREATE POLICY "Anyone can view availability for active properties"
    ON public.property_availability FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.vacation_properties
            WHERE id = property_id AND is_active = true
        )
    );

CREATE POLICY "Hosts can manage availability for their properties"
    ON public.property_availability FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.vacation_properties
            WHERE id = property_id AND host_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vacation_properties
            WHERE id = property_id AND host_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX idx_property_availability_property ON public.property_availability(property_id);
CREATE INDEX idx_property_availability_date ON public.property_availability(date);
CREATE INDEX idx_property_availability_lookup ON public.property_availability(property_id, date, is_available);

-- =====================================================
-- 3. VACATION BOOKINGS TABLE
-- =====================================================
CREATE TABLE public.vacation_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE RESTRICT,
    guest_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Dates
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_nights INTEGER NOT NULL,
    num_guests INTEGER DEFAULT 1,
    num_pets INTEGER DEFAULT 0,
    
    -- Pricing breakdown
    nightly_rate DECIMAL(10, 2) NOT NULL,
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    pet_fee DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    host_payout DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status vacation_booking_status DEFAULT 'pending',
    
    -- Payment
    payment_intent_id TEXT,
    stripe_charge_id TEXT,
    payout_status TEXT DEFAULT 'pending',
    payout_date TIMESTAMPTZ,
    
    -- Guest info
    guest_name TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    special_requests TEXT,
    
    -- Timestamps
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- Enable RLS
ALTER TABLE public.vacation_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vacation_bookings
CREATE POLICY "Guests can view their own bookings"
    ON public.vacation_bookings FOR SELECT
    TO authenticated
    USING (guest_id = auth.uid());

CREATE POLICY "Hosts can view bookings for their properties"
    ON public.vacation_bookings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.vacation_properties
            WHERE id = property_id AND host_id = auth.uid()
        )
    );

CREATE POLICY "Guests can create bookings"
    ON public.vacation_bookings FOR INSERT
    TO authenticated
    WITH CHECK (guest_id = auth.uid());

CREATE POLICY "Guests can update their pending bookings"
    ON public.vacation_bookings FOR UPDATE
    TO authenticated
    USING (guest_id = auth.uid() AND status = 'pending')
    WITH CHECK (guest_id = auth.uid());

CREATE POLICY "Hosts can update booking status"
    ON public.vacation_bookings FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.vacation_properties
            WHERE id = property_id AND host_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX idx_vacation_bookings_property ON public.vacation_bookings(property_id);
CREATE INDEX idx_vacation_bookings_guest ON public.vacation_bookings(guest_id);
CREATE INDEX idx_vacation_bookings_dates ON public.vacation_bookings(check_in_date, check_out_date);
CREATE INDEX idx_vacation_bookings_status ON public.vacation_bookings(status);

-- =====================================================
-- 4. PROPERTY REVIEWS TABLE
-- =====================================================
CREATE TABLE public.property_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES public.vacation_bookings(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Overall rating
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Category ratings
    cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
    accuracy INTEGER CHECK (accuracy >= 1 AND accuracy <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    location INTEGER CHECK (location >= 1 AND location <= 5),
    check_in INTEGER CHECK (check_in >= 1 AND check_in <= 5),
    value INTEGER CHECK (value >= 1 AND value <= 5),
    
    -- Content
    review_text TEXT,
    host_response TEXT,
    host_response_at TIMESTAMPTZ,
    
    -- Status
    is_public BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(booking_id)
);

-- Enable RLS
ALTER TABLE public.property_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_reviews
CREATE POLICY "Anyone can view public reviews"
    ON public.property_reviews FOR SELECT
    USING (is_public = true);

CREATE POLICY "Guests can view their own reviews"
    ON public.property_reviews FOR SELECT
    TO authenticated
    USING (guest_id = auth.uid());

CREATE POLICY "Guests can create reviews for completed bookings"
    ON public.property_reviews FOR INSERT
    TO authenticated
    WITH CHECK (
        guest_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.vacation_bookings
            WHERE id = booking_id 
            AND guest_id = auth.uid()
            AND status = 'completed'
        )
    );

CREATE POLICY "Guests can update their own reviews"
    ON public.property_reviews FOR UPDATE
    TO authenticated
    USING (guest_id = auth.uid())
    WITH CHECK (guest_id = auth.uid());

CREATE POLICY "Hosts can respond to reviews"
    ON public.property_reviews FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.vacation_properties
            WHERE id = property_id AND host_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX idx_property_reviews_property ON public.property_reviews(property_id);
CREATE INDEX idx_property_reviews_guest ON public.property_reviews(guest_id);
CREATE INDEX idx_property_reviews_rating ON public.property_reviews(rating);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_vacation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vacation_properties_updated_at
    BEFORE UPDATE ON public.vacation_properties
    FOR EACH ROW EXECUTE FUNCTION public.update_vacation_updated_at();

CREATE TRIGGER update_vacation_bookings_updated_at
    BEFORE UPDATE ON public.vacation_bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_vacation_updated_at();

CREATE TRIGGER update_property_reviews_updated_at
    BEFORE UPDATE ON public.property_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_vacation_updated_at();

-- Update property rating when review is added
CREATE OR REPLACE FUNCTION public.update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.vacation_properties
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.property_reviews
            WHERE property_id = NEW.property_id AND is_public = true
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.property_reviews
            WHERE property_id = NEW.property_id AND is_public = true
        )
    WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_property_rating_on_review
    AFTER INSERT OR UPDATE ON public.property_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_property_rating();

-- Block availability dates when booking is confirmed
CREATE OR REPLACE FUNCTION public.block_availability_on_booking()
RETURNS TRIGGER AS $$
DECLARE
    d DATE;
BEGIN
    IF NEW.status = 'confirmed' AND (OLD IS NULL OR OLD.status != 'confirmed') THEN
        FOR d IN SELECT generate_series(NEW.check_in_date, NEW.check_out_date - INTERVAL '1 day', '1 day')::date
        LOOP
            INSERT INTO public.property_availability (property_id, date, is_available, booking_id)
            VALUES (NEW.property_id, d, false, NEW.id)
            ON CONFLICT (property_id, date) 
            DO UPDATE SET is_available = false, booking_id = NEW.id;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER block_dates_on_booking_confirm
    AFTER INSERT OR UPDATE ON public.vacation_bookings
    FOR EACH ROW EXECUTE FUNCTION public.block_availability_on_booking();