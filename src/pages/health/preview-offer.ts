/** No preview checkout exists until the owner approves country-specific prices. */
export function getClinicalPreviewOffer(_country?: string) {
  return { price: null, checkoutEnabled: false, approvalRequired: true, paymentSequence: 'after-approval' as const };
}