-- =====================================================
-- COMPLETE GROWTH ACCELERATION PACKAGE
-- Phase 1: Viral Referral System
-- Phase 2: Automated Business Import Engine
-- Phase 3: Sponsor Outreach CRM
-- =====================================================

-- =====================================================
-- PHASE 1: VIRAL REFERRAL SYSTEM
-- =====================================================

-- Referral Campaigns (time-limited bonus campaigns)
CREATE TABLE public.referral_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL DEFAULT 'standard' CHECK (campaign_type IN ('flash', 'milestone', 'team', 'seasonal', 'standard')),
  bonus_multiplier NUMERIC(3,1) DEFAULT 1.0,
  bonus_type TEXT DEFAULT 'points' CHECK (bonus_type IN ('points', 'cash', 'both')),
  bonus_points INTEGER DEFAULT 0,
  bonus_cash NUMERIC(10,2) DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  max_participants INTEGER,
  target_referrals INTEGER,
  requirements JSONB DEFAULT '{}',
  rewards JSONB DEFAULT '[]',
  banner_image_url TEXT,
  banner_color TEXT DEFAULT '#8B5CF6',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Campaign Participants
CREATE TABLE public.referral_campaign_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.referral_campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referrals_during_campaign INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  cash_earned NUMERIC(10,2) DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_referral_at TIMESTAMPTZ,
  UNIQUE(campaign_id, user_id)
);

-- Referral Milestones (achievement thresholds)
CREATE TABLE public.referral_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_count INTEGER NOT NULL UNIQUE,
  milestone_name TEXT NOT NULL,
  description TEXT,
  reward_type TEXT DEFAULT 'points' CHECK (reward_type IN ('badge', 'cash', 'points', 'exclusive', 'all')),
  reward_points INTEGER DEFAULT 0,
  reward_cash NUMERIC(10,2) DEFAULT 0,
  badge_name TEXT,
  badge_icon TEXT,
  badge_color TEXT DEFAULT '#F59E0B',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Milestone Progress
CREATE TABLE public.user_milestone_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES public.referral_milestones(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  reward_claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMPTZ,
  UNIQUE(user_id, milestone_id)
);

-- Referral Streaks
CREATE TABLE public.referral_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_referral_date DATE,
  streak_started_at DATE,
  total_streak_days INTEGER DEFAULT 0,
  streak_frozen_until DATE,
  freeze_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns to referral_stats if they don't exist
ALTER TABLE public.referral_stats 
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_referral_date DATE,
  ADD COLUMN IF NOT EXISTS campaign_wins INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS badges_earned TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS total_campaigns_joined INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS milestones_unlocked INTEGER DEFAULT 0;

-- Insert default milestones
INSERT INTO public.referral_milestones (milestone_count, milestone_name, description, reward_type, reward_points, badge_name, badge_icon, badge_color) VALUES
  (1, 'First Referral', 'Welcome to the community! You made your first referral.', 'all', 50, 'Starter', 'Star', '#10B981'),
  (5, 'Rising Star', 'You''ve referred 5 people. You''re on fire!', 'all', 100, 'Rising Star', 'TrendingUp', '#3B82F6'),
  (10, 'Connector', 'Double digits! 10 successful referrals.', 'all', 250, 'Connector', 'Users', '#8B5CF6'),
  (25, 'Influencer', 'You''re making waves with 25 referrals!', 'all', 500, 'Influencer', 'Megaphone', '#EC4899'),
  (50, 'Ambassador', '50 referrals! You''re officially an ambassador.', 'all', 1000, 'Ambassador', 'Award', '#F59E0B'),
  (100, 'Champion', 'The elite 100 club. You''re a true champion!', 'all', 2500, 'Champion', 'Trophy', '#EF4444'),
  (250, 'Legend', 'Legendary status achieved with 250 referrals!', 'all', 5000, 'Legend', 'Crown', '#FFD700'),
  (500, 'Icon', 'You''ve reached icon status. 500 referrals!', 'all', 10000, 'Icon', 'Zap', '#FF6B6B')
ON CONFLICT (milestone_count) DO NOTHING;

-- =====================================================
-- PHASE 2: AUTOMATED BUSINESS IMPORT ENGINE
-- =====================================================

-- Business Import Sources
CREATE TABLE public.business_import_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('csv', 'api', 'manual', 'scrape', 'partner')),
  api_endpoint TEXT,
  api_key_secret_name TEXT,
  description TEXT,
  field_mapping JSONB DEFAULT '{}',
  last_import_at TIMESTAMPTZ,
  total_imported INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Business Import Jobs
CREATE TABLE public.business_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.business_import_sources(id),
  initiated_by UUID NOT NULL REFERENCES auth.users(id),
  job_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  source_file_url TEXT,
  query_params JSONB DEFAULT '{}',
  field_mapping JSONB DEFAULT '{}',
  businesses_found INTEGER DEFAULT 0,
  businesses_imported INTEGER DEFAULT 0,
  duplicates_skipped INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  error_details JSONB DEFAULT '[]',
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invitation Templates
CREATE TABLE public.invitation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_type TEXT DEFAULT 'email' CHECK (template_type IN ('email', 'sms', 'both')),
  subject TEXT,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '["business_name", "claim_link", "platform_name"]',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  send_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bulk Invitation Campaigns
CREATE TABLE public.bulk_invitation_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES public.invitation_templates(id),
  target_criteria JSONB DEFAULT '{}',
  target_cities TEXT[],
  target_categories TEXT[],
  target_states TEXT[],
  exclude_previously_invited BOOLEAN DEFAULT true,
  min_days_between_invites INTEGER DEFAULT 14,
  total_targets INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  claimed_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'paused', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  send_rate_per_hour INTEGER DEFAULT 50,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns to b2b_external_leads
ALTER TABLE public.b2b_external_leads
  ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES public.business_import_sources(id),
  ADD COLUMN IF NOT EXISTS import_job_id UUID REFERENCES public.business_import_jobs(id),
  ADD COLUMN IF NOT EXISTS email_status TEXT DEFAULT 'not_sent' CHECK (email_status IN ('not_sent', 'sent', 'opened', 'clicked', 'bounced', 'replied', 'unsubscribed')),
  ADD COLUMN IF NOT EXISTS invitation_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_invited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS social_profiles JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS zip_code TEXT,
  ADD COLUMN IF NOT EXISTS owner_name TEXT,
  ADD COLUMN IF NOT EXISTS owner_email TEXT,
  ADD COLUMN IF NOT EXISTS data_quality_score INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS last_campaign_id UUID REFERENCES public.bulk_invitation_campaigns(id);

-- Insert default invitation template
INSERT INTO public.invitation_templates (name, template_type, subject, body, is_default) VALUES
  ('Default Claim Invitation', 'email', 
   'Claim Your Free Business Listing on {{platform_name}}',
   E'Hi {{owner_name}},\n\nWe found {{business_name}} and would love to have you join our community of Black-owned businesses!\n\nClaim your FREE listing today:\n{{claim_link}}\n\nBenefits include:\n• Increased visibility to customers seeking Black-owned businesses\n• Free business profile with photos and reviews\n• Connect with other business owners\n• Access to exclusive resources and events\n\nIt only takes 2 minutes to claim your listing.\n\nBest,\nThe {{platform_name}} Team',
   true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PHASE 3: SPONSOR OUTREACH CRM
-- =====================================================

-- Sponsor Prospects
CREATE TABLE public.sponsor_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  annual_revenue TEXT,
  employee_count TEXT,
  website TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  headquarters_city TEXT,
  headquarters_state TEXT,
  primary_contact_name TEXT,
  primary_contact_title TEXT,
  primary_contact_email TEXT,
  primary_contact_phone TEXT,
  primary_contact_linkedin TEXT,
  secondary_contacts JSONB DEFAULT '[]',
  source TEXT CHECK (source IN ('manual', 'linkedin', 'referral', 'inbound', 'event', 'cold_outreach', 'partner', 'other')),
  source_details TEXT,
  pipeline_stage TEXT DEFAULT 'research' CHECK (pipeline_stage IN ('research', 'outreach', 'contacted', 'meeting_scheduled', 'meeting_completed', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost', 'on_hold')),
  stage_changed_at TIMESTAMPTZ DEFAULT now(),
  expected_tier TEXT CHECK (expected_tier IN ('bronze', 'silver', 'gold', 'platinum', 'custom')),
  expected_close_date DATE,
  deal_value NUMERIC(12,2),
  deal_currency TEXT DEFAULT 'USD',
  probability INTEGER DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
  weighted_value NUMERIC(12,2) GENERATED ALWAYS AS (deal_value * probability / 100) STORED,
  lost_reason TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  last_contact_at TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  follow_up_notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sponsor Outreach Activities
CREATE TABLE public.sponsor_outreach_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES public.sponsor_prospects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('email', 'call', 'meeting', 'linkedin', 'note', 'task', 'proposal', 'contract', 'other')),
  subject TEXT,
  body TEXT,
  outcome TEXT,
  outcome_notes TEXT,
  duration_minutes INTEGER,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT false,
  performed_by UUID REFERENCES auth.users(id),
  email_message_id TEXT,
  email_opened BOOLEAN DEFAULT false,
  email_opened_at TIMESTAMPTZ,
  email_clicked BOOLEAN DEFAULT false,
  email_clicked_at TIMESTAMPTZ,
  meeting_link TEXT,
  meeting_recording_url TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sponsor Email Templates
CREATE TABLE public.sponsor_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'outreach' CHECK (category IN ('outreach', 'follow_up', 'proposal', 'meeting', 'nurture', 'closing', 'other')),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '["company_name", "contact_name", "sender_name"]',
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  reply_rate NUMERIC(5,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sponsor Email Sequences
CREATE TABLE public.sponsor_email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  target_tier TEXT,
  target_industry TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  total_enrolled INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0,
  avg_reply_rate NUMERIC(5,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Prospect Sequence Enrollments
CREATE TABLE public.prospect_sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES public.sponsor_prospects(id) ON DELETE CASCADE,
  sequence_id UUID NOT NULL REFERENCES public.sponsor_email_sequences(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'stopped', 'bounced', 'replied', 'converted')),
  next_send_at TIMESTAMPTZ,
  last_sent_at TIMESTAMPTZ,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  enrolled_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  stopped_reason TEXT,
  UNIQUE(prospect_id, sequence_id)
);

-- Insert default email templates
INSERT INTO public.sponsor_email_templates (name, category, subject, body) VALUES
  ('Initial Outreach', 'outreach', 
   'Partnership Opportunity with Black-Owned Business Network',
   E'Hi {{contact_name}},\n\nI noticed {{company_name}}''s commitment to diversity and inclusion, and wanted to reach out about a unique partnership opportunity.\n\nWe''re building the largest directory of Black-owned businesses in America, and our sponsorship program offers brands like yours direct access to this community.\n\nWould you be open to a brief call to explore how we might work together?\n\nBest,\n{{sender_name}}'),
  ('Follow Up 1', 'follow_up',
   'Quick follow up - {{company_name}} partnership',
   E'Hi {{contact_name}},\n\nJust wanted to follow up on my previous email about sponsorship opportunities.\n\nOur platform connects sponsors with over 4.7 million Black-owned businesses, offering authentic engagement with a community that values brand partners who show up meaningfully.\n\nHappy to share more details whenever convenient.\n\nBest,\n{{sender_name}}'),
  ('Meeting Request', 'meeting',
   'Let''s connect: {{company_name}} x Our Platform',
   E'Hi {{contact_name}},\n\nThank you for your interest! I''d love to walk you through our sponsorship tiers and discuss how {{company_name}} could benefit.\n\nAre you available for a 20-minute call this week? Here are some times that work for me:\n- [Time 1]\n- [Time 2]\n- [Time 3]\n\nLooking forward to connecting!\n\nBest,\n{{sender_name}}')
ON CONFLICT DO NOTHING;

-- Insert default sequence
INSERT INTO public.sponsor_email_sequences (name, description, target_tier, steps) VALUES
  ('Standard Sponsor Outreach', 'Default 4-email sequence for new sponsor prospects', 'gold',
   '[
     {"step": 1, "template_name": "Initial Outreach", "delay_days": 0},
     {"step": 2, "template_name": "Follow Up 1", "delay_days": 3},
     {"step": 3, "template_name": "Follow Up 2", "delay_days": 5},
     {"step": 4, "template_name": "Final Follow Up", "delay_days": 7}
   ]'::jsonb)
ON CONFLICT DO NOTHING;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Referral indexes
CREATE INDEX IF NOT EXISTS idx_referral_campaigns_active ON public.referral_campaigns(is_active, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_referral_campaigns_featured ON public.referral_campaigns(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_campaign_participants_user ON public.referral_campaign_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_campaign ON public.referral_campaign_participants(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_rank ON public.referral_campaign_participants(campaign_id, rank);
CREATE INDEX IF NOT EXISTS idx_user_milestones ON public.user_milestone_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_streaks_user ON public.referral_streaks(user_id);

-- Import indexes
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.business_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_source ON public.business_import_jobs(source_id);
CREATE INDEX IF NOT EXISTS idx_bulk_campaigns_status ON public.bulk_invitation_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_external_leads_email_status ON public.b2b_external_leads(email_status);
CREATE INDEX IF NOT EXISTS idx_external_leads_city ON public.b2b_external_leads(city);
CREATE INDEX IF NOT EXISTS idx_external_leads_state ON public.b2b_external_leads(state);
CREATE INDEX IF NOT EXISTS idx_external_leads_category ON public.b2b_external_leads(category);

-- CRM indexes
CREATE INDEX IF NOT EXISTS idx_prospects_stage ON public.sponsor_prospects(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_prospects_assigned ON public.sponsor_prospects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_prospects_priority ON public.sponsor_prospects(priority);
CREATE INDEX IF NOT EXISTS idx_prospects_follow_up ON public.sponsor_prospects(next_follow_up) WHERE next_follow_up IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_activities_prospect ON public.sponsor_outreach_activities(prospect_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.sponsor_outreach_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_scheduled ON public.sponsor_outreach_activities(scheduled_at) WHERE is_completed = false;
CREATE INDEX IF NOT EXISTS idx_sequence_enrollments_next ON public.prospect_sequence_enrollments(next_send_at) WHERE status = 'active';

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE public.referral_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_milestone_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_import_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_invitation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_outreach_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospect_sequence_enrollments ENABLE ROW LEVEL SECURITY;

-- Referral Campaigns - Public read, admin write
CREATE POLICY "Anyone can view active campaigns" ON public.referral_campaigns FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage campaigns" ON public.referral_campaigns FOR ALL USING (public.is_admin_secure());

-- Campaign Participants - Users see own, admins see all
CREATE POLICY "Users view own participation" ON public.referral_campaign_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users join campaigns" ON public.referral_campaign_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage participants" ON public.referral_campaign_participants FOR ALL USING (public.is_admin_secure());

-- Milestones - Public read
CREATE POLICY "Anyone can view milestones" ON public.referral_milestones FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage milestones" ON public.referral_milestones FOR ALL USING (public.is_admin_secure());

-- User Milestone Progress - Users see own
CREATE POLICY "Users view own progress" ON public.user_milestone_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own progress" ON public.user_milestone_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users claim rewards" ON public.user_milestone_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage progress" ON public.user_milestone_progress FOR ALL USING (public.is_admin_secure());

-- Streaks - Users see own
CREATE POLICY "Users view own streaks" ON public.referral_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own streaks" ON public.referral_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins manage streaks" ON public.referral_streaks FOR ALL USING (public.is_admin_secure());

-- Import Sources - Admin only
CREATE POLICY "Admins manage import sources" ON public.business_import_sources FOR ALL USING (public.is_admin_secure());

-- Import Jobs - Admin only
CREATE POLICY "Admins manage import jobs" ON public.business_import_jobs FOR ALL USING (public.is_admin_secure());

-- Invitation Templates - Admin only
CREATE POLICY "Admins manage templates" ON public.invitation_templates FOR ALL USING (public.is_admin_secure());

-- Bulk Campaigns - Admin only
CREATE POLICY "Admins manage bulk campaigns" ON public.bulk_invitation_campaigns FOR ALL USING (public.is_admin_secure());

-- Sponsor Prospects - Admin only
CREATE POLICY "Admins manage prospects" ON public.sponsor_prospects FOR ALL USING (public.is_admin_secure());

-- Outreach Activities - Admin only
CREATE POLICY "Admins manage activities" ON public.sponsor_outreach_activities FOR ALL USING (public.is_admin_secure());

-- Email Templates - Admin only
CREATE POLICY "Admins manage sponsor templates" ON public.sponsor_email_templates FOR ALL USING (public.is_admin_secure());

-- Email Sequences - Admin only
CREATE POLICY "Admins manage sequences" ON public.sponsor_email_sequences FOR ALL USING (public.is_admin_secure());

-- Sequence Enrollments - Admin only
CREATE POLICY "Admins manage enrollments" ON public.prospect_sequence_enrollments FOR ALL USING (public.is_admin_secure());

-- =====================================================
-- TRIGGERS FOR AUTOMATION
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT unnest(ARRAY[
      'referral_campaigns',
      'business_import_sources',
      'invitation_templates',
      'bulk_invitation_campaigns',
      'sponsor_prospects',
      'sponsor_email_templates',
      'sponsor_email_sequences'
    ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON public.%s;
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON public.%s
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END $$;

-- Prospect stage change tracking
CREATE OR REPLACE FUNCTION public.track_prospect_stage_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.pipeline_stage IS DISTINCT FROM NEW.pipeline_stage THEN
    NEW.stage_changed_at = now();
    
    -- Log the stage change as an activity
    INSERT INTO public.sponsor_outreach_activities (
      prospect_id,
      activity_type,
      subject,
      body,
      is_completed,
      completed_at
    ) VALUES (
      NEW.id,
      'note',
      'Pipeline Stage Changed',
      format('Stage changed from %s to %s', OLD.pipeline_stage, NEW.pipeline_stage),
      true,
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER track_prospect_stage
  BEFORE UPDATE ON public.sponsor_prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.track_prospect_stage_change();

-- Update campaign participant stats
CREATE OR REPLACE FUNCTION public.update_campaign_participant_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- This would be called when a referral is completed during an active campaign
  -- Implementation depends on existing referral tracking
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get active campaigns for a user
CREATE OR REPLACE FUNCTION public.get_active_campaigns()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  campaign_type TEXT,
  bonus_multiplier NUMERIC,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_joined BOOLEAN,
  participant_count BIGINT,
  my_rank INTEGER,
  my_referrals INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.campaign_type,
    c.bonus_multiplier,
    c.start_date,
    c.end_date,
    (p.user_id IS NOT NULL) AS is_joined,
    (SELECT COUNT(*) FROM public.referral_campaign_participants WHERE campaign_id = c.id) AS participant_count,
    p.rank AS my_rank,
    COALESCE(p.referrals_during_campaign, 0) AS my_referrals
  FROM public.referral_campaigns c
  LEFT JOIN public.referral_campaign_participants p ON c.id = p.campaign_id AND p.user_id = auth.uid()
  WHERE c.is_active = true
    AND c.start_date <= now()
    AND c.end_date >= now()
  ORDER BY c.is_featured DESC, c.end_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's milestone progress
CREATE OR REPLACE FUNCTION public.get_user_milestone_progress()
RETURNS TABLE (
  milestone_id UUID,
  milestone_count INTEGER,
  milestone_name TEXT,
  description TEXT,
  badge_name TEXT,
  badge_icon TEXT,
  badge_color TEXT,
  reward_points INTEGER,
  reward_cash NUMERIC,
  is_unlocked BOOLEAN,
  unlocked_at TIMESTAMPTZ,
  reward_claimed BOOLEAN,
  progress_percent INTEGER
) AS $$
DECLARE
  user_referrals INTEGER;
BEGIN
  -- Get user's total successful referrals
  SELECT COALESCE(successful_referrals, 0) INTO user_referrals
  FROM public.referral_stats
  WHERE user_id = auth.uid();

  RETURN QUERY
  SELECT 
    m.id AS milestone_id,
    m.milestone_count,
    m.milestone_name,
    m.description,
    m.badge_name,
    m.badge_icon,
    m.badge_color,
    m.reward_points,
    m.reward_cash,
    (ump.id IS NOT NULL) AS is_unlocked,
    ump.unlocked_at,
    COALESCE(ump.reward_claimed, false) AS reward_claimed,
    LEAST(100, (user_referrals * 100 / m.milestone_count))::INTEGER AS progress_percent
  FROM public.referral_milestones m
  LEFT JOIN public.user_milestone_progress ump ON m.id = ump.milestone_id AND ump.user_id = auth.uid()
  WHERE m.is_active = true
  ORDER BY m.milestone_count ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get campaign leaderboard
CREATE OR REPLACE FUNCTION public.get_campaign_leaderboard(p_campaign_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  rank INTEGER,
  user_id UUID,
  user_name TEXT,
  referrals INTEGER,
  points INTEGER,
  is_current_user BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY p.referrals_during_campaign DESC)::INTEGER AS rank,
    p.user_id,
    COALESCE(pr.full_name, 'Anonymous') AS user_name,
    p.referrals_during_campaign AS referrals,
    p.points_earned AS points,
    (p.user_id = auth.uid()) AS is_current_user
  FROM public.referral_campaign_participants p
  LEFT JOIN public.profiles pr ON p.user_id = pr.id
  WHERE p.campaign_id = p_campaign_id
  ORDER BY p.referrals_during_campaign DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get sponsor pipeline summary
CREATE OR REPLACE FUNCTION public.get_sponsor_pipeline_summary()
RETURNS TABLE (
  stage TEXT,
  count BIGINT,
  total_value NUMERIC,
  weighted_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.pipeline_stage AS stage,
    COUNT(*) AS count,
    COALESCE(SUM(p.deal_value), 0) AS total_value,
    COALESCE(SUM(p.weighted_value), 0) AS weighted_value
  FROM public.sponsor_prospects p
  GROUP BY p.pipeline_stage
  ORDER BY 
    CASE p.pipeline_stage
      WHEN 'research' THEN 1
      WHEN 'outreach' THEN 2
      WHEN 'contacted' THEN 3
      WHEN 'meeting_scheduled' THEN 4
      WHEN 'meeting_completed' THEN 5
      WHEN 'proposal_sent' THEN 6
      WHEN 'negotiation' THEN 7
      WHEN 'closed_won' THEN 8
      WHEN 'closed_lost' THEN 9
      WHEN 'on_hold' THEN 10
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;