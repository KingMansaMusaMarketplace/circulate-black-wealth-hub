## Plan: Update Savings Headline from $12,100+/mo to $18,000+/mo

**Scope:** Replace all public-facing mentions of "$12,100+/mo" (and variants like "~$12,100/mo") with "$18,000+/mo" to reflect the expanded 42-agentic-AI-employee value proposition.

**Files affected (11 files, 16 occurrences):**
1. `src/components/Hero.tsx` — 2 occurrences (lines 208, 344)
2. `src/components/HomePage/PricingSection.tsx` — 1 occurrence (line 116)
3. `src/components/HomePage/TrustStatStrip.tsx` — 1 occurrence (line 5)
4. `src/components/business/kayla/KaylaTeamRosterTeaser.tsx` — 1 occurrence (line 57)
5. `src/components/homepage/KaylaDemoSection.tsx` — 1 occurrence (line 87)
6. `src/components/pitch-deck/PitchSlide6BusinessModel.tsx` — 1 occurrence (line 36)
7. `src/components/sponsorship/SponsorshipImpactSection.tsx` — 1 occurrence (line 7)
8. `src/pages/AdminOutreachCRM.tsx` — 1 occurrence (line 151)
9. `src/pages/BusinessSignupPage.tsx` — 3 occurrences (lines 465, 476, 625)
10. `src/pages/KaylaTeamPage.tsx` — 1 occurrence (line 42)
11. `src/pages/Why1325Page.tsx` — 1 occurrence (line 36)
12. `src/pages/admin/AIWorkforceDashboard.tsx` — 1 occurrence (line 539)

**Technical steps:**
- Use `sed` to replace `$12,100+` → `$18,000+`, `~$12,100/mo` → `~$18,000/mo`, and `12,100` → `18,000` in each file.
- Run `bunx tsc --noEmit` to verify TypeScript compiles cleanly.