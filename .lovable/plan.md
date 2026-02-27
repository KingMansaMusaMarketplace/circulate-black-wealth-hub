

## Plan: Update SLACK_CHANNEL_ID and Verify Notifications

### Problem
The `send-slack-notification` edge function keeps returning `channel_not_found` because the stored `SLACK_CHANNEL_ID` secret has an incorrect value.

### Steps

1. **Update the `SLACK_CHANNEL_ID` secret** to the correct value: `C0AJB2V8F4G`

2. **Re-deploy the `send-slack-notification` edge function** to ensure it picks up the new secret value

3. **Send a test notification** by calling the edge function with a sample `payment_confirmation` payload to confirm messages arrive in the Slack channel

### Technical Details
- The edge function code (`supabase/functions/send-slack-notification/index.ts`) is already correct — no code changes needed
- The Slack bot connection has the required `chat:write` scope
- The function reads `SLACK_CHANNEL_ID` from environment at runtime, so updating the secret and redeploying should resolve the issue
- If the channel is **private**, you will still need to invite the bot by typing `/invite @Lovable App` in that channel

