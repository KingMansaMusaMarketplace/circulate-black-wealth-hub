# Corporate Sponsorship System - Complete Implementation Guide

This document provides an overview of the complete corporate sponsorship system implementation.

## System Overview

The corporate sponsorship system provides companies with tiered sponsorship options, automated impact tracking, logo placement across the platform, and a dedicated dashboard to manage their sponsorship.

## Implementation Steps Completed

### ✅ Step 1: Webhook Handler & Subscription Management
**Files Created/Modified:**
- `supabase/functions/stripe-webhook/index.ts` - Automated subscription lifecycle management
- `supabase/functions/send-corporate-welcome/index.ts` - Welcome email automation
- `supabase/config.toml` - Edge function configuration

**Features:**
- Automated subscription creation on successful Stripe checkout
- Initial benefits setup (logo placements, monthly reports, social media recognition)
- Impact metrics initialization
- Welcome email automation
- Subscription update/cancellation handling

**Documentation:** See `docs/SPONSOR_METRICS_AUTOMATION.md`

---

### ✅ Step 2: Impact Metrics Calculation
**Files Created/Modified:**
- `supabase/functions/calculate-sponsor-impact/index.ts` - Automated daily calculations
- `supabase/functions/update-sponsor-metrics-manual/index.ts` - Manual metric updates
- `src/lib/services/sponsor-metrics-service.ts` - Frontend service layer
- `src/components/admin/SponsorMetricsControl.tsx` - Admin control panel

**Features:**
- Automated daily calculation at midnight UTC via pg_cron
- Real economic impact tracking:
  - Businesses supported (unique count)
  - Total transactions (marketplace activity)
  - Community reach (customers × 10 multiplier)
  - Economic impact (transaction value × 2.3x Black dollar multiplier)
- Manual calculation trigger for admins
- Historical metrics storage with date tracking
- Database optimizations (unique constraints, indexes)

**Documentation:** See `docs/SPONSOR_METRICS_AUTOMATION.md`

---

### ✅ Step 3: Logo Placement System
**Files Created:**
- `src/components/sponsors/SponsorLogo.tsx` - Individual logo component
- `src/components/sponsors/SponsorLogoGrid.tsx` - Grid display component
- `src/components/sponsors/SponsorBanner.tsx` - Top banner component
- `src/hooks/use-sponsor-benefits.ts` - Benefits management hook

**Features:**
- Tier-based logo placements:
  - **Bronze**: Footer only (grayscale effect)
  - **Silver**: Footer + Directory (reduced opacity)
  - **Gold**: Footer + Directory + Sidebar (scale animation)
  - **Platinum**: All placements + Homepage + Banner (premium effects)
- Responsive grid layouts
- Automatic tier sorting (highest tier first)
- Lazy loading for performance
- SEO-friendly with sponsored links
- Accessibility compliant

**Documentation:** See `docs/SPONSOR_LOGO_PLACEMENT.md`

---

### ✅ Step 4: Sponsor Dashboard
**Files Created:**
- `src/pages/SponsorDashboard.tsx` - Main dashboard page
- `src/hooks/use-sponsor-subscription.ts` - Data fetching hooks
- `src/components/sponsor-dashboard/ImpactMetricsCard.tsx` - Metrics display
- `src/components/sponsor-dashboard/SubscriptionDetailsCard.tsx` - Subscription info
- `src/components/sponsor-dashboard/LogoUploadCard.tsx` - Logo management
- Storage bucket: `sponsor-logos` with RLS policies

**Features:**
- Real-time impact metrics dashboard
- Subscription details and billing info
- Self-service logo upload (drag & drop)
- Website URL management
- Tier-specific benefits display
- Secure file storage with validation
- Responsive layout for all devices

**Documentation:** See `docs/SPONSOR_DASHBOARD.md`

---

## Database Schema

### Tables Created/Modified

#### `corporate_subscriptions`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- company_name (text)
- tier (text: bronze/silver/gold/platinum)
- status (text: active/canceled/past_due)
- stripe_subscription_id (text)
- stripe_customer_id (text)
- current_period_start (timestamptz)
- current_period_end (timestamptz)
- logo_url (text) -- NEW
- website_url (text) -- NEW
- cancel_at_period_end (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `sponsor_impact_metrics`
```sql
- id (uuid, primary key)
- subscription_id (uuid, foreign key)
- metric_date (date)
- businesses_supported (integer)
- total_transactions (integer)
- community_reach (integer)
- economic_impact (numeric)
- created_at (timestamptz)
- updated_at (timestamptz)

-- Unique constraint on (subscription_id, metric_date)
-- Indexes on (subscription_id), (metric_date)
```

#### `sponsor_benefits`
```sql
- id (uuid, primary key)
- subscription_id (uuid, foreign key)
- logo_placement (text[])
- featured_listing (boolean)
- monthly_reports (boolean)
- social_media_recognition (boolean)
- priority_support (boolean)
- custom_landing_page (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Storage Buckets

#### `sponsor-logos`
- **Public**: Yes (read access)
- **Path structure**: `{subscription_id}/logo.{ext}`
- **Max size**: 500KB per file
- **Formats**: PNG, JPG, SVG
- **RLS Policies**: Sponsors can CRUD their own logos only

---

## Edge Functions

### `stripe-webhook`
- **Purpose**: Handle Stripe webhook events
- **Events**: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
- **Auth**: Stripe signature validation (no JWT)
- **Triggers**: Subscription creation, benefits setup, welcome email

### `send-corporate-welcome`
- **Purpose**: Send welcome email to new sponsors
- **Auth**: Service role key
- **Integration**: Resend API (requires RESEND_API_KEY secret)
- **Template**: Welcome message with getting started guide

### `calculate-sponsor-impact`
- **Purpose**: Calculate impact metrics for all active sponsors
- **Auth**: No JWT (scheduled via pg_cron)
- **Schedule**: Daily at midnight UTC
- **Process**: Query transactions, calculate metrics, upsert to database

### `update-sponsor-metrics-manual`
- **Purpose**: Manual metric updates by admins
- **Auth**: JWT required
- **Usage**: Admin dashboard override for corrections

---

## Security Implementation

### Row-Level Security (RLS) Policies

#### `corporate_subscriptions`
```sql
-- Sponsors can view their own subscription
CREATE POLICY "Sponsors can view their own subscription"
ON corporate_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Sponsors can update their own subscription
CREATE POLICY "Sponsors can update their own subscription"
ON corporate_subscriptions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON corporate_subscriptions FOR SELECT
USING (is_admin_secure());
```

#### `sponsor_impact_metrics`
```sql
-- Sponsors can view their own metrics
CREATE POLICY "Sponsors can view their own metrics"
ON sponsor_impact_metrics FOR SELECT
USING (
  subscription_id IN (
    SELECT id FROM corporate_subscriptions WHERE user_id = auth.uid()
  )
);
```

#### Storage `sponsor-logos`
```sql
-- Public read access
CREATE POLICY "Public read access to sponsor logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'sponsor-logos');

-- Sponsors can upload/update/delete their own logo
CREATE POLICY "Sponsors can manage their own logo"
ON storage.objects FOR ALL
USING (
  bucket_id = 'sponsor-logos'
  AND auth.uid() IN (
    SELECT user_id FROM corporate_subscriptions 
    WHERE id::text = (storage.foldername(name))[1]
  )
);
```

### Input Validation

#### File Upload
- Type checking (images only)
- Size limit (500KB max)
- Extension validation
- Virus scanning (recommended for production)

#### Data Sanitization
- URL validation for website_url
- HTML entity encoding for display
- SQL injection prevention via parameterized queries

---

## Automation & Cron Jobs

### Daily Metrics Calculation
```sql
-- Scheduled via pg_cron
SELECT cron.schedule(
  'calculate-sponsor-metrics-daily',
  '0 0 * * *', -- Midnight UTC
  $$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/calculate-sponsor-impact',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [ANON_KEY]'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

### Verification
```sql
-- Check cron job status
SELECT * FROM cron.job WHERE jobname = 'calculate-sponsor-metrics-daily';

-- View execution history
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'calculate-sponsor-metrics-daily')
ORDER BY start_time DESC 
LIMIT 10;
```

---

## Integration Guide

### 1. Add to Router
```tsx
// src/App.tsx or routing config
import SponsorDashboard from '@/pages/SponsorDashboard';

{
  path: '/sponsor-dashboard',
  element: <SponsorDashboard />,
}
```

### 2. Add Logo Placements
```tsx
// Homepage
import { SponsorBanner, SponsorLogoGrid } from '@/components/sponsors';

<SponsorBanner /> {/* At top of page */}
<SponsorLogoGrid placement="homepage" maxLogos={8} />

// Footer
<SponsorLogoGrid placement="footer" maxLogos={16} />

// Directory Sidebar
<SponsorLogoGrid placement="sidebar" maxLogos={6} />
```

### 3. Add Admin Controls
```tsx
// Admin Dashboard
import SponsorMetricsControl from '@/components/admin/SponsorMetricsControl';

<SponsorMetricsControl />
```

---

## Testing Checklist

### Subscription Flow
- [ ] Stripe checkout creates corporate_subscriptions record
- [ ] Initial sponsor_benefits record created with correct tier benefits
- [ ] Initial sponsor_impact_metrics record created (zeros)
- [ ] Welcome email sent to sponsor
- [ ] Subscription updates sync correctly
- [ ] Subscription cancellation updates status

### Impact Metrics
- [ ] Daily cron job runs successfully at midnight UTC
- [ ] Metrics calculated correctly based on platform_transactions
- [ ] Businesses supported count is accurate (unique businesses)
- [ ] Community reach multiplier applied (× 10)
- [ ] Economic impact multiplier applied (× 2.3)
- [ ] Admin can manually trigger calculation
- [ ] Historical metrics stored with dates

### Logo System
- [ ] Logos display correctly for each tier
- [ ] Tier-specific visual effects work (grayscale, scale, shadows)
- [ ] Logo grid sorts by tier correctly
- [ ] Banner shows platinum/gold sponsors only
- [ ] Banner dismissal persists in localStorage
- [ ] Logo links open in new tab with correct attributes

### Sponsor Dashboard
- [ ] Authenticated sponsors can access dashboard
- [ ] Non-sponsors see appropriate message
- [ ] Impact metrics display correctly
- [ ] Subscription details render properly
- [ ] Logo upload works with valid files
- [ ] Logo upload rejects invalid files (size, type)
- [ ] Website URL updates correctly
- [ ] Tier-specific benefits display correctly

### Security
- [ ] RLS policies prevent unauthorized access
- [ ] Sponsors can only view/edit their own data
- [ ] Storage policies enforce ownership
- [ ] File validation prevents malicious uploads
- [ ] Admin functions require proper authentication

---

## Performance Optimizations

### Query Optimization
- Indexed on `corporate_subscriptions(status, logo_url)` for fast active sponsor lookups
- Indexed on `sponsor_impact_metrics(subscription_id, metric_date)` for quick historical queries
- Unique constraint prevents duplicate metric entries

### Caching Strategy
- Logo grid data cached for 5 minutes (`staleTime: 5 * 60 * 1000`)
- Sponsor banner data cached for 10 minutes
- Subscription data cached until manual refetch
- Metrics data cached for 5 minutes

### Image Optimization
- Lazy loading on all logo images (`loading="lazy"`)
- Public CDN URLs from Supabase Storage
- Recommended logo size: 1200px × 400px
- Max file size: 500KB

---

## Monitoring & Analytics

### Key Metrics to Track
1. **Subscription Health**
   - Active subscriptions by tier
   - Churn rate
   - Average subscription duration
   - Revenue by tier

2. **Impact Metrics**
   - Total businesses supported across all sponsors
   - Total economic impact generated
   - Average impact per sponsor tier
   - Month-over-month growth

3. **Engagement**
   - Dashboard login frequency
   - Logo upload rate
   - Admin manual calculations triggered
   - Email open rates (welcome emails)

### Monitoring Queries
```sql
-- Active subscriptions by tier
SELECT tier, COUNT(*) as count
FROM corporate_subscriptions
WHERE status = 'active'
GROUP BY tier;

-- Total impact across all sponsors
SELECT 
  SUM(businesses_supported) as total_businesses,
  SUM(total_transactions) as total_transactions,
  SUM(economic_impact) as total_economic_impact
FROM sponsor_impact_metrics
WHERE metric_date >= CURRENT_DATE - INTERVAL '30 days';

-- Edge function execution logs
SELECT * FROM edge_logs 
WHERE function_name = 'calculate-sponsor-impact'
ORDER BY timestamp DESC
LIMIT 100;
```

---

## Troubleshooting

### Metrics Not Updating
1. Check cron job: `SELECT * FROM cron.job`
2. View execution logs: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10`
3. Check edge function logs in Supabase Dashboard
4. Verify platform_transactions table has data
5. Run manual calculation from admin dashboard

### Logo Not Displaying
1. Verify logo_url is set in database
2. Check storage bucket is public
3. Verify RLS policies on storage.objects
4. Check image URL is accessible
5. Verify subscription status is 'active'

### Dashboard Access Issues
1. Verify user is authenticated
2. Check user has corporate_subscriptions record
3. Verify RLS policies allow access
4. Check browser console for errors
5. Verify Supabase client is configured correctly

### Upload Failures
1. Check file size (< 500KB)
2. Verify file type is image
3. Check storage bucket exists
4. Verify RLS policies allow upload
5. Check network connectivity

---

## Future Enhancements

### Phase 2 Features
- [ ] Historical metrics charts (line graphs, bar charts)
- [ ] Downloadable PDF impact reports
- [ ] Email notification preferences
- [ ] Custom branding colors
- [ ] Social media preview cards
- [ ] Comparative analytics
- [ ] Milestone celebrations
- [ ] Custom CTAs for sponsors

### Phase 3 Features
- [ ] Multi-user access (team management)
- [ ] API access for sponsors
- [ ] White-label portal
- [ ] Advanced analytics dashboard
- [ ] Integration with CRM systems
- [ ] Automated monthly reports
- [ ] Sponsor community forum

---

## Support & Documentation

### For Developers
- [Sponsor Logo Placement](./SPONSOR_LOGO_PLACEMENT.md)
- [Sponsor Dashboard](./SPONSOR_DASHBOARD.md)
- [Metrics Automation](./SPONSOR_METRICS_AUTOMATION.md)

### For Sponsors
- Getting started guide (send in welcome email)
- Dashboard user manual
- Logo upload guidelines
- FAQs

### Supabase Resources
- [Edge Functions](https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns/functions)
- [Edge Function Logs](https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns/functions/calculate-sponsor-impact/logs)
- [Storage Buckets](https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns/storage/buckets)
- [SQL Editor](https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns/sql/new)

---

## Maintenance Schedule

### Daily
- Monitor cron job execution
- Check edge function error rates
- Review failed uploads

### Weekly
- Review subscription status changes
- Analyze impact metrics trends
- Check for anomalies in data

### Monthly
- Archive old metrics (keep 12 months)
- Review storage usage
- Update documentation as needed
- Security audit of RLS policies

---

## Contact & Support

For issues or questions:
1. Check this documentation first
2. Review Supabase logs and console
3. Check GitHub issues (if applicable)
4. Contact platform admin team

---

**Last Updated:** 2025-10-12
**Version:** 1.0.0
**Status:** Production Ready ✅
