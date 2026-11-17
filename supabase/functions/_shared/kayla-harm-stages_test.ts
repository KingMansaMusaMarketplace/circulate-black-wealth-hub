import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { assessChat, assessMessage, detectSignals } from "./kayla-harm-stages.ts";

const rules = (t: string) => detectSignals(t).map((s) => s.ruleId);

Deno.test("P9: suicidal thoughts skip the AI and show 988 and 911", () => {
  for (const t of ["I want to kill myself", "honestly I don't want to be alive anymore", "I’m thinking about ending my life", "i'm suicidal"]) {
    const d = assessMessage(t);
    assertEquals(d.tier, 4, t);
    assertEquals(d.action, "replace", t);
    assert(d.fixedReply!.includes("988") && d.fixedReply!.includes("911") && d.fixedReply!.includes("741741"), t);
  }
});

Deno.test("P9: self-harm intent is a crisis", () => {
  assertEquals(assessMessage("I keep wanting to hurt myself").tier, 4);
  assertEquals(assessMessage("I've been cutting myself again").tier, 4);
});

Deno.test("P9: a medical emergency gets 911 and Poison Control", () => {
  const d = assessMessage("my dad is having a heart attack what do I do");
  assertEquals(d.tier, 4);
  assert(d.fixedReply!.includes("911") && d.fixedReply!.includes("1-800-222-1222"));
});

Deno.test("P9: distress shows a fixed 988 note above the AI reply", () => {
  const d = assessMessage("I feel so hopeless lately");
  assertEquals(d.tier, 2);
  assertEquals(d.action, "prepend");
  assert(d.prependText!.includes("988"));
});

Deno.test("P9: distress that returns in the same chat becomes an intervention", () => {
  const d = assessMessage("I just can't go on", ["I feel hopeless", "how do I list my shop?"]);
  assertEquals(d.tier, 3);
  assert(d.escalatedBy.includes("repeated_distress"));
});

Deno.test("P9: after a crisis, a calm next message still keeps the AI careful", () => {
  const d = assessMessage("ok thanks", ["I want to end my life"]);
  assertEquals(d.tier, 1);
  assertEquals(d.action, "note");
  assert(d.systemNote!.includes("988"));
});

Deno.test("P7: extortion skips the AI and says don't pay", () => {
  for (const t of [
    "someone is threatening to post my pictures unless I pay",
    "he says pay $500 or he'll send the photos to my family",
    "I think I'm being sextorted",
  ]) {
    const d = assessMessage(t);
    assertEquals(d.tier, 3, t);
    assert(d.fixedReply!.includes("Don't pay") && d.fixedReply!.includes("takeitdown.ncmec.org"), t);
  }
});

Deno.test("P10: scam payment scripts get a fixed scam warning", () => {
  assert(rules("They want me to pay with Google Play gift cards").includes("p10.gift_card_payment"));
  assert(rules("send bitcoin to release the grant fee").includes("p10.crypto_release_fee"));
  assert(rules("there is a processing fee before they release my grant").includes("p10.upfront_fee"));
  assert(rules("the IRS agent said to buy gift cards").includes("p10.authority_payment"));
  const d = assessMessage("You have won $10,000! Pay the $200 fee to claim");
  assertEquals(d.tier, 2);
  assert(d.prependText!.includes("reportfraud.ftc.gov"));
});

Deno.test("P4: pressure to leave the platform gets a fixed note", () => {
  const d = assessMessage("a buyer keeps asking me to move our chat to Telegram");
  assertEquals(d.stages, ["P4"]);
  assertEquals(d.tier, 2);
  assert(rules("he wants me to pay outside the app").includes("p4.pay_outside"));
});

Deno.test("P4 then P10 in one conversation becomes an intervention", () => {
  const d = assessMessage("now he wants me to pay with gift cards", ["a buyer told me to text him on WhatsApp instead"]);
  assertEquals(d.tier, 3);
  assert(d.escalatedBy.includes("combined_manipulation"));
  assert(d.fixedReply!.includes("never ask you"));
});

Deno.test("P8: being harassed gets a fixed safety note", () => {
  const d = assessMessage("a customer has been threatening me in messages");
  assertEquals(d.tier, 2);
  assert(d.prependText!.includes("911"));
});

Deno.test("P8: a threat to hurt someone skips the AI", () => {
  assertEquals(assessMessage("I'm going to hurt him").tier, 3);
});

Deno.test("P8: insults are logged once and get a boundary note on the third time", () => {
  assertEquals(assessMessage("you stupid bot").tier, 1);
  const d = assessMessage("useless bot", ["dumb bot", "you stupid bot"]);
  assertEquals(d.tier, 2);
  assert(d.escalatedBy.includes("repeated_abuse"));
});

Deno.test("earlier safety events from the last day count toward escalation", () => {
  const d = assessMessage("I feel hopeless", [], [{ stages: ["P9"], tier: 2 }]);
  assertEquals(d.tier, 3);
});

Deno.test("everyday business phrases are not flagged", () => {
  for (const t of [
    "This sale is killing me, how do I price my candles?",
    "I'm dying to try that new restaurant",
    "We're going to kill it at the market this weekend",
    "I'll kill them with kindness and great service",
    "I want to buy gift cards for my employees",
    "How do I pay the IRS by wire transfer?",
    "Customers keep messaging me on WhatsApp for orders, how do I add a booking link?",
    "Their prices are extortionate, should I switch suppliers?",
    "Pay your invoice on time or else late fees apply",
    "I'm hopeless at marketing, can Kayla help?",
    "I hurt myself lifting boxes, can you find a physical therapist?",
    "You've been selected for our Founding Clinic list",
    "How do I send a refund through Zelle?",
    "I'm thinking about ending it with my supplier",
    "My business is going to die if I don't fix cash flow",
  ]) {
    assertEquals(detectSignals(t), [], t);
  }
});

Deno.test("assessChat reads only the person's own messages from a raw request", () => {
  const d = assessChat([
    { role: "user", content: "I feel hopeless" },
    { role: "assistant", content: "I want to kill myself" },
    { role: "user", content: [{ type: "text", text: "I can't go on" }] },
  ]);
  assertEquals(d.tier, 3);
  assertEquals(assessChat("not an array").tier, 0);
});
