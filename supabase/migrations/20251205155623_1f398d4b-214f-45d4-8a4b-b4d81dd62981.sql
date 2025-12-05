-- Create sponsor communications table
CREATE TABLE public.sponsor_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES public.corporate_subscriptions(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES auth.users(id),
  communication_type TEXT NOT NULL, -- 'email', 'call', 'meeting', 'note'
  subject TEXT,
  content TEXT NOT NULL,
  email_template TEXT, -- 'welcome', 'renewal', 'logo_reminder', 'custom'
  sent_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create sponsor documents table
CREATE TABLE public.sponsor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES public.corporate_subscriptions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'certificate', 'tax_letter', 'contract', 'invoice'
  document_url TEXT,
  document_data JSONB DEFAULT '{}',
  generated_by UUID REFERENCES auth.users(id),
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create sponsor reminders table
CREATE TABLE public.sponsor_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES public.corporate_subscriptions(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'renewal', 'follow_up', 'logo_upload', 'custom'
  reminder_date DATE NOT NULL,
  message TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sponsor_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sponsor_communications
CREATE POLICY "Admins can manage sponsor communications"
  ON public.sponsor_communications FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sponsors can view their own communications"
  ON public.sponsor_communications FOR SELECT
  USING (sponsor_id IN (
    SELECT id FROM public.corporate_subscriptions WHERE user_id = auth.uid()
  ));

-- RLS Policies for sponsor_documents
CREATE POLICY "Admins can manage sponsor documents"
  ON public.sponsor_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sponsors can view their own documents"
  ON public.sponsor_documents FOR SELECT
  USING (sponsor_id IN (
    SELECT id FROM public.corporate_subscriptions WHERE user_id = auth.uid()
  ));

-- RLS Policies for sponsor_reminders
CREATE POLICY "Admins can manage sponsor reminders"
  ON public.sponsor_reminders FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for performance
CREATE INDEX idx_sponsor_communications_sponsor_id ON public.sponsor_communications(sponsor_id);
CREATE INDEX idx_sponsor_documents_sponsor_id ON public.sponsor_documents(sponsor_id);
CREATE INDEX idx_sponsor_reminders_sponsor_id ON public.sponsor_reminders(sponsor_id);
CREATE INDEX idx_sponsor_reminders_date ON public.sponsor_reminders(reminder_date) WHERE is_completed = false;