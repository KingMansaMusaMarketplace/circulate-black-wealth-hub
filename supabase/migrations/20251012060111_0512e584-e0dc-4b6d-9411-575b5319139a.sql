-- Add logo and website fields to corporate_subscriptions table
ALTER TABLE corporate_subscriptions 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add index for faster queries when filtering active subscriptions with logos
CREATE INDEX IF NOT EXISTS idx_corporate_subscriptions_status_logo 
ON corporate_subscriptions(status, logo_url) 
WHERE status = 'active' AND logo_url IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN corporate_subscriptions.logo_url IS 'URL to sponsor company logo image';
COMMENT ON COLUMN corporate_subscriptions.website_url IS 'Company website URL for logo links';