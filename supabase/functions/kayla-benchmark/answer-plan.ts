// How live chat (ai-chat) decides to answer a question, mirrored here so the
// scoreboard grades the same Kayla customers actually talk to.
import { wantsPremium } from "../_shared/kayla-deep.ts";

export interface AnswerPlan {
  model: string;
  forceWeb: boolean;
  premium: boolean;
}

export function chatAnswerPlan(category: string, question: string): AnswerPlan {
  return {
    model: category === "simple" ? "google/gemini-3.7-flash" : "google/gemini-3.1-pro-preview",
    forceWeb: category === "search" || category === "critical",
    premium: wantsPremium(category, question),
  };
}
