# AGENTS
- Public directory lookup functions (search_directory_businesses, get_directory_*) must stay executable by anon + authenticated; security revokes broke the directory Sep 26 2026.
- Hard Kayla chat questions (strategy/money/legal/forecast) go through `premiumChatAnswer` in `_shared/kayla-deep.ts` (premium draft + self-check) on every chat function; keeps quality consistent and fail-open to the fast model.
- Kayla web lookups live only in `_shared/kayla-grounding.ts` `webSearch` (Perplexity first, Firecrawl fallback); answers that used the web must end with a Sources list from returned URLs only.
- Voice Kayla (`realtime-token`) builds instructions from `buildKaylaSystemPrompt` + memory; only speaking style lives in that file, so voice and chat never drift.
- Approved weekly scoreboard fixes (`kayla_improvement_proposals`, status approved) are injected via `loadApprovedImprovements` in every Kayla channel; nothing applies without admin approval.
