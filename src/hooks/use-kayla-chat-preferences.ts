import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  KAYLA_ADULT_KEY,
  KAYLA_LOCAL_CHAT_KEYS,
  KAYLA_MEMORY_KEY,
  KAYLA_PREFS_EVENT,
  prefsFromAccountRow,
  readLocalKaylaPrefs,
  type KaylaChatPrefs,
} from '@/lib/kayla/chat-preferences';

const local = () => (typeof window !== 'undefined' ? window.localStorage : null);

function writeLocal(prefs: KaylaChatPrefs) {
  try {
    local()?.setItem(KAYLA_MEMORY_KEY, prefs.memoryEnabled ? 'on' : 'off');
    if (prefs.adultConfirmed) local()?.setItem(KAYLA_ADULT_KEY, 'yes');
    else local()?.removeItem(KAYLA_ADULT_KEY);
  } catch { /* storage blocked */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(KAYLA_PREFS_EVENT));
}

export function clearLocalKaylaChats() {
  try { KAYLA_LOCAL_CHAT_KEYS.forEach((k) => local()?.removeItem(k)); } catch { /* ignore */ }
}

/**
 * The person's Kayla chat settings: "Remember my chats" and 18+ confirmation.
 * Signed in → saved to their account (the server enforces Memory Off).
 * Signed out → kept on this device only.
 */
export function useKaylaChatPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<KaylaChatPrefs>(() => readLocalKaylaPrefs(local()));
  const [ready, setReady] = useState(!user);

  useEffect(() => {
    const sync = () => setPrefs(readLocalKaylaPrefs(local()));
    window.addEventListener(KAYLA_PREFS_EVENT, sync);
    return () => window.removeEventListener(KAYLA_PREFS_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!user) { setReady(true); return; }
    let cancelled = false;
    setReady(false);
    supabase
      .from('kayla_chat_preferences')
      .select('memory_enabled, adult_confirmed_at')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error) {
          const next = prefsFromAccountRow(data);
          setPrefs(next);
          writeLocal(next);
        }
        setReady(true);
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  const save = useCallback(async (patch: { memory_enabled?: boolean; adult_confirmed_at?: string }) => {
    if (!user) return true;
    const { error } = await supabase
      .from('kayla_chat_preferences')
      .upsert({ user_id: user.id, ...patch }, { onConflict: 'user_id' });
    if (error) console.warn('[kayla-prefs] save failed:', error.message);
    return !error;
  }, [user?.id]);

  const setMemoryEnabled = useCallback(async (memoryEnabled: boolean) => {
    const next = { ...readLocalKaylaPrefs(local()), memoryEnabled };
    setPrefs(next);
    writeLocal(next);
    // Turning memory off also removes the copy of the chat kept on this device.
    if (!memoryEnabled) clearLocalKaylaChats();
    return save({ memory_enabled: memoryEnabled });
  }, [save]);

  const confirmAdult = useCallback(() => {
    const next = { ...readLocalKaylaPrefs(local()), adultConfirmed: true };
    setPrefs(next);
    writeLocal(next);
    // The database stamps its own time; this value only marks "confirmed".
    return save({ adult_confirmed_at: new Date().toISOString() });
  }, [save]);

  /** Delete every saved Kayla conversation for this person (account + device). */
  const deleteSavedChats = useCallback(async () => {
    clearLocalKaylaChats();
    window.dispatchEvent(new Event(KAYLA_PREFS_EVENT));
    if (!user) return true;
    const { error } = await supabase.from('ai_chat_sessions').delete().eq('user_id', user.id);
    if (error) console.warn('[kayla-prefs] delete failed:', error.message);
    return !error;
  }, [user?.id]);

  return { ...prefs, ready, signedIn: !!user, setMemoryEnabled, confirmAdult, deleteSavedChats };
}
