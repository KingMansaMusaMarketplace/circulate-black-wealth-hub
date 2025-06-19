
-- Add new Stripe price IDs for the business tiers
-- We'll keep the existing STRIPE_BUSINESS_PRICE_ID for the Professional tier
-- and add a new one for the Starter tier

-- First, let's add a new subscription tier enum value for business_starter
ALTER TYPE subscription_tier ADD VALUE IF NOT EXISTS 'business_starter';

-- Update the subscription tiers in the subscription service to support business_starter
-- The database is ready to handle the new tier through the existing enum
