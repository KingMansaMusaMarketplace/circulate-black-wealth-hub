# Add subtle MCP infrastructure badge to homepage

## What this does (plain English)

Add a small, tasteful pill/badge near the top of the homepage that signals to investors, developers, and AI-savvy visitors that 1325.AI is **real infrastructure** — an MCP (Model Context Protocol) server that ChatGPT, Claude, Cursor, and Codex can connect to as a tool.

Regular shoppers will barely notice it. The people who *do* know what MCP means (investors, devs, tech influencers) will immediately understand: **this isn't just another marketplace — it's protocol-level infrastructure.**

## What it looks like

A single small pill sitting just above or just below the hero headline. Something like:

```text
┌─────────────────────────────────────────────────────┐
│  ⚡ AI Infrastructure  •  MCP-ready for ChatGPT,    │
│     Claude, Cursor & Codex  →                       │
└─────────────────────────────────────────────────────┘
```

- Styled with the existing MansaGold accent + subtle border (matches the current dark hero).
- Clickable — links to `/connect` (the page we already built with the Copy URL + Claude/ChatGPT shortcut buttons).
- Small text, low visual weight. Doesn't compete with the main hero headline or the "Explore the directory" call-to-action.
- Small lightning/plug icon from lucide-react so it reads as "technical" at a glance without needing to read it.

## Why this is the right amount

- **Doesn't hurt shopper conversion.** The hero's main job — get people into the directory — stays intact.
- **Proves the investor claim.** Your homepage already says "the agentic commerce protocol" in words. This badge is the *proof*: click it, connect it, use it.
- **Zero risk.** It's a link to an existing page. No backend, no MCP server changes, no new dependencies.
- **Reversible in 30 seconds** if you don't like it.

## Where the change lands

- **One file only:** `src/components/Hero.tsx` (I'll read it first to place the badge in the right spot without disturbing the existing layout).
- **No new components, no new dependencies, no design-token changes.**
- Uses `Link` from `react-router-dom` (already imported elsewhere) and an icon from `lucide-react` (already used across the site).

## What I'd write (technical detail, safe to skip)

- Add a `<Link to="/connect">` element wrapping a pill styled with `border border-mansagold/30 bg-mansagold/5 text-mansagold text-xs` (matches existing dark-theme accents in `WhySection`, `HomePage`, and the sponsor banner).
- Icon: `Zap` from lucide-react (already used elsewhere in the codebase).
- Copy: **"AI Infrastructure · MCP-ready for ChatGPT, Claude, Cursor & Codex"** with an arrow.
- Placed inside the existing hero container, above the H1, so it doesn't shift any spacing on mobile.

## What you'll need to do

Nothing. Just approve the plan and I'll ship it. After it's live, click the badge yourself once to make sure it takes you to `/connect` — that's the whole QA step.

## What I will NOT do

- Not adding a full section, banner, or anything below the fold.
- Not changing the hero headline, subhead, or CTAs.
- Not touching the MCP server, edge functions, or `/connect` page.
- Not changing colors, fonts, or the design system.
