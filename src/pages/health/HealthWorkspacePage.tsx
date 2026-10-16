import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BrainCircuit, Calendar, ClipboardCheck, HeartPulse, LayoutDashboard, Lock, LogOut, Receipt, Users, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { db, Row } from './workspace/hc';
import { Billing, Dashboard, Patients, PriorAuth, RecordReview, Schedule, Team } from './workspace/Screens';

const NAV = [
  { k: 'dashboard', l: 'Dashboard', i: LayoutDashboard },
  { k: 'patients', l: 'Patients', i: Users },
  { k: 'schedule', l: 'Schedule', i: Calendar },
  { k: 'review', l: 'Kayla Record Review', i: BrainCircuit },
  { k: 'auth', l: 'Prior Authorization', i: ClipboardCheck },
  { k: 'billing', l: 'Billing & Claims', i: Receipt },
  { k: 'team', l: 'Team', i: UserCog },
];

const Banner = () => (
  <div className="flex items-center justify-center gap-2 bg-mansagold px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-mansablue">
    <Lock className="h-3.5 w-3.5" /> SAMPLE DATA ONLY · Do not enter real patient information · Not yet approved for real patient records
  </div>
);
const Brand = () => (
  <div className="flex items-center gap-2 font-semibold text-mansagold"><img src={logo1325} alt="1325.AI logo" className="h-8 w-8 rounded-md object-contain" /> 1325 Clinical <span className="hidden text-xs font-normal text-foreground/70 sm:inline">Enterprise Edition</span><span className="ml-3 hidden border-l border-mansagold/30 pl-3 text-xs font-normal text-foreground/80 lg:inline">Chief Medical Advisor: <span className="text-mansagold">Dr. John Atwater</span></span></div>
);

function SignIn() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    const r = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email, password: pw })
      : await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: `${window.location.origin}/health/app` } });
    setBusy(false);
    if (r.error) return toast.error(r.error.message);
    if (mode === 'up' && !r.data.session) toast.success('Check your email to confirm, then sign in.');
  };
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>{mode === 'in' ? 'Sign in to 1325 Clinical' : 'Create your clinic account'}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && go()} />
          <Button disabled={busy} onClick={go} className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark">{mode === 'in' ? 'Sign in' : 'Create account'}</Button>
          <button className="w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}</button>
          <Link to="/health" className="block text-center text-xs text-muted-foreground underline">Take the guided tour instead</Link>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateClinic({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState(''); const [spec, setSpec] = useState(''); const [busy, setBusy] = useState(false);
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Set up your sample clinic</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">We'll fill it with three made-up patients, visits, claims and authorizations so you can try everything right away.</p>
          <Input placeholder="Clinic name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Specialty (optional)" value={spec} onChange={(e) => setSpec(e.target.value)} />
          <Button disabled={busy} className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={async () => {
            setBusy(true);
            const { error } = await db.rpc('hc_create_clinic', { _name: name, _specialty: spec || null });
            setBusy(false);
            if (error) return toast.error(error.message);
            onDone();
          }}>Create clinic</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HealthWorkspacePage() {
  const { user, loading } = useAuth();
  const [clinic, setClinic] = useState<Row | null | undefined>(undefined);
  const [role, setRole] = useState('');
  const [patients, setPatients] = useState<Row[]>([]);
  const [tab, setTab] = useState('dashboard');

  const loadClinic = useCallback(async () => {
    if (!user) return;
    const { data } = await db.from('hc_members').select('role, hc_clinics(*)').eq('user_id', user.id).order('created_at').limit(1).maybeSingle();
    setRole(data?.role ?? ''); setClinic(data?.hc_clinics ?? null);
  }, [user]);
  const loadPatients = useCallback(async () => {
    if (!clinic) return;
    const { data } = await db.from('hc_patients').select('*').eq('clinic_id', clinic.id).order('last_name');
    setPatients(data ?? []);
  }, [clinic]);
  useEffect(() => { loadClinic(); }, [loadClinic]);
  useEffect(() => { loadPatients(); }, [loadPatients]);

  const shellHeader = (
    <header className="flex h-14 items-center justify-between border-b-2 border-mansagold theme-clinical-bar px-4 text-foreground shadow-lg">
      <Brand />
      {user && <div className="flex items-center gap-3 text-sm"><span className="hidden text-foreground/80 md:inline">{clinic?.name}</span>
        <Button size="sm" variant="ghost" className="text-foreground hover:bg-foreground/10" onClick={() => supabase.auth.signOut()}><LogOut className="h-4 w-4" /></Button></div>}
    </header>
  );

  const props = { clinicId: clinic?.id, patients, reloadPatients: loadPatients, isOwner: role === 'owner' };
  const current = NAV.find((n) => n.k === tab)!;
  return (
    <div className="theme-clinical dark min-h-screen">
      <Helmet><title>1325 Clinical Workspace | health.1325.ai</title><meta name="robots" content="noindex" /></Helmet>
      <Banner />
      {shellHeader}
      {loading ? null : !user ? <SignIn /> : clinic === undefined ? null : !clinic ? <CreateClinic onDone={loadClinic} /> : (
        <div className="flex">
          <aside className="hidden w-60 shrink-0 border-r bg-card/80 p-3 md:block">
            {NAV.map((n) => (
              <button key={n.k} onClick={() => setTab(n.k)} className={`mb-1 flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition ${tab === n.k ? 'border-mansagold bg-mansagold/10 font-medium text-mansagold' : 'border-transparent text-muted-foreground hover:bg-muted'}`}>
                <n.i className="h-4 w-4" /> {n.l}
              </button>
            ))}
            <div className="mt-6 rounded-lg border border-mansagold/40 bg-mansagold/5 p-3 text-xs text-muted-foreground"><b className="text-foreground">Kayla Clinical AI</b><br />Organizes records. Doctors make every medical decision.</div>
          </aside>
          <main className="min-w-0 flex-1 p-4 md:p-8">
            <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
              {NAV.map((n) => <Button key={n.k} size="sm" variant={tab === n.k ? 'default' : 'outline'} onClick={() => setTab(n.k)}>{n.l}</Button>)}
            </div>
            <p className="text-xs text-muted-foreground">health.1325.ai · {clinic.name}</p>
            <h1 className="mb-6 text-2xl font-semibold">{current.l}</h1>
            {tab === 'dashboard' && <Dashboard {...props} go={setTab} />}
            {tab === 'patients' && <Patients {...props} />}
            {tab === 'schedule' && <Schedule {...props} />}
            {tab === 'review' && <RecordReview {...props} />}
            {tab === 'auth' && <PriorAuth {...props} />}
            {tab === 'billing' && <Billing {...props} />}
            {tab === 'team' && <Team {...props} />}
          </main>
        </div>
      )}
    </div>
  );
}
