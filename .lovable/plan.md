
# Make Kayla an Agentic AI

## Current State

**Kayla (Voice Concierge):** Conversational only -- she can answer questions about 1325.AI but cannot take any actions. She connects via OpenAI Realtime API (WebRTC) with an ephemeral token from the `realtime-token` edge function.

**AI Agent (Separate System):** The `ai-agent` edge function performs autonomous operations (lead qualification, churn prediction, deal scoring, ticket resolution) but is only accessible via the AI Agent Dashboard -- completely disconnected from Kayla.

## What Changes

Wire Kayla with **tool-calling** so she can perform real actions during voice conversations. When a user asks Kayla to do something actionable, OpenAI will emit a `function_call` event instead of just talking. The client intercepts it, calls a new edge function to execute the tool, and sends the result back to the conversation.

## Architecture

```text
User speaks to Kayla
        |
  OpenAI Realtime API
        |
  Detects tool intent
        |
  Emits function_call event
        |
  Client (RealtimeAudio.ts) intercepts
        |
  Calls kayla-tools edge function
        |
  Executes action (DB query, booking, etc.)
        |
  Returns result to OpenAI via data channel
        |
  Kayla speaks the result naturally
```

## Implementation Plan

### 1. Create `kayla-tools` Edge Function

A new edge function that acts as the execution layer for Kayla's tool calls. It receives a tool name + arguments, executes the corresponding action against Supabase, and returns structured results.

**Tools to include:**

| Tool | Description | DB Action |
|------|-------------|-----------|
| `search_businesses` | Search the business directory by category, name, or location | SELECT from `businesses` |
| `get_business_details` | Get full details for a specific business | SELECT from `businesses` with reviews |
| `check_loyalty_points` | Check a user's loyalty point balance | SELECT from `loyalty_points` |
| `get_nearby_businesses` | Find businesses near a location | Geospatial query on `businesses` |
| `get_upcoming_bookings` | Check user's upcoming bookings | SELECT from `bookings` |
| `run_lead_qualification` | Trigger lead scoring for a business owner | Calls existing `qualifyLeads` logic |
| `get_churn_alerts` | Get high-risk churn predictions | SELECT from `churn_predictions` |
| `get_deal_pipeline` | Get B2B deal scores and pipeline | SELECT from `deal_scores` |
| `get_agent_stats` | Get AI agent dashboard stats | Aggregated queries |

The function validates JWT auth, determines user context (regular user vs business owner vs admin), and restricts tools accordingly.

### 2. Update `realtime-token` Edge Function

Add a `tools` array to the OpenAI session configuration (lines 748-769). OpenAI Realtime API supports function definitions in the session creation payload, identical to the Chat Completions `tools` format.

This tells OpenAI: "When the user asks to search businesses, call this function instead of guessing."

### 3. Update `RealtimeAudio.ts` Client

Add a handler for `response.function_call_arguments.done` events from the data channel. When received:

1. Parse the function name and arguments
2. Call the `kayla-tools` edge function via `supabase.functions.invoke()`
3. Send the result back to OpenAI via `conversation.item.create` (type: `function_call_output`)
4. Trigger `response.create` so Kayla speaks the result

Also handle intermediate events like `response.function_call_arguments.delta` for UI feedback (show "Kayla is looking that up..." state).

### 4. Update `useVoiceConnection.ts` Hook

Add new state for tool execution:
- `isExecutingTool` boolean for UI feedback
- Handle the new `function_call` event type in `handleMessage`
- Expose tool execution state to consuming components

### 5. Update Voice UI Components

- `VoiceButton.tsx`: Show a distinct state when Kayla is executing a tool (e.g., pulsing search icon instead of speaking indicator)
- `VoiceTranscript.tsx`: Show "Searching businesses..." or similar contextual messages during tool execution

### 6. Update `supabase/config.toml`

Add the new `kayla-tools` function entry with `verify_jwt = false` (auth validated in code).

## Technical Details

**OpenAI Realtime API tool format** (added to session creation):
```json
{
  "tools": [
    {
      "type": "function",
      "name": "search_businesses",
      "description": "Search the 1325.AI business directory",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "category": { "type": "string" },
          "limit": { "type": "number" }
        },
        "required": ["query"]
      }
    }
  ]
}
```

**Client-side function call handling** (in data channel message handler):
```typescript
if (event.type === 'response.function_call_arguments.done') {
  // Execute tool via edge function
  const result = await supabase.functions.invoke('kayla-tools', {
    body: { tool: event.name, arguments: JSON.parse(event.arguments) }
  });
  // Send result back to OpenAI
  dc.send(JSON.stringify({
    type: 'conversation.item.create',
    item: { type: 'function_call_output', call_id: event.call_id, output: JSON.stringify(result.data) }
  }));
  dc.send(JSON.stringify({ type: 'response.create' }));
}
```

**Role-based tool access:**
- All users: `search_businesses`, `get_business_details`, `get_nearby_businesses`, `check_loyalty_points`, `get_upcoming_bookings`
- Business owners: All above + `run_lead_qualification`, `get_churn_alerts`, `get_deal_pipeline`, `get_agent_stats`
- Admins: All tools

## Files Modified

1. **NEW** `supabase/functions/kayla-tools/index.ts` -- Tool execution engine
2. **EDIT** `supabase/functions/realtime-token/index.ts` -- Add tools array to session config
3. **EDIT** `src/utils/RealtimeAudio.ts` -- Handle function_call events in data channel
4. **EDIT** `src/components/voice/useVoiceConnection.ts` -- Add tool execution state
5. **EDIT** `src/components/voice/VoiceButton.tsx` -- Tool execution UI state
6. **EDIT** `supabase/config.toml` -- Register new function

## What Kayla Can Do After This

A user can say:
- *"Find me a Black-owned restaurant near downtown Columbus"* -- Kayla searches the directory and reads back results
- *"How many loyalty points do I have?"* -- Kayla checks their balance
- *"Do I have any bookings coming up?"* -- Kayla checks their schedule
- A business owner can say: *"How are my leads looking?"* -- Kayla runs lead qualification and reports scores
- *"Any customers at risk of churning?"* -- Kayla pulls churn alerts and recommends actions
