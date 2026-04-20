
## Memory Audit — 1325.AI Project

I read all 9 memory files plus the index. Overall the memory is in good shape: well-organized, no major contradictions, correctly using a separate file per topic. Here's what I found and what I recommend cleaning up.

### Health summary
- **Index**: Accurate, all referenced files exist.
- **Total size**: ~2.5 KB across files. Well under any limits.
- **No user preferences file** (`mem://~user`) exists — that's a gap, not a bug.
- **No duplicate or contradictory rules** detected.

### Issues found

**1. Stale-dated content (likely outdated)**
- `pricing-model` says "Active Stripe price IDs (2026-04-17)" — that timestamp is 3 days old and fine, but the file mixes a Founders' Lock price ID (`price_1TGzewAsptTW1mCm...`) with a separate "Active Stripe price IDs" block listing a *different* "Business Pro $39" tier that isn't in the tier list above it. That's confusing.
- "Legacy $599 products exist but are disconnected" — vague; either name them or drop the line.

**2. Core section is slightly bloated**
The Core section should only hold rules that apply to *every* action. Two lines are borderline:
- `legacy-peer-deps=true required for package management` — only relevant when installing packages, not every action. Could move to a `technical-and-security` note.
- `Archived routes (/developers/*, /b2b-marketplace) are frozen` — already covered in `archived-features` file. Duplicated in Core.

**3. Missing memories that should exist now**
After today's investor-suite build, no memory captures:
- Investor portal exists at hidden `/investor-portal` route, NDA-first flow, passcode-gated
- Private `investor-materials` Supabase bucket with restrictive RLS
- v12 manual is the current canonical platform manual (supersedes v10/v11)
- USPTO Provisional **63/969,202** is the patent reference used in legal docs
- Illinois governing law for NDAs/agreements

**4. Minor inconsistencies**
- `archived-features` lists `/leads-dashboard` but Core only mentions `/developers/*` and `/b2b-marketplace`. Core is incomplete vs. detail file.
- `brand-identity` says theme is "True Black gradient" but Core says "Dark, Apple-like minimal" — not contradictory but should align wording.

**5. No `mem://~user` file**
You're non-technical and prefer plain-English explanations (based on past corrections). That should live in user preferences so it carries across projects.

---

### Proposed cleanup actions

When you approve, I'll do the following in default mode:

1. **Tighten the Core section** — remove the duplicated archived-routes line and the package-manager line; align "True Black, Apple-like minimal" wording.
2. **Update `pricing-model`** — clarify the Founders' Lock vs. Business Pro $39 tier relationship, drop or specify the vague "legacy $599" line.
3. **Add `mem://features/investor-portal`** — captures: hidden `/investor-portal` route, passcode in `INVESTOR_PORTAL_PASSCODE` secret, NDA-first flow, private `investor-materials` bucket, current canonical files (v12 manual + NDA v3), USPTO 63/969,202, Illinois governing law.
4. **Sync `archived-features` reference in Core** — either list all three archived routes in Core or drop them entirely from Core and rely on the detail file (recommended: drop from Core).
5. **Create `mem://~user`** — short file noting: prefers plain-English explanations, non-technical, wants confirmation before large changes. (Optional — only if you confirm.)
6. **Update the index** to reflect the new investor-portal memory and trimmed Core.

### Files I'll touch
- `mem://index.md` (rewrite Core + add new entry)
- `mem://features/pricing-model` (clarify)
- `mem://features/investor-portal` (new)
- `mem://~user` (new, optional)

No code files affected — this is a memory-only cleanup.
