import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { billSessionAction } from "./bill-state.ts";

Deno.test("a paid bill can never start another charge", () => {
  assertEquals(billSessionAction({ status: "complete", payment_status: "paid" }), "paid");
  assertEquals(billSessionAction({ status: "open", payment_status: "paid" }), "paid");
});

Deno.test("tapping Pay twice reuses the same open checkout", () => {
  assertEquals(billSessionAction({ status: "open", payment_status: "unpaid" }), "reuse");
});

Deno.test("only an expired, unpaid checkout allows a fresh one", () => {
  assertEquals(billSessionAction({ status: "expired", payment_status: "unpaid" }), "new");
});

Deno.test("if Stripe cannot be checked, refuse instead of risking a double charge", () => {
  assertEquals(billSessionAction(null), "unknown");
});
