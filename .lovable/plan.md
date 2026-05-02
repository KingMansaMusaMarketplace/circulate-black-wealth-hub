## Goal

Take Kayla's agentic team from ~82/100 to ~90/100 by closing the two highest-leverage gaps: agents that learn from user feedback, and agents that arrive smart on day one for every new business.

## Part 1 — Feedback UI (closes the learning loop)

Right now `ai_agent_feedback` exists but nothing writes to it from the UI. We'll add a tiny, reusable thumbs-up/down control that any Kayla output card can drop in.

**Build:**
1. New component `src/components/ai/AgentFeedbackButtons.tsx` — two ghost icon buttons (ThumbsUp / ThumbsDown), optional one-line "what was wrong?" textarea on thumbs-down, optimistic UI, toast on success.
2. New hook `src/hooks/useAgentFeedback.ts` — wraps the insert into `ai_agent_feedback` (agent_name, business_id, run_id, rating, comment, user_id).
3. Wire into the 4 most-visible Kayla output surfaces first:
   - `KaylaGrantMatcher` (per grant card)
   - `KaylaCustomerSegments` (per segment)
   - Cashflow forecast result card
   - Price-optimizer recommendation card
4. New admin/owner page section "Kayla Learning" on the existing AI dashboard — shows last 30 days of feedback grouped by agent with avg rating, so you can see which agents need prompt refinement.

## Part 2 — First-touch enrichment (smart on day one)

When a business completes onboarding, fire a single edge function that runs a coordinated burst of lightweight Kayla agents to seed the business profile. Every later agent then reads from this seed instead of starting blind.

**Build:**
1. New edge function `kayla-first-touch` that:
   - Triggers on a new row in `businesses` (via DB trigger calling `pg_net` to the function URL, or invoked at the end of the onboarding flow — we'll do both for reliability with idempotency on `business_id`).
   - In parallel, calls: `kayla-data-agent` (public web enrichment), `kayla-reputation-monitor` (Google reviews snapshot), `kayla-grant-matcher` (initial grant fit), `kayla-compliance-checker` (baseline gaps), `kayla-supplier-diversity` (certification opportunities).
   - Writes a single consolidated row to a new `kayla_business_baseline` table: industry, size, public sentiment, top 3 grant matches, top 3 compliance gaps, certification recommendations, generated welcome message from Kayla.
   - Inserts a "welcome digest" message into `ai_chat_sessions` for that business owner so when they first open Kayla she greets them with specifics about their business, not "How can I help?"

2. New table `kayla_business_baseline` (one row per business, RLS owner-scoped).

3. UI: small "Kayla's First Look" card on the business dashboard surfacing the baseline insights with a "Dive deeper" CTA per item.

## What this does not include (deliberately deferred)

- Wiring decision-logging into the remaining 25 agents — mechanical, do after we see feedback patterns.
- Inter-agent context bus — bigger architectural change, separate plan.
- Versioned `agent_prompts` table — defer until we have feedback data telling us which prompts to A/B.

## Technical details

- Feedback insert path: client → direct supabase.from('ai_agent_feedback').insert (RLS already permits owner + matching user_id writes per existing policy).
- First-touch trigger: prefer invoking the function explicitly at the end of `useBusinessOnboarding` success handler (synchronous reliability), with an idempotency key of `business_id` so a DB trigger backup is safe to also call.
- All five sub-agent calls inside `kayla-first-touch` run via `Promise.allSettled` so one failure doesn't kill the baseline.
- Baseline row uses `jsonb` for the consolidated insights to avoid schema churn as we tune what's stored.
- Chat seed message inserted with `role: 'assistant'` and `metadata: { type: 'first_touch_welcome' }` so the UI can style it distinctly.

## Expected outcome

- Score moves from ~82 → ~90.
- Every new business owner's first Kayla interaction is personalized to their actual business in under 30 seconds of onboarding completion.
- Every Kayla output across the 4 highest-traffic surfaces is rate-able, and you get a weekly visual of which agents users trust.
