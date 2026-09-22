# Homepage rewrite around the three reasons people buy

Seth Godin's point: in the AI era, people buy for three reasons — freedom from fear, status, and affiliation. Right now the 1325.AI homepage leads with infrastructure language ("MCP infrastructure layer for the $12T global Black economy"). That speaks to investors, not to the shopper or the business owner. This plan keeps the investor credibility but puts the three reasons front and centre.

## What changes on the homepage

**1. New headline and subline**
Replace the infrastructure headline with a plain, human promise built on the three drivers. Direction (final wording to be confirmed):

- Headline: "Find a Black-owned business you can trust — anywhere in the world."
- Subline: "Every listing verified. Every dollar you spend circulates. Kayla and 42 Agentic AI Employees keep it accurate."

**2. A three-card band directly under the hero**
One card per driver, in the user's language, no jargon:

- **Trust (freedom from fear)** — "We check every business before it appears. No dead links, no guesswork."
- **Standing (status)** — "Claim your listing and wear the verified badge. Owners get a profile customers recognise."
- **Belonging (affiliation)** — "Every purchase keeps the dollar in the community longer."

Each card gets one clear action: Search the directory / Claim your listing / See the impact.

**3. Say what "Verified" actually means**
Add a single sentence next to the verified count in the stats strip, and the same sentence on a business page near the badge, so the badge stops being an unexplained word.

**4. Reorder the calls to action**
"Shop Black-Owned" stays the primary action. "Submit Your Business — Free" becomes "Claim or Add Your Business — Free", since getting owners to show up is the priority. "Deploy Kayla" moves to the secondary row with For Investors / Meet the Team / Founder Video.

**5. Keep untouched**
The live business count, the $2.1T / $9.1T / patent stats, the founder quote, the sponsor wall, the workforce section, and the submission box all stay exactly as they are.

## Technical notes

- All edits are in `src/pages/HomePage.tsx` plus one new presentational component for the three-driver band under `src/components/homepage/`.
- The verified-meaning line on business pages goes in the existing business detail header component; copy only, no data or logic changes.
- No database, booking, directory-search, or Kayla changes. Colours use existing tokens (mansagold, mansablue) — no new hardcoded colours.
- Page title and meta description updated to match the new headline.

## Open question

The three headline/subline wordings above are my draft. Approve as-is and I will write them, or give me your own line and I will use yours.
