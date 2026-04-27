# Channing Capital × 1325.AI — Partnership Deck + One-Pager

## What you're getting

Two branded PDF artifacts for Keith McGregory to forward to Rodney Herenton at Channing Capital Management:

1. **`1325AI_x_ChanningCapital_Partnership_Deck.pdf`** — 10-slide landscape deck (16:9, ~13.33" × 7.5")
2. **`1325AI_x_ChanningCapital_OnePager.pdf`** — single-page letter-size summary Keith can paste into the email body or attach as a teaser

Both will live in `/mnt/documents/` and appear inline so you can preview and download.

---

## Branding (matches your existing pitch deck + manual)

- **Background:** Deep navy `#0A1F3D` with a subtle radial gold glow on cover/closing
- **Accent:** MansaGold `#FFB300`
- **Text:** White on navy, with `rgba(255,255,255,0.78)` for body copy
- **Type:** Helvetica-Bold for headlines, Helvetica for body (matches reportlab default + your manual)
- **Motif:** Thin gold rule under each section title; gold-circled checkmarks for benefit lists; small 1325.AI wordmark + "Confidential — Prepared for Channing Capital Management" footer on every slide

---

## Deck structure (10 slides)

| # | Slide | Tone | Key content |
|---|---|---|---|
| 1 | **Cover (personal)** | Warm | "Prepared for Keith McGregory & Rodney B. Herenton" · "A Partnership Conversation" · 1325.AI neural-brain mark · date |
| 2 | **Why this conversation** | Personal-pro hybrid | Short note: "Keith — at your suggestion, sharing how 1325.AI and Channing might align beyond capital." Frames it as partnership, **not** an investment ask. |
| 3 | **Two firms, one mission** | Professional | Side-by-side: Channing (est. 2003, ~$3.5B AUM, value equity, Black-led, Chicago) vs. 1325.AI (agentic commerce protocol, $1.6T market, 27 patent claims, Chicago) |
| 4 | **The intersection** | Professional | Channing serves **capital allocators upstream**; 1325.AI serves **businesses & consumers downstream**. We meet at "Black economic infrastructure." |
| 5 | **5 ways 1325.AI helps Channing** | Professional | (1) AI ops for portfolio companies (Kayla + 33 agents) · (2) Supplier-diversity intelligence for institutional clients · (3) ESG / community-impact reporting data · (4) Deal-flow signal from our SMB transaction graph · (5) Co-branded thought leadership |
| 6 | **5 ways Channing helps 1325.AI** | Professional | (1) Institutional credibility & introductions · (2) Pension/endowment LP relationships · (3) Public-equity lens on our roadmap · (4) Board / advisory expertise · (5) Chicago civic network access |
| 7 | **Joint initiatives we could launch** | Professional | • Annual *State of Black Wealth* report (Channing data + 1325.AI commerce data)<br>• Chicago SMB accelerator co-sponsored with Channing portfolio companies<br>• HBCU finance fellowship pipeline<br>• Joint LP/investor breakfast series |
| 8 | **What we're explicitly NOT asking** | Hybrid | Bold callout: "This is **not** a capital raise." We're proposing a **strategic partnership** — data, distribution, and credibility exchange. (This is the trust-builder slide.) |
| 9 | **Suggested 90-day path** | Professional | Day 0–30: 30-min intro call (Keith + Rodney + Thomas) · Day 30–60: NDA + data-sharing pilot on one Channing portfolio co · Day 60–90: Co-author one public artifact (op-ed or report) |
| 10 | **Closing (personal)** | Warm | Tagline: *"Let's build the future of Black wealth — together."*<br><br>**Thomas D. Bowling** · Founder & CEO, 1325.AI<br>✉ Thomas@1325.AI<br>📍 1000 E. 111th Street, Suite 1100, Chicago, IL 60628<br>🌐 1325.AI |

---

## One-pager structure (single letter-size PDF, portrait)

Designed to live in the **email body** as a teaser — Keith forwards email + this one-pager, attaches the full deck.

- **Header band** (navy + gold rule): "1325.AI × Channing Capital Management — A Partnership Conversation"
- **Two-column body:**
  - *Left:* "Why now" (2 short paragraphs) + "What 1325.AI is" (3 bullets: agentic commerce protocol, $1.6T market, 27 patent claims)
  - *Right:* "5 ways we can help each other" (compressed version of slides 5 + 6, 5 bullets total)
- **Joint initiative callout box** (gold border): "Proposed first step: a 30-minute intro call between Thomas, Keith, and Rodney."
- **Explicit non-ask line** in italics: *"This is a partnership conversation, not a capital raise."*
- **Footer:** Thomas's full contact block (same as slide 10) + "Confidential — Prepared at the request of Keith McGregory"

---

## Build approach

1. Switch to default mode (so I can run scripts).
2. Write a single Python script at `/tmp/build_channing_deck.py` using `reportlab` (already used for your manual + pitch deck — same look & feel).
3. Render both PDFs to `/mnt/documents/`.
4. **Mandatory QA:** convert every page to JPEG with `pdftoppm -r 150` and visually inspect each one for overlap, clipping, low contrast, alignment issues. Fix and re-render until clean.
5. Surface both files inline as `<lov-artifact>` tags so you can preview/download from chat.

---

## What I will NOT touch

- No code in the React app
- No database changes
- No edits to the existing platform manual or pitch deck
- No mention of investment / fundraising in the deck (per your direction — partnership only)

---

## After approval, you'll get back

- ✅ Deck PDF (10 slides, landscape)
- ✅ One-pager PDF (1 page, portrait)
- ✅ A short suggested email body Keith can paste above the attachments when he forwards to Rodney
- ✅ A QA summary listing every issue I found and fixed during visual review

Approve below and I'll build it.