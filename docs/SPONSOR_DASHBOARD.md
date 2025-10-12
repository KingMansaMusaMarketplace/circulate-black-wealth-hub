# Corporate Sponsor Dashboard

This document explains the corporate sponsor dashboard functionality and how sponsors interact with the platform.

## Overview

The sponsor dashboard provides corporate sponsors with a comprehensive view of their sponsorship impact, subscription details, and branding management tools.

## Features

### 1. Impact Metrics Display

Real-time dashboard showing:
- **Businesses Supported**: Unique Black-owned businesses that received transactions
- **Total Transactions**: Number of completed marketplace transactions
- **Community Reach**: Estimated people impacted (customers × 10 multiplier)
- **Economic Impact**: Total transaction value with 2.3x Black dollar multiplier effect

Metrics are automatically calculated daily at midnight UTC by the `calculate-sponsor-impact` Edge Function.

### 2. Subscription Details

Displays current sponsorship information:
- Company name and logo
- Tier level (Bronze, Silver, Gold, Platinum)
- Subscription status
- Billing period dates
- Active benefits list

### 3. Logo & Branding Management

Self-service logo upload:
- Drag-and-drop or click to upload
- Automatic upload to Supabase Storage (`sponsor-logos` bucket)
- Image validation (500KB max, image files only)
- Real-time preview
- Website URL management

### 4. Benefits Overview

Tier-specific benefits display:
- Bronze: Basic placement + tracking
- Silver: Additional directory placement
- Gold: Featured placement + social media
- Platinum: All benefits + homepage banner + priority support

## Access Control

### Authentication Requirements
- User must be authenticated (JWT required)
- User must have an active corporate subscription
- Only the subscription owner can access their dashboard

### RLS Policies
```sql
-- Sponsors can view their own subscription
SELECT * FROM corporate_subscriptions WHERE user_id = auth.uid()

-- Sponsors can view their own metrics
SELECT * FROM sponsor_impact_metrics 
WHERE subscription_id IN (
  SELECT id FROM corporate_subscriptions WHERE user_id = auth.uid()
)
```

## Storage Configuration

### Logo Storage
Logos are stored in the `sponsor-logos` Supabase Storage bucket:
- **Bucket**: `sponsor-logos` (public read access)
- **Path**: `{subscription_id}/logo.{extension}`
- **Max size**: 500KB
- **Formats**: PNG, JPG, SVG
- **Public URLs**: Automatically generated

### Storage Policies
```sql
-- Public read access
CREATE POLICY "Public read access to sponsor logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'sponsor-logos');

-- Sponsors can manage their own logos
CREATE POLICY "Sponsors can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sponsor-logos'
  AND auth.uid() IN (
    SELECT user_id FROM corporate_subscriptions 
    WHERE id::text = (storage.foldername(name))[1]
  )
);
```

## Components

### SponsorDashboard (Page)
Main dashboard page at `/sponsor-dashboard` (route needs to be configured).

**Usage:**
```tsx
import SponsorDashboard from '@/pages/SponsorDashboard';
```

### ImpactMetricsCard
Displays the four key impact metrics in a grid layout.

**Props:**
```tsx
interface ImpactMetricsCardProps {
  businessesSupported: number;
  totalTransactions: number;
  communityReach: number;
  economicImpact: number;
  className?: string;
}
```

### SubscriptionDetailsCard
Shows subscription information and tier benefits.

**Props:**
```tsx
interface SubscriptionDetailsCardProps {
  companyName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  logoUrl?: string;
  websiteUrl?: string;
  className?: string;
}
```

### LogoUploadCard
Handles logo file uploads and website URL management.

**Props:**
```tsx
interface LogoUploadCardProps {
  subscriptionId: string;
  currentLogoUrl?: string;
  currentWebsiteUrl?: string;
  onUpdate: () => void;
  className?: string;
}
```

## Hooks

### useSponsorSubscription
Fetches the current user's corporate subscription.

```tsx
import { useSponsorSubscription } from '@/hooks/use-sponsor-subscription';

const { data: subscription, isLoading, refetch } = useSponsorSubscription();
```

**Returns:**
```tsx
{
  id: string;
  user_id: string;
  company_name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: 'active' | 'canceled' | 'past_due';
  current_period_start?: string;
  current_period_end?: string;
  logo_url?: string;
  website_url?: string;
  // ... other fields
}
```

### useSponsorImpactMetrics
Fetches historical impact metrics for a subscription.

```tsx
import { useSponsorImpactMetrics } from '@/hooks/use-sponsor-subscription';

const { data: metrics, isLoading } = useSponsorImpactMetrics(subscriptionId);
```

**Returns:**
```tsx
Array<{
  id: string;
  subscription_id: string;
  metric_date: string;
  businesses_supported: number;
  total_transactions: number;
  community_reach: number;
  economic_impact: number;
}>
```

## Integration Steps

### 1. Add Route to Router
```tsx
// In your router configuration
import SponsorDashboard from '@/pages/SponsorDashboard';

{
  path: '/sponsor-dashboard',
  element: <SponsorDashboard />,
  // Optional: Add auth guard
}
```

### 2. Add Navigation Link
```tsx
// In your navigation menu
<Link to="/sponsor-dashboard">
  Sponsor Dashboard
</Link>
```

### 3. Protect Route (Optional)
```tsx
// Create a protected route wrapper
const ProtectedSponsorRoute = ({ children }) => {
  const { data: subscription, isLoading } = useSponsorSubscription();
  
  if (isLoading) return <LoadingSpinner />;
  if (!subscription) return <Navigate to="/pricing" />;
  
  return children;
};

// Use in route config
{
  path: '/sponsor-dashboard',
  element: (
    <ProtectedSponsorRoute>
      <SponsorDashboard />
    </ProtectedSponsorRoute>
  ),
}
```

## Data Flow

### 1. Initial Load
```mermaid
User → Dashboard Page → useSponsorSubscription hook
→ Supabase Query (corporate_subscriptions)
→ Returns subscription data
→ useSponsorImpactMetrics hook
→ Supabase Query (sponsor_impact_metrics)
→ Returns metrics history
→ Render dashboard
```

### 2. Logo Upload
```mermaid
User selects file → Validate file
→ Upload to Supabase Storage (sponsor-logos bucket)
→ Get public URL
→ Update corporate_subscriptions.logo_url
→ Trigger refetch
→ Update UI
```

### 3. Website URL Update
```mermaid
User updates URL → Click Save
→ Update corporate_subscriptions.website_url
→ Trigger refetch
→ Update UI
```

## Error Handling

### No Active Subscription
If user has no subscription:
```tsx
<Alert>
  <AlertTitle>No Active Sponsorship</AlertTitle>
  <AlertDescription>
    You don't have an active corporate sponsorship. 
    Please contact us to become a sponsor.
  </AlertDescription>
</Alert>
```

### No Metrics Yet
If metrics haven't been calculated:
```tsx
<Card>
  <CardContent>
    <TrendingUp />
    <p>Calculating your impact metrics...</p>
  </CardContent>
</Card>
```

### Upload Errors
- File too large: "File size must be less than 500KB"
- Invalid file type: "Please upload an image file"
- Upload failure: "Failed to upload logo: [error message]"

## Customization

### Tier-Specific Features
To add tier-specific functionality:

```tsx
{subscription.tier === 'platinum' && (
  <PlatinumOnlyFeature />
)}

{['gold', 'platinum'].includes(subscription.tier) && (
  <PremiumFeature />
)}
```

### Custom Metrics
To add additional metrics to the dashboard:

1. Add the metric to `sponsor_impact_metrics` table
2. Update `calculate-sponsor-impact` Edge Function
3. Update `ImpactMetricsCard` component
4. Update the metrics interface

## Performance Optimization

- Logo images use lazy loading
- Metrics data cached for 5 minutes
- Subscription data cached until refetch
- Optimistic UI updates for logo/URL changes

## Security Considerations

- All mutations require authentication
- RLS policies enforce subscription ownership
- Storage policies prevent unauthorized uploads
- File type and size validation on upload
- External links use `rel="noopener noreferrer"`

## Testing

### Test Cases
1. User with active subscription can access dashboard
2. User without subscription sees appropriate message
3. Logo upload works with valid files
4. Logo upload rejects oversized files
5. Logo upload rejects non-image files
6. Website URL updates correctly
7. Metrics display correctly when available
8. Metrics show placeholder when not available
9. Subscription details render correctly
10. Benefits list matches tier

### Mock Data
```tsx
const mockSubscription = {
  id: '123',
  user_id: 'user-123',
  company_name: 'Test Corp',
  tier: 'platinum',
  status: 'active',
  current_period_start: '2025-01-01',
  current_period_end: '2025-02-01',
  logo_url: 'https://example.com/logo.png',
  website_url: 'https://testcorp.com',
};

const mockMetrics = [{
  id: '1',
  subscription_id: '123',
  metric_date: '2025-01-15',
  businesses_supported: 25,
  total_transactions: 150,
  community_reach: 1500,
  economic_impact: 345000,
}];
```

## Future Enhancements

- Historical metrics charts (line graphs)
- Downloadable impact reports (PDF)
- Email notification settings
- Custom branding color picker
- Social media preview generator
- Comparative metrics (vs other sponsors)
- Milestone celebrations
- Custom call-to-action links
