
-- Photography requests table for Premium hosts
CREATE TABLE public.photography_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  preferred_date DATE,
  preferred_time_slot TEXT,
  notes TEXT,
  photographer_name TEXT,
  scheduled_date DATE,
  photo_count INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.photography_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can view their own requests"
  ON public.photography_requests FOR SELECT
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can create their own requests"
  ON public.photography_requests FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own requests"
  ON public.photography_requests FOR UPDATE
  USING (auth.uid() = host_id);
