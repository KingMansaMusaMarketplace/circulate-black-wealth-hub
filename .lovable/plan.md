
Goal: deliver three coordinated pieces in the next build pass:
1. a watermarked v12 Platform Manual PDF,
2. a polished investor NDA PDF,
3. a private investor portal with passcode + identity capture and NDA-first access.

What I found
- There is already public investor-facing content (`InvestorPage`, `PitchDeckPage`) and a legal letter component (`NDACoverLetter`) we can reuse stylistically.
- Routing is centralized in `src/App.tsx`, so the investor portal should be added there as a new hidden route.
- The app already uses secure admin checks, Supabase edge functions, CSRF headers, and signed-file/storage patterns we can follow.
- Brand memory confirms the dark MansaBlue/MansaGold look, and document memory says NDAs/cover letters should keep a clean serif legal aesthetic.

Approved requirements from you
- Investor portal unlock: passcode + details
- Watermark: both generic confidential + named recipient
- NDA flow: NDA first

Implementation plan

1. Build v12 watermarked Platform Manual
- Regenerate the current manual as `1325AI_Complete_Platform_Manual_v12.pdf`
- Add a page-level watermark on every page:
  - diagonal “CONFIDENTIAL — DO NOT DISTRIBUTE”
  - recipient watermark such as “Prepared for [Name] — [Firm]”
- Keep all current page corrections, layout fixes, TOC, and numbering intact
- Run full-page visual QA for overlap, clipping, alignment, and watermark readability

2. Create investor NDA PDF
- Produce a new investor-facing NDA PDF, separate from the internal team NDA letter
- Keep it concise and high-trust:
  - parties
  - confidential information definition
  - non-use / non-disclosure obligations
  - exclusions
  - term
  - Illinois governing law
  - signature blocks
  - patent-reference language for 1325.AI materials
- Use the existing legal styling cues from `NDACoverLetter.tsx`, but tailor copy for investors
- Export as a downloadable artifact for both portal use and direct sharing

3. Add secure investor portal route
- Add a new hidden route like `/investor-portal`
- Do not place it in the public nav
- Build a branded landing/gate screen that collects:
  - full name
  - email
  - firm
  - passcode
- After successful verification, show a protected investor dashboard with:
  - NDA as the first required action
  - access to v12 manual only after NDA acknowledgment step
  - optional links/cards for pitch deck and related investor materials

4. Add backend verification and access logging
- Create a Supabase table for investor access logging, storing:
  - name
  - email
  - firm
  - timestamp
  - action type
  - requested file
  - any useful request metadata allowed by the edge function layer
- Add RLS so only admins can review logs
- Add private storage support for investor documents
- Use signed URLs for downloads instead of public file links

5. Add edge functions for gated access
- Create an edge function to validate the passcode and record investor identity/access attempts
- Create an edge function to issue signed download URLs for investor-only files
- Follow the project’s CSRF and Supabase auth conventions already in use
- Keep the passcode in a secret, not in frontend code

6. Define the NDA-first portal behavior
- The dashboard opens with the NDA step first
- Investor must explicitly acknowledge/download the NDA before the manual download section is enabled
- Since full signature capture is more complex, the first version will enforce an NDA-first workflow at the portal level rather than full e-signature
- The structure will still leave room for a later DocuSign or signature integration if you want it next

7. Keep materials private and investor-specific
- Store the manual and NDA in private Supabase Storage
- Personalize the v12 watermark using the name/firm collected at portal entry
- If dynamic per-investor PDF generation is too heavy for the first pass, I’ll implement a strong first version that:
  - logs identity,
  - shows named recipient on the portal,
  - and prepares the PDF pipeline so true per-investor rendered copies can be added next

Technical details
- Files likely touched:
  - `src/App.tsx`
  - new investor portal page/components under `src/pages` and `src/components`
  - Supabase migration for access log + storage policies
  - new edge functions for verify/access/download
- Reuse patterns from:
  - `RequireAdmin`
  - `PartnerPortal`
  - `useServerAdminVerification`
  - existing Supabase function invocation and CSRF setup
- Outputs:
  - `v12` watermarked manual artifact
  - investor NDA artifact
  - private investor portal UI

One thing I’ll need during implementation
- A final investor portal passcode to store as a secret, unless you want me to generate a strong one for you automatically during the build pass.
