-- Performance Optimization: Add indexes for secondary tables (fixed immutability issue)

-- Sales Agent indexes
CREATE INDEX IF NOT EXISTS idx_sales_agents_referral ON public.sales_agents(referral_code) WHERE is_active = true;

-- Referrals table indexes
CREATE INDEX IF NOT EXISTS idx_referrals_agent ON public.referrals(sales_agent_id, referral_date DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_business ON public.referrals(referred_user_id, referral_date DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(commission_status, referral_date DESC);

-- Reviews table indexes  
CREATE INDEX IF NOT EXISTS idx_reviews_business ON public.reviews(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(business_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON public.reviews(customer_id, created_at DESC);

-- Forum indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON public.forum_topics(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_topics_user ON public.forum_topics(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_topic ON public.forum_replies(topic_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user ON public.forum_replies(user_id, created_at DESC);

-- Community events indexes (removed immutable function from WHERE clause)
CREATE INDEX IF NOT EXISTS idx_community_events_date ON public.community_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_community_events_organizer ON public.community_events(organizer_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user ON public.event_attendees(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event ON public.event_attendees(event_id, status);

-- Corporate subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_corporate_subscriptions_user ON public.corporate_subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_corporate_subscriptions_status ON public.corporate_subscriptions(status, current_period_end);

COMMENT ON INDEX idx_sales_agents_referral IS 'Optimizes referral code lookup';
COMMENT ON INDEX idx_referrals_agent IS 'Optimizes agent referral history queries';
COMMENT ON INDEX idx_reviews_business IS 'Optimizes business review display';
COMMENT ON INDEX idx_forum_topics_category IS 'Optimizes forum category browsing';
COMMENT ON INDEX idx_community_events_date IS 'Optimizes events date queries';