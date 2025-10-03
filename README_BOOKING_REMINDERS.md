# Booking Reminder System

## Overview
The booking reminder system automatically sends email reminders to customers 24 hours before their appointments.

## Setup

### Automatic Reminders (Recommended)

To enable automatic reminders, you need to set up a scheduled task that calls the `send-booking-reminder` edge function every hour.

#### Option 1: Using Supabase Cron (Database Triggers)

```sql
-- Create a cron job to run every hour
SELECT cron.schedule(
  'send-booking-reminders',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/send-booking-reminder',
    headers := jsonb_build_object('Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

#### Option 2: Using External Cron Service (e.g., GitHub Actions)

Create `.github/workflows/booking-reminders.yml`:

```yaml
name: Send Booking Reminders
on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Allow manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Call reminder function
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/send-booking-reminder
```

#### Option 3: Using Vercel Cron (if deployed on Vercel)

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/send-booking-reminders",
    "schedule": "0 * * * *"
  }]
}
```

### Manual Reminders

You can also trigger reminders manually by calling the edge function:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/send-booking-reminder
```

## How It Works

1. The `send-booking-reminder` function runs on a schedule
2. It queries all confirmed bookings happening in the next 24 hours
3. For each booking, it sends a reminder email to the customer
4. Emails include:
   - Appointment details (date, time, duration)
   - Business location and contact information
   - Helpful tips and reminders

## Customization

### Changing Reminder Timing

Edit `supabase/functions/send-booking-reminder/index.ts`:

```typescript
// Change from 24 hours to 2 hours before appointment
const now = new Date();
const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

const { data: upcomingBookings } = await supabase
  .from('bookings')
  .eq('status', 'confirmed')
  .gte('booking_date', now.toISOString())
  .lte('booking_date', twoHoursFromNow.toISOString());
```

### Multiple Reminder Intervals

You can create multiple reminder functions:
- `send-booking-reminder-24h` - 24 hours before
- `send-booking-reminder-2h` - 2 hours before
- `send-booking-reminder-1h` - 1 hour before

## Monitoring

View reminder logs in Supabase:
- Edge function logs: https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns/functions/send-booking-reminder/logs
- Email notifications: Query the `email_notifications` table

## Testing

Test the reminder function manually:

```bash
# This will send reminders for all bookings in the next 24 hours
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/send-booking-reminder
```

## Troubleshooting

### Reminders Not Sending

1. Check that bookings have `status = 'confirmed'`
2. Verify the cron job is running
3. Check edge function logs for errors
4. Ensure RESEND_API_KEY is configured

### Wrong Timing

Verify your server timezone matches your business timezone. The function uses UTC timestamps.
