import { useState } from 'react';
import { AlertTriangle, HeartPulse, Lock, Stethoscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSpecialtyExample, SPECIALTIES, specialtyExcerpt } from './specialty-examples';

export default function SpecialtyExamples() {
  const [source, setSource] = useState<number | null>(null);
  return <div className="space-y-6">
    <header className="space-y-2 border-b pb-5">
      <Badge variant="outline" className="border-mansagold/40 text-mansagold">Fictional samples · read-only</Badge>
      <h2 className="flex items-center gap-2 text-xl font-semibold"><Stethoscope className="h-5 w-5 text-mansagold" />Specialty examples</h2>
      <p className="text-sm text-muted-foreground">Source-linked excerpts · awaiting doctor review · no real patient records</p>
    </header>
    <Tabs defaultValue="Primary Care" onValueChange={() => setSource(null)}>
      <TabsList aria-label="Clinical specialty" className="grid h-auto w-full grid-cols-1 gap-1 sm:grid-cols-3">
        {SPECIALTIES.map((specialty) => <TabsTrigger key={specialty} value={specialty} className="min-h-10 whitespace-normal">{specialty}</TabsTrigger>)}
      </TabsList>
      {SPECIALTIES.map((specialty) => {
        const example = getSpecialtyExample(specialty);
        return <TabsContent key={example.id} value={specialty} className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-semibold">{example.title}</h3><Badge variant="secondary">Not approved</Badge></div>
          <div className="grid items-start gap-8 xl:grid-cols-2">
            <section aria-label="Specialty excerpts" className="min-w-0 space-y-5">
              {example.sections.map((section) => <div key={section.title} className="space-y-2 border-b pb-4"><h4 className="font-medium text-mansagold">{section.title}</h4>{section.lines.map((line) => <div key={line} className="text-sm leading-relaxed"><span>{specialtyExcerpt(example, line)}</span>{' '}<Button variant="link" size="sm" className="h-auto px-1 py-0 text-mansagold" aria-label={`View source line ${line}`} onClick={() => {
                setSource(line);
                document.getElementById(`${example.id}-line-${line}`)?.scrollIntoView({ block: 'nearest' });
              }}>L{line}</Button></div>)}</div>)}
              <div className="space-y-2 border-l-2 border-mansagold pl-3"><h4 className="flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4 text-mansagold" />Gaps for doctor review</h4><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{example.gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul></div>
            </section>
            <section aria-label="Specialty transcript" className="min-w-0 space-y-3 border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
              <h4 className="flex items-center gap-2 font-semibold"><HeartPulse className="h-4 w-4 text-mansagold" />Original fictional transcript</h4>
              <ol className="space-y-2">{example.transcript.map((text, index) => <li key={index} id={`${example.id}-line-${index + 1}`} aria-current={source === index + 1 ? 'true' : undefined} className={`scroll-mt-6 rounded-md border px-3 py-2 text-sm leading-relaxed ${source === index + 1 ? 'border-mansagold bg-mansagold/10' : 'border-transparent'}`}><span className="mr-2 text-xs text-muted-foreground">L{index + 1}</span>{text}</li>)}</ol>
            </section>
          </div>
          <footer className="space-y-3 border-t pt-4"><p className="text-sm text-muted-foreground">Kayla is an AI assistant, not a licensed clinician. These fixed excerpts are not generated or signed notes; doctors make every medical decision.</p><div className="flex flex-wrap gap-2"><Button variant="outline" disabled><Lock className="h-4 w-4" />Signature unavailable</Button><Button variant="outline" disabled><Lock className="h-4 w-4" />Export unavailable</Button><Button variant="outline" disabled><Lock className="h-4 w-4" />Sending locked</Button></div></footer>
        </TabsContent>;
      })}
    </Tabs>
  </div>;
}