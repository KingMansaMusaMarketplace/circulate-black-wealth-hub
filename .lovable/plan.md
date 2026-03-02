

# Update Meet Kayla Section to Showcase Agentic AI Powers

## Why This Matters

Kayla just got upgraded with real tool-calling — she can now search the directory, check loyalty points, pull bookings, and run lead qualification **live during a voice conversation**. But the homepage still describes her as a generic "AI-powered guide." This is a missed opportunity to differentiate from every other chatbot on the market.

## What Changes

### 1. Update Section Header Copy

**Current:**
- Label: "AI Concierge"
- Description: "Your AI-powered guide... Just speak — she'll find businesses, book stays, and answer anything."

**New:**
- Label: "Agentic AI Concierge"
- Add a small gold badge/pill next to the heading that says "Powered by Real-Time Tools" to visually signal this isn't a basic chatbot
- Updated description: "More than a chatbot — Kayla takes action. She searches the live directory, checks your loyalty points, pulls your bookings, and delivers real answers — all by voice, in real time."

### 2. Redesign Capability Cards to Show Agentic Actions

Replace the current 4 generic cards with 6 cards that emphasize what Kayla **does**, not just what she knows about:

| Card | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | Search | Live Directory Search | "Ask for a restaurant nearby — she queries the real database and reads back results." |
| 2 | Star | Check Loyalty Points | "Say 'How many points do I have?' — she pulls your balance instantly." |
| 3 | Calendar | View Your Bookings | "Ask about upcoming reservations — she checks your schedule." |
| 4 | Home | Find Vacation Rentals | "Describe your ideal trip — she searches Mansa Stays listings." |
| 5 | TrendingUp | Lead Insights (Business Owners) | "Ask 'How are my leads?' — she runs live qualification scoring." |
| 6 | ShieldAlert | Churn Alerts (Business Owners) | "Ask about at-risk customers — she surfaces churn predictions." |

Grid changes from `grid-cols-2 md:grid-cols-4` to `grid-cols-2 md:grid-cols-3` to accommodate 6 cards cleanly.

### 3. Add "What Makes Kayla Different" Differentiator Row

A small row of 3 inline badges/pills below the description, before the capability cards:

- "Real-Time Data" (with a database icon)
- "Voice-First" (with a mic icon)
- "Takes Action" (with a zap/bolt icon)

These are styled as small glass-morphism pills with gold text, reinforcing that this is agentic AI, not a FAQ bot.

## File Changed

**`src/components/HomePage/MeetKaylaSection.tsx`** — Updated copy, expanded capabilities array from 4 to 6 cards, added differentiator badges, adjusted grid layout.

## Technical Notes

- No new dependencies needed — uses existing Lucide icons (`Star`, `Calendar`, `TrendingUp`, `ShieldAlert`, `Database`, `Zap`) and existing `motion` animations
- Maintains the same voice connection logic, CTA button, and sound wave visualization
- Cards remain purely presentational — they describe what Kayla can do, the actual tool-calling happens through the voice interface
- Grid shifts to `md:grid-cols-3` for 6 cards (2 rows of 3 on desktop, 3 rows of 2 on mobile)

