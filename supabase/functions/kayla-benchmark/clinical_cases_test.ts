import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { compileHelpQuestion } from "../_shared/clinical-help-intake.ts";
import { CLINICAL_BENCHMARK_CASES } from "./clinical-cases.ts";

Deno.test("scoreboard has 15-20 Clinical questions", () => {
  assert(CLINICAL_BENCHMARK_CASES.length >= 15 && CLINICAL_BENCHMARK_CASES.length <= 20);
});

for (const c of CLINICAL_BENCHMARK_CASES) {
  Deno.test(`"${c.question}" reaches ${c.topic}`, () => {
    const selection = compileHelpQuestion(c.question);
    assert(selection, "doctor guide would turn this question away");
    assertEquals(selection.topics[0], c.topic);
  });
}
