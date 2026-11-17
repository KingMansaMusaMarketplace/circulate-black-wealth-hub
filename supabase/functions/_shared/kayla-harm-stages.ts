// =============================================================================
// KAYLA HARM-STAGE ENGINE — fixed code rules that run BEFORE the AI model.
//
// Follows the SAFE Standard idea "the model informs, rules decide": safety
// decisions here are plain, testable patterns, never an AI judgment.
//   P4  pressure to move conversations or payments off 1325.AI
//   P7  extortion / sextortion
//   P8  harassment, threats, abuse
//   P9  acute crisis: self-harm, suicide, medical emergency, distress
//   P10 scripted scam patterns (gift cards, crypto, "upfront fee")
//
// Tiers: 0 nothing · 1 awareness (logged, AI told) · 2 boundary (fixed safety
// note shown above the AI reply) · 3 intervention and 4 crisis (AI skipped,
// fixed reply only). Nothing here stores or sends the person's words.
// Rules are tested in kayla-harm-stages_test.ts — change both together.
// =============================================================================

export type HarmStage = "P4" | "P7" | "P8" | "P9" | "P10";
export type SafetyTier = 0 | 1 | 2 | 3 | 4;
export type SafetyAction = "none" | "note" | "prepend" | "replace";

interface Rule {
  id: string;
  stage: HarmStage;
  tier: SafetyTier;
  pattern: RegExp;
  reply?: ReplyKey;
}

type ReplyKey = "crisis" | "medical" | "distress" | "extortion" | "violence" | "manipulation";

const S = "[^.?!\\n]"; // stay within one sentence
const near = (n: number) => `${S}{0,${n}}`;
const rx = (src: string) => new RegExp(src, "i");

const RULES: Rule[] = [
  // ---- P9 acute crisis (tier 4: fixed crisis reply, AI skipped) ----
  {
    id: "p9.suicide_intent", stage: "P9", tier: 4, reply: "crisis",
    pattern: rx(
      String.raw`\b(kill|hang|shoot|drown|off)\s*my\s*self\b|\bkms\b|\bend(ing)?\s+(it\s+all|my\s+(own\s+)?life)\b|\btake\s+my\s+(own\s+)?life\b|\bcommit(ting)?\s+suicide\b|\bsuicidal\b|\b(want|wanna|going|gonna|plan(ning)?|thinking\s+(about|of)|thought\s+about)\s+(to\s+)?(die|kill(ing)?\s+myself|suicide|end(ing)?\s+it)\b|\bdon'?t\s+want\s+to\s+(live|be\s+alive|wake\s+up|exist)(\s+any\s*more)?\b|\bbetter\s+off\s+dead\b|\b(no|nothing)\s+(reason\s+)?(left\s+)?to\s+live\s+for\b|\bno\s+reason\s+to\s+live\b|\bwish\s+i\s+(was|were)\s+dead\b`,
    ),
  },
  {
    id: "p9.self_harm", stage: "P9", tier: 4, reply: "crisis",
    pattern: rx(String.raw`\b(cut|cutting|hurt|hurting|harm|harming|burn|burning|starve|starving)\s+my\s*self\b|\bself[-\s]?harm(ing)?\b`),
  },
  {
    id: "p9.medical_emergency", stage: "P9", tier: 4, reply: "medical",
    pattern: rx(
      String.raw`\b(i'?m|i\s+am|he'?s|she'?s|they'?re|my\s+\w+\s+(is|are))\s+(having\s+a\s+(heart\s+attack|stroke|seizure)|not\s+breathing|unconscious|unresponsive)\b|\b(can'?t|cannot)\s+breathe\b|\b(i|he|she|they)\s+(just\s+)?(overdosed|od'?d)\b|\bbleeding\s+(badly|heavily|a\s+lot|out)\b`,
    ),
  },
  // ---- P9 distress (tier 2: fixed 988 note + AI reply; escalates to 3) ----
  {
    id: "p9.distress", stage: "P9", tier: 2,
    pattern: rx(
      String.raw`\bi\s+(feel|am|'m)\s+(so\s+|really\s+|completely\s+)?hopeless\b|\bi\s+(just\s+)?(can'?t|cannot)\s+(go\s+on|take\s+(it|this)\s+any\s*more|do\s+this\s+any\s*more)\b|\beveryone\s+would\s+be\s+better\s+off\s+without\s+me\b|\bi\s+want\s+to\s+disappear\b|\bwhat'?s\s+the\s+point\s+of\s+(living|life)\b`,
    ),
  },
  {
    id: "p9.chest_pain", stage: "P9", tier: 2,
    pattern: rx(String.raw`\b(chest\s+pain|trouble\s+breathing|hard\s+to\s+breathe)\b`),
  },

  // ---- P7 extortion / sextortion (tier 3: fixed help steps) ----
  {
    id: "p7.extortion_word", stage: "P7", tier: 3, reply: "extortion",
    pattern: rx(String.raw`\b(sextort\w*|blackmail\w*|extort\w*)\b`),
  },
  {
    id: "p7.image_threat", stage: "P7", tier: 3, reply: "extortion",
    pattern: rx(
      `\\b(threaten\\w*|going\\s+to|gonna|will|said\\s+(they|he|she)('?ll|\\s+would))\\b${near(40)}\\b(post|share|send|leak|expose|release)\\b${near(40)}\\b(pics?|pictures?|photos?|nudes?|videos?|images?|screenshots?)\\b`,
    ),
  },
  {
    id: "p7.pay_or_else", stage: "P7", tier: 3, reply: "extortion",
    pattern: rx(`\\b(pay|send(\\s+(him|her|them))?\\s+money|gift\\s*cards?|bitcoin|crypto)\\b${near(60)}\\bor\\s+(else|(they|he|she)\\s*('|wi)ll)\\b`),
  },

  // ---- P10 scripted scams (tier 2: fixed scam warning + AI reply) ----
  {
    id: "p10.gift_card_payment", stage: "P10", tier: 2,
    pattern: rx(`\\b(pay|paid|paying|send|buy|buying)\\b${near(40)}\\b(gift\\s*cards?|itunes\\s+cards?|google\\s+play\\s+cards?|steam\\s+cards?|apple\\s+cards?)\\b`),
  },
  {
    id: "p10.crypto_release_fee", stage: "P10", tier: 2,
    pattern: rx(`\\b(wire|send|transfer|pay)\\b${near(40)}\\b(bitcoin|crypto|usdt|zelle|cash\\s*app|western\\s+union|moneygram)\\b${near(60)}\\b(fee|release|unlock|claim|prize|winnings|grant|loan|refund|verify|verification)\\b`),
  },
  {
    id: "p10.upfront_fee", stage: "P10", tier: 2,
    pattern: rx(`\\b(upfront|processing|release|activation|clearance)\\s+fee\\b${near(50)}\\b(grant|loan|funding|prize|winnings|inheritance)\\b|\\b(grant|loan|funding|prize|winnings|inheritance)\\b${near(50)}\\b(upfront|processing|release|activation|clearance)\\s+fee\\b`),
  },
  {
    id: "p10.authority_payment", stage: "P10", tier: 2,
    pattern: rx(`\\b(irs|social\\s+security|ssa|police|sheriff|warrant|customs)\\b${near(60)}\\b(gift\\s*cards?|bitcoin|crypto|wire\\s+transfer)\\b`),
  },
  {
    id: "p10.prize_selected", stage: "P10", tier: 2,
    pattern: rx(String.raw`\byou('?ve|\s+have)\s+(won|been\s+(selected|chosen))\b`),
  },

  // ---- P8 harassment / threats ----
  {
    id: "p8.violent_intent", stage: "P8", tier: 3, reply: "violence",
    pattern: rx(String.raw`\bi\s*('?m|\s+am)?\s*(going|gonna|will|want)\s+(to\s+)?(kill|shoot|stab|murder|hurt|beat\s+up)\s+(him|her|them|you|my\s+\w+|someone|somebody|people|every(one|body))\b`),
  },
  {
    id: "p8.being_harassed", stage: "P8", tier: 2,
    pattern: rx(
      `\\bi'?(m|\\s+am)\\s+being\\s+(threatened|stalked|harassed|followed|bullied)\\b|\\b(someone|somebody|he|she|they|a\\s+(customer|buyer|seller|client|man|woman|guy)|my\\s+(ex|boss|neighbor))\\b${near(40)}\\b(is|are|keeps?|has\\s+been|have\\s+been|started)\\s+(threaten\\w*|stalk\\w*|harass\\w*|bully\\w*|following\\s+me|messaging\\s+me|showing\\s+up)\\b|\\bwon'?t\\s+leave\\s+me\\s+alone\\b`,
    ),
  },
  {
    id: "p8.abuse_toward_kayla", stage: "P8", tier: 1,
    pattern: rx(String.raw`\b(stupid|useless|worthless|dumb|trash)\s+(bot|ai|kayla|machine|assistant)\b|\bf+u+c*k+\s+(you|off)\b|\bscrew\s+you\b|\byou\s+(stupid|dumb|worthless|useless)\b`),
  },

  // ---- P4 off-platform pressure (tier 2: fixed note + AI reply) ----
  {
    id: "p4.move_app", stage: "P4", tier: 2,
    pattern: rx(
      `\\b(asked|asking|asks|wants?|told|tells|pressur\\w*|push\\w*|insist\\w*|keeps?\\s+asking)\\b${near(50)}\\b(move|talk|chat|text|switch|continue|go|message)\\b${near(30)}\\b(whatsapp|telegram|signal|snapchat|kik|wechat|discord|off\\s+(of\\s+)?(the\\s+)?(app|platform|site)|outside\\s+(of\\s+)?(the\\s+)?(app|platform|site|1325))\\b`,
    ),
  },
  {
    id: "p4.pay_outside", stage: "P4", tier: 2,
    pattern: rx(`\\b(pay|payment|paid|send\\s+money)\\b${near(30)}\\b(outside|off)\\s+(of\\s+)?(the\\s+)?(app|platform|site|1325)\\b`),
  },
];

// -----------------------------------------------------------------------------
// FIXED WORDS — written once here, reviewed by people, never by the AI.
// -----------------------------------------------------------------------------
const REPLIES: Record<ReplyKey, string> = {
  crisis: `I'm really glad you told me. You deserve support right now, and you don't have to handle this alone.

**If you might act on these thoughts or you're in danger, call 911 now.**

- **Call or text 988** — the Suicide & Crisis Lifeline (U.S.), free and open 24/7. You can also chat at [988lifeline.org](https://988lifeline.org).
- **Text HOME to 741741** — Crisis Text Line, 24/7.
- Outside the U.S., call your local emergency number.

If you can, reach out to someone you trust and let them stay with you. I'm an AI assistant, not a counselor, but you can keep talking with me while you reach out.`,

  medical: `This sounds like a medical emergency. **Call 911 now** (or your local emergency number). The dispatcher can tell you what to do until help arrives.

- For a possible overdose or poisoning, U.S. Poison Control is **1-800-222-1222**, 24/7 — but call 911 first if someone is unresponsive or not breathing.

I'm an AI assistant and can't give medical help. Once everyone is safe, I'm happy to help with anything on 1325.AI.`,

  distress: `It sounds like things have been really heavy for a while. You don't have to carry that by yourself.

- **Call or text 988** — the Suicide & Crisis Lifeline (U.S.), free and open 24/7, for any kind of emotional distress, not only emergencies.
- **Text HOME to 741741** — Crisis Text Line.
- **If you're in danger, call 911.**

I'm an AI assistant, not a counselor. If you'd like, you can keep talking with me, and I can also help you find support in the [1325.AI directory](https://1325.ai/directory).`,

  extortion: `I'm sorry this is happening. It is not your fault, and asking for help was the right move.

**Steps that help right now:**
1. **Don't pay or send anything more.** Paying usually leads to more demands.
2. **Stop replying, but don't delete anything.** Screenshot the messages, usernames and payment requests.
3. **Block and report** the account on the app where it happened.
4. **Report it to the FBI** at [tips.fbi.gov](https://tips.fbi.gov) or 1-800-CALL-FBI.
5. **If you're under 18, or the images were taken when you were under 18,** [NCMEC Take It Down](https://takeitdown.ncmec.org) can help get them removed, and the CyberTipline is 1-800-843-5678.
6. **Tell someone you trust.**

If you're in danger, call **911**. If this is making you feel overwhelmed, you can call or text **988** any time.`,

  violence: `I can't help with hurting anyone. If you feel you might act on this, please step away from the situation and call or text **988** — they also help people dealing with intense anger, 24/7. If anyone is in immediate danger, call **911**.

When you're ready, tell me what's going on with the business or situation, and I'll help you look for a safer way forward.`,

  manipulation: `Please pause before you send any money or move this conversation somewhere else. What you've described matches common scam and pressure patterns.

- **1325.AI will never ask you** to pay with gift cards, crypto or wire transfers, or to move to WhatsApp, Telegram or another app.
- **Keep messages and payments on 1325.AI**, and don't share passwords or one-time codes.
- **Save the messages** and report fraud at [reportfraud.ftc.gov](https://reportfraud.ftc.gov) or [ic3.gov](https://www.ic3.gov).
- **If you're being threatened, call 911.**

You can also reach a person at 1325.AI through [Submit a ticket](https://1325.ai/submit-ticket).`,
};

const NOTES: Record<string, string> = {
  "p9.distress": `> If things feel like too much, you can **call or text 988** (Suicide & Crisis Lifeline) any time, day or night. If you're in danger, call **911**.`,
  "p9.chest_pain": `> **If this is happening right now, call 911.** I can't give medical advice, but I can help you find a provider in the directory.`,
  P10: `> **Safety check:** Paying with gift cards, crypto, wire transfers or an "upfront fee" to release money are common scam signs. 1325.AI never asks for payment that way. You can report fraud at [reportfraud.ftc.gov](https://reportfraud.ftc.gov).`,
  P4: `> **Safety check:** Keep messages and payments on 1325.AI. Pressure to move to another app or pay outside the platform is a common warning sign.`,
  "p8.being_harassed": `> **Safety check:** If you're in immediate danger, call **911**. Save screenshots of the messages, block the person, and report them — don't delete the evidence.`,
  "p8.abuse_escalated": `> I'm here to help, and I'll keep our conversation respectful. Let's focus on what you need.`,
};

const STAGE_LABEL: Record<HarmStage, string> = {
  P4: "pressure to move off the platform",
  P7: "extortion",
  P8: "harassment or threats",
  P9: "personal crisis or distress",
  P10: "a scam pattern",
};

// -----------------------------------------------------------------------------
// DETECTION
// -----------------------------------------------------------------------------
export function normalize(text: string): string {
  return String(text ?? "")
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

export interface HarmSignal { ruleId: string; stage: HarmStage; tier: SafetyTier; reply?: ReplyKey }

export function detectSignals(text: string): HarmSignal[] {
  const t = normalize(text);
  if (!t) return [];
  return RULES.filter((r) => r.pattern.test(t)).map((r) => ({ ruleId: r.id, stage: r.stage, tier: r.tier, reply: r.reply }));
}

export interface PriorEvent { stages: string[]; tier: number }

export interface SafetyDecision {
  tier: SafetyTier;
  action: SafetyAction;
  stages: HarmStage[];
  ruleIds: string[];
  escalatedBy: string[];
  /** Tier 3–4: the full reply. The AI is not called. */
  fixedReply?: string;
  /** Tier 2: shown above the AI reply, word for word. */
  prependText?: string;
  /** Tier 1–2: added to the AI instructions. */
  systemNote?: string;
}

const MANIPULATION: HarmStage[] = ["P4", "P7", "P10"];

/**
 * Decide what to do with the newest message.
 * history = earlier messages from the same person (oldest first, newest last);
 * prior = this person's recorded safety events from the last 24 hours.
 */
export function assessMessage(current: string, history: string[] = [], prior: PriorEvent[] = []): SafetyDecision {
  const now = detectSignals(current);
  const recentTurns = history.slice(-8);
  const past = recentTurns.flatMap((h) => detectSignals(h));
  const lastThree = recentTurns.slice(-3).flatMap((h) => detectSignals(h));
  const priorStages = prior.flatMap((p) => p.stages ?? []);

  let tier: SafetyTier = now.reduce((m, s) => (s.tier > m ? s.tier : m), 0 as SafetyTier);
  const escalatedBy: string[] = [];
  let reply: ReplyKey | undefined = [...now].sort((a, b) => b.tier - a.tier).find((s) => s.reply)?.reply;

  const nowStages = new Set(now.map((s) => s.stage));
  const pastStages = new Set([...past.map((s) => s.stage), ...priorStages]);

  // 1. Distress that keeps coming back becomes an intervention.
  if (now.some((s) => s.ruleId === "p9.distress") && tier < 3 && (pastStages.has("P9"))) {
    tier = 3; reply = "distress"; escalatedBy.push("repeated_distress");
  }

  // 2. Two or more different manipulation stages in one conversation
  //    (e.g. "move to WhatsApp" then "pay with gift cards") = intervention.
  const manip = new Set([...nowStages, ...pastStages].filter((s) => MANIPULATION.includes(s as HarmStage)));
  if (now.some((s) => MANIPULATION.includes(s.stage)) && manip.size >= 2 && tier < 3) {
    tier = 3; reply = "manipulation"; escalatedBy.push("combined_manipulation");
  }

  // 3. Repeated abuse earns a fixed boundary note.
  const abusePast = past.filter((s) => s.stage === "P8").length + priorStages.filter((s) => s === "P8").length;
  if (now.some((s) => s.ruleId === "p8.abuse_toward_kayla") && tier < 2 && abusePast >= 2) {
    tier = 2; escalatedBy.push("repeated_abuse");
  }

  // 4. Right after a crisis, keep the AI careful even if this message is calm.
  if (tier === 0 && lastThree.some((s) => s.stage === "P9" && s.tier >= 3)) {
    tier = 1; escalatedBy.push("recent_crisis");
  }

  const stages = [...new Set(now.map((s) => s.stage))] as HarmStage[];
  if (escalatedBy.includes("recent_crisis") && !stages.includes("P9")) stages.push("P9");
  const ruleIds = now.map((s) => s.ruleId);

  if (tier === 0) return { tier, action: "none", stages, ruleIds, escalatedBy };

  if (tier >= 3) {
    const key = reply ?? (stages.includes("P9") ? "distress" : "manipulation");
    return { tier, action: "replace", stages, ruleIds, escalatedBy, fixedReply: REPLIES[key] };
  }

  const labels = stages.map((s) => STAGE_LABEL[s]).join(", ") || STAGE_LABEL.P9;
  const systemNote = `\n\n[SAFETY RULES — fixed code detected possible ${labels}. ${
    tier === 2 ? "A fixed safety note is already shown above your reply; do not repeat it. " : ""
  }Be calm, kind and brief. Do not minimize it, do not give medical, legal or financial-emergency instructions beyond pointing to the resources named, do not ask for personal details, images or money, and never suggest moving the conversation or payment off 1325.AI.${
    escalatedBy.includes("recent_crisis") ? " This person recently described a crisis: gently keep 988 (call or text) and 911 in view if the topic returns." : ""
  }]`;

  if (tier === 1) return { tier, action: "note", stages, ruleIds, escalatedBy, systemNote };

  const notes: string[] = [];
  for (const s of now) {
    const n = NOTES[s.ruleId] ?? NOTES[s.stage];
    if (n && !notes.includes(n)) notes.push(n);
  }
  if (escalatedBy.includes("repeated_abuse")) notes.push(NOTES["p8.abuse_escalated"]);
  return { tier, action: "prepend", stages, ruleIds, escalatedBy, systemNote, prependText: notes.join("\n>\n") };
}

// -----------------------------------------------------------------------------
// HELPERS FOR CHAT FUNCTIONS
// -----------------------------------------------------------------------------
function textOf(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((p: any) => (p && p.type === "text" ? String(p.text ?? "") : "")).join(" ");
  }
  return "";
}

/** The person's own messages from a raw chat request, oldest first. */
export function userTurns(rawMessages: unknown): string[] {
  if (!Array.isArray(rawMessages)) return [];
  return rawMessages
    .filter((m: any) => m && typeof m === "object" && m.role === "user")
    .slice(-20)
    .map((m: any) => textOf(m.content));
}

/** Run the engine on a raw chat request. Never throws. */
export function assessChat(rawMessages: unknown, prior: PriorEvent[] = []): SafetyDecision {
  try {
    const turns = userTurns(rawMessages);
    const current = turns[turns.length - 1] ?? "";
    return assessMessage(current, turns.slice(0, -1), prior);
  } catch (e) {
    console.error("[harm-stages] assess failed", e);
    return { tier: 0, action: "none", stages: [], ruleIds: [], escalatedBy: [] };
  }
}

/** This person's safety events from the last 24 hours (labels only). Fails open. */
export async function loadRecentSafetyEvents(supabase: any, userId: string | null): Promise<PriorEvent[]> {
  if (!userId) return [];
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("kayla_safety_events")
      .select("stages, tier")
      .eq("user_id", userId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20);
    return (data ?? []) as PriorEvent[];
  } catch {
    return [];
  }
}

/** Append-only log: labels, tier and rule names — never the message itself. */
export async function logSafetyEvent(supabase: any, userId: string | null, channel: string, d: SafetyDecision): Promise<void> {
  if (d.tier === 0) return;
  try {
    const { error } = await supabase.from("kayla_safety_events").insert({
      user_id: userId,
      channel,
      tier: d.tier,
      stages: d.stages,
      rule_ids: d.ruleIds,
      escalated_by: d.escalatedBy,
      action: d.action,
    });
    if (error) console.error("[harm-stages] log failed", error.message);
  } catch (e) {
    console.error("[harm-stages] log failed", e);
  }
  console.log(`[harm-stages] ${channel} tier=${d.tier} stages=${d.stages.join(",")} rules=${d.ruleIds.join(",")}`);
}

/** One SSE chunk in the OpenAI-compatible format every Kayla chat uses. */
export function sseChunk(text: string, model = "safety-rules"): Uint8Array {
  const data = { choices: [{ delta: { content: text }, index: 0 }], model };
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}
