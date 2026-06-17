# Correct Terminology: "42 Agentic AI Employees"

The distinction matters — these are **agentic** (autonomous, goal-driven) AI workers, not generic AI assistants. I'll make sure every surface reflects that.

## Scope

**1. Manual PDF (rebuild as v54)**
- Update the source content that generates the manual so all instances of:
  - "42 AI Employees" → "42 Agentic AI Employees"
  - "42 AI employees" → "42 Agentic AI employees"
  - "AI Employees" (when referring to the 42) → "Agentic AI Employees"
- Update the bookmark label "42 AI Employees" → "42 Agentic AI Employees"
- Re-render PDF and re-apply the snapped bookmarks from v53
- Output: `1325AI_Complete_Platform_Manual_v54.pdf`

**2. App codebase (so future regenerations stay correct)**
- Search the project for the phrases above and update:
  - Marketing/landing copy
  - Component labels (e.g., agent directory headers, ROI section)
  - SEO meta tags / OG descriptions if they mention it
- Leave internal variable names alone (e.g., `aiEmployees`) — only user-facing strings change.

**3. Memory update**
- Update `mem://features/agentic-ecosystem` and the Core memory line so future AI sessions always say **"42 Agentic AI Employees"**.

## What stays the same
- The count (42) and the "~4 Roles Covered / $18,000+/mo savings" framing
- Individual agent names and the hierarchy
- Bookmarks structure from v53 (Roman numeral sections, charts appendix)

## Out of scope
- No design or layout changes to the manual
- No changes to pricing, features, or other copy

Ready to switch to build mode and ship v54 + the in-app text fixes?
