

# Plan: Triple-Model AI Orchestration with Claude

## Prerequisites
You'll add your **Anthropic API key** as a Supabase secret — I'll prompt you for it in the first step.

## Steps

### 1. Store the Anthropic API Key
Add `ANTHROPIC_API_KEY` as a Supabase secret so the orchestrator edge function can use it.

### 2. Create Edge Function: `ai-chat-orchestrator`
A new function at `supabase/functions/ai-chat-orchestrator/index.ts` that:

- **Classifies** each query using a fast, cheap model (Gemini Flash Lite via Lovable AI Gateway) into one of four categories:
  - `simple` → **Gemini** (fast FAQs, greetings, navigation)
  - `complex` → **Claude** (strategy, reasoning, multi-step analysis)
  - `search` → **Perplexity** (real-time web data, trending info, citations)
  - `critical` → **Claude + Perplexity** in parallel (high-stakes decisions needing both reasoning and real data)

- **Calls the right provider(s)**:
  - Gemini via Lovable AI Gateway (`LOVABLE_API_KEY`)
  - Claude via Anthropic Messages API (`ANTHROPIC_API_KEY`)
  - Perplexity via its API (`PERPLEXITY_API_KEY` — already configured)

- **Uses the same Kayla system prompt** from the existing `ai-chat` function
- **Streams the response** in OpenAI-compatible SSE format (same as current frontend expects)
- **Automatic failover**: if any provider is down, routes to the next available one

### 3. Update AI Assistant UI (`AIAssistant.tsx`)
- Change the fetch URL from `/functions/v1/ai-chat` to `/functions/v1/ai-chat-orchestrator`
- Add a small badge below each response showing which model(s) powered it (e.g., "⚡ Gemini", "🧠 Claude", "🔍 Perplexity + Claude")
- Show "Kayla+" label when multi-model consensus is used
- Render responses with `react-markdown` for proper formatting

### 4. Keep Existing `ai-chat` as Fallback
The current function stays untouched — if the orchestrator ever fails entirely, the frontend can fall back to it.

### 5. Deploy & Test
Deploy the new edge function and verify all routing paths work.

## Technical Details

- **Classifier call**: ~50ms using `google/gemini-2.5-flash-lite` — adds minimal latency
- **Claude model**: `claude-sonnet-4-20250514` via `https://api.anthropic.com/v1/messages`
- **Perplexity**: Uses existing `PERPLEXITY_API_KEY` connector
- **Cost impact**: Most queries (simple) stay on Gemini (cheapest). Only complex/critical queries hit Claude (~$3/$15 per million tokens). Perplexity only for search queries.
- **Circuit breaker**: Leverages existing `retry.ts` pattern for resilience

