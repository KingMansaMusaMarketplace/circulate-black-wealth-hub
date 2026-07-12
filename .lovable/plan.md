# 🛡️ BOARD CHECK — Homepage Business Submission

**What we're building:** A "Submit Your Black-Owned Business" box directly under the hero on the homepage. Owners self-submit → Kayla auto-verifies → you (admin) approve → business goes live in the directory + MCP.

**Why it matters:** Turns the homepage into a growth engine. Every approved listing = a new entry in the MCP (Model Context Protocol) directory that AI assistants can surface.

---

## 1. Homepage submission box (under hero)

A compact card titled **"Own a Black-owned business? Add it free."** with:

- Business Name
- Website URL
- Business Email
- Phone Number
- Owner Full Name
- City / State
- Category (dropdown: Food, Beauty, Tech, Retail, Services, Health, Auto, Professional, Other)
- ☑️ **Checkbox 1 (Ownership):** "I confirm that I am the legal owner or authorized representative of this business."
- ☑️ **Checkbox 2 (Legal attestation):** "I attest under penalty of perjury that this business is Black-owned and that all information provided is accurate. I understand that submitting false information may result in permanent removal and legal action."

Both boxes required. On submit → success message: *"Thank you! Kayla is now verifying your business. You'll hear from us within 48 hours."*

## 2. Database — new table `business_submissions`

Stores: business info, both attestation timestamps, submitter IP + user agent (fraud trail), Kayla's verification report (JSON), a confidence score (0–100), status (`pending_verification` → `pending_review` → `approved` / `rejected`), and admin notes. RLS: only admins can read; anyone can insert (with rate limiting).

## 3. Kayla auto-verification (edge function, runs on submit)

Kayla (using Lovable AI Gateway + web search) checks:

1. **Website is live** (HTTP 200 check)
2. **Address / phone / website match** across the web
3. **Black-owned signals** — searches for the business + terms like "Black-owned," directory listings (Official Black Wall Street, US Black Chambers, EatOkra, etc.), press mentions, owner bio
4. **Category sanity check** (does the site actually sell what they claimed?)
5. **Fraud flags** — duplicate submissions, disposable email domains, mismatched info

Kayla writes a **verification report** + confidence score to the submission row, then sets status to `pending_review`.

## 4. Admin approval queue (`/admin/submissions`)

A page (admin-only) showing all pending submissions sorted by Kayla's confidence score. Each row shows:

- Business info
- Kayla's report (green ✅ / yellow ⚠️ / red ❌ flags)
- Confidence score
- **[Approve]** / **[Reject]** / **[Request more info]** buttons

## 5. After you approve

Automatically:
- ✅ Create a public listing in the `businesses` directory table (visible in search + MCP)
- ✅ Email the owner: "Your listing is live" + link to view it + link to claim their account
- ✅ Show a soft upsell in the email: **"Want premium placement? Become a Founding Sponsor →"** (links to sponsor tier page)

On reject → email with reason.

---

## Anti-abuse safeguards

- **Rate limit:** 1 submission per IP per hour, 3 per day
- **Honeypot field** to block bots
- **Duplicate URL check** — if the domain is already submitted or already listed, block with a friendly message
- **Disposable email block** (gmail/yahoo allowed; tempmail blocked)

---

## Technical details

**Files to create/edit:**
- New: `src/components/homepage/BusinessSubmissionBox.tsx`
- Edit: homepage (`src/pages/Index.tsx` or equivalent) — insert component right under hero
- New: migration for `business_submissions` table + RLS + grants
- New: edge function `verify-business-submission` (calls Lovable AI + web search)
- New: edge function `approve-business-submission` (admin action → creates listing, sends email)
- New: `src/pages/admin/SubmissionsQueue.tsx`

**Uses:** Lovable AI Gateway (Kayla), Lovable Emails, existing admin role system.

**Not touched:** existing directory, existing sponsor flow, existing MCP definitions (approved businesses flow into the directory Kayla's MCP tools already read from — no MCP code change needed).

---

## What you'll need to do after I build it

1. Test one submission yourself using a real Black-owned business URL
2. Approve it from `/admin/submissions`
3. Confirm it shows up in the directory
4. Then we announce it (homepage banner, email your list)

Approve this plan and I'll build it.