import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { overDailyLimit } from "./request-limit.ts";

Deno.test("regular visitors are stopped at 3 requests a day", () => {
  assertEquals(overDailyLimit("someone@example.com", 2), false);
  assertEquals(overDailyLimit("someone@example.com", 3), true);
});

Deno.test("Maurice is never stopped by the daily limit", () => {
  assertEquals(overDailyLimit("chefmaurice420@gmail.com", 3), false);
  assertEquals(overDailyLimit(" ChefMaurice420@Gmail.com ", 50), false);
});
