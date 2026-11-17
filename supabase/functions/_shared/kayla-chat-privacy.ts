// =============================================================================
// KAYLA CHAT PRIVACY — the person's own "Remember my chats" switch.
//
// Stored per person in public.kayla_chat_preferences, so the choice follows
// them to every device. Every signed-in Kayla channel (main chat, assistant,
// voice) asks this module before saving or recalling past conversations.
//
// Memory Off means: this conversation is not saved, past conversations and
// business notes are not read back to Kayla, and no message words are written
// to team-handoff logs. Safety labels (kayla_safety_events) still record —
// they never contain message words. Kayla's own learning (scoreboard,
// approved lessons, owner feedback) is untouched.
// =============================================================================

export interface ChatPrivacy {
  /** May Kayla save this chat and recall earlier ones? */
  memoryEnabled: boolean;
  /** Has the person confirmed they are 18 or older? */
  adultConfirmed: boolean;
}

export interface ChatPreferenceRow {
  memory_enabled?: boolean | null;
  adult_confirmed_at?: string | null;
}

/**
 * Pure decision. A saved "off" always wins; the request may also switch memory
 * off for one conversation (`memory_off: true`) but can never switch it on.
 * When the setting could not be read, memory stays off (privacy first).
 */
export function resolveChatPrivacy(
  row: ChatPreferenceRow | null | undefined,
  requestBody: unknown,
  readFailed = false,
): ChatPrivacy {
  const requestOff = !!requestBody && typeof requestBody === "object" &&
    (requestBody as Record<string, unknown>).memory_off === true;
  const savedOff = row?.memory_enabled === false;
  return {
    memoryEnabled: !readFailed && !savedOff && !requestOff,
    adultConfirmed: !!row?.adult_confirmed_at,
  };
}

export async function loadChatPrivacy(
  supabase: any,
  userId: string,
  requestBody: unknown,
): Promise<ChatPrivacy> {
  try {
    const { data, error } = await supabase
      .from("kayla_chat_preferences")
      .select("memory_enabled, adult_confirmed_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.warn("[kayla-chat-privacy] read failed, keeping memory off:", error.message);
      return resolveChatPrivacy(null, requestBody, true);
    }
    return resolveChatPrivacy(data, requestBody);
  } catch (e) {
    console.warn("[kayla-chat-privacy] read error, keeping memory off:", e);
    return resolveChatPrivacy(null, requestBody, true);
  }
}

/** What may be written to team-handoff logs for this question. */
export function handoffReason(privacy: ChatPrivacy, question: string): string {
  return privacy.memoryEnabled ? question.slice(0, 160) : "(private chat — words not kept)";
}
