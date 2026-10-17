import { Lock, NotebookPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SAMPLE_VISITS } from './workspace/sample-visits';

const SECTIONS = [
  { title: 'Patient’s story', lines: [2, 3, 4] },
  { title: 'Exam findings', lines: [5, 6] },
  { title: 'Doctor’s assessment', lines: [7] },
  { title: 'Doctor’s plan', lines: [8, 9] },
];

/** Read-only excerpts: no AI request or signature simulation in the executive demo. */
export default function ExecutiveNotePreview({ review }: { review: boolean }) {
  const visit = SAMPLE_VISITS[0];
  return <div className="space-y-6">
    <div className="border-b pb-4"><h3 className="flex items-center gap-2 text-xl font-semibold"><NotebookPen className="h-5 w-5 text-mansagold" />{review ? 'Doctor review & signed report' : 'Source-linked visit note'}</h3><p className="mt-2 text-sm text-muted-foreground">{visit.title} · fictional example · fixed excerpts, not a generated or signed note</p></div>
    <div className="grid gap-6 xl:grid-cols-2">
      <section aria-label="Walkthrough note" className="space-y-4">
        <p className="border-l-2 border-mansagold pl-3 text-sm font-medium">Awaiting doctor review · not approved</p>
        {SECTIONS.map((section) => <div key={section.title} className="space-y-2 border-b pb-3"><h4 className="font-medium text-mansagold">{section.title}</h4>{section.lines.map((line) => <p key={line} className="text-sm">{visit.lines[line - 1]} <a className="text-mansagold underline" href={`#tour-transcript-${line}`}>L{line}</a></p>)}</div>)}
        {review && <div className="space-y-3"><p className="text-sm text-muted-foreground">In the clinic workspace, a doctor or clinic owner records their own decision and name. Only a signed note can produce a report; rejected and unsigned notes cannot.</p><div className="flex flex-wrap gap-2"><Button className="h-auto whitespace-normal py-2" variant="outline" disabled><Lock />Sign note — clinic workspace only</Button><Button className="h-auto whitespace-normal py-2" variant="outline" disabled><Lock />Signed report unavailable</Button></div></div>}
      </section>
      <section aria-label="Walkthrough transcript" className="space-y-3 border-t pt-4 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><h4 className="font-semibold">Original fictional transcript</h4><ol className="space-y-2">{visit.lines.map((line, index) => <li id={`tour-transcript-${index + 1}`} key={line} tabIndex={-1} className="scroll-mt-6 rounded-md px-3 py-2 text-sm target:bg-mansagold/10"><span className="mr-2 text-xs text-muted-foreground">L{index + 1}</span>{line}</li>)}</ol></section>
    </div>
  </div>;
}