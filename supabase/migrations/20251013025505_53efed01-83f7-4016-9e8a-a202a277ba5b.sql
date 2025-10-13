-- Performance Optimization: Add indexes for core tables

-- Transactions table indexes
CREATE INDEX IF NOT EXISTS idx_transactions_business_id ON public.transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON public.transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_business_date ON public.transactions(business_id, transaction_date DESC);

-- Businesses table indexes
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category) WHERE is_verified = true;
CREATE INDEX IF NOT EXISTS idx_businesses_location ON public.businesses(city, state) WHERE is_verified = true;
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON public.businesses(is_verified, average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_parent ON public.businesses(parent_business_id) WHERE parent_business_id IS NOT NULL;

-- QR Scans table indexes
CREATE INDEX IF NOT EXISTS idx_qr_scans_business ON public.qr_scans(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_scans_date ON public.qr_scans(created_at DESC);

-- Bookings table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_business ON public.bookings(business_id, booking_date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id, booking_date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status, booking_date DESC);

-- Activity Log indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON public.activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_business ON public.activity_log(business_id, created_at DESC);

-- Business Analytics indexes
CREATE INDEX IF NOT EXISTS idx_business_analytics_date ON public.business_analytics(business_id, date_recorded DESC);
CREATE INDEX IF NOT EXISTS idx_business_analytics_metric ON public.business_analytics(business_id, metric_type, date_recorded DESC);

COMMENT ON INDEX idx_transactions_business_date IS 'Optimizes business transaction history queries';
COMMENT ON INDEX idx_businesses_verified IS 'Optimizes directory listing queries';
COMMENT ON INDEX idx_qr_scans_business IS 'Optimizes QR scan analytics';
COMMENT ON INDEX idx_bookings_business IS 'Optimizes booking queries for business dashboard';