# Notification Preferences System

## Overview

The notification preferences system allows administrators to customize which events trigger email alerts and set thresholds to reduce notification noise.

## Features

### Configurable Event Types

1. **Business Verifications**
   - Toggle: Enable/disable business verification notifications
   - Notifies when businesses submit verification documents

2. **Sales Agent Milestones**
   - Master toggle: Enable/disable all agent milestone notifications
   - Sub-categories:
     - **Referral Milestones**: Agent referral count achievements
     - **Earnings Milestones**: Commission earning achievements
     - **Conversion Milestones**: QR scan conversion rate achievements

### Threshold Configuration

Set minimum values to reduce notification volume:

- **Minimum Referrals**: Only notify for milestones ≥ this count (default: 1)
- **Minimum Earnings**: Only notify for milestones ≥ this amount (default: $100)
- **Minimum Conversion**: Only notify for rates ≥ this percentage (default: 50%)

### Notification Frequency

Choose when to receive notifications:

- **Immediate**: Real-time notifications as events occur
- **Daily Digest**: Summary email once per day
- **Weekly Digest**: Summary email once per week
- **Custom Time**: Set preferred time for digest delivery (default: 9:00 AM)

### Email Configuration

- **Primary Email**: Main address for receiving notifications
- **Additional Emails**: Comma-separated list of extra recipients
- All configured emails receive notifications

## Database Schema

### Table: admin_notification_preferences

```sql
CREATE TABLE admin_notification_preferences (
  id UUID PRIMARY KEY,
  admin_user_id UUID NOT NULL UNIQUE,
  
  -- Event toggles
  business_verification_enabled BOOLEAN DEFAULT true,
  agent_milestone_enabled BOOLEAN DEFAULT true,
  milestone_referrals_enabled BOOLEAN DEFAULT true,
  milestone_earnings_enabled BOOLEAN DEFAULT true,
  milestone_conversion_enabled BOOLEAN DEFAULT true,
  
  -- Thresholds
  min_referral_milestone INTEGER DEFAULT 1,
  min_earnings_milestone NUMERIC DEFAULT 100,
  min_conversion_milestone NUMERIC DEFAULT 50,
  
  -- Frequency
  send_immediate BOOLEAN DEFAULT true,
  send_daily_digest BOOLEAN DEFAULT false,
  send_weekly_digest BOOLEAN DEFAULT false,
  digest_time TIME DEFAULT '09:00:00',
  
  -- Recipients
  notification_email TEXT NOT NULL,
  send_to_multiple_emails TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Reference

### Get Preferences

```typescript
import { getAdminNotificationPreferences } from '@/lib/api/admin-notification-preferences';

const preferences = await getAdminNotificationPreferences();
// Returns AdminNotificationPreferences or null
```

### Update Preferences

```typescript
import { updateAdminNotificationPreferences } from '@/lib/api/admin-notification-preferences';

const success = await updateAdminNotificationPreferences({
  agent_milestone_enabled: true,
  min_referral_milestone: 10,
  notification_email: 'admin@example.com'
});
```

### Check If Notification Should Send

```typescript
import { shouldSendNotification } from '@/lib/api/admin-notification-preferences';

const { shouldSend, preferences } = await shouldSendNotification(
  'agent_milestone',
  { type: 'referrals_10', value: 10 }
);

if (shouldSend) {
  // Send notification
}
```

### Get Recipients

```typescript
import { getNotificationRecipients } from '@/lib/api/admin-notification-preferences';

const recipients = await getNotificationRecipients();
// Returns array of email addresses
```

## UI Component

### Location
`src/components/admin/NotificationPreferences.tsx`

### Usage

```typescript
import NotificationPreferences from '@/components/admin/NotificationPreferences';

// In admin dashboard
<NotificationPreferences />
```

### Features

- **Visual Toggles**: Easy on/off switches for each event type
- **Numeric Inputs**: Set threshold values with validation
- **Email Management**: Configure primary and additional emails
- **Live Preview**: Badge showing current configuration
- **Auto-save**: Changes saved with confirmation toast

## Edge Function Integration

### Function: send-admin-notification

The edge function now checks preferences before sending:

```typescript
// 1. Get notification preferences from database
const preferences = await getNotificationPreferences();

// 2. Check if notification should be sent
if (!shouldSendNotification(preferences, type, milestoneData)) {
  return { success: true, message: 'Notification blocked by preferences' };
}

// 3. Get recipients from preferences
const recipients = getRecipients(preferences);

// 4. Send to all configured recipients
await resend.emails.send({
  to: recipients,
  // ... email content
});
```

## Default Behavior

### New Admin Setup

When an admin first accesses the system:

1. Function `get_admin_notification_preferences()` is called
2. If no preferences exist, creates default record:
   ```typescript
   {
     business_verification_enabled: true,
     agent_milestone_enabled: true,
     milestone_referrals_enabled: true,
     milestone_earnings_enabled: true,
     milestone_conversion_enabled: true,
     min_referral_milestone: 1,
     min_earnings_milestone: 100,
     min_conversion_milestone: 50,
     send_immediate: true,
     notification_email: admin.email
   }
   ```
3. Admin can then customize preferences

### Missing Preferences

If preferences can't be loaded:
- System allows all notifications (fail-open)
- Falls back to `ADMIN_EMAIL` environment variable
- Admin can configure preferences later

## Examples

### Example 1: Only High-Value Milestones

```typescript
await updateAdminNotificationPreferences({
  min_referral_milestone: 25,  // Only 25+ referrals
  min_earnings_milestone: 1000, // Only $1000+ earnings
  min_conversion_milestone: 75  // Only 75%+ conversion
});
```

Result: Only receive notifications for significant achievements

### Example 2: Verification Only

```typescript
await updateAdminNotificationPreferences({
  business_verification_enabled: true,
  agent_milestone_enabled: false  // Disable all milestones
});
```

Result: Only notified about business verifications

### Example 3: Daily Digest Only

```typescript
await updateAdminNotificationPreferences({
  send_immediate: false,
  send_daily_digest: true,
  digest_time: '18:00:00'  // 6 PM delivery
});
```

Result: Receive one summary email daily at 6 PM

### Example 4: Multiple Recipients

```typescript
await updateAdminNotificationPreferences({
  notification_email: 'admin@example.com',
  send_to_multiple_emails: [
    'manager@example.com',
    'operations@example.com'
  ]
});
```

Result: All three emails receive notifications

## Testing

### Test Preference Creation

```typescript
// Should auto-create preferences on first access
const prefs = await getAdminNotificationPreferences();
console.log('Preferences created:', prefs);
```

### Test Threshold Filtering

```typescript
// Set high threshold
await updateAdminNotificationPreferences({
  min_referral_milestone: 50
});

// Try to send notification for 10 referrals
const { shouldSend } = await shouldSendNotification(
  'agent_milestone',
  { type: 'referrals_10', value: 10 }
);

console.log('Should send:', shouldSend); // false
```

### Test Multiple Recipients

```typescript
// Configure multiple emails
await updateAdminNotificationPreferences({
  notification_email: 'admin@test.com',
  send_to_multiple_emails: ['manager@test.com']
});

// Get recipients
const recipients = await getNotificationRecipients();
console.log('Recipients:', recipients); 
// ['admin@test.com', 'manager@test.com']
```

## Security

### Row Level Security (RLS)

- Admins can only view/edit their own preferences
- `admin_user_id` must match `auth.uid()`
- Policies prevent cross-admin access

### Database Function

- `get_admin_notification_preferences()` is SECURITY DEFINER
- Creates default preferences safely
- Prevents SQL injection

## Monitoring

### View Notification Log

```sql
SELECT 
  created_at,
  email_type,
  recipient_email,
  status
FROM email_notifications
WHERE email_type LIKE 'admin_%'
ORDER BY created_at DESC
LIMIT 20;
```

### Check Preference Updates

```sql
SELECT 
  admin_user_id,
  notification_email,
  agent_milestone_enabled,
  min_referral_milestone,
  updated_at
FROM admin_notification_preferences
ORDER BY updated_at DESC;
```

### Count Blocked Notifications

Check edge function logs for:
```
"Notification blocked by preferences"
```

## Future Enhancements

- [ ] Per-milestone type thresholds (separate for each milestone)
- [ ] Scheduled notification windows (quiet hours)
- [ ] Notification priority levels (urgent vs informational)
- [ ] Custom email templates per notification type
- [ ] Notification history dashboard
- [ ] Bulk preference updates for multiple admins
- [ ] Role-based notification routing
- [ ] Webhook integration for external systems

## Troubleshooting

### Preferences Not Loading

1. Check admin user is authenticated
2. Verify RLS policies allow access
3. Check database for preferences record:
   ```sql
   SELECT * FROM admin_notification_preferences 
   WHERE admin_user_id = 'YOUR_USER_ID';
   ```

### Notifications Still Sending

1. Verify `send_immediate` is enabled
2. Check threshold values are correct
3. Review edge function logs for decision logic
4. Confirm email type toggles are properly set

### Changes Not Saving

1. Check for validation errors in console
2. Verify admin has UPDATE permission
3. Check network tab for API errors
4. Ensure email format is valid

## Support

For issues with notification preferences:
1. Check admin dashboard Settings tab
2. Review edge function logs
3. Verify database preferences table
4. Test with manual function invocations
