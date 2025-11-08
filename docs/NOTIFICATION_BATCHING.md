# Notification Batching System

## Overview

The notification batching system prevents email spam by intelligently grouping similar notifications that occur within a short time window. Instead of receiving 10 separate emails for 10 business verifications, admins receive one consolidated email.

## How It Works

### 1. Notification Queue
When an event occurs (business verification, agent milestone), instead of sending an email immediately:
- The notification is added to the `notification_batch_queue` table
- It's assigned a `batch_key` to group similar notifications
- The system waits for the configured batch window (default: 5 minutes)

### 2. Batch Processing
A scheduled job (`process-notification-batches`) runs periodically to:
- Find notifications older than the batch window
- Group them by `batch_key`
- If a group has reached the minimum batch size (default: 2), send as one email
- Otherwise, send individual notifications

### 3. Batch Keys
Notifications are grouped using intelligent batch keys:

**Business Verifications:**
- All verifications within the same time window are grouped together
- Batch key format: `business_verification_[timeWindow]`

**Agent Milestones:**
- Grouped by milestone category (referrals, earnings, conversion)
- Batch key format: `agent_milestone_[category]_[timeWindow]`

## Configuration

Admins can configure batching through **Admin Dashboard → Settings → Notification Preferences**:

### Batching Settings
- **Enable Smart Batching**: Toggle batching on/off
- **Batch Window**: 1-30 minutes (default: 5)
  - Notifications within this window are grouped
  - Longer windows = fewer emails, more delay
  - Shorter windows = more emails, less delay
- **Minimum Batch Size**: 2-10 events (default: 2)
  - Only batch if this many notifications occur
  - Below this threshold, send immediately

### Notification Frequency
Batching works alongside immediate, daily, and weekly notifications:
- **Immediate with Batching**: Smart grouping within minutes
- **Immediate without Batching**: Every notification sent instantly
- **Daily Digest**: All day's notifications in one email (9 AM)
- **Weekly Digest**: All week's notifications in one email (Monday 9 AM)

## Setting Up the Batch Processor

### Step 1: Schedule the Cron Job

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule batch processor to run every 2 minutes
SELECT cron.schedule(
  'process-notification-batches',
  '*/2 * * * *', -- Every 2 minutes
  $$
  SELECT
    net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/process-notification-batches',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);
```

**Important**: Replace:
- `YOUR_PROJECT_REF` with your project reference (e.g., `agoclnqfyinwjxdmjnns`)
- `YOUR_ANON_KEY` with your anon key from Supabase Dashboard → Settings → API

### Step 2: Schedule Cleanup Job

Clean up old processed notifications:

```sql
-- Clean up old batch data every day at 3 AM
SELECT cron.schedule(
  'cleanup-batch-queue',
  '0 3 * * *', -- 3:00 AM daily
  $$
  SELECT cleanup_old_batch_queue();
  $$
);
```

## API Usage

### Queue a Batched Notification

```typescript
import { queueBatchedNotification } from '@/lib/api/notification-batcher';

// Queue a business verification notification
await queueBatchedNotification({
  notificationType: 'business_verification',
  eventData: {
    businessId: 'uuid',
    businessName: 'Cool Business',
    ownerName: 'John Doe',
    ownerEmail: 'john@example.com',
    submittedAt: new Date().toISOString(),
  },
});
```

### Check If Batching Is Enabled

```typescript
import { isBatchingEnabled } from '@/lib/api/notification-batcher';

const shouldBatch = await isBatchingEnabled();
if (shouldBatch) {
  // Queue for batching
} else {
  // Send immediately
}
```

### Send Immediate Notification (Bypass Batching)

```typescript
import { sendImmediateNotification } from '@/lib/api/notification-batcher';

// For critical notifications that can't wait
await sendImmediateNotification('business_verification', eventData);
```

### Get Batching Statistics

```typescript
import { getBatchingStats } from '@/lib/api/notification-batcher';

const stats = await getBatchingStats();
console.log(stats);
// {
//   pendingCount: 5,
//   batchesLast24h: 12,
//   averageBatchSize: 3.5
// }
```

## Email Templates

### Batched Email Example
When 5 business verifications occur within 5 minutes:

```
Subject: 5 Business Verification Notifications

[Large number: 5]
Pending Verifications

• Cool Business
  Owner: John Doe (john@example.com)
  Submitted: 2:15 PM

• Another Business
  Owner: Jane Smith (jane@example.com)
  Submitted: 2:17 PM

[Review All Verifications Button]
```

### Individual Email Example
When only 1 notification occurs:

```
Subject: New Business Verification: Cool Business

New Business Verification Request

Cool Business
Owner: John Doe
Email: john@example.com
Submitted: 2:15 PM
```

## Database Schema

### notification_batch_queue
Temporary queue for pending notifications:
- `id`: UUID
- `notification_type`: business_verification | agent_milestone
- `event_data`: JSONB with notification details
- `batch_key`: Grouping key for batching
- `created_at`: Timestamp
- `processed_at`: When batch was sent (null = pending)
- `batch_id`: Reference to sent batch

### notification_batches
Audit log of sent batches:
- `id`: UUID
- `batch_key`: Grouping key
- `notification_type`: Type of notification
- `event_count`: Number of events in batch
- `events`: JSONB array of all events
- `recipients`: Array of email addresses
- `sent_at`: When batch was sent

## Monitoring

### View Pending Notifications
```sql
SELECT 
  batch_key,
  COUNT(*) as pending_count,
  MIN(created_at) as oldest,
  MAX(created_at) as newest
FROM notification_batch_queue
WHERE processed_at IS NULL
GROUP BY batch_key;
```

### View Recent Batches
```sql
SELECT 
  notification_type,
  event_count,
  sent_at,
  recipients
FROM notification_batches
ORDER BY sent_at DESC
LIMIT 20;
```

### View Batching Performance
```sql
SELECT 
  notification_type,
  AVG(event_count) as avg_batch_size,
  COUNT(*) as total_batches,
  SUM(event_count) as total_events
FROM notification_batches
WHERE sent_at > now() - interval '7 days'
GROUP BY notification_type;
```

## Best Practices

1. **Batch Window**: 
   - 2-5 minutes for active systems
   - 10-15 minutes for quieter systems
   - Longer windows = better batching but more delay

2. **Minimum Batch Size**:
   - Set to 2 for aggressive batching
   - Set to 3-5 for less frequent batching
   - Higher = fewer emails, but some notifications sent individually

3. **Processor Frequency**:
   - Run every 1-2 minutes for responsive batching
   - Don't run more frequently than batch window

4. **Critical Notifications**:
   - Use `sendImmediateNotification()` for urgent alerts
   - Security issues, payment failures, etc.

5. **Monitoring**:
   - Check pending queue size regularly
   - Monitor average batch sizes
   - Alert if queue grows too large (indicates processor issues)

## Troubleshooting

### Notifications Not Batching
1. Check if batching is enabled in admin preferences
2. Verify cron job is scheduled: `SELECT * FROM cron.job WHERE jobname = 'process-notification-batches';`
3. Check cron execution logs: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;`
4. Verify batch window is appropriate for notification volume

### Emails Still Sending Individually
1. Check minimum batch size setting
2. Verify events are occurring within batch window
3. Check if batch keys are being generated correctly
4. Review `notification_batch_queue` for grouping

### Queue Growing Too Large
1. Check if processor is running
2. Verify edge function logs for errors
3. Check if Resend API key is valid
4. Increase processor frequency (run more often)

### Wrong Batch Grouping
1. Review batch key generation logic
2. Ensure events have correct notification_type
3. Check time window alignment

## Future Enhancements

- [ ] User preference for batch size
- [ ] Priority levels (critical = no batch)
- [ ] Batch preview in admin dashboard
- [ ] Per-notification-type batching settings
- [ ] Smart scheduling based on admin timezone
- [ ] Batch analytics and reporting
