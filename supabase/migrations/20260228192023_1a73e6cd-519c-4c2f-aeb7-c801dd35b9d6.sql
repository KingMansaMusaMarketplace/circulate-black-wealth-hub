
-- Automated Messaging: Templates and scheduled messages for hosts

CREATE TABLE public.host_message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL,
  property_id uuid REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  subject text,
  body text NOT NULL,
  trigger_type text NOT NULL DEFAULT 'manual',
  trigger_offset_hours int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_trigger CHECK (trigger_type IN ('booking_confirmed', 'before_checkin', 'at_checkin', 'during_stay', 'before_checkout', 'after_checkout', 'manual')),
  CONSTRAINT valid_category CHECK (category IN ('check_in', 'house_rules', 'local_recommendations', 'checkout', 'welcome', 'general'))
);

CREATE TABLE public.scheduled_guest_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES public.host_message_templates(id) ON DELETE SET NULL,
  booking_id uuid NOT NULL,
  host_id uuid NOT NULL,
  guest_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
  subject text,
  body text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed', 'cancelled'))
);

ALTER TABLE public.host_message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_guest_messages ENABLE ROW LEVEL SECURITY;

-- Templates: hosts manage their own
CREATE POLICY "Hosts manage own templates" ON public.host_message_templates
  FOR ALL USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);

-- Scheduled messages: hosts can view/manage, guests can view their own
CREATE POLICY "Hosts manage scheduled messages" ON public.scheduled_guest_messages
  FOR ALL USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Guests view own scheduled messages" ON public.scheduled_guest_messages
  FOR SELECT USING (auth.uid() = guest_id AND status = 'sent');

-- Index for efficient query of pending messages
CREATE INDEX idx_scheduled_messages_pending ON public.scheduled_guest_messages (scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_message_templates_host ON public.host_message_templates (host_id);
