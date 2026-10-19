import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/1325-ai-logo.png';
import { useClinicalVoice } from './ClinicalVoice';
import { narrationCatalog } from './clinical-narration';
import { HELP_CATEGORIES, PRODUCT_HELP, resolveHelpTarget, type HelpSurface } from './product-help';

/** Product documentation choices only: no patient input, agent execution or clinical mutation. */
export default function AskKayla({ surface, onNavigate }: { surface: HelpSurface; onNavigate: (tab: string) => void }) {
  const [category, setCategory] = useState(HELP_CATEGORIES[0]);
  const [selectedId, setSelectedId] = useState('overview');
  const voice = useClinicalVoice();
  const stopRef = useRef(voice?.stop);
  stopRef.current = voice?.stop;
  useEffect(() => () => stopRef.current?.(), []);
  const selected = PRODUCT_HELP.find(topic => topic.id === selectedId) ?? PRODUCT_HELP[0];
  const target = resolveHelpTarget(selected.id, surface);
  const overview = narrationCatalog().find(clip => clip.id === selected.narration);
  const activeClip = narrationCatalog().find(clip => clip.id === voice?.current);
  const choose = (id: string) => { voice?.stop(); setSelectedId(id); };
  return <section aria-label="Ask Kayla product guide" className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mansagold/30 pb-5">
      <div className="flex items-center gap-3"><img src={logo} alt="1325.AI" className="h-12 w-12 shrink-0 object-contain" /><div><h2 className="text-xl font-semibold">Kayla · Clinical product guide</h2><p className="mt-1 text-sm text-muted-foreground">1325 Clinical · Functionality & workflows</p></div></div>
      <Badge variant="outline" className="border-mansagold/40 text-mansagold">Product help · Not medical advice</Badge>
    </div>
    <nav aria-label="Product help categories" className="flex flex-wrap gap-2">{HELP_CATEGORIES.map(value => <Button key={value} variant={category === value ? 'default' : 'outline'} aria-pressed={category === value} className="h-auto whitespace-normal text-left" onClick={() => { setCategory(value); const first = PRODUCT_HELP.find(topic => topic.category === value); if (first) choose(first.id); }}>{value}</Button>)}</nav>
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
      <nav aria-label="Questions for Kayla" className="space-y-1 lg:border-r lg:border-border lg:pr-5">{PRODUCT_HELP.filter(topic => topic.category === category).map(topic => <Button key={topic.id} variant="ghost" aria-pressed={selectedId === topic.id} onClick={() => choose(topic.id)} className={`h-auto w-full justify-start whitespace-normal border-l-2 px-3 py-3 text-left leading-relaxed ${selectedId === topic.id ? 'border-mansagold bg-mansagold/10 text-mansagold' : 'border-transparent text-muted-foreground'}`}>{topic.question}</Button>)}</nav>
      <article aria-live="polite" aria-label="Kayla product answer" className="min-w-0 space-y-5">
        <div className="space-y-2"><p className="text-xs font-semibold text-mansagold">{selected.feature}</p><h3 className="text-xl font-semibold">{selected.question}</h3><Badge variant="outline">{selected.status}</Badge></div>
        <p className="text-sm leading-relaxed">{selected.answer}</p>
        <div><h4 className="mb-3 flex items-center gap-2 text-sm font-semibold"><BookOpen className="h-4 w-4 text-mansagold" />Workflow</h4><ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{selected.steps.map(step => <li key={step}>{step}</li>)}</ol></div>
        <div className="border-l-2 border-mansagold pl-4"><h4 className="text-sm font-semibold">Current boundary</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.boundary}</p></div>
        {target && (target.startsWith('/') ? <Button variant="outline" className="h-auto whitespace-normal" asChild><Link to={target} onClick={() => voice?.stop()}>Open related page<ArrowRight className="h-4 w-4 shrink-0" /></Link></Button> : <Button variant="outline" className="h-auto whitespace-normal" onClick={() => { voice?.stop(); onNavigate(target); }}>Open related screen<ArrowRight className="h-4 w-4 shrink-0" /></Button>)}
        {voice && overview && <section aria-label="Product overview narration" className="space-y-3 border-t border-border pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="text-sm font-semibold">Related spoken overview</h4><p className="text-xs text-muted-foreground">{overview.title} · Prerecorded, not a reading of this answer</p></div><div className="flex gap-1">
            <Button variant="outline" size="icon" aria-label={voice.enabled ? 'Mute product guide' : 'Enable product guide sound'} title={voice.enabled ? 'Mute product guide' : 'Enable product guide sound'} onClick={voice.toggle}>{voice.enabled ? <Volume2 /> : <VolumeX />}</Button>
            <Button variant="outline" size="icon" disabled={!voice.enabled} aria-label={voice.playing ? 'Pause product overview' : 'Play product overview'} title={voice.playing ? 'Pause product overview' : 'Play product overview'} onClick={() => voice.playing ? voice.pause() : voice.paused && voice.current === selected.narration ? voice.resume() : voice.play(selected.narration)}>{voice.playing ? <Pause /> : <Play />}</Button>
            <Button variant="ghost" size="icon" disabled={!voice.current} aria-label="Stop product overview" title="Stop product overview" onClick={voice.stop}><Square /></Button>
          </div></div>
          <p aria-label="Product overview transcript" className="text-sm leading-relaxed text-muted-foreground">{activeClip && (voice.playing || voice.paused) ? activeClip.text : overview.text}</p>
          {voice.error && <p role="alert" className="text-sm text-destructive">{voice.error}</p>}
        </section>}
        <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Maintained product guidance for this preview. Unknown capabilities are not confirmed. Contact <a className="text-mansagold underline" href="mailto:Thomas@1325.ai">Thomas@1325.ai</a> for unanswered product questions; do not include patient information.</p>
      </article>
    </div>
  </section>;
}