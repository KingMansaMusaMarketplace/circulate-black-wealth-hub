

# Event-Driven Kayla: From Cron to Pub/Sub Orchestration

## What This Changes

Right now, Kayla's 7 services (Review Responder, Onboarding Concierge, Churn Predictor, B2B Matchmaker, Content Generator, Quality Scorer, Data Agent) all run on fixed cron schedules — daily at 6 AM and 1 PM CST. This means if a new review comes in at 6:01 AM, Kayla won't respond until 1 PM. With event-driven orchestration, Kayla reacts within seconds of any trigger.

## Architecture

```text
┌─────────────────────────────────────────────────────┐
│                   DATABASE EVENTS                    │
│                                                      │
│  New Review → trigger → kayla_event_queue (INSERT)   │
│  New Signup → trigger → kayla_event_queue (INSERT)   │
│  Booking    → trigger → kayla_event_queue (INSERT)   │
│  Inactivity → pg_cron  → kayla_event_queue (INSERT)  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│          kayla_event_queue table                      │
│  id | event_type | payload | status | created_at     │
│  ── | ────────── | ─────── | ────── | ──────────     │
│  …  | new_review | {id:…}  | pending| 2026-03-21…    │
└──────────────────────┬──────────────────────────────┘
                       │ pg_net.http_post (via trigger)
                       ▼
┌──────────────────────────────────────────────────────┐
│          kayla-event-processor (Edge Function)        │
│                                                      │
│  Routes event_type → correct service handler:        │
│    new_review      → Review Responder                │
│    new_signup      → Onboarding Concierge            │
│    new_booking     → Content Generator               │
│    churn_signal    → Churn Predictor                 │
│    b2b_match       → B2B Matchmaker                  │
│    quality_check   → Quality Scorer                  │
└──────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Create the Event Queue Table
A new `kayla_event_queue` table acts as the central nervous system. Every event gets logged here with a type, JSON payload, processing status, and timestamps. This gives full auditability of everything Kayla reacts to.

### Step 2: Create Database Triggers on Key Tables
Add `AFTER INSERT` triggers on the tables that matter most:
- **`reviews`** — fires `new_review` event (routes to Review Responder)
- **`profiles`** — fires `new_signup` event (routes to Onboarding Concierge)
- **`bookings`** — fires `new_booking` event
- **`businesses`** — fires `new_business` event (routes to Quality Scorer)
- **`b2b_connections`** — fires `b2b_request` event (routes to Matchmaker)

Each trigger inserts a row into `kayla_event_queue` and then calls `pg_net.http_post` to invoke the new edge function immediately.

### Step 3: Build `kayla-event-processor` Edge Function
A new edge function that receives an event type + payload and routes it to the correct service handler. It reuses the existing service logic from `kayla-services` (Review Responder, Onboarding Concierge, etc.) but runs them for a single record instead of batch-scanning.

### Step 4: Keep Cron as a Safety Net
The existing cron jobs stay but shift to a "sweep" role — running less frequently (e.g., every 6 hours instead of twice daily) to catch anything the event triggers might have missed. This hybrid approach ensures zero events are dropped.

### Step 5: Add Event Dashboard to Admin Panel
A new tab in the Admin AI Command Center showing:
- Real-time event stream (last 50 events)
- Event processing stats (avg response time, success rate)
- Failed event retry controls

### Step 6: Frontend Real-Time Listener
Subscribe to `kayla_event_queue` via Supabase Realtime so the admin dashboard updates live as events flow through — Kayla's activity becomes visible in real time.

## Technical Details

**Event Queue Schema:**
- `id` (uuid), `event_type` (text), `payload` (jsonb), `status` (pending/processing/completed/failed), `target_service` (text), `created_at`, `processed_at`, `error_message` (text nullable), `retry_count` (int default 0)

**Trigger Pattern (per table):**
```sql
CREATE FUNCTION kayla_emit_event() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO kayla_event_queue (event_type, payload, target_service)
  VALUES (TG_ARGV[0], row_to_json(NEW), TG_ARGV[1]);
  
  PERFORM net.http_post(
    url := '...supabase.co/functions/v1/kayla-event-processor',
    headers := '{"Authorization":"Bearer ...","Content-Type":"application/json"}'::jsonb,
    body := json_build_object('event_type', TG_ARGV[0], 'record_id', NEW.id)::jsonb
  );
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Debouncing:** Events within 5 seconds of the same type + entity ID are deduplicated to prevent trigger storms during batch imports.

**Retry Logic:** Failed events are retried up to 3 times with exponential backoff via a lightweight pg_cron job running every 2 minutes.

## What Kayla Feels Like After This

| Scenario | Before (Cron) | After (Event-Driven) |
|----------|--------------|---------------------|
| New review posted | Responded at next cron (up to 7hrs) | Draft response in ~10 seconds |
| Business signs up | Welcome at next cron run | Onboarding message within seconds |
| Listing quality drop | Caught on daily sweep | Scored immediately on save |
| B2B match opportunity | Found on schedule | Suggested in real time |

