# Kayla Agentic AI Team — Full Health Audit & Intelligence Upgrade

## Goal
Give you a verifiable, evidence-based answer to "Is my Kayla AI team at 100/100?" — and then close any gaps so it actually gets smarter over time.

## Phase 1 — Audit (read-only, ~10 min)

I will inspect the live system and produce a scorecard. No code changes in this phase.

1. **Agent Inventory** — Query the database to confirm all 33 agents are registered, active, and assigned to a department per the Agentic Ecosystem hierarchy.
2. **Edge Function Health** — Pull last 7 days of logs for `ai-agent`, `generate-ai-business-insights`, and Kayla's chat function. Count: success rate, error rate, avg latency, rate-limit hits (429), credit errors (402).
3. **Output Quality Sample** — Pull the 20 most recent rows from `business_insights`, `lead_scores`, `churn_predictions`, and `ai_agent_actions`. Manually review for: hallucinations, generic output, missing reasoning fields.
4. **Model Routing Check** — Verify each agent uses the right model for its job (heavy reasoning → gemini-2.5-pro / gpt-5; light tasks → gemini-3-flash-preview). Mis-routed agents waste money or under-perform.
5. **Prompt Versioning Check** — Look for system prompts in edge functions. Flag any that are vague, contradictory, or missing role/format instructions.

**Deliverable:** A scorecard PDF in `/mnt/documents/kayla-team-audit.pdf` with a real number out of 100, color-coded by dimension, and a prioritized fix list.

## Phase 2 — Intelligence Upgrades (only if you approve after seeing the audit)

These are the four upgrades that make agents genuinely smarter over time. We pick which to build based on audit findings.

### Upgrade A — Agent Memory (RAG)
- New table `agent_memory` storing past decisions, outcomes, and embeddings
- Before each agent call, retrieve top-5 relevant past decisions and inject into the prompt
- Result: Agents stop repeating mistakes and reuse what worked

### Upgrade B — Feedback Loop
- Add thumbs-up/down on every agent output in the UI
- Store ratings in `ai_agent_feedback` table
- Weekly job: surface lowest-rated outputs so prompts can be refined
- Result: Measurable quality improvement week over week

### Upgrade C — Prompt Version Control
- Move all agent system prompts into a `agent_prompts` table with version, A/B variant, and performance metrics
- Track which prompt version produced which output
- Result: Safe, measurable prompt iteration instead of blind edits

### Upgrade D — Inter-Agent Memory Bus
- Agents can read each other's recent conclusions (e.g., the Churn agent sees what the Lead-Scoring agent just decided about the same customer)
- Implemented as a shared `agent_context_bus` table with TTL
- Result: Coordinated decisions instead of siloed ones — this is the Level 3 "AI Organization" behavior your patent claims

## What I Need From You

Two decisions:

1. **Run the audit?** (Phase 1 only — read-only, no risk, ~10 min)
2. **Audit format:** PDF report, or live dashboard page at `/admin/kayla-health`?

After Phase 1 you'll see the real score and decide which Phase 2 upgrades to fund.

## Honest Notes

- I cannot promise "100/100" before running the audit — that would be guessing.
- "Beginning very smart" requires Upgrades A + C at minimum. Without them, every Kayla conversation starts from zero context.
- None of this requires new infrastructure — your current Lovable Cloud + Lovable AI Gateway + Supabase stack supports all four upgrades.
