import logo1325 from '@/assets/1325-ai-logo.png';
import { FileCheck2, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { enterpriseReadiness } from './enterprise-readiness';

export default function EnterpriseReadiness() {
  const readiness = enterpriseReadiness();
  return <Sheet>
    <SheetTrigger asChild><Button variant="outline" size="sm" className="gap-2 border-mansagold/40"><ShieldCheck className="h-4 w-4 text-mansagold" />Readiness</Button></SheetTrigger>
    <SheetContent className="theme-clinical dark w-full overflow-y-auto border-mansagold/30 bg-background text-foreground sm:max-w-xl motion-reduce:animate-none" side="right">
      <SheetHeader className="pr-6 text-left">
        <div className="mb-3 flex items-center gap-3"><img src={logo1325} alt="1325.AI logo" className="h-10 w-10 object-contain" /><span className="text-sm font-semibold text-mansagold">1325 Clinical · Enterprise Edition</span></div>
        <SheetTitle className="text-xl">Enterprise readiness</SheetTitle>
        <SheetDescription>Healthcare privacy & readiness roadmap · fictional evaluation only</SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-6">
        <div className="space-y-2 border-l-2 border-mansagold pl-4"><p className="flex items-center gap-2 font-semibold"><Lock className="h-4 w-4 text-mansagold" />Real patient records remain locked</p><p className="text-sm text-muted-foreground">This panel is not a compliance certification, legal opinion or approval to use patient information. The Health Insurance Portability and Accountability Act (HIPAA) requirements must be reviewed for the intended services.</p></div>
        <ol className="space-y-6">{readiness.phases.map((phase, index) => <li key={phase.id} className="space-y-4 border-t pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="flex items-center gap-2 font-semibold"><span className="text-mansagold">0{index + 1}</span>{phase.title}</h3><Badge variant="outline" className={phase.id === 'fictional' ? 'border-mansagold/40 text-mansagold' : 'text-muted-foreground'}>{phase.label}</Badge></div>
          <dl className="space-y-4">{phase.items.map((item) => <div key={item.title}><dt className="text-sm font-medium">{item.title}</dt><dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</dd></div>)}</dl>
        </li>)}</ol>
        <section aria-label="Current processing restrictions" className="space-y-3 border-t pt-5"><h3 className="flex items-center gap-2 font-semibold"><FileCheck2 className="h-4 w-4 text-mansagold" />Current restrictions</h3><dl className="space-y-2 text-sm">{['Agreement uploads', 'Real-record uploads', 'Patient calls'].map((label) => <div key={label} className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">{label}</dt><dd className="flex items-center gap-1"><Lock className="h-3 w-3" />Locked</dd></div>)}</dl></section>
        <p className="border-t pt-4 text-xs leading-relaxed text-muted-foreground">A signed clinic agreement alone cannot unlock uploads. Visitor approval, clinic membership and sample doctor sign-off do not establish vendor coverage or healthcare clearance. Status changes require independent verification; this panel cannot approve or activate services.</p>
      </div>
    </SheetContent>
  </Sheet>;
}