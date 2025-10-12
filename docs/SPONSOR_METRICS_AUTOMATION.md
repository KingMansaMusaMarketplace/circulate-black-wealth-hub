# Corporate Sponsor Impact Metrics Automation

This document explains how the sponsor impact metrics system works and how to set up automated daily calculations.

## Overview

The impact metrics system automatically tracks the real economic impact of corporate sponsorships by analyzing marketplace transactions. It calculates:

- **Businesses Supported**: Unique Black-owned businesses that received transactions
- **Total Transactions**: Number of completed marketplace transactions
- **Community Reach**: Estimated people impacted (unique customers × 10)
- **Economic Impact**: Total transaction value × 2.3 (Black dollar multiplier effect)

## How It Works

### 1. Data Collection
The system queries the `platform_transactions` table for all successful transactions since each sponsor's subscription started.

### 2. Calculation Logic
```typescript
// Unique businesses
const uniqueBusinesses = new Set(transactions.map(t => t.business_id));

// Economic impact with multiplier
const totalValue = transactions.reduce((sum, t) => sum + t.amount_total, 0);
const economicImpact = totalValue * 2.3; // Black dollar circulates 2.3x
```

### 3. Storage
Metrics are stored daily in `sponsor_impact_metrics` table with a unique constraint on `(subscription_id, metric_date)` to prevent duplicates.

## Automated Scheduling Options

### Option 1: Supabase Cron (Recommended)

Set up a daily cron job in Supabase to automatically calculate metrics:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily calculation at midnight UTC
SELECT cron.schedule(
  'calculate-sponsor-metrics-daily',
  '0 0 * * *', -- Every day at midnight
  $$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/calculate-sponsor-impact',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```

**To set this up:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL above (replace YOUR_SERVICE_ROLE_KEY)
3. Verify the cron job: `SELECT * FROM cron.job;`

### Option 2: External Cron Service

Use services like cron-job.org, EasyCron, or GitHub Actions:

**GitHub Actions Example:**
```yaml
# .github/workflows/calculate-metrics.yml
name: Calculate Sponsor Metrics
on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
  workflow_dispatch: # Allow manual trigger

jobs:
  calculate:
    runs-on: ubuntu-latest
    steps:
      - name: Calculate Metrics
        run: |
          curl -X POST \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/calculate-sponsor-impact
```

### Option 3: Manual Trigger (Admin Dashboard)

Admins can manually trigger calculations from the admin dashboard using the `SponsorMetricsControl` component.

## API Endpoints

### Calculate All Metrics
```bash
POST /functions/v1/calculate-sponsor-impact
Authorization: Bearer <SERVICE_ROLE_KEY>

Response:
{
  "success": true,
  "processed": 5,
  "message": "Impact metrics calculated successfully"
}
```

### Update Specific Metrics
```bash
POST /functions/v1/update-sponsor-metrics-manual
Authorization: Bearer <USER_JWT>
Content-Type: application/json

{
  "subscription_id": "uuid",
  "businesses_supported": 25,
  "total_transactions": 150,
  "community_reach": 500,
  "economic_impact": 45000
}
```

## Frontend Integration

### Display Latest Metrics
```typescript
import { sponsorMetricsService } from '@/lib/services/sponsor-metrics-service';

// In your component
const { data: metrics } = await sponsorMetricsService.getLatestMetrics(subscriptionId);
```

### Trigger Manual Calculation
```typescript
// Admin only
await sponsorMetricsService.calculateAllMetrics();
```

## Monitoring

### Check Calculation Status
```sql
-- View latest metrics for all sponsors
SELECT 
  cs.company_name,
  cs.tier,
  sim.metric_date,
  sim.businesses_supported,
  sim.total_transactions,
  sim.economic_impact
FROM sponsor_impact_metrics sim
JOIN corporate_subscriptions cs ON cs.id = sim.subscription_id
WHERE sim.metric_date = CURRENT_DATE
ORDER BY cs.created_at DESC;
```

### View Calculation History
```sql
-- See all metric updates
SELECT 
  subscription_id,
  metric_date,
  businesses_supported,
  created_at
FROM sponsor_impact_metrics
ORDER BY created_at DESC
LIMIT 50;
```

## Troubleshooting

### Metrics Not Updating
1. Check if cron job is running: `SELECT * FROM cron.job WHERE jobname = 'calculate-sponsor-metrics-daily';`
2. View cron job history: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;`
3. Check edge function logs in Supabase Dashboard

### Incorrect Calculations
1. Verify transaction data: `SELECT COUNT(*) FROM platform_transactions WHERE status = 'succeeded';`
2. Check subscription dates: `SELECT id, created_at FROM corporate_subscriptions;`
3. Review calculation logic in `calculate-sponsor-impact` function

### Performance Issues
- Metrics are indexed on `(subscription_id, metric_date)`
- Calculations use efficient aggregation queries
- Consider batch processing if you have 100+ sponsors

## Best Practices

1. **Run Daily**: Keep metrics fresh by calculating daily
2. **Monitor Logs**: Check edge function logs for errors
3. **Backup Data**: Metrics table should be included in database backups
4. **Validate Results**: Periodically verify calculations manually
5. **Alert on Failures**: Set up notifications if cron job fails

## Security

- Calculation endpoint requires authentication
- Manual updates require user JWT token
- Service role key should never be exposed to frontend
- RLS policies protect sponsor data

## Future Enhancements

- Real-time metrics updates using database triggers
- Trend analysis and projections
- Comparative metrics across sponsors
- Export metrics to CSV/PDF for reports
- Email digest of weekly/monthly performance
