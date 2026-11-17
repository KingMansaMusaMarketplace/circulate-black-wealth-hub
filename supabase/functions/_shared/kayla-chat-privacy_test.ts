import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { handoffReason, resolveChatPrivacy } from "./kayla-chat-privacy.ts";

Deno.test("memory stays on when the person never changed the setting", () => {
  assertEquals(resolveChatPrivacy(null, {}).memoryEnabled, true);
});

Deno.test("a saved Memory Off always wins", () => {
  assertEquals(resolveChatPrivacy({ memory_enabled: false }, {}).memoryEnabled, false);
});

Deno.test("a request can switch memory off but never on", () => {
  assertEquals(resolveChatPrivacy({ memory_enabled: true }, { memory_off: true }).memoryEnabled, false);
  assertEquals(resolveChatPrivacy({ memory_enabled: false }, { memory_off: false }).memoryEnabled, false);
});

Deno.test("if the setting cannot be read, memory stays off", () => {
  assertEquals(resolveChatPrivacy(null, {}, true).memoryEnabled, false);
});

Deno.test("adult confirmation needs a recorded confirmation time", () => {
  assertEquals(resolveChatPrivacy(null, {}).adultConfirmed, false);
  assertEquals(resolveChatPrivacy({ adult_confirmed_at: "2026-11-17T03:00:00Z" }, {}).adultConfirmed, true);
});

Deno.test("private chats keep no message words in handoff logs", () => {
  const q = "My bakery on 79th Street is behind on rent";
  assertEquals(handoffReason({ memoryEnabled: false, adultConfirmed: true }, q).includes("bakery"), false);
  assertEquals(handoffReason({ memoryEnabled: true, adultConfirmed: true }, q), q);
});
