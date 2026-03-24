

## Redesign the Public Sponsor Display Section

The current sponsor section on the homepage shows plain white cards with just text names and small tier badges. It looks generic and doesn't communicate "these are our valued corporate sponsors" — it looks more like a placeholder list.

### What We'll Build

A premium, dark-themed sponsor showcase that:
- Has a clear **"Our Corporate Sponsors"** heading with a gold accent line and subtitle
- Generates **branded initials-based logo placeholders** (using the existing `generatePlaceholder` utility) when sponsors have no uploaded logo — so every card has a visual logo element
- Uses **tier-specific gradient borders** (platinum = purple/pink glow, gold = amber glow, silver = slate shimmer, bronze = copper tone)
- Shows the **company name below the logo** area instead of centered as the only content
- Adds a **"Visit Website" CTA** on hover with smooth overlay
- Platinum sponsors get a **larger, featured card** spanning full width with extra visual treatment
- Adds a subtle **"Become a Sponsor"** CTA link at the bottom

### Visual Design (Dark Theme)

```text
┌──────────────────────────────────────────────┐
│         ✦ Our Corporate Sponsors ✦           │
│    Powering the future of Black business     │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │  ⭐ PLATINUM FOUNDING SPONSOR           │ │
│  │  ┌──────┐                               │ │
│  │  │  BC  │  Black Excellence Capital     │ │
│  │  └──────┘                               │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  ┌────┐  │ │  ┌────┐  │ │  ┌────┐  │    │
│  │  │ UT │  │ │  │ HF │  │ │  │ MM │  │    │
│  │  └────┘  │ │  └────┘  │ │  └────┘  │    │
│  │  Unity   │ │ Heritage │ │  Mansa   │    │
│  │  GOLD    │ │  GOLD    │ │  GOLD    │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                              │
│     Interested in sponsoring? Learn more →   │
└──────────────────────────────────────────────┘
```

### Technical Changes

**1. Rewrite `src/components/sponsors/PublicSponsorDisplay.tsx`**
- Import `generatePlaceholder` from `imageOptimizer.ts` to create branded SVG logos for sponsors missing `logo_url`
- Platinum sponsors: full-width card with gradient border glow, larger logo area, "Founding Sponsor" label
- Gold/Silver/Bronze: 3-column grid (1-col on mobile) with tier-colored gradient borders
- Each card: dark `bg-slate-900/80` interior, logo/placeholder at top, company name below, tier badge
- Hover: subtle scale + border glow intensifies + "Visit Website" overlay
- Keep existing impression/click tracking logic unchanged
- Section background: matches the premium dark theme (`from-[#000000] via-[#050a18]`)
- Gold accent divider under the heading using `bg-mansagold`

**2. No other files need changes** — the component is already imported and placed in `HomePage.tsx`.

