# Email Digest Scheduler Setup Guide

This guide explains how to set up Supabase cron jobs to send daily and weekly notification digests based on admin preferences.

## Overview

The digest scheduler automatically sends email summaries of:
- New business verification requests
- Agent performance milestones
- Top performing agents
- Summary statistics

Admins can configure whether they receive daily digests, weekly digests, or both through the admin dashboard settings.

## Prerequisites

1. Resend API key configured (`RESEND_API_KEY`)
2. Admin notification preferences configured in the dashboard
3. Supabase project with `pg_cron` and `pg_net` extensions enabled

## Step 1: Enable Required Extensions

First, enable the required Supabase extensions. Run this SQL in your Supabase SQL Editor:

```sql
-- Enable pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;
```

## Step 2: Get Your Project Details

You'll need:
- **Project URL**: Found in Supabase Dashboard → Settings → API → Project URL
  - Example: `https://agoclnqfyinwjxdmjnns.supabase.co`
- **Anon Key**: Found in Supabase Dashboard → Settings → API → anon/public key

## Step 3: Schedule Daily Digest

Run this SQL in your Supabase SQL Editor to schedule the daily digest:

```sql
-- Schedule daily digest to run every day at 9:00 AM UTC
SELECT cron.schedule(
  'send-daily-notification-digest',
  '0 9 * * *', -- 9:00 AM UTC daily
  $$
  SELECT
    net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-notification-digest',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body:='{"digestType": "daily"}'::jsonb
    ) as request_id;
  $$
);
```

**Important**: Replace:
- `YOUR_PROJECT_REF` with your actual project reference (e.g., `agoclnqfyinwjxdmjnns`)
- `YOUR_ANON_KEY` with your actual anon key

## Step 4: Schedule Weekly Digest

Run this SQL to schedule the weekly digest:

```sql
-- Schedule weekly digest to run every Monday at 9:00 AM UTC
SELECT cron.schedule(
  'send-weekly-notification-digest',
  '0 9 * * 1', -- 9:00 AM UTC every Monday
  $$
  SELECT
    net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-notification-digest',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body:='{"digestType": "weekly"}'::jsonb
    ) as request_id;
  $$
);
```

**Important**: Replace the same values as in Step 3.

## Customizing Schedule Times

The cron expression format is: `minute hour day month weekday`

Common examples:
- `0 9 * * *` - Every day at 9:00 AM
- `0 18 * * *` - Every day at 6:00 PM
- `0 9 * * 1` - Every Monday at 9:00 AM
- `0 9 1 * *` - First day of every month at 9:00 AM
- `*/30 * * * *` - Every 30 minutes

Adjust the digest time in admin preferences to match your schedule.

## Managing Cron Jobs

### View all cron jobs:
```sql
SELECT * FROM cron.job;
```

### Delete a cron job:
```sql
SELECT cron.unschedule('send-daily-notification-digest');
SELECT cron.unschedule('send-weekly-notification-digest');
```

### View cron job execution history:
```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

## Testing the Digest

You can manually trigger a digest without waiting for the cron schedule:

1. Go to Supabase Dashboard → Edge Functions
2. Find `send-notification-digest`
3. Click "Invoke" and use this body:
   ```json
   {
     "digestType": "daily"
   }
   ```
   or
   ```json
   {
     "digestType": "weekly"
   }
   ```

## Admin Configuration

Admins can control digest delivery through the Admin Dashboard → Settings → Notification Preferences:

- **Daily Digest**: Toggle to enable/disable daily summaries
- **Weekly Digest**: Toggle to enable/disable weekly summaries
- **Digest Time**: Set preferred time (informational, cron job schedule is separate)
- **Email Recipients**: Configure who receives digests

## Digest Content

Each digest email includes:

### Summary Section
- Total new business verifications
- Total agent milestones achieved

### Business Verifications
- List of all pending verification requests
- Business name and submission time

### Agent Milestones
- All milestones achieved in the period
- Agent name, milestone type, and value

### Top Performers
- Ranked list of top 5 agents
- Based on number of milestones achieved

## Troubleshooting

### Digests not sending
1. Check cron job is scheduled: `SELECT * FROM cron.job;`
2. Check execution logs: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC;`
3. Verify admin has digest enabled in preferences
4. Check edge function logs in Supabase Dashboard

### Wrong time zone
- Cron jobs run in UTC
- Calculate your local time to UTC for scheduling
- Example: 9 AM EST = 2 PM UTC, use `0 14 * * *`

### Missing notifications
- Verify notifications table has data
- Check the time range matches your expectations
- Ensure RLS policies allow service role access

## Security Notes

- Cron jobs use the anon key (public)
- Edge function validates requests
- Service role key is used internally for database access
- Never expose service role key in cron job SQL

## Next Steps

- Monitor digest delivery through email
- Review cron job execution history regularly
- Adjust schedule based on admin feedback
- Consider adding more metrics to digests
