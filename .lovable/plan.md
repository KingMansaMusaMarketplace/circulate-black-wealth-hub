## Goal

Write a polished, ready-to-send email that accompanies the **Church Partnership Proposal v5 PDF** when Thomas sends it to a pastor or church leader.

## Deliverable

A plain text + HTML email saved to `/mnt/documents/`:
- `Church_Partnership_Email.txt` — copy/paste version for Gmail/Outlook
- `Church_Partnership_Email.html` — branded HTML version with True Black + MansaGold styling, glowing 1325.AI logo header, and a clear CTA to open the attached PDF

Both reference the PDF as an attachment (no phone number per prior instruction).

## Email Content Outline

- **Subject line options** (3 to choose from):
  1. "A Partnership to Circulate Wealth Through Your Church"
  2. "How Your Church Can Build a Vision Fund with Mansa Musa Marketplace"
  3. "Invitation: Become a Founding Church Partner of 1325.AI"
- **Greeting** — "Dear Pastor [Last Name],"
- **Opening hook** — The dollar circulates only ~6 hours in our community vs. 28+ days elsewhere. Our mission is to change that.
- **The ask** — Brief intro to Mansa Musa Marketplace (powered by 1325.AI) and the Digital Tithe model: 10% of every congregant subscription returns to the church's Vision Fund, automated monthly.
- **Why this church** — One sentence positioning the Black Church as the economic heartbeat.
- **What's attached** — Reference the proposal PDF: pricing tiers, ROI projections, partner benefits.
- **Clear CTA** — Request a 20-minute discovery call.
- **Signature** — Thomas D. Bowling, Founder & CEO, 1325.AI · Thomas@1325.AI · 1325.ai (no phone number).

## Branding (HTML version)

- True Black background (#000000), MansaGold (#FFB300) accents, MansaBlue (#003366) secondary
- Glowing 1325.AI logo at top (reuse the asset generated for v4/v5 PDF)
- Apple-minimal layout, generous whitespace, white body text on dark
- Footer: "Mansa Musa Marketplace — Powered by 1325.AI"

## Implementation

- Python script writes both `.txt` and `.html` files to `/mnt/documents/`
- Reuse the glowing logo PNG already generated (`/tmp/logo_glow_*.png`) embedded as base64 in the HTML
- QA: render the HTML to an image with a headless browser (or imagemagick) to verify layout before delivering
- Deliver both files via `<lov-artifact>` tags

## Notes

- One-off artifact generation, no app code touched
- Phone number 312.709.6006 will NOT appear anywhere (per prior memory)
