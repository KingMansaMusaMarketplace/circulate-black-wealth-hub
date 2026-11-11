import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Repeat, RotateCcw, Volume2, VolumeX, Square } from 'lucide-react';
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
import DictationButton from './workspace/DictationButton';
import { KAYLA_MIC_REMINDER, KAYLA_QUESTION_MAX_CHARS, KAYLA_QUESTION_MAX_SECONDS, appendDictation } from '@/lib/clinical/dictation';

import { spokenText } from '../../../supabase/functions/_shared/clinical-spoken-text';
import { SILENT_AUDIO, VoiceRefused, kaylaVoicePart } from './kayla-voice';
import { voiceCommand } from '@/lib/clinical/kayla-workspace-voice';

const KAYLA_VOICE_PROBLEM = "Kayla's voice couldn't start just now. Her written answer is above — press Read aloud to try again.";
/** The retry message, plus the voice service's own short reason when it gave one (never answer words). */
export const kaylaVoiceProblem = (error: unknown) => error instanceof VoiceRefused && error.reason
  ? `Kayla's voice couldn't start: ${error.reason} Her written answer is above — press Read aloud to try again.`
  : KAYLA_VOICE_PROBLEM;
/** Plain words for the speaker: no markdown symbols or web addresses; brand said the approved way. */
export { spokenText };

/** Prefer a natural-sounding female US English voice built into the device, when one exists. */
const kaylaBrowserVoice = () => {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  const english = voices.filter(v => v.lang?.toLowerCase().startsWith('en-us'));
  return ['Samantha', 'Ava', 'Allison', 'Aria', 'Jenny', 'Google US English', 'Female'].map(name => english.find(v => v.name.includes(name))).find(Boolean) ?? english[0] ?? null;
};

/** Phones (especially iPhone) only allow speech that starts from a tap; a silent utterance during the tap unlocks later answers. */
const primeSpeech = () => {
  if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return;
  const silent = new SpeechSynthesisUtterance(' '); silent.volume = 0; window.speechSynthesis.speak(silent);
};

/** clinicId turns on the spoken-question microphone (private clinic workspace only). */
export default function AskKayla({ surface, onNavigate, clinicId }: { surface: HelpSurface; onNavigate: (tab: string) => void; clinicId?: string }) {
  const chat = useClinicalHelpConversation();
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const canSpeak = surface === 'workspace' && !!clinicId && !!chat;
  const [localError, setLocalError] = useState('');
  const [selectedId, setSelectedId] = useState(() => chat?.previousTopics()[0] ?? 'overview');
  const [speaking, setSpeaking] = useState<string | null>(null);
  // Answers Kayla has already read once show a Repeat button.
  const [heard, setHeard] = useState<ReadonlySet<string>>(() => new Set());
  const markHeard = (id: string) => setHeard(prev => prev.has(id) ? prev : new Set(prev).add(id));
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
    if (autoRead) { primeSpeech(); primeAudio(); }
    setLocalError(''); setInput(''); setSelectedId(selection.topics[0]); chat?.ask(selection, surface);
  };
  const followup = (intent: HelpIntent) => { if (autoRead) { primeSpeech(); primeAudio(); } const topics = chat?.previousTopics().length ? chat.previousTopics() : [selectedId]; setSelectedId(topics[0]); setLocalError(''); chat?.ask({ topics, intent }, surface); };
  // Kayla's own video voice (workspace only); the device voice is the automatic fallback.
  const kaylaAudio = useRef<HTMLAudioElement | null>(null);
  const readToken = useRef(0);
  const [voiceLoading, setVoiceLoading] = useState<string | null>(null);
  const audioElement = () => { if (!kaylaAudio.current && typeof Audio !== 'undefined') kaylaAudio.current = new Audio(); return kaylaAudio.current; };
  /** Called during a tap: phones only allow later audio from an element that first played inside a tap. */
  const primeAudio = () => {
    if (!canSpeak) return;
    const a = audioElement(); if (!a || (a.src && !a.paused)) return;
    const mark = ++primeMark.current;
    a.muted = true; a.src = SILENT_AUDIO;
    // Only undo the silent clip if Kayla's real answer has not started on this element meanwhile.
    void Promise.resolve(a.play()).catch(() => undefined).finally(() => { if (primeMark.current === mark) { a.pause(); a.muted = false; } });
  };
  const primeMark = useRef(0);
  const stopSpeaking = () => {
    readToken.current++; setVoiceLoading(null);
    window.speechSynthesis?.cancel();
    const a = kaylaAudio.current; if (a) { a.onended = null; a.onerror = null; a.pause(); }
  };
  const stopSpeakingRef = useRef(stopSpeaking); stopSpeakingRef.current = stopSpeaking;
  const readWithDevice = (id: string, text: string) => {
    if (!window.speechSynthesis) { setSpeaking(null); setLocalError('Spoken answers are unavailable in this browser. The written answer remains available.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText(text));
    utterance.lang = 'en-US';
    const voiceChoice = kaylaBrowserVoice();
    if (voiceChoice) utterance.voice = voiceChoice;
    utterance.onend = () => setSpeaking(null); utterance.onerror = () => setSpeaking(null);
    setSpeaking(id); markHeard(id); window.speechSynthesis.speak(utterance);
  };
  const readAnswer = (id: string, text: string, toggle = true) => {
    stopSpeaking(); stopVoice.current?.();
    if (toggle && speaking === id) { setSpeaking(null); return; }
    const proof = canSpeak && clinicId ? chat?.voiceProof?.(id) : null;
    if (!proof || !clinicId) { readWithDevice(id, text); return; }
    if (toggle) primeAudio();
    const token = readToken.current;
    const live = () => token === readToken.current;
    // In the clinic workspace only Kayla's own voice speaks; if it cannot start, say so instead of a computer voice.
    const fail = (error?: unknown) => { if (!live()) return; setVoiceLoading(null); setSpeaking(null); setLocalError(kaylaVoiceProblem(error)); };
    const playPiece = (url: string) => new Promise<void>((resolve, reject) => {
      const a = audioElement(); if (!a) { reject(new Error('No audio')); return; }
      primeMark.current++; a.muted = false;
      a.onended = () => resolve(); a.onerror = () => reject(new Error('Audio failed'));
      a.src = url;
      Promise.resolve(a.play()).catch(reject);
    });
    const piece = (n: number) => kaylaVoicePart(clinicId, proof, n);
    setLocalError(''); setSpeaking(id); setVoiceLoading(id);
    void (async () => {
      try {
        let current = await piece(0);
        const total = current.parts;
        for (let n = 0; n < total; n++) {
          if (!live()) return;
          // Prepare the next piece while this one plays, so Kayla keeps talking without a long pause.
          const next = n + 1 < total ? piece(n + 1) : null;
          next?.catch(() => undefined);
          setVoiceLoading(null);
          if (n === 0) markHeard(id);
          await playPiece(current.url);
          if (!next || !live()) break;
          current = await next.catch(() => piece(n + 1));
        }
        if (live()) setSpeaking(null);
      } catch (error) { fail(error); }
    })();
  };
  const stopAll = () => { stopSpeaking(); setSpeaking(null); };
  // One audio lane: if a narration clip starts, Kayla's spoken answer stops.
  useEffect(() => { if (voice?.playing) { stopSpeakingRef.current(); setSpeaking(null); } }, [voice?.playing]);
  useEffect(() => () => { stopSpeakingRef.current(); if (kaylaAudio.current) kaylaAudio.current.src = ''; }, []);
  // "Read answers aloud": once on, every new finished answer is spoken automatically.
  const [autoRead, setAutoRead] = useState(false);
  const lastRead = useRef<string | null>(null);
  const latest = chat?.messages.at(-1);
  const latestReady = !busy && latest?.role === 'assistant' && latest.parts.some(p => p.type === 'data-receipt') ? latest : null;
  const enableAutoRead = () => { lastRead.current = latestReady?.id ?? lastRead.current; setAutoRead(true); primeSpeech(); primeAudio(); };
  const toggleAutoRead = () => { if (autoRead) { setAutoRead(false); stopSpeaking(); setSpeaking(null); } else enableAutoRead(); };
  useEffect(() => {
    if (!autoRead || !latestReady || lastRead.current === latestReady.id) return;
    lastRead.current = latestReady.id;
    readAnswer(latestReady.id, latestReady.parts.filter(p => p.type === 'text').map(p => (p as { text: string }).text).join('\n'), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRead, latestReady?.id]);
  const selected = PRODUCT_HELP.find(t => t.id === selectedId) ?? PRODUCT_HELP[0];
  const target = resolveHelpTarget(selectedId, surface);
  return <section aria-label="Ask Kayla product conversation" className="mx-auto min-w-0 max-w-4xl space-y-4">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <div className="flex min-w-0 items-center gap-3"><img src={logo} alt="1325.AI" className="h-12 w-12 shrink-0 object-contain" /><div><h2 ref={heading} className="text-xl font-semibold">Ask Kayla</h2><p className="text-sm text-muted-foreground">1325 Clinical EMR / EHR · Product specialist</p></div></div>
      <div className="flex flex-wrap items-center gap-2">{(speaking || voiceLoading) && <Button variant="destructive" size="sm" title="Stop Kayla talking" onClick={stopAll}><Square />Stop Kayla</Button>}<Button variant={autoRead ? 'default' : 'outline'} size="sm" aria-pressed={autoRead} title={autoRead ? 'Stop reading answers aloud' : 'Kayla reads each answer aloud'} onClick={toggleAutoRead}>{autoRead ? <Volume2 /> : <VolumeX />}{autoRead ? 'Reading answers aloud' : 'Read answers aloud'}</Button><Badge variant="outline">No saved history</Badge><Button variant="ghost" size="icon" title="Clear conversation" aria-label="Clear conversation" onClick={() => { stopSpeaking(); chat?.clear(); setInput(''); setLocalError(''); setSpeaking(null); }}><RotateCcw /></Button></div>
    </header>
    <Conversation className="h-[min(52vh,560px)] min-h-[280px]" aria-label="Conversation with Kayla">
      <ConversationContent className="gap-6 px-1 py-4">
        {!chat?.messages.length && <Message from="assistant"><MessageContent><MessageResponse>{"I'm Kayla, your Agentic AI product guide for **1325 Clinical EMR / EHR**. What would you like to know about its features or workflows?\n\nI can explain how the sample platform works, what is locked, and how the **42 Agentic AI Employees** fit into the broader 1325.AI team. I don't provide medical advice or accept patient information."}</MessageResponse></MessageContent></Message>}
        {chat?.messages.map(message => <Message key={message.id} from={message.role}><MessageContent className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}>
          {message.parts.map((part, index) => part.type === 'text' ? <MessageResponse key={index}>{part.text}</MessageResponse> : null)}
        </MessageContent>{message.role === 'assistant' && message.parts.some(p => p.type === 'data-receipt') && <Button variant="outline" size="sm" className="mt-1 self-start" title={speaking === message.id ? 'Stop reading this answer' : heard.has(message.id) ? 'Hear this answer again from the start' : 'Kayla reads this answer aloud'} onClick={() => readAnswer(message.id, message.parts.filter(p => p.type === 'text').map(p => p.text).join('\n'))}>{speaking === message.id ? <><Square />Stop reading</> : heard.has(message.id) ? <><Repeat />Repeat answer</> : <><Volume2 />Read aloud</>}</Button>}{voiceLoading === message.id && <Shimmer className="text-xs">Kayla is getting ready to speak…</Shimmer>}</Message>)}
        {chat?.status === 'submitted' && <Shimmer>Kayla is preparing your answer…</Shimmer>}
      </ConversationContent><ConversationScrollButton aria-label="Latest answer" />
    </Conversation>
    {(localError || chat?.problem) && <p role="alert" className="text-sm text-destructive">{localError || chat?.problem}</p>}
    {!chat && <p role="alert" className="text-sm text-destructive">A current approved private session is required.</p>}
    <div ref={form}><PromptInput attachmentsDisabled maxFiles={0} onSubmit={({ text }) => submit(text)}>
      <PromptInputTextarea aria-label="Your product question" placeholder="Please tell me about 1325 Clinical EMR / EHR and its features" value={input} onChange={e => setInput(e.target.value)} maxLength={KAYLA_QUESTION_MAX_CHARS} disabled={busy || !chat || listening} autoComplete="off" />
      <PromptInputFooter className="flex-wrap justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {canSpeak && clinicId && <DictationButton clinicId={clinicId} purpose="question" maxSeconds={KAYLA_QUESTION_MAX_SECONDS} idleLabel="Speak" sectionLabel="your question to Kayla" disabled={busy}
            onBusyChange={setListening}
            onError={message => setLocalError(message)}
            // Spoken words only fill the box; the doctor reads them and presses send, and the same product-only check applies.
            onText={text => { setLocalError('');
              // Hands-free: "Kayla, open schedule" jumps straight to that screen (screen names only, nothing sent).
              const screen = voiceCommand(text);
              if (screen) { setInput(''); onNavigate(screen); return; } if (!autoRead) enableAutoRead(); setInput(prev => appendDictation(prev, text, KAYLA_QUESTION_MAX_CHARS).text); form.current?.querySelector('textarea')?.focus({ preventScroll: true }); }} />}
          <span className="text-xs text-muted-foreground">{canSpeak ? `${KAYLA_MIC_REMINDER} Hands-free: say "Kayla, open schedule" (or labs, notes, billing).` : 'Product questions only · No patient information'}</span>
        </div>
        <PromptInputSubmit variant="clinicalHelp" status={chat?.status} onStop={() => { void chat?.stop(); }} disabled={!chat || listening || (!busy && !input.trim())} aria-label={busy ? 'Stop answer' : 'Ask Kayla'} />
      </PromptInputFooter>
    </PromptInput></div>
    <div className="flex flex-wrap gap-2" aria-label="Follow-up questions">{([['steps','Walk me through it'],['limits','What is available today?'],['team','How does the team help?']] as const).map(([intent,label]) => <Button key={intent} variant="outline" disabled={busy || !chat} className="h-auto whitespace-normal py-2" onClick={() => followup(intent)}>{label}</Button>)}</div>
    <details className="border-t border-border pt-4"><summary className="cursor-pointer text-sm font-semibold text-primary">Browse all product features</summary><nav aria-label="Product features" className="mt-3 flex flex-wrap gap-2">{PRODUCT_HELP.map(topic => <Button key={topic.id} variant="ghost" disabled={busy || !chat} className="h-auto whitespace-normal text-left" onClick={() => { setSelectedId(topic.id); chat?.ask({ topics: [topic.id], intent: 'explain' }, surface); }}>{topic.feature}</Button>)}</nav></details>
    <div className="border-l-2 border-primary pl-3 text-xs leading-relaxed text-muted-foreground"><p className="font-semibold text-foreground">{selected.feature} · {selected.status}</p><p>{selected.boundary}</p></div>
    {target && (target.startsWith('/') ? <Button variant="outline" asChild><Link to={target}>Open related page<ArrowRight /></Link></Button> : <Button variant="outline" onClick={() => onNavigate(target)}>Open related screen<ArrowRight /></Button>)}
  </section>;
}