

# Slack Notifications Integration Plan

## Overview
Create a centralized Slack notification system that sends automated alerts to your team channels for fraud alerts, new business signups, and payment confirmations. The bot will appear as "1325.AI" with customized formatting for each notification type.

## What You'll Get
- **Fraud Alerts** -- Critical/high severity fraud detections posted to Slack in real-time with severity badges and investigation links
- **New Business Signups** -- Notifications when new businesses register on the platform
- **Payment Confirmations** -- Alerts when payments (subscriptions, one-time purchases) are completed via Stripe

## Architecture

```text
+-------------------+       +---------------------+       +-------------------+
| Existing Edge     | ----> | send-slack-          | ----> | Slack Connector   |
| Functions         |       | notification         |       | Gateway           |
| (fraud, stripe,   |       | (new edge function)  |       | (chat.postMessage)|
|  signups)         |       +---------------------+       +-------------------+
+-------------------+                                            |
                                                                 v
                                                          #your-channel
```

## Implementation Steps

### 1. Create `send-slack-notification` Edge Function
A single reusable edge function that all other functions call to post to Slack. It will:
- Use the Slack connector gateway (`https://connector-gateway.lovable.dev/slack/api/chat.postMessage`)
- Accept notification type, channel, and payload
- Format messages with rich Block Kit formatting (color-coded by severity/type)
- Support fraud alerts, signup notifications, and payment confirmations
- No JWT required (called internally by other edge functions)

### 2. Update `detect-fraud` Edge Function
After inserting fraud alerts into the database, call the new Slack function to post critical/high severity alerts with:
- Alert type and severity badge
- Description and confidence score
- Link to admin dashboard for investigation

### 3. Update `stripe-webhook` Edge Function
After processing successful payments, send a Slack notification with:
- Customer/business info
- Payment amount and type
- Subscription tier (if applicable)

### 4. Create a Database Trigger for New Business Signups
Add a lightweight trigger or modify the existing signup flow to call the Slack notification when a new business is inserted into the `businesses` table.

## Technical Details

### Slack Message Formatting
Each notification type gets a distinct visual style using Slack Block Kit:
- **Fraud Alerts**: Red accent, warning emoji, severity level, confidence score
- **Business Signups**: Green accent, business name, owner info
- **Payments**: Blue accent, amount, customer, payment type

### Channel Configuration
The target Slack channel will be configurable via a `SLACK_CHANNEL_ID` secret. You'll need to provide the channel ID from your `mansamusamarketplace.slack.com` workspace (found in channel details in Slack).

### Security
- The `send-slack-notification` function will be set to `verify_jwt = false` since it's called internally by other authenticated edge functions
- Gateway authentication uses `LOVABLE_API_KEY` and `SLACK_API_KEY` (both already available)

### New Files
- `supabase/functions/send-slack-notification/index.ts` -- Core Slack posting function

### Modified Files
- `supabase/functions/detect-fraud/index.ts` -- Add Slack notification after alert insertion
- `supabase/functions/stripe-webhook/index.ts` -- Add Slack notification after payment processing
- `supabase/config.toml` -- Add config for new function

### Secret Needed
- `SLACK_CHANNEL_ID` -- The ID of the Slack channel to post notifications to (you'll provide this)

