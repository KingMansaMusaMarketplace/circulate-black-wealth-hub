import { Link } from 'react-router-dom';
import { Building2, FileCheck2, FolderLock, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PilotReadiness from './PilotReadiness';
import { intakeAvailability } from './intake-policy';

export default function ClinicIntake({ clinicId, clinicName, clinicRole, signedIn = false }: { clinicId?: string; clinicName?: string; clinicRole?: string; signedIn?: boolean }) {
  const availability = intakeAvailability();
  return <div className="space-y-8">
    <section aria-label="Clinic intake status" className="border-y py-6">
      <Badge variant="outline" className="mb-3">Preparation only · Patient files blocked</Badge>
      <h2 className="text-xl font-semibold">Clinic intake</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">Register your clinic for the fictional-case workspace. Agreement review and real CME file intake remain unavailable pending attorney approval, confirmed vendor coverage and independently verified healthcare safeguards.</p>
    </section>
    <section aria-label="Clinic registration" className="flex gap-4">
      <Building2 className="mt-1 h-6 w-6 shrink-0 text-mansagold" />
      <div className="min-w-0 flex-1"><h3 className="text-lg font-semibold">1 · Clinic registration</h3>
        <p className="mt-2 text-sm text-muted-foreground">{clinicId ? clinicName : signedIn ? 'Your account is signed in. Set up your sample clinic to continue.' : 'Create an account or sign in, then register your sample clinic.'}</p>
        <Badge variant="outline" className="mt-3">{clinicId ? 'Sample clinic registered · Not approved for patient data' : 'Registration required'}</Badge>
        <p className="mt-3 text-sm text-muted-foreground">Use clinic information only. Do not include patient names, identifying case details or medical information.</p>
        <Button variant="outline" asChild className="mt-4"><Link to="/health/app">{clinicId ? 'Open clinic workspace' : signedIn ? 'Set up sample clinic' : 'Sign in / Create clinic account'}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </div>
    </section>
    <section aria-label="Signed BAA upload" className="flex gap-4 border-t pt-6">
      <FileCheck2 className="mt-1 h-6 w-6 shrink-0 text-mansagold" />
      <div className="min-w-0 flex-1"><h3 className="text-lg font-semibold">2 · Signed clinic agreement</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A Business Associate Agreement (BAA) must be attorney-approved and signed by authorized parties. No approved agreement or approved agreement-upload service is available here yet.</p>
        <Button disabled={!availability.agreementUpload} className="mt-4"><Lock className="mr-2 h-4 w-4" />Signed BAA upload locked</Button>
        <Button variant="ghost" asChild className="mt-4 sm:ml-3"><Link to="/health/baa">View agreement requirements<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        <p className="mt-3 text-xs text-muted-foreground">Do not email or send agreements through support. A signed clinic BAA alone cannot activate patient-file access.</p>
      </div>
    </section>
    <section aria-label="CME file portal" className="flex gap-4 border-t pt-6">
      <FolderLock className="mt-1 h-6 w-6 shrink-0 text-mansagold" />
      <div className="min-w-0 flex-1"><h3 className="text-lg font-semibold">3 · CME case files</h3>
        <Badge variant="outline" className="mt-3">Portal not activated · No approved clinics for real records</Badge>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Real case files can be accepted only in a dedicated, independently approved healthcare environment. This workspace cannot receive, preview, store or process those files.</p>
        <Button disabled={!availability.cmeUpload} className="mt-4"><Lock className="mr-2 h-4 w-4" />CME file upload locked</Button>
        <p className="mt-3 text-xs text-muted-foreground">Clinic registration, checklist reports and signatures never unlock this portal. Patient calls remain blocked.</p>
      </div>
    </section>
    {clinicId && clinicRole && <PilotReadiness clinicId={clinicId} clinicRole={clinicRole} />}
    <section className="border-t pt-6"><h3 className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-5 w-5 text-mansagold" />After independent clearance</h3>
      <ol className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3"><li><b className="block text-foreground">Authorized intake</b>Clinic access and permitted record use verified.</li><li><b className="block text-foreground">Source-linked draft</b>Kayla organizes timelines and flags missing or conflicting records.</li><li><b className="block text-foreground">Doctor review</b>A licensed doctor checks sources and makes the final conclusions.</li></ol>
      <p className="mt-4 text-xs text-muted-foreground">Planned real-record workflow, not currently available. Kayla is an AI assistant—not a doctorate holder or licensed clinician.</p>
    </section>
  </div>;
}