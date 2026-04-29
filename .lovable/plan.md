# Founding 100 — $149/mo Pro for Life (Rate-Locked Forever)

Replace the blanket "free until Sept 1, 2026" promo with a paid Founding Member offer:

- **First 100 paying businesses** get the **Pro tier at $149/mo, locked in forever** (rate never increases).
- **Regular Pro price (after 100 spots fill or for non-founders): $249/mo** — making the founding deal a $100/mo lifetime savings.
- **Existing $19/mo "Business" tier stays as-is** for businesses that don't want full Pro.
- **No grandfathering** of the old free promise (no one paid under it; clean cutover).

---

## What changes (plain English)

1. The site no longer says "free until Sept 1, 2026."
2. New copy: **"Founding 100 — Pro at $149/mo, locked in forever. X of 100 spots left."**
3. Anyone using Pro features without paying gets sent to the paywall (the auto-grant during the "free period" is removed).
4. New Stripe checkout: $149/mo recurring, only available while slots remain.
5. After 100 slots fill, the Pro card flips to **$249/mo regular price**.
6. Founders' rate is permanently locked at $149/mo even if regular price changes later.

---

## Step 1 — Remove the auto-grant of premium

Two files currently grant premium to every logged-in user during the "free period":

- `src/lib/services/unified-subscription-service.ts` — delete the `if (isInFreePeriod()) { return premium... }` block (lines ~30–43)
- `src/lib/services/subscription-service.ts` — same block (lines ~28–35)

Delete `src/lib/constants/free-period.ts` and replace with `src/lib/constants/founding-member.ts`:

```ts
export const FOUNDING_MEMBER_PRICE_MONTHLY_USD = 149;
export const REGULAR_PRO_PRICE_MONTHLY_USD = 249;
export const FOUNDING_MEMBER_SLOT_CAP = 100;
export const STRIPE_FOUNDING_PRICE_ID = 'price_xxx';   // filled in after Stripe product creation
export const STRIPE_REGULAR_PRO_PRICE_ID = 'price_yyy';
```

Also clean up the 64 stale `is_founding_member=true` flags on `profiles` (they were granted by the auto-grant, not by payment).

---

## Step 2 — Database

New migration:

```sql
-- The 100 paid Founding Member slots
create table public.founding_member_slots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  slot_number int not null unique check (slot_number between 1 and 100),
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  locked_price_cents int not null default 14900,   -- $149 forever
  claimed_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.founding_member_slots enable row level security;

-- Public can read the count for the "X of 100 left" badge
create policy "Public can read founding slots"
  on public.founding_member_slots for select to anon, authenticated using (true);
-- No insert/update/delete policy = service role only

-- Atomic slot claim (prevents overselling under race conditions)
create or replace function public.claim_founding_slot(
  _user_id uuid,
  _business_id uuid,
  _stripe_subscription_id text,
  _stripe_customer_id text
) returns int
language plpgsql security definer set search_path = public as $$
declare next_slot int;
begin
  select slot_number into next_slot
    from public.founding_member_slots
    where stripe_subscription_id = _stripe_subscription_id;
  if next_slot is not null then return next_slot; end if;

  select coalesce(max(slot_number), 0) + 1 into next_slot
    from public.founding_member_slots;
  if next_slot > 100 then raise exception 'FOUNDING_SLOTS_FULL'; end if;

  insert into public.founding_member_slots
    (user_id, business_id, slot_number, stripe_subscription_id, stripe_customer_id)
  values (_user_id, _business_id, next_slot, _stripe_subscription_id, _stripe_customer_id);

  update public.profiles
    set is_founding_member = true, founding_member_since = now()
    where id = _user_id;

  if _business_id is not null then
    update public.businesses
       set is_founding_member = true,
           founding_order = next_slot,
           founding_joined_at = now()
     where id = _business_id;
  end if;
  return next_slot;
end; $$;

-- Cleanup stale free-period flags
update public.profiles
   set is_founding_member = false, founding_member_since = null
 where id not in (select user_id from public.founding_member_slots);
```

---

## Step 3 — Stripe products

Create two new Stripe products via the Stripe tool:

1. **"Mansa Musa Pro — Founding Member"** — recurring, **$149.00/month USD**
2. **"Mansa Musa Pro"** — recurring, **$249.00/month USD** (regular price)

Both price IDs get pasted into `src/lib/constants/founding-member.ts`.

---

## Step 4 — Edge functions

**`create-founding-checkout`**
- Authenticates the user, finds their `business_id`.
- Pre-checks slot count; if ≥100, returns `409 SLOTS_FULL` so UI can flip to the $249 regular checkout.
- Creates Stripe Checkout: `mode: 'subscription'`, `line_items: [{ price: STRIPE_FOUNDING_PRICE_ID, quantity: 1 }]`, metadata `{ user_id, business_id, tier: 'founding_pro' }`.
- `success_url` → `/founding-success?session_id={CHECKOUT_SESSION_ID}`.

**`verify-founding-checkout`**
- Called by the success page with `session_id`.
- Retrieves session from Stripe, confirms `payment_status === 'paid'` and `subscription` exists.
- Calls `claim_founding_slot()`. Idempotent.
- Returns the assigned slot number.

**`create-pro-checkout`** (regular $249 Pro for non-founders)
- Standard subscription checkout against `STRIPE_REGULAR_PRO_PRICE_ID`.

`check-subscription` already-existing flow handles ongoing renewals — no rewrite needed; it'll just see the new price IDs and map them to the `pro` tier.

iOS rule respected: all Stripe UI hidden via the existing `shouldHideStripePayments()`.

---

## Step 5 — UI

**New hook:** `useFoundingSlots()` — polls the slot count every 60s, returns `{ claimed, remaining, isFull }`.

**New components:**
- `FoundingMemberOffer.tsx` — the pitch card: "Founding 100 — Pro $149/mo, locked in forever. X of 100 spots left." with Claim button.
- `FoundingSlotBadge.tsx` — small live counter chip ("87 spots left") for headers/CTAs.
- `/founding-success` page — calls `verify-founding-checkout`, shows "You are Founding Member #14", confetti, returns to dashboard.

**Pricing page logic:**
- If `!isFull` → show Founding card ($149/mo) prominently above regular Pro ($249/mo).
- If `isFull` → Founding card collapses to "Founding 100 sold out — join Pro at $249/mo."

**Copy replacements** (delete every "free until Sept 1, 2026" mention):
- `src/pages/SignupPage.tsx`
- `src/components/HomePage/BetaChallengeSection.tsx`
- `src/components/FreeGrowthBanner.tsx` → renamed to `FoundingMemberBanner.tsx`
- `src/components/HowItWorks/CTASection.tsx`
- `src/pages/FAQPage.tsx`
- `src/components/badges/FoundingMemberBadge.tsx`
- `src/components/dashboard/layout/UserProfileSection.tsx`
- `src/components/partner/marketing/*` (Email, Social, Flyer, Video, Talking-points)
- `src/pages/UserProfilePage.tsx`
- `src/pages/partners/EatOkraPartnershipPage.tsx`

---

## Files touched (summary)

**New:** `founding_member_slots` table + `claim_founding_slot()` fn, `create-founding-checkout` edge fn, `verify-founding-checkout` edge fn, `create-pro-checkout` edge fn, `useFoundingSlots` hook, `FoundingMemberOffer.tsx`, `FoundingSlotBadge.tsx`, `/founding-success` page, `src/lib/constants/founding-member.ts`.

**Modified:** `unified-subscription-service.ts`, `subscription-service.ts`, pricing page, signup page, ~12 marketing/copy files.

**Deleted:** `src/lib/constants/free-period.ts`.

---

## What you'll need to do manually

1. **Approve the migration** when prompted.
2. **Approve the two Stripe product creations** (I'll trigger them; you don't have to log in).
3. Nothing else — `STRIPE_SECRET_KEY` is already configured.

---

## Approve to proceed?

Once you say go, I'll start at Step 1 (remove auto-grant) and work through to Step 5 (copy updates).
