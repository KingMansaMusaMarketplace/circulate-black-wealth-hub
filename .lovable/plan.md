# Pre-Launch Polish: Business Owner Signup

Six targeted improvements so Monday's new owners have a smooth, confidence-building experience from signup through "your business is live."

---

## 1. Stepper + sticky save bar on the Business form

Convert the single-scroll form into a 3-step wizard with a persistent action bar.

- Wrap `BusinessFormContent` with a `currentStep` state (1 Basic Info → 2 Location → 3 Contact).
- Render a top progress strip ("Step 2 of 3 — Location") with three numbered pills using MansaGold for the active step.
- Show only the current step's section; "Back" / "Next" buttons advance and validate per-step (using `form.trigger([...fields])`).
- Final step shows the "Save Business Profile" button.
- Sticky action bar pinned to bottom of the card on mobile (`sticky bottom-0`) so the primary action is always reachable.
- All existing validation, submit, and toast logic in `useBusinessForm` stays intact.

## 2. Autosave / draft recovery via localStorage

Never lose a half-filled form again.

- In `useBusinessForm`, subscribe to `form.watch()` and write the values to `localStorage` under a per-user key (`business-form-draft:${user.id}`) debounced at 800ms.
- On mount, if no server profile exists and a draft is present, prompt the user with a small banner: "We saved your last draft — Restore / Discard."
- Clear the draft key on successful save.
- Skip drafting empty/initial state to avoid noise.

## 3. Optional logo + banner upload during signup

Let owners brand their listing before they hit Save.

- Add a new "Brand Assets" subsection at the top of Step 1 with two `LogoUpload` / `BannerUpload` components (reuse existing upload utilities; check `admin-update-business-images` patterns and any current image upload component in the project).
- Both fields are clearly marked **Optional — you can add this later**.
- Uploaded URLs are stored on form state and persisted into `businesses.logo_url` / `banner_url` on save.
- If they skip, the existing post-save upload page still works as a fallback.

## 4. Resilient email verification + visible "Resend"

Reduce signup stalls if SMTP slows down.

- Add a prominent **"Resend verification email"** button on the login screen and on a new `/verify-email` waiting page, using `supabase.auth.resend({ type: 'signup', email })`.
- Apply a 60-second client-side cooldown on the button to avoid hammering the rate limit.
- Show a friendly hint: "Didn't get it? Check spam, or click resend below."
- Pre-launch ops note (no code): verify the Supabase Auth email rate limit in dashboard before Monday — recommend bumping the per-hour cap if currently default.

## 5. Mobile keyboard fix on the description field

Stop the Submit button from disappearing behind the iOS keyboard.

- Add `scroll-margin-bottom: 120px` to all form `Input` and `Textarea` controls in the Business form (utility class `scroll-mb-32`).
- On focus of the Textarea, call `element.scrollIntoView({ block: 'center', behavior: 'smooth' })`.
- Add safe-area bottom padding (`pb-[env(safe-area-inset-bottom)]`) to the sticky action bar from item #1 so it clears the iOS home indicator.

## 6. "Your business is live" confirmation email

Closes the loop after Save with a branded transactional email.

- Create a new React Email template `business-live-confirmation.tsx` in `supabase/functions/_shared/transactional-email-templates/` (1325.AI / MansaBlue + MansaGold styling, white body).
- Template includes: business name, category, "View your listing" button (deep-link to `/business/:id` on the directory), and a short next-steps list (add logo, share QR code, invite team).
- Register it in `registry.ts`.
- Invoke `send-transactional-email` from `useBusinessForm.onSubmit` after a successful save, with `idempotencyKey: business-live-${profileId}` so resaves don't spam.
- Deploy `send-transactional-email` after the registry update.

---

## Technical details

- Files touched (frontend):
  - `src/components/business/business-form/BusinessFormContent.tsx` — stepper + sticky bar wrapper
  - `src/components/business/business-form/useBusinessForm.ts` — draft autosave/restore + post-save email invoke
  - `src/components/business/business-form/BasicInfoFields.tsx` — add brand-assets subsection, scroll-margin on textarea
  - `src/components/business/business-form/models.ts` — add optional `logoUrl`, `bannerUrl`
  - `src/components/auth/LoginForm.tsx` (or container) — Resend verification button
  - New: `src/pages/auth/VerifyEmailPage.tsx` waiting screen
- Files touched (backend):
  - `supabase/functions/_shared/transactional-email-templates/business-live-confirmation.tsx` (new)
  - `supabase/functions/_shared/transactional-email-templates/registry.ts` (add entry)
  - Deploy `send-transactional-email`
- No DB schema changes required (logo_url/banner_url already exist on `businesses`).
- No new packages — uses existing `react-hook-form`, `framer-motion`, shadcn UI, and the email infra already scaffolded in the project.

## Out of scope

- Changing required-field rules.
- Reworking the directory listing page.
- Bulk operations or admin tooling.

Ready to implement on approval.