-- Create price overrides table for custom pricing per date
CREATE TABLE IF NOT EXISTS public.property_price_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(property_id, date)
);

-- Enable RLS on price overrides
ALTER TABLE public.property_price_overrides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_price_overrides (use IF NOT EXISTS pattern via DO block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'property_price_overrides' AND policyname = 'Anyone can view price overrides'
  ) THEN
    CREATE POLICY "Anyone can view price overrides"
      ON public.property_price_overrides
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'property_price_overrides' AND policyname = 'Hosts can manage their property price overrides'
  ) THEN
    CREATE POLICY "Hosts can manage their property price overrides"
      ON public.property_price_overrides
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.vacation_properties vp
          WHERE vp.id = property_id AND vp.host_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Add indexes for performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_property_price_overrides_property_date ON public.property_price_overrides(property_id, date);
CREATE INDEX IF NOT EXISTS idx_property_availability_property_date ON public.property_availability(property_id, date);