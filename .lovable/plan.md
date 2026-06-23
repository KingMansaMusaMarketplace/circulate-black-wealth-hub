
# Plan: Two PDFs for Dr. Atwater (Comped Full Office Automation)

Build two branded PDFs in the same visual style as the existing `Atwater_OSA_Full_Office_Automation.pdf` (MansaBlue `#003366`, MansaGold `#FFB300`, near-black body) using Python + reportlab. Save both to `/mnt/documents/` so you can preview and forward to Dr. Atwater.

---

## Deliverable 1: `Atwater_OSA_Upgrade_Path.pdf` (~3 pages)

**Purpose:** Show Dr. Atwater the full vision — what 1325.AI can do once HIPAA paperwork and EHR (electronic health record) integration are in place — and make clear you (Mansa Musa Marketplace) are comping everything as a gift to a friend.

**Page 1 — Cover & Vision**
- Header: "Full Office Automation — Upgrade Path"
- Subhead: "Prepared exclusively for Dr. John Atwater, Orthopedic Specialists of the Atlantic, Stuart, FL"
- Gold "COMPLIMENTARY — $0/MONTH FOR LIFE OF FRIENDSHIP" badge
- 3-sentence framing: starts on $299/mo Pro (comped) → unlocks PHI + EHR + billing → ~$32K–$38K/mo in role coverage

**Page 2 — The 3 Unlock Tiers Table**
| Tier | What unlocks | What it normally costs | Your price |
|---|---|---|---|
| Tier 1 — BAA signed | PHI in calls/texts/reminders, patient-specific scheduling | Free | **Free** |
| Tier 2 — EHR integration | Auto-intake into chart, appointment sync, call notes logged | $3,500–$8,000 one-time | **Comped** |
| Tier 3 — Ledger Pro add-on | Insurance eligibility checks, AR chasing, billing reports | $200/mo | **Comped** |

Plus a clear "Always Human" box: clinical decisions, prescriptions, lab orders, claim submission — these stay with licensed staff (legal requirement, protects his license).

**Page 3 — Before / After + Next Steps**
- Side-by-side: current Pro coverage (~$19,500/mo) vs. Full Office Automation (~$32K–$38K/mo)
- 4 next steps: (1) sign BAA, (2) tell us EHR vendor, (3) 30-min Kayla onboarding call, (4) go live
- Footer: "A gift from Mansa Musa Marketplace / 1325.AI to a trusted friend of the practice."

---

## Deliverable 2: `Atwater_OSA_BAA_Cover_Letter.pdf` (1 page)

**Purpose:** Plain-English cover letter explaining what a BAA (Business Associate Agreement) is and why signing it unlocks the next phase. **Not the BAA itself** — the actual legal BAA should come from your attorney. This is the friendly letter that goes on top.

**Contents:**
- 1325.AI letterhead (brand colors)
- Date placeholder, addressed to Dr. Atwater at OSA Stuart FL
- 3 short paragraphs:
  1. "Thank you for trusting 1325.AI with OSA's operations."
  2. Plain-English explanation: a BAA is a 1–2 page HIPAA contract that lets us legally handle patient health information (PHI). Without it we can only do non-PHI work (marketing, reviews, general scheduling). With it, our agents can do specific patient scheduling, intake, reminders, recalls.
  3. "Please sign and return the attached BAA. Once received, we'll activate Tier 1 within 48 hours."
- Signature block placeholder for you
- Note at bottom: "Attach your legal BAA template here before sending."

---

## Technical notes (for the AI to execute)

- Reuse the reportlab style/setup from the prior `Atwater_OSA_Full_Office_Automation.pdf` build (same fonts, brand colors, table styling) for visual consistency
- Use `SimpleDocTemplate`, `Table`, `Paragraph`, `Spacer`, `PageBreak`
- QA both PDFs with `pdftoppm` and inspect each page image for overflow, clipping, or color issues before delivering
- Emit `<presentation-artifact>` tags for both files when done

---

## What you'll need to do after

1. **Forward the Upgrade Path PDF** to Dr. Atwater alongside the existing Full Office Automation addendum
2. **Have your attorney prepare the actual BAA** (1–2 page HIPAA contract); attach it behind the cover letter before sending
3. **Get his EHR vendor name** (Athena, eClinicalWorks, Epic, etc.) so the integration can be scoped
4. **Reply here with his login email** so the comped Pro account can be created

---

Reply **"go"** (or "approve") and I'll build both PDFs.
