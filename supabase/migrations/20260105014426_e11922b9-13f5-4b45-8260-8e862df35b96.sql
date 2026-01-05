-- Add founding member fields to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS is_founding_member BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS founding_order INTEGER,
ADD COLUMN IF NOT EXISTS founding_joined_at TIMESTAMP WITH TIME ZONE;

-- Add founding sponsor field to corporate_subscriptions
ALTER TABLE public.corporate_subscriptions
ADD COLUMN IF NOT EXISTS is_founding_sponsor BOOLEAN DEFAULT false;

-- Create index for founding members query
CREATE INDEX IF NOT EXISTS idx_businesses_founding 
ON public.businesses(is_founding_member, founding_order) 
WHERE is_founding_member = true;

-- Mark existing businesses as founding members (first 100 by created_at)
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM businesses
  WHERE is_verified = true
)
UPDATE businesses b
SET 
  is_founding_member = true,
  founding_order = n.rn,
  founding_joined_at = b.created_at
FROM numbered n
WHERE b.id = n.id AND n.rn <= 100;

-- Mark existing sponsors as founding sponsors
UPDATE corporate_subscriptions
SET is_founding_sponsor = true
WHERE status = 'active';