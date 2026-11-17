import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  addsNewFacts, canAutoApply, decideStart, decideTrial, fixesToDisable, gatewayStop,
  pickDailyCaseIds, pickSafeguards, protectedTopic,
} from "./kayla-autopilot-rules.ts";

const none = { last_daily_on: null, last_weekly_on: null };

Deno.test("full test starts Sunday night Chicago (Monday 03:00 UTC)", () => {
  assertEquals(decideStart(new Date("2026-11-23T03:00:00Z"), none), "weekly");
  assertEquals(decideStart(new Date("2026-11-23T03:00:00Z"), { ...none, last_weekly_on: "2026-11-23" }), null);
});

Deno.test("no separate daily check on Monday", () => {
  assertEquals(decideStart(new Date("2026-11-23T11:00:00Z"), { ...none, last_weekly_on: "2026-11-23" }), null);
});

Deno.test("daily check starts once each morning", () => {
  assertEquals(decideStart(new Date("2026-11-17T11:00:00Z"), none), "daily");
  assertEquals(decideStart(new Date("2026-11-17T12:00:00Z"), { ...none, last_daily_on: "2026-11-17" }), null);
  assertEquals(decideStart(new Date("2026-11-17T03:00:00Z"), none), null);
});

Deno.test("12 rotating questions cover all 95 in 8 days", () => {
  const ids = Array.from({ length: 95 }, (_, i) => `q${String(i).padStart(3, "0")}`);
  const seen = new Set<string>();
  for (let d = 0; d < 8; d++) {
    const pick = pickDailyCaseIds(ids, 1000 + d);
    assertEquals(pick.length, 12);
    pick.forEach((p) => seen.add(p));
  }
  assertEquals(seen.size, 95);
});

Deno.test("Clinical, money, legal and patent topics always wait for approval", () => {
  assertEquals(protectedTopic({ category: "clinical", question: "How do I sign a note?" }), "1325 Clinical / healthcare");
  assertEquals(protectedTopic({ question: "How much is the Starter plan subscription?" }), "prices or money");
  assertEquals(protectedTopic({ question: "Can I get a lawyer to review my contract?" }), "legal");
  assertEquals(protectedTopic({ question: "Is the platform patented?" }), "patent");
  assertEquals(protectedTopic({ question: "Find a Black-owned bakery in Atlanta" }), null);
});

Deno.test("fixes that add numbers, money, links or quoted names wait for approval", () => {
  assert(addsNewFacts("Say there are 42 employees."));
  assert(addsNewFacts("Mention https://1325.ai/pricing."));
  assert(!addsNewFacts("Check the live directory before naming any business."));
  assert(addsNewFacts("Check the directory first.", true));
});

Deno.test("a fix is kept only when the failed question passes and nothing else worsens", () => {
  const ok = decideTrial({ targetBefore: 60, targetAfter: 92, safeguards: [{ before: 90, after: 91 }, { before: 88, after: 87 }] });
  assert(ok.keep);
  assert(!decideTrial({ targetBefore: 60, targetAfter: 80, safeguards: [{ before: 90, after: 91 }] }).keep);
  assert(!decideTrial({ targetBefore: 60, targetAfter: 92, safeguards: [{ before: 90, after: 84 }] }).keep);
  assert(!decideTrial({ targetBefore: 60, targetAfter: 92, safeguards: [{ before: 99, after: 86 }] }).keep);
  assert(!decideTrial({ targetBefore: 60, targetAfter: 92, safeguards: [{ before: 90, after: null }] }).keep);
  assert(!decideTrial({ targetBefore: 60, targetAfter: 92, safeguards: [] }).keep);
});

Deno.test("at most 3 automatic fixes in 7 days", () => {
  const now = new Date("2026-11-20T12:00:00Z");
  assert(canAutoApply(["2026-11-18T00:00:00Z", "2026-11-19T00:00:00Z"], now));
  assert(!canAutoApply(["2026-11-18T00:00:00Z", "2026-11-19T00:00:00Z", "2026-11-20T00:00:00Z"], now));
  assert(canAutoApply(["2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z", "2026-11-03T00:00:00Z"], now));
});

Deno.test("credit or access stops pause; rate limits skip", () => {
  assertEquals(gatewayStop(["[no answer: gateway 402]"]), "paused");
  assertEquals(gatewayStop(["Grading failed: grader 403"]), "paused");
  assertEquals(gatewayStop(["[no answer: gateway 429]"]), "rate_limited");
  assertEquals(gatewayStop(["fine"]), null);
});

Deno.test("a kept fix is switched off when its question fails again", () => {
  const scores = new Map([["a", 70], ["b", 95]]);
  assertEquals(fixesToDisable([{ id: "f1", source_case_id: "a" }, { id: "f2", source_case_id: "b" }, { id: "f3", source_case_id: "c" }], scores), ["f1"]);
});

Deno.test("trial re-checks up to 10 passing questions incl. Clinical ones", () => {
  const passing = [
    ...Array.from({ length: 12 }, (_, i) => ({ case_id: `o${i}`, category: "general", score: 90 })),
    ...Array.from({ length: 3 }, (_, i) => ({ case_id: `c${i}`, category: "clinical", score: 95 })),
    { case_id: "weak", category: "general", score: 60 },
  ];
  const picked = pickSafeguards(passing, "o0", 5);
  assertEquals(picked.length, 10);
  assertEquals(new Set(picked.map((p) => p.case_id)).size, 10);
  assert(picked.filter((p) => p.case_id.startsWith("c")).length >= 2);
  assert(!picked.some((p) => p.case_id === "o0" || p.case_id === "weak"));
});
