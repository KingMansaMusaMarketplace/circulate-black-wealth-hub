-- Add unique constraint to prevent duplicate metrics for same date
ALTER TABLE public.sponsor_impact_metrics
ADD CONSTRAINT sponsor_impact_metrics_subscription_date_unique 
UNIQUE (subscription_id, metric_date);

-- Create index for faster metric queries
CREATE INDEX IF NOT EXISTS idx_sponsor_impact_metrics_date 
ON public.sponsor_impact_metrics(metric_date DESC);

CREATE INDEX IF NOT EXISTS idx_sponsor_impact_metrics_subscription 
ON public.sponsor_impact_metrics(subscription_id, metric_date DESC);