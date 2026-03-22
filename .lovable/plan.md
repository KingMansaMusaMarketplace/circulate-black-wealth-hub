

# Plan: Kayla "AI Employee" Go-to-Market Announcement Suite

Three deliverables that convert the Gemini draft into production-ready assets.

---

## 1. Update KaylaOutreachPreview Component

Replace the current generic outreach preview with the polished "AI Employee" copy from the Gemini draft.

**File:** `src/components/business/kayla/KaylaOutreachPreview.tsx`

- Rewrite email body to match the Gemini draft: founder intro ("For 40 years..."), 4 bullet capabilities (Review Management, B2B Matchmaking, Churn Prediction, Content Generation), Wealth Ticker multiplier callout, $100/mo CTA
- Add a 4th capability bullet: **Content Generation** (social posts on autopilot)
- Include the "Mansa Musa Multiplier" / Verified Wealth Ticker section
- Signature block: "Thomas D. Bowling, Founder & Chief Architect, 1325.ai"

---

## 2. Create Kayla Announcement Page

A new dedicated page (modeled on the existing `EmailCopyPage`) with the full LinkedIn/email announcement ready to copy.

**New file:** `src/pages/KaylaAnnouncementPage.tsx`
- Full Gemini draft text with `[Business Name]` placeholder
- "Copy to Clipboard" button (reuse the pattern from `EmailCopyPage`)
- Gold/black brand theme matching the platform aesthetic
- Separate copy buttons for "Email Version" and "LinkedIn Version" (LinkedIn version strips the subject line and shortens for post format)

**Edit:** `src/App.tsx`
- Add lazy import and route at `/kayla-announcement`

---

## 3. Build 3-Email Onboarding Sequence Page

A page displaying the post-activation drip sequence that keeps new $100/mo subscribers engaged.

**New file:** `src/pages/KaylaOnboardingSequencePage.tsx`

Three emails displayed as tabbed cards:

- **Email 1 (Day 0 — Welcome):** "Your AI Employee just clocked in" — confirms activation, shows first review draft Kayla generated, links to dashboard
- **Email 2 (Day 3 — First Value):** "Kayla found 5 B2B partners for you" — surfaces B2B matches and churn alerts from the first 72 hours
- **Email 3 (Day 7 — ROI Report):** "Your first week with Kayla" — weekly summary: reviews handled, matches found, estimated hours saved, Wealth Ticker impact

Each email card has its own "Copy" button. All copy follows the "AI Employee" framing.

**Edit:** `src/App.tsx`
- Add lazy import and route at `/kayla-onboarding-sequence`

---

## Technical Notes

- No database changes needed — these are static copy/template pages
- Follows existing `EmailCopyPage` pattern (clipboard API, toast notifications, dark theme)
- Brand colors: mansagold `#d4a843` accents, dark slate backgrounds
- All three files are independent and can be built in parallel

