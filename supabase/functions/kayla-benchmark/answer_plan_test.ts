import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { chatAnswerPlan } from "./answer-plan.ts";

Deno.test("grant and tax questions use the premium brain like live chat", () => {
  assertEquals(chatAnswerPlan("complex", "Is a grant that charges a $99 application fee legit?").premium, true);
  assertEquals(chatAnswerPlan("complex", "Can I take the home office tax deduction?").premium, true);
});

Deno.test("critical questions always search the web and use the premium brain", () => {
  const plan = chatAnswerPlan("critical", "What licenses do I need for a food truck?");
  assertEquals(plan.forceWeb, true);
  assertEquals(plan.premium, true);
});

Deno.test("simple questions stay on the fast model without forced web search", () => {
  const plan = chatAnswerPlan("simple", "Hi Kayla");
  assertEquals(plan, { model: "google/gemini-3.7-flash", forceWeb: false, premium: false });
});
