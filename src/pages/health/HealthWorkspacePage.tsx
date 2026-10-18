import React, { useCallback, useEffect, useRef, useState } from 'react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { BrainCircuit, Calendar, ClipboardCheck, LayoutDashboard, Lock, LogOut, NotebookPen, Receipt, Users, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { db, Row } from './workspace/hc';
import { Dashboard, Patients, PriorAuth, Schedule, Team } from './workspace/Screens';
import RecordReview from './workspace/RecordReview';
import VisitNotes from './workspace/VisitNotes';
import ClinicIntake from './workspace/ClinicIntake';
import ChartPrep from './workspace/ChartPrep';
import MedicalChronology from './workspace/MedicalChronology';
import CareGuide from './workspace/CareGuide';
import DocumentationCheck from './workspace/DocumentationCheck';
import { ClinicSignIn, CreateSampleClinic } from './workspace/ClinicAccountForms';
import { EndPrivateSessionButton } from './PrivateSession';
import ExecutiveWalkthrough from './ExecutiveWalkthrough';
import PracticeImpact from './workspace/PracticeImpact';
import SpecialtyExamples from './workspace/SpecialtyExamples';
import EnterpriseReadiness from './EnterpriseReadiness';
import ClinicalSafetyPanel from './ClinicalSafetyPanel';
import DoctorDay from './workspace/DoctorDay';
import SamplePatientChart from './workspace/SamplePatientChart';
import MedicationReview from './workspace/MedicationReview';
import ClinicalDataExplorer from './workspace/ClinicalDataExplorer';
import ConnectionPreparation from './workspace/ConnectionPreparation';
import PatientCommunication from './workspace/PatientCommunication';
import BillingPreparation from './workspace/BillingPreparation';
import EnterpriseReliability from './workspace/EnterpriseReliability';
import DoctorEvaluation from './workspace/DoctorEvaluation';
import ExecutiveQuality from './workspace/ExecutiveQuality';
import FacilitySelector from './FacilitySelector';
import { DEFAULT_FACILITY_CONTEXT, type FacilityContext } from './workspace/facility-context';

const NAV = [
  { k: 'doctor-day', l: 'Connected Doctor Day', i: Calendar },
  { k: 'sample-chart', l: 'Expanded Sample Chart', i: ClipboardCheck },
  { k: 'medication-review', l: 'Medication Review Assistance', i: ClipboardCheck },
  { k: 'data-explorer', l: 'Clinical Data Explorer', i: ClipboardCheck },
  { k: 'connections', l: 'Clinical Connections', i: ClipboardCheck },
  { k: 'portal', l: 'Patient Communication', i: Users },
  { k: 'intake', l: 'Clinic Intake', i: Lock },
  { k: 'dashboard', l: 'Dashboard', i: LayoutDashboard },
  { k: 'patients', l: 'Patients', i: Users },
  { k: 'schedule', l: 'Schedule', i: Calendar },
  { k: 'prep', l: 'Pre-Visit Chart Prep', i: ClipboardCheck },
  { k: 'chronology', l: 'Medical Chronology', i: Calendar },
  { k: 'review', l: 'CME Files & Review', i: BrainCircuit },
  { k: 'notes', l: 'AI Note-Taking', i: NotebookPen },
  { k: 'care', l: 'Care Guide', i: ClipboardCheck },
  { k: 'doccheck', l: 'Billing Documentation Check', i: Receipt },
  { k: 'auth', l: 'Prior Authorization', i: ClipboardCheck },
  { k: 'impact', l: 'Practice Impact', i: ClipboardCheck },
  { k: 'specialties', l: 'Specialty Examples', i: ClipboardCheck },
  { k: 'billing', l: 'Billing Preparation', i: Receipt },
  { k: 'reliability', l: 'Backup, Recovery & Migration', i: ClipboardCheck },
  { k: 'evaluation', l: 'Doctor Evaluation', i: ClipboardCheck },
  { k: 'quality', l: 'Executive Quality Overview', i: LayoutDashboard },
  { k: 'team', l: 'Team', i: UserCog },
];

const Banner = () => (
  <div className="flex items-center justify-center gap-2 bg-mansagold px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-mansablue">
    <Lock className="h-3.5 w-3.5" /> SAMPLE DATA ONLY · Do not enter real patient information · Not yet approved for real patient records
  </div>
);
const Brand = () => (
  <div className="flex items-center gap-2 font-semibold text-mansagold"><img src={logo1325} alt="1325.AI logo" className="h-8 w-8 rounded-md object-contain" /> 1325 Clinical <span className="hidden text-xs font-normal text-foreground/70 sm:inline">Enterprise Edition</span></div>
);

export default function HealthWorkspacePage() {
  const [facilityContext, setFacilityContext] = useState<FacilityContext>(DEFAULT_FACILITY_CONTEXT);
  const { user, loading, authInitialized } = useAuth();
  const [searchParams] = useSearchParams();
  const [clinic, setClinic] = useState<Row | null | undefined>(undefined);
  const [role, setRole] = useState('');
  const [patients, setPatients] = useState<Row[]>([]);
  const [tab, setTab] = useState('review');
  const tourReturnTab = useRef<string | null>(null);
  const [tourRevision, setTourRevision] = useState(0);
  const navigateTab = (next: string) => {
    tourReturnTab.current = null;
    setTourRevision((revision) => revision + 1);
    setTab(next);
  };
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'cme') setTab('review');
    else if (view === 'prep') setTab('prep');
    else if (view === 'chronology') setTab('chronology');
    else if (view === 'care') setTab('care');
    else if (view === 'doccheck') setTab('doccheck');
  }, [searchParams]);

  const [clinicError, setClinicError] = useState('');
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const userId = user?.id ?? null;
  const currentUser = useRef(userId);
  currentUser.current = userId;
  const requestVersion = useRef(0);

  const loadClinic = useCallback(async (preferredClinicId?: string) => {
    if (!userId) return;
    const version = ++requestVersion.current;
    setClinicError('');
    try {
      let query = db.from('hc_members').select('role, hc_clinics(*)').eq('user_id', userId);
      if (preferredClinicId) query = query.eq('clinic_id', preferredClinicId);
      const { data, error } = await query.order('created_at').limit(1).maybeSingle();
      if (currentUser.current !== userId || version !== requestVersion.current) return;
      if (error) throw new Error(error.message);
      if (preferredClinicId && !data?.hc_clinics) throw new Error('Your clinic was saved, but workspace access could not be confirmed. Retry opening it; do not create another clinic.');
      setRole(data?.role ?? ''); setClinic(data?.hc_clinics ?? null); setLoadedFor(userId);
    } catch (error) {
      if (currentUser.current !== userId || version !== requestVersion.current) return;
      setClinicError(error instanceof Error ? error.message : 'Clinic access could not be checked.');
      throw error;
    }
  }, [userId]);
  const loadPatients = useCallback(async () => {
    if (!clinic || loadedFor !== userId) return;
    const clinicId = clinic.id;
    const { data, error } = await db.from('hc_patients').select('*').eq('clinic_id', clinicId).order('last_name');
    if (currentUser.current !== userId) return;
    if (!error) setPatients(data ?? []);
  }, [clinic, loadedFor, userId]);
  useEffect(() => {
    ++requestVersion.current;
    setClinic(undefined); setRole(''); setPatients([]); setLoadedFor(null); setClinicError('');
    setFacilityContext(DEFAULT_FACILITY_CONTEXT);
    if (userId) void loadClinic().catch(() => {});
    return () => { ++requestVersion.current; };
  }, [userId, loadClinic]);
  useEffect(() => { void loadPatients(); }, [loadPatients]);

  const shellHeader = (
    <header className="flex min-h-14 flex-wrap items-center justify-between gap-2 py-2 border-b-2 border-mansagold theme-clinical-bar px-4 text-foreground shadow-lg">
      <Brand />
      <div className="flex flex-wrap gap-1"><EnterpriseReadiness /><ClinicalSafetyPanel /><Button variant="ghost" size="sm" asChild><Link to="/health/intake">Clinic intake</Link></Button><Button variant="ghost" size="sm" asChild><Link to="/health/baa">Clinic BAA</Link></Button></div>
      {user && <div className="flex items-center gap-3 text-sm"><span className="hidden text-foreground/80 md:inline">{loadedFor === userId ? clinic?.name : ''}</span>
        <Button size="sm" variant="ghost" className="text-foreground hover:bg-foreground/10" onClick={() => supabase.auth.signOut()}><LogOut className="h-4 w-4" /></Button></div>}
    </header>
  );

  const props = { clinicId: clinic?.id, patients, reloadPatients: loadPatients, isOwner: role === 'owner' };
  const current = NAV.find((n) => n.k === tab) ?? NAV[0];
  return (
    <div className="theme-clinical dark min-h-screen">
      <Helmet><title>1325 Clinical Workspace | health.1325.ai</title><meta name="robots" content="noindex" /></Helmet>
      <Banner />
      {shellHeader}
      {user && clinic && loadedFor === userId && <FacilitySelector value={facilityContext} onChange={setFacilityContext} clinicName={clinic.name} />}
      {loading || !authInitialized ? <p role="status" className="p-8 text-muted-foreground">Checking sign-in…</p> : !user ? <ClinicSignIn /> : clinicError && clinic === undefined ? <section role="alert" className="mx-auto max-w-lg space-y-4 p-8"><h1 className="text-xl font-semibold">Clinic access could not be checked</h1><p className="text-sm text-muted-foreground">{clinicError}</p><Button variant="outline" onClick={() => { void loadClinic().catch(() => {}); }}>Retry clinic access</Button></section> : loadedFor !== userId || clinic === undefined ? <p role="status" className="p-8 text-muted-foreground">Loading your clinic…</p> : !clinic ? <CreateSampleClinic key={user.id} onDone={loadClinic} /> : (
        <div className="flex">
           <aside className="hidden w-60 shrink-0 flex-col border-r bg-card/80 p-3 md:flex">
            {NAV.map((n) => (
              <Button variant="ghost" key={n.k} onClick={() => navigateTab(n.k)} className={`mb-1 flex h-auto w-full justify-start gap-3 whitespace-normal rounded-md border-l-2 px-3 py-2 text-left text-sm transition ${tab === n.k ? 'border-mansagold bg-mansagold/10 font-medium text-mansagold' : 'border-transparent text-muted-foreground hover:bg-muted'}`}>
                <n.i className="h-4 w-4" /> {n.l}
              </Button>
            ))}
            <div className="mt-6 rounded-lg border border-mansagold/40 bg-mansagold/5 p-3 text-xs text-muted-foreground"><b className="text-foreground">Kayla Clinical AI</b><br />Organizes records. Doctors make every medical decision.</div>
             <EndPrivateSessionButton className="mt-auto w-full justify-start border-t border-border pt-3" />
          </aside>
          <main className="min-w-0 flex-1 p-4 md:p-8">
            <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
              {NAV.map((n) => <Button key={n.k} size="sm" variant={tab === n.k ? 'default' : 'outline'} onClick={() => navigateTab(n.k)}>{n.l}</Button>)}
            </div>
            <p className="text-xs text-muted-foreground">health.1325.ai · {clinic.name}</p>
            <h1 className="mb-6 text-2xl font-semibold">{current.l}</h1>
            <ExecutiveWalkthrough key={`${user.id}:${clinic.id}:${tourRevision}`} onStep={(next) => { if (tourReturnTab.current === null) tourReturnTab.current = tab; setTab(next); }} onEnd={() => { if (tourReturnTab.current !== null) setTab(tourReturnTab.current); tourReturnTab.current = null; }} />
            {tab === 'dashboard' && <Dashboard {...props} go={navigateTab} />}
            {tab === 'doctor-day' && <DoctorDay key={`${user.id}:${clinic.id}`} clinicId={clinic.id} clinicRole={role} />}
            {tab === 'sample-chart' && <SamplePatientChart key={`${user.id}:${clinic.id}`} />}
            {tab === 'medication-review' && <MedicationReview key={`${user.id}:${clinic.id}`} />}
            {tab === 'data-explorer' && <ClinicalDataExplorer key={`${user.id}:${clinic.id}`} />}
            {tab === 'connections' && <ConnectionPreparation key={`${user.id}:${clinic.id}`} />}
            {tab === 'portal' && <PatientCommunication key={`${user.id}:${clinic.id}`} />}
            {tab === 'intake' && <ClinicIntake clinicId={clinic.id} clinicName={clinic.name} clinicRole={role} signedIn />}
            {tab === 'patients' && <Patients {...props} />}
            {tab === 'schedule' && <Schedule {...props} />}
            {tab === 'prep' && <ChartPrep key={`${user.id}:${clinic.id}`} />}
            {tab === 'chronology' && <MedicalChronology key={`${user.id}:${clinic.id}`} />}
            {tab === 'review' && <RecordReview clinicId={clinic.id} clinicRole={role} />}
            {tab === 'notes' && <VisitNotes clinicId={clinic.id} clinicRole={role} />}
            {tab === 'care' && <CareGuide key={`${user.id}:${clinic.id}`} />}
            {tab === 'doccheck' && <DocumentationCheck key={`${user.id}:${clinic.id}`} />}
            {tab === 'auth' && <PriorAuth {...props} />}
            {tab === 'impact' && <PracticeImpact key={`${user.id}:${clinic.id}`} />}
            {tab === 'specialties' && <SpecialtyExamples key={`${user.id}:${clinic.id}`} />}
            {tab === 'billing' && <BillingPreparation key={`${user.id}:${clinic.id}`} />}
            {tab === 'reliability' && <EnterpriseReliability key={`${user.id}:${clinic.id}`} />}
            {tab === 'evaluation' && <DoctorEvaluation key={`${user.id}:${clinic.id}`} />}
            {tab === 'quality' && <ExecutiveQuality key={`${user.id}:${clinic.id}:${facilityContext.facilityId}:${facilityContext.department}`} facilityContext={facilityContext} onNavigate={navigateTab} />}
            {tab === 'team' && <Team {...props} />}
          </main>
        </div>
      )}
    </div>
  );
}
