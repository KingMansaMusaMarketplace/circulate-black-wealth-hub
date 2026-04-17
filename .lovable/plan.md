

## Pricing Audit & Market Benchmark — 1325.AI / Mansa Musa Marketplace

### What we charge today (pulled from `subscription-tiers.ts` + admin sponsor file)

**Business SaaS tiers (per business)**
| Tier | Monthly | Annual eq. | What's inside |
|---|---|---|---|
| Free | $0 | — | Directory listing, scan-to-earn, mentorship, networking |
| Kayla AI Essentials | $19 | $15.83 | Verification + Kayla AI on, 5 QR codes, 30-day trial |
| Business Pro | $29 | $24.17 | Analytics, bookings, reviews, 25 QR codes (NO Kayla AI) |
| Kayla AI Starter | $49 | $40.83 | Pro + Kayla AI + Records Mgmt, 25 QR, 30-day trial |
| **Kayla AI Pro (popular)** | **$149** | $124.17 | Full 28-service AI suite, unlimited QR, 14-day trial |
| Kayla AI Enterprise | $420 + $30/user | — | Multi-location, white-label, integrations |

**Corporate sponsorships (monthly)**
Bronze $5,000 · Silver $15,000 · Gold $25,000 · Platinum $50,000

**Transaction layer** (from platform constants)
- Booking commission 7.5% (basic) / 12% (premium)
- QR-loyalty loop 7.5% commission + 15% user discount
- Closed-loop wallet 2% / Susu 1.5% / Ambassador $5 + 10% rev share
- Mansa Stays (28+ nights = monthly rate) · Noire Rideshare $2.50 base + $1.25/mi + $0.20/min, drivers keep 80%

---

### Market benchmark — where each tier sits vs. competitors

**SMB local-business SaaS (the apples-to-apples comp set):**
- Yelp for Business: $0 free, $1–$15/day ad packages → ~$30–$450/mo
- Google Business Profile: free
- Square for Restaurants / Retail: $0–$165/mo + 2.6%+10¢ per swipe
- Toast: $69–$165/mo + hardware + 2.49%+15¢
- Vagaro / Booksy / Mindbody: $30–$200/mo (bookings + reviews + marketing)
- Birdeye / Podium (reviews + messaging): **$300–$600+/mo**
- HoneyBook (CRM + bookings + invoicing): $19–$79/mo
- Hootsuite / Sprout Social (just social): $99–$249/mo per user
- Jasper / Copy.ai (just AI marketing copy): $39–$125/mo
- Gusto / QuickBooks bookkeeping AI: $40–$200/mo each

**Black-business / community marketplace comps:**
- EatOkra, We Buy Black, Official Black Wall Street: mostly free directories with optional $20–$100/mo featured listings — none bundle AI

**Sponsorship comps (DEI / community sponsorships, monthly equivalent):**
- US Black Chambers regional partner: $1,250–$8,300/mo
- NMSDC corporate membership: ~$2,500–$10,000/mo
- AfroTech / Blavity sponsor packs: $25k–$250k per activation (annualized $2k–$20k/mo)
- Local NAACP / Urban League partner tiers: $400–$5,000/mo

---

### My honest read, tier by tier

**1. Free + Essentials ($0 / $19)** — *Underpriced, but strategically correct.*
Free is your acquisition engine. $19 Essentials undercuts every comparable tool and that's the right move pre-PMF. Keep.

**2. Business Pro at $29** — *Significantly underpriced.*
Analytics + bookings + reviews + QR is a $79–$149 product elsewhere (Vagaro, Booksy, Birdeye lite). Charging $29 reads "hobby tool," not "growth platform," and it cannibalizes the $49 Starter (only $20 gap for adding AI + records). Recommend **$39–$49**.

**3. Kayla AI Starter at $49** — *Fair / slightly low.*
Reasonable as an AI on-ramp. If Pro raises to $39–$49, push Starter to **$69–$79**.

**4. Kayla AI Pro at $149 — *This is your real story and it's WAY underpriced.* 👈
Your own marketing claims "$12,100/mo savings, ~4 roles covered, 28 AI employees." If even 10% of that is real, $149 is laughable.
- Comparable AI-stack bundles (Jasper $125 + Birdeye $300 + Vagaro $85 + bookkeeping AI $50) = **$560+/mo for fewer integrations**
- Single-purpose AI agents (Sierra, Decagon, 11x.ai) charge **$500–$2,500/mo per agent**
- Recommend **$249–$349/mo**, with a "Founders' Lock" at $149 for first 100 paying businesses to protect early adopters and create urgency.

**5. Kayla AI Enterprise at $420 + $30/user** — *Underpriced for what it claims.*
Multi-location + white-label + integrations is a $1,000–$3,000/mo product (Toast Enterprise, Mindbody Premium, BentoBox). Recommend **$799–$1,200 base + $50/user**, or quote-based.

**6. Sponsorships ($5k–$50k/mo)** — *Top end is aggressive, bottom end is reasonable.*
- Bronze $5k/mo ($60k/yr) is in line with US Black Chambers / NMSDC.
- **Platinum $50k/mo = $600k/yr** is at AfroTech / Essence Fest tier — defensible only with proof of reach (members, scans, GMV, impressions). Without that proof deck, you'll get ghosted by procurement.
- Recommend keeping the price ladder but adding a **"Founding Sponsor" intro tier at $1,500–$2,500/mo** to convert local/regional brands who can't write a $5k check yet.

**7. Transaction fees** — *On-market and well-structured.*
7.5%–12% booking commission and 80/20 driver split are competitive with Square/Uber/DoorDash. No change needed.

---

### Bottom line

You are **leaving real money on the table on the AI tiers** (Pro and Enterprise) and **slightly underpriced on Business Pro**. Sponsorships are priced *aspirationally* — defensible once you can show traction numbers, but you need a sub-$5k entry point to actually close deals this year.

### Recommended new pricing (proposed)

| Tier | Today | Proposed | Δ |
|---|---|---|---|
| Free | $0 | $0 | — |
| Essentials | $19 | $19 | keep |
| Business Pro | $29 | **$39** | +$10 |
| Kayla Starter | $49 | **$79** | +$30 |
| Kayla Pro (popular) | $149 | **$299** (Founders $149 for first 100) | +$150 |
| Kayla Enterprise | $420 + $30/user | **$899 + $50/user** | +~$480 |
| Sponsor — NEW Founding | — | **$1,750/mo** | new entry tier |
| Sponsor Bronze | $5k | $5k | keep |
| Sponsor Silver/Gold/Platinum | $15k/$25k/$50k | keep | keep |

### What I'd do next (no code changes yet — your call)

1. **Approve / edit the proposed numbers above.** I'll only change what you green-light.
2. Once approved, I'll update `src/lib/services/subscription-tiers.ts`, the matching Stripe price IDs in `KAYLA_STRIPE_TIERS`, the pricing page copy, and add a "Founders' Pricing — first 100 businesses" badge to lock in early adopters.
3. Add the **$1,750 Founding Sponsor** tier to the sponsorship ladder and admin pages.
4. Optional: build a one-page **ROI proof sheet** ("$299 vs. $560+ stack") so sales has a comeback when prospects flinch at the new Kayla Pro price.

