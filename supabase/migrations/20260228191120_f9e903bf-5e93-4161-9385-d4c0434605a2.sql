
-- Mansa Promise: Guest Guarantee system
-- Tracks which guarantees each property meets and stores guarantee definitions

CREATE TABLE public.mansa_promise_guarantees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guarantee_key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Shield',
  category text NOT NULL DEFAULT 'safety',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Property-level compliance tracking
CREATE TABLE public.property_guarantee_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
  guarantee_id uuid NOT NULL REFERENCES public.mansa_promise_guarantees(id) ON DELETE CASCADE,
  is_compliant boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  verified_by uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(property_id, guarantee_id)
);

ALTER TABLE public.mansa_promise_guarantees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_guarantee_compliance ENABLE ROW LEVEL SECURITY;

-- Guarantees are publicly readable
CREATE POLICY "Anyone can view guarantees"
  ON public.mansa_promise_guarantees FOR SELECT
  USING (true);

-- Compliance: hosts can view/manage their own properties
CREATE POLICY "Hosts can view their property compliance"
  ON public.property_guarantee_compliance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vacation_properties vp
      WHERE vp.id = property_id AND vp.host_id = auth.uid()
    )
  );

CREATE POLICY "Public can view compliant properties"
  ON public.property_guarantee_compliance FOR SELECT
  USING (is_compliant = true);

CREATE POLICY "Hosts can update their property compliance"
  ON public.property_guarantee_compliance FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.vacation_properties vp
      WHERE vp.id = property_id AND vp.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can insert their property compliance"
  ON public.property_guarantee_compliance FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vacation_properties vp
      WHERE vp.id = property_id AND vp.host_id = auth.uid()
    )
  );

-- Seed the core Mansa Promise guarantees
INSERT INTO public.mansa_promise_guarantees (guarantee_key, name, description, icon_name, category, sort_order) VALUES
  ('clean_certified', 'Clean & Certified', 'Professional cleaning verified between every guest stay with hospital-grade sanitization standards', 'Sparkles', 'safety', 1),
  ('identity_verified', 'Identity Verified Host', 'Host identity has been verified through government ID and background check', 'UserCheck', 'trust', 2),
  ('accurate_listing', 'Accurate Listing Guarantee', 'If the property doesn''t match the listing, get a full refund or rebooking within 24 hours', 'CheckCircle', 'accuracy', 3),
  ('easy_checkin', 'Easy Check-In', 'Self check-in with detailed instructions provided 48 hours before arrival', 'Key', 'convenience', 4),
  ('responsive_host', 'Responsive Host', 'Host responds to messages within 1 hour during business hours', 'MessageCircle', 'communication', 5),
  ('safety_essentials', 'Safety Essentials', 'Smoke detectors, carbon monoxide detectors, fire extinguisher, and first aid kit verified', 'ShieldCheck', 'safety', 6),
  ('fair_cancellation', 'Fair Cancellation', 'Free cancellation up to 48 hours before check-in with full refund', 'RefreshCcw', 'policy', 7),
  ('no_hidden_fees', 'No Hidden Fees', 'Total price shown upfront — no surprise cleaning fees or service charges at checkout', 'DollarSign', 'transparency', 8);
