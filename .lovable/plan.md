

# Plan: AI Answering Service for Business Owners

## Overview
Build a "Kayla for Your Business" AI answering service where business owners configure an AI agent that handles customer calls/texts — answers FAQs, takes messages, and notifies the owner.

## Steps

### 1. Create Database Tables (Migration)
- **`business_answering_config`**: `id`, `business_id`, `owner_id`, `greeting_message`, `business_hours` (jsonb), `faq_entries` (jsonb array), `forwarding_number`, `is_active`, `voice_id`, `max_call_duration_seconds`, `twilio_phone_number`, timestamps
- **`answering_call_logs`**: `id`, `business_id`, `caller_number`, `call_duration`, `transcript`, `summary`, `action_taken` (enum: answered_faq, took_message, forwarded), `sentiment`, `created_at`
- RLS policies: owners can only read/write their own config and logs

### 2. Connect Twilio via Connector
- Use `standard_connectors--connect` with `twilio` connector
- Verify `TWILIO_API_KEY` and `LOVABLE_API_KEY` secrets are available

### 3. Create Edge Function: `answering-service-config`
- CRUD API for business owners to manage their answering config (greeting, FAQs, hours)
- Authenticated — validates user owns the business
- Supports GET (fetch config) and POST/PUT (update config)

### 4. Create Edge Function: `kayla-answering-service`
- Receives inbound Twilio webhook (SMS initially, voice later)
- Looks up business by Twilio phone number
- Loads business FAQ entries and context from `business_answering_config`
- Calls Lovable AI Gateway with a business-specific system prompt built from the owner's FAQs, hours, greeting, and category
- Returns response via Twilio SMS
- Logs interaction to `answering_call_logs`

### 5. Build Dashboard UI: Answering Service Tab
New tab in the Business Dashboard with:
- **Setup wizard**: greeting message editor, business hours picker, FAQ builder (question + answer pairs)
- **Toggle**: enable/disable the service
- **Call/message log viewer**: list of handled interactions with transcripts and sentiment
- **Simple analytics**: messages handled, top questions, sentiment breakdown

### 6. SMS Test Flow
- Add a "Send Test Message" button that simulates a customer text to verify the AI responds correctly using the owner's configured FAQs

## Technical Details
- **AI Model**: Lovable AI Gateway (`google/gemini-3-flash-preview`) — fast and cost-effective for FAQ-style responses
- **Start with SMS**: Lower complexity than voice; voice can be added later with ElevenLabs TTS
- **Twilio gateway**: All calls go through `connector-gateway.lovable.dev/twilio`
- **System prompt**: Dynamically built per-business using their name, category, FAQs, hours, and address
- **Subscription gating**: Feature gated behind Premium/Enterprise tier via existing `FeatureGate` component

