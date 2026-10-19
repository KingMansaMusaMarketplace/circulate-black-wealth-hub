import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { supabase } from '@/integrations/supabase/client';
import { clinicalRequestHeaders } from './clinical-request';
import { canonicalQuestion, type HelpSelection } from '../../../supabase/functions/_shared/clinical-help-intake';
import type { HelpTurn } from '../../../supabase/functions/_shared/clinical-help-history';

export type HelpMessage = UIMessage<unknown, { receipt: { text: string; proof: string } }>;
function useConversation() {
  const turns = useRef<HelpTurn[]>([]);
  const pending = useRef(false);
  const alive = useRef(true);
  const account = useRef<string | undefined>();
  const resetting = useRef(false);
  const [resetBusy, setResetBusy] = useState(false);
  const surface = useRef<'demo' | 'workspace'>('demo');
  const [problem, setProblem] = useState('');
  const transport = useMemo(() => new DefaultChatTransport<HelpMessage>({
    api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-kayla-help`,
    fetch: async (url, init) => {
      const response = await fetch(url, init);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : `Kayla request failed (${response.status}).`);
      }
      return response;
    },
    headers: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) throw new Error('Sign in with your approved email to ask Kayla.');
      return { Authorization: `Bearer ${data.session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, 'x-csrf-token': 'clinical-product-help', ...clinicalRequestHeaders() };
    },
    prepareSendMessagesRequest: () => ({ body: { surface: surface.current, turns: turns.current } }),
  }), []);
  const chat = useChat<HelpMessage>({
    transport,
    onError: e => { if (resetting.current) return; pending.current = false; if (alive.current) setProblem(e.message); },
    onFinish: ({ message, isAbort, isError }) => {
      if (resetting.current) return;
      pending.current = false;
      if (!alive.current || isAbort || isError) return;
      const receipt = message.parts.find(p => p.type === 'data-receipt');
      const last = turns.current[turns.current.length - 1];
      if (receipt?.type === 'data-receipt' && last) last.reply = receipt.data;
      else setProblem('This answer was not confirmed. Clear the conversation before continuing.');
    },
  });
  const stopRef = useRef(chat.stop);
  stopRef.current = chat.stop;
  const clear = async () => {
    if (resetting.current) return;
    resetting.current = true; setResetBusy(true); pending.current = true;
    window.speechSynthesis?.cancel();
    try {
      await stopRef.current(); turns.current = []; chat.setMessages([]); chat.clearError(); setProblem('');
    } finally { pending.current = false; resetting.current = false; if (alive.current) setResetBusy(false); }
  };
  const clearRef = useRef(clear); clearRef.current = clear;
  useEffect(() => {
    alive.current = true;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || (account.current && session?.user.id !== account.current)) {
        void clearRef.current();
      }
      account.current = session?.user.id;
    });
    return () => { alive.current = false; resetting.current = true; void stopRef.current(); turns.current = []; data.subscription.unsubscribe(); window.speechSynthesis?.cancel(); };
  }, [chat.setMessages]);
  const ask = (selection: HelpSelection, view: 'demo' | 'workspace') => {
    if (pending.current) return;
    if (turns.current.length && !turns.current[turns.current.length - 1].reply) { setProblem('Clear the incomplete conversation before asking again.'); return; }
    setProblem(''); surface.current = view; pending.current = true;
    turns.current.push({ selection });
    void chat.sendMessage({ text: canonicalQuestion(selection) }).catch(e => { pending.current = false; setProblem(e instanceof Error ? e.message : 'Request failed'); });
  };
  return { ...chat, status: resetBusy ? 'submitted' as const : chat.status, ask, clear, problem, previousTopics: () => turns.current[turns.current.length - 1]?.selection.topics ?? [] };
}
const Context = createContext<ReturnType<typeof useConversation> | null>(null);
export function ClinicalHelpConversationProvider({ children }: { children: ReactNode }) {
  const conversation = useConversation();
  return <Context.Provider value={conversation}>{children}</Context.Provider>;
}
export function useClinicalHelpConversation() { return useContext(Context); }