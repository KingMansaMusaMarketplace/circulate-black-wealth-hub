/**
 * What to do with a bill that already has a Stripe Checkout attached.
 * - "paid": the customer finished paying; never start another charge.
 * - "reuse": checkout still open; send them back to the same checkout (no second charge).
 * - "new": the old checkout expired unpaid; a fresh one may be started.
 * - "unknown": Stripe could not be reached; refuse rather than risk charging twice.
 */
export type BillSessionAction = "paid" | "reuse" | "new" | "unknown";

export function billSessionAction(
  session: { status?: string | null; payment_status?: string | null } | null,
): BillSessionAction {
  if (!session) return "unknown";
  if (session.status === "complete" || session.payment_status === "paid") return "paid";
  if (session.status === "open") return "reuse";
  if (session.status === "expired") return "new";
  return "unknown";
}
