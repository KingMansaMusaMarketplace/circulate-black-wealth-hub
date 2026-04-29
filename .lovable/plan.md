## Goal

Make the Enterprise tier billing match the marketing copy: a flat **$899/mo base** + **$50/user/mo per seat**, with the seat count adjustable by the Enterprise admin and synced to Stripe.

The Stripe price for the per-seat add-on already exists:
`price_1TNLU6AsptTW1mCmvlaqtQsZ` (`kayla_enterprise_per_user` in `subscription-tiers.ts`).

## What changes

### 1. Stripe checkout — bundle base + per-seat at signup

Edit `supabase/functions/create-checkout/index.ts`:

When `tier === 'kayla_enterprise'`, build a checkout session with **two line items**:

```
line_items: [
  { price: 'price_1TNLTCAsptTW1mCmVEccEd1D', quantity: 1 },         // $899 base
  { price: 'price_1TNLU6AsptTW1mCmvlaqtQsZ', quantity: seatCount }, // $50 × N
]
```

- Accept an optional `seatCount` (int, 1–500, default 1) in the request body / Zod schema.
- Set `proration_behavior: 'create_prorations'` on subsequent updates (handled in step 3).

### 2. Database — track seats per Enterprise account

New migration adds:

```sql
create table public.enterprise_seats (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,        -- the Enterprise admin
  stripe_subscription_id text not null,
  stripe_seat_item_id text,           -- subscription item id for the per-seat price
  seat_count int not null default 1 check (seat_count between 1 and 500),
  updated_at timestamptz not null default now(),
  unique (stripe_subscription_id)
);
alter table public.enterprise_seats enable row level security;

-- Owner can read/update their own row
create policy "owner read seats" on public.enterprise_seats
  for select using (auth.uid() = owner_user_id);
```

Writes happen only from edge functions using the service role key.

### 3. Edge function — `enterprise-seats` (manage seats post-signup)

New function `supabase/functions/enterprise-seats/index.ts`:

- `GET` → returns current `seat_count` and computed monthly total.
- `POST { seatCount }` → validates (1–500), looks up the subscription item for the per-seat price, calls `stripe.subscriptionItems.update(itemId, { quantity: seatCount, proration_behavior: 'create_prorations' })`, updates `enterprise_seats` row.
- Re-uses the same auth + CORS pattern (incl. `x-csrf-token`) used by `customer-portal`.
- Registered in `supabase/config.toml`.

### 4. Admin UI — seat management page

New page `src/pages/business/EnterpriseSeatsPage.tsx` (route `/business/enterprise/seats`, gated by `EnterpriseGate`):

- Shows current seat count, base price, per-seat price, computed monthly total, and renewal date.
- Stepper / number input to change seats (1–500), "Update seats" button → calls `enterprise-seats` POST.
- Inline note: "Changes are prorated and billed on your next invoice."
- Link to Stripe Customer Portal for invoices/payment method.

Add route in `src/App.tsx` and a card link inside the existing Enterprise dashboard area.

### 5. Marketing copy — keep, but add accuracy footnote

In the Enterprise pricing card (already shows "From $899/mo + $50/user/mo"), add a small line:
"Seat count is set at checkout and can be adjusted any time from the Enterprise dashboard."

## Out of scope (intentionally)

- Per-seat user invitations / SSO / team membership table — that is a real "team management" feature; this task is purely about getting **billing** correct so the marketed price is honored. Inviting individual users can be added later without re-touching billing.
- Metered usage (true `usage_record` style billing). We're using **licensed quantity** on a recurring price, which matches the "$50/user/mo" promise and is far simpler to operate.

## Files

- **edit**: `supabase/functions/create-checkout/index.ts`, `supabase/config.toml`, `src/App.tsx`, `src/components/business/EnterpriseGate.tsx` (add link to seats page)
- **create**: `supabase/functions/enterprise-seats/index.ts`, `src/pages/business/EnterpriseSeatsPage.tsx`
- **migration**: `enterprise_seats` table + RLS

After approval I'll implement all of the above in one pass.
