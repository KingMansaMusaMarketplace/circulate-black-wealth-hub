ALTER TABLE public.kayla_cashflow_forecasts ADD COLUMN IF NOT EXISTS reasoning JSONB;
ALTER TABLE public.kayla_grant_matches ADD COLUMN IF NOT EXISTS reasoning JSONB;
ALTER TABLE public.kayla_price_recommendations ADD COLUMN IF NOT EXISTS reasoning JSONB;