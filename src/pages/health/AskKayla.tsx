import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, Volume2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import logo from '@/assets/1325-ai-logo.png';
import { useClinicalVoice } from './ClinicalVoice';
import { PRODUCT_HELP, resolveHelpTarget, type HelpSurface } from './product-help';
import { compileHelpQuestion, type HelpIntent } from '../../../supabase/functions/_shared/clinical-help-intake';
import { useClinicalHelpConversation } from './ClinicalHelpConversation';

export default function AskKayla({ surface, onNavigate }: { surface: HelpSurface; onNavigate: (tab: string) => void }) {
  const chat = useClinicalHelpConversation();
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState('');
  const [selectedId, setSelectedId] = useState('overview');
  const [speaking, setSpeaking] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLDivElement>(null);
  const voice = useClinicalVoice();
  const stopVoice = useRef(voice?.stop); stopVoice.current = voice?.stop;
  const busy = chat?.status === 'submitted' || chat?.status === 'streaming';
  useEffect(() => {
    heading.current?.scrollIntoView?.({ block: 'start', behavior: 'instant' });
    form.current?.querySelector('textarea')?.focus({ preventScroll: true });
    stopVoice.current?.();
    return () => { window.speechSynthesis?.cancel(); stopVoice.current?.(); };
  }, []);
  useEffect(() => { if (!busy) form.current?.querySelector('textarea')?.focus({ preventScroll: true }); }, [busy]);
  const submit = (text: string) => {
    if (busy) return;
    const selection = compileHelpQuestion(text, chat?.previousTopics());
    if (!selection) { setInput(''); setLocalError('This question was not sent. Ask only about product features, without names, patient details or other personal information. You can choose a feature below.'); return; }
    setLocalError(''); setInput(''); setSelectedId(selection.topics[0]); chat?.ask(selection, surface);
  };
  const followup = (intent: HelpIntent) => { setLocalError(''); chat?.ask({ topics: chat.previousTopics().length ? chat.previousTopics() : [selectedId], intent }, surface); };
  const readAnswer = (id: string, text: string) => {
    if (!window.speechSynthesis) { setLocalError('Spoken answers are unavailable in this browser. The written answer remains available.'); return; }
    window.speechSynthesis.cancel(); stopVoice.current?.();
    if (speaking === id) { setSpeaking(null); return; }
    const utterance = new SpeechSynthesisUtterance(text.replace(/1325\.AI/gi, 'thirteen twenty-five dot A I').replace(/[*#`]/g, ''));
    utterance.lang = 'en-US'; utterance.onend = () => setSpeaking(null); utterance.onerror = () => setSpeaking(null);
    setSpeaking(id); window.speechSynthesis.speak(utterance);
  };
  const selected = PRODUCT_HELP.find(t => t.id === selectedId) ?? PRODUCT_HELP[0];
  const target = resolveHelpTarget(selectedId, surface);
  return <section aria-label="Ask Kayla product conversation" className="mx-auto min-w-0 max-w-4xl space-y-4">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <div className="flex min-w-0 items-center gap-3"><img src={logo} alt="1325.AI" className="h-12 w-12 shrink-0 object-contain" /><div><h2 ref={heading} className="text-xl font-semibold">Ask Kayla</h2><p className="text-sm text-muted-foreground">1325 Clinical · Product specialist</p></div></div>
      <div className="flex items-center gap-2"><Badge variant="outline">No saved history</Badge><Button variant="ghost" size="icon" title="Clear conversation" aria-label="Clear conversation" onClick={() => { chat?.clear(); setInput(''); setLocalError(''); setSpeaking(null); }}><RotateCcw /></Button></div>
    </header>
    <Conversation className="h-[min(52vh,560px)] min-h-[280px]" aria-label="Conversation with Kayla">
      <ConversationContent className="gap-6 px-1 py-4">
        {!chat?.messages.length && <Message from="assistant"><MessageContent><MessageResponse>{"I'm Kayla, your AI product guide for **1325 Clinical**. What would you like to know about its features or workflows?\n\nI can explain how the sample platform works, what is locked, and how the **42 Agentic AI Employees** fit into the broader 1325.AI team. I don't provide medical advice or accept patient information."}</MessageResponse></MessageContent></Message>}
        {chat?.messages.map(message => <Message key={message.id} from={message.role}><MessageContent className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}>
          {message.parts.map((part, index) => part.type === 'text' ? <MessageResponse key={index}>{part.text}</MessageResponse> : part.type === 'reasoning' ? <details key={index} className="text-xs text-muted-foreground"><summary>Preparing the product answer</summary><MessageResponse>{part.text}</MessageResponse></details> : null)}
        </MessageContent>{message.role === 'assistant' && message.parts.some(p => p.type === 'data-receipt') && <Button variant="ghost" size="icon" title={speaking === message.id ? 'Stop spoken answer' : 'Read this answer aloud'} aria-label={speaking === message.id ? 'Stop spoken answer' : 'Read this answer aloud'} onClick={() => readAnswer(message.id, message.parts.filter(p => p.type === 'text').map(p => p.text).join('\n'))}>{speaking === message.id ? <Square /> : <Volume2 />}</Button>}</Message>)}
        {chat?.status === 'submitted' && <Shimmer>Kayla is preparing your answer…</Shimmer>}
      </ConversationContent><ConversationScrollButton aria-label="Latest answer" />
    </Conversation>
    {(localError || chat?.problem) && <p role="alert" className="text-sm text-destructive">{localError || chat?.problem}</p>}
    {!chat && <p role="alert" className="text-sm text-destructive">A current approved private session is required.</p>}
    <div ref={form}><PromptInput attachmentsDisabled maxFiles={0} onSubmit={({ text }) => submit(text)}>
      <PromptInputTextarea aria-label="Your product question" placeholder="Please tell me about 1325 Clinical and its features" value={input} onChange={e => setInput(e.target.value)} maxLength={600} disabled={busy || !chat} autoComplete="off" />
      <PromptInputFooter className="justify-between"><span className="text-xs text-muted-foreground">Product questions only · No patient information</span><PromptInputSubmit variant="clinicalHelp" status={chat?.status} onStop={() => { void chat?.stop(); }} disabled={!chat || (!busy && !input.trim())} aria-label={busy ? 'Stop answer' : 'Ask Kayla'} /></PromptInputFooter>
    </PromptInput></div>
    <div className="flex flex-wrap gap-2" aria-label="Follow-up questions">{([['steps','Walk me through it'],['limits','What is available today?'],['team','How does the team help?']] as const).map(([intent,label]) => <Button key={intent} variant="outline" disabled={busy || !chat} className="h-auto whitespace-normal py-2" onClick={() => followup(intent)}>{label}</Button>)}</div>
    <details className="border-t border-border pt-4"><summary className="cursor-pointer text-sm font-semibold text-primary">Browse all product features</summary><nav aria-label="Product features" className="mt-3 flex flex-wrap gap-2">{PRODUCT_HELP.map(topic => <Button key={topic.id} variant="ghost" disabled={busy || !chat} className="h-auto whitespace-normal text-left" onClick={() => { setSelectedId(topic.id); chat?.ask({ topics: [topic.id], intent: 'explain' }, surface); }}>{topic.feature}</Button>)}</nav></details>
    <div className="border-l-2 border-primary pl-3 text-xs leading-relaxed text-muted-foreground"><p className="font-semibold text-foreground">{selected.feature} · {selected.status}</p><p>{selected.boundary}</p></div>
    {target && (target.startsWith('/') ? <Button variant="outline" asChild><Link to={target}>Open related page<ArrowRight /></Link></Button> : <Button variant="outline" onClick={() => onNavigate(target)}>Open related screen<ArrowRight /></Button>)}
  </section>;
}