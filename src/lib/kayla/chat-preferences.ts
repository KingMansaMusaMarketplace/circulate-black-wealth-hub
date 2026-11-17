/**
 * Kayla chat settings kept on this device: "Remember my chats" and the
 * one-time 18+ confirmation. Signed-in people also have the same settings
 * saved to their account (kayla_chat_preferences), which the server obeys.
 */
export const KAYLA_MEMORY_KEY = 'kayla:memory-enabled';
export const KAYLA_ADULT_KEY = 'kayla:adult-confirmed';
export const KAYLA_PREFS_EVENT = 'kayla-prefs-changed';

/** Every place a Kayla chat copy or chat id is kept on this device. */
export const KAYLA_LOCAL_CHAT_KEYS = ['mm:kayla:chat:v1', 'kayla_session_id', 'kayla_widget_session_id'];

export interface KaylaChatPrefs {
  memoryEnabled: boolean;
  adultConfirmed: boolean;
}

type ReadableStorage = Pick<Storage, 'getItem'>;

export function readLocalKaylaPrefs(storage: ReadableStorage | null | undefined): KaylaChatPrefs {
  try {
    return {
      memoryEnabled: storage?.getItem(KAYLA_MEMORY_KEY) !== 'off',
      adultConfirmed: storage?.getItem(KAYLA_ADULT_KEY) === 'yes',
    };
  } catch {
    // Storage blocked: remember nothing, and ask the age question again.
    return { memoryEnabled: false, adultConfirmed: false };
  }
}

/** A row saved on the account always wins over what this device remembers. */
export function prefsFromAccountRow(
  row: { memory_enabled?: boolean | null; adult_confirmed_at?: string | null } | null | undefined,
): KaylaChatPrefs {
  return {
    memoryEnabled: row?.memory_enabled !== false,
    adultConfirmed: !!row?.adult_confirmed_at,
  };
}
