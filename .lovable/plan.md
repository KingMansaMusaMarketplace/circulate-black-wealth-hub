

# Add 3 AI Team Members: CRO, Patent Strategist, Investor Relations Manager

## What We're Building

Adding three new AI-powered team members to the About page team section and updating the pitch deck team slide to showcase the AI workforce alongside human leadership. These three roles fill the critical gaps for fundraising: revenue optimization, IP protection, and investor readiness.

### New AI Team Members

1. **Kayla CRO (AI Chief Revenue Officer)** -- Models ARR forecasting across 8 revenue streams, optimizes pricing tiers, tracks MRR/churn/NRR metrics
2. **Kayla IP Shield (AI Patent & IP Strategist)** -- Monitors 27 patent claims under USPTO 63/969,202, tracks competitive filings, manages claim amendments
3. **Kayla IR (AI Investor Relations Manager)** -- Automates financial reporting, manages VC pipeline, generates investor-ready materials

### Technical Details

**Files to modify:**

1. **`src/components/AboutPage/TeamSection/types.ts`** -- Add an optional `isAI?: boolean` field to distinguish AI team members from human ones

2. **`src/components/AboutPage/TeamSection/teamData.ts`** -- Add 3 new entries with `isAI: true`, professional bios referencing Kayla's agentic infrastructure, and robot/AI-themed avatar images from Unsplash

3. **`src/components/AboutPage/TeamSection/TeamMemberCard.tsx`** -- Add a subtle "AI Agent" badge/indicator on AI team member cards (e.g., a small glowing badge with a Bot icon) to differentiate them visually from human members

4. **`src/components/AboutPage/TeamSection/TeamMemberDialog.tsx`** -- Show AI-specific details in the dialog (e.g., "Powered by Kayla" label, capabilities list instead of education)

5. **`src/components/AboutPage/TeamSection.tsx`** -- Update the grid layout: keep `lg:grid-cols-4` but add a section header distinguishing "Leadership Team" from "AI Workforce" with a divider between the two groups

6. **`src/components/pitch-deck/PitchSlide12Team.tsx`** -- Add an "AI Workforce" section below the advisors card showing the 3 AI roles with brief capability descriptions, reinforcing the "human + AI" team narrative for investors

### Design Approach

- AI team member cards will use the same card design but with a distinguishing gradient (blue-to-purple instead of blue-to-blue) and a small "AI" chip
- Avatar fallbacks will use Bot/Brain icons instead of initials
- The About page will show human team first, then a "Powered by Kayla" divider, then AI team members
- Pitch deck slide keeps existing founder + advisors layout, adds a compact AI workforce row

