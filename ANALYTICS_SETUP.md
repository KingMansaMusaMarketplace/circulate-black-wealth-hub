# Analytics Setup Guide

## Overview

This app includes comprehensive analytics tracking using PostHog for user behavior, conversion funnels, and business metrics.

## Quick Start

### 1. Get PostHog API Key

1. Sign up at [https://posthog.com](https://posthog.com)
2. Create a new project
3. Copy your Project API Key from Project Settings

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
VITE_POSTHOG_KEY=your_posthog_key_here
VITE_POSTHOG_HOST=https://app.posthog.com
```

### 3. Verify Setup

The analytics will automatically start tracking once the environment variable is set. Check your browser console for `[Analytics]` logs in development mode.

## Features

### Automatic Tracking

- **Page Views**: Every route change is automatically tracked
- **User Identity**: User properties are tracked on login
- **Session Management**: Anonymous sessions are tracked before login

### Conversion Funnels

The following conversion funnels are tracked:

1. **User Onboarding**
   - Signup start
   - Signup complete
   - Email verified

2. **Business Registration**
   - Registration start
   - Registration complete

3. **Subscription Flow**
   - Subscription view
   - Subscription start
   - Subscription complete (with tier and amount)

4. **QR Code Engagement**
   - QR scan funnel start
   - QR scan funnel complete (with points earned)

5. **Transaction Flow**
   - Transaction start
   - Transaction complete (with amount)

### Business Metrics

Track business-specific interactions:

- Business view
- Business click
- Business search (with query and results count)
- QR code scan (with business ID and points)
- Reward redemption

## Usage Examples

### Track Custom Events

```typescript
import { useAnalytics } from '@/contexts/AnalyticsContext';

function MyComponent() {
  const { trackEvent } = useAnalytics();
  
  const handleClick = () => {
    trackEvent('button_clicked', {
      button_name: 'cta_button',
      page: 'homepage'
    });
  };
}
```

### Track Page Views

```typescript
import { usePageTracking } from '@/hooks/use-analytics-tracking';

function MyPage() {
  usePageTracking('my_page_name', {
    category: 'marketing',
    source: 'email'
  });
  
  return <div>Page content</div>;
}
```

### Track Business Metrics

```typescript
import { useBusinessMetrics } from '@/hooks/use-analytics-tracking';

function BusinessCard() {
  const { trackBusinessView, trackBusinessClick } = useBusinessMetrics();
  
  useEffect(() => {
    trackBusinessView(businessId);
  }, [businessId]);
  
  const handleClick = () => {
    trackBusinessClick(businessId);
  };
}
```

### Track Conversions

```typescript
import { useConversionTracking } from '@/hooks/use-analytics-tracking';

function CheckoutFlow() {
  const { trackTransactionStart, trackTransactionComplete } = useConversionTracking();
  
  const handleCheckout = async () => {
    trackTransactionStart(amount);
    // ... checkout logic
    trackTransactionComplete(transactionId, amount);
  };
}
```

## Data Privacy

- Analytics only track after user consent (no tracking before page load)
- Sensitive data (passwords, payment info) is never tracked
- Users can opt out of analytics in their settings
- All data is anonymized by default
- GDPR and CCPA compliant

## PostHog Features

### Dashboards

Create custom dashboards to visualize:
- User acquisition trends
- Conversion funnel performance
- Revenue metrics
- User engagement patterns

### Insights

Available insights:
- **Trends**: Track how metrics change over time
- **Funnels**: Analyze conversion drop-offs
- **Retention**: Measure user retention
- **Paths**: See user journey flows
- **Session Recording**: Watch user sessions (optional)

### Cohorts

Create user cohorts based on:
- User properties
- Event behaviors
- Time-based segments

## Best Practices

1. **Event Naming**: Use snake_case for event names (e.g., `button_clicked`)
2. **Properties**: Always include relevant context properties
3. **User Properties**: Update user properties when they change
4. **Testing**: Check console logs in development mode
5. **Privacy**: Never track sensitive information

## Debugging

### Development Mode

In development, all analytics events are logged to the console:

```
[Analytics] Event: qr_code_scan { business_id: '123', points_earned: 25 }
[Analytics] Page view: /dashboard { path: '/dashboard' }
[Analytics] User identified: user_123 { email: 'user@example.com' }
```

### Verify Events

1. Open PostHog dashboard
2. Go to "Live Events" tab
3. Perform actions in your app
4. Events should appear within seconds

## Support

- PostHog Docs: [https://posthog.com/docs](https://posthog.com/docs)
- Community Forum: [https://posthog.com/questions](https://posthog.com/questions)
- Status Page: [https://status.posthog.com](https://status.posthog.com)
