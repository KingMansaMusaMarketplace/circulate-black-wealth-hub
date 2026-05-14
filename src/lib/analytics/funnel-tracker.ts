import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "funnel_session_id";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      (crypto as any)?.randomUUID?.() ??
      `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

/** Fire-and-forget funnel event. Never throws to the caller. */
export const trackFunnelEvent = async (
  eventName: string,
  metadata: Record<string, unknown> = {}
): Promise<void> => {
  try {
    if (typeof window === "undefined") return;
    const { data: userRes } = await supabase.auth.getUser();
    await supabase.from("funnel_events").insert({
      event_name: eventName,
      session_id: getSessionId(),
      user_id: userRes?.user?.id ?? null,
      path: window.location.pathname,
      metadata,
    });
  } catch (err) {
    // Analytics must never break the app
    if (import.meta.env.DEV) console.warn("trackFunnelEvent failed", err);
  }
};
