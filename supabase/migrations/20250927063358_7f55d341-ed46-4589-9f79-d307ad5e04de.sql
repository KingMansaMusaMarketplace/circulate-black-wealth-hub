-- Enable realtime for qr_scans table for live analytics
ALTER TABLE public.qr_scans REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.qr_scans;

-- Enable realtime for businesses table for new business notifications
ALTER TABLE public.businesses REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;

-- Enable realtime for transactions table for live transaction tracking
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Create notification preferences table for users
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT true,
  new_businesses BOOLEAN DEFAULT true,
  special_offers BOOLEAN DEFAULT true,
  loyalty_updates BOOLEAN DEFAULT true,
  event_reminders BOOLEAN DEFAULT true,
  location_based BOOLEAN DEFAULT false,
  weekly_digest BOOLEAN DEFAULT true,
  reward_expiry BOOLEAN DEFAULT true,
  point_milestones BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on notification preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification preferences
CREATE POLICY "Users can manage their own notification preferences"
ON public.notification_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notification_preferences_updated_at();

-- Create activity_log table for comprehensive activity tracking
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB DEFAULT '{}',
  points_involved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on activity log
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity log
CREATE POLICY "Users can view their own activity"
ON public.activity_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity"
ON public.activity_log
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners can view activity for their businesses"
ON public.activity_log
FOR SELECT
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Enable realtime for activity_log
ALTER TABLE public.activity_log REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;

-- Function to log user activity automatically (fixed parameter defaults)
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_business_id UUID DEFAULT NULL,
  p_activity_data JSONB DEFAULT '{}',
  p_points_involved INTEGER DEFAULT 0
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.activity_log (
    user_id,
    business_id,
    activity_type,
    activity_data,
    points_involved
  ) VALUES (
    p_user_id,
    p_business_id,
    p_activity_type,
    p_activity_data,
    p_points_involved
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;