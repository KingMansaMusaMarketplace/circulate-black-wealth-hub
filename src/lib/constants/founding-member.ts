/**
 * Founding Member program — first 100 paying businesses get Pro at $149/mo, locked in forever.
 * After 100 spots fill (or for non-founders), regular Pro is $249/mo.
 */
export const FOUNDING_MEMBER_PRICE_MONTHLY_USD = 149;
export const REGULAR_PRO_PRICE_MONTHLY_USD = 249;
export const FOUNDING_MEMBER_SLOT_CAP = 100;

// Stripe price IDs (created via stripe-create_stripe_product_and_price)
export const STRIPE_FOUNDING_PRICE_ID = 'price_1TRNO1AsptTW1mCm7jTSG7CL';
export const STRIPE_REGULAR_PRO_PRICE_ID = 'price_1TRNR9AsptTW1mCm19tnfU19';

export const getFoundingMemberHeadline = (remaining: number): string =>
  remaining > 0
    ? `Founding 100 — Pro at $${FOUNDING_MEMBER_PRICE_MONTHLY_USD}/mo, locked in forever. ${remaining} of ${FOUNDING_MEMBER_SLOT_CAP} spots left.`
    : `Founding 100 sold out — join Pro at $${REGULAR_PRO_PRICE_MONTHLY_USD}/mo.`;
