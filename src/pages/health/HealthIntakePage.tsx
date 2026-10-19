import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { db } from './workspace/hc';
import ClinicIntake from './workspace/ClinicIntake';

export default function HealthIntakePage() {
  const { user, loading } = useAuth();
  const [membership, setMembership] = useState<{ clinicId: string; clinicName: string; role: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setMembership(null);
    setFailed(false);
    if (!user) return;
    setPending(true);
    db.from('hc_members').select('role, hc_clinics(id, name)').eq('user_id', user.id).order('created_at').limit(1).maybeSingle()
      .then(({ data, error }: { data: { role: string; hc_clinics: { id: string; name: string } } | null; error: unknown }) => {
        if (!active) return;
        setFailed(Boolean(error));
        if (!error && data?.hc_clinics) setMembership({ clinicId: data.hc_clinics.id, clinicName: data.hc_clinics.name, role: data.role });
        setPending(false);
      }).catch(() => { if (active) { setFailed(true); setPending(false); } });
    return () => { active = false; };
  }, [user]);
  return <div className="theme-clinical dark min-h-screen bg-background text-foreground">
    <Helmet><title>Clinic Intake | 1325 Clinical EMR / EHR</title><meta name="description" content="1325 Clinical EMR / EHR clinic registration and intake preparation. Signed agreement uploads and real patient file intake remain locked pending independently verified healthcare clearance." /><meta name="robots" content="noindex" /></Helmet>
    <div className="flex items-center justify-center gap-2 bg-mansagold px-4 py-2 text-center text-xs font-semibold text-mansablue"><Lock className="h-3.5 w-3.5 shrink-0" />PATIENT DATA BLOCKED · Clinic preparation only</div>
    <header className="theme-clinical-bar border-b-2 border-mansagold px-4 py-4 sm:px-8"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3"><Link to="/health" className="flex items-center gap-3 font-semibold"><img src={logo1325} alt="1325.AI" className="h-9 w-9 object-contain" />1325 Clinical EMR / EHR</Link><Button variant="ghost" size="sm" asChild><Link to="/health/app"><ArrowLeft className="mr-2 h-4 w-4" />Clinic workspace</Link></Button></div></header>
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8"><h1 className="mb-6 text-3xl font-semibold">Clinic registration & record intake</h1>
      {loading || (user && pending) ? <p role="status" className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Checking clinic access…</p> : failed ? <div role="alert"><p>Clinic access could not be checked. Patient uploads remain locked.</p><Button variant="outline" asChild className="mt-4"><Link to="/health/app">Return to clinic workspace</Link></Button></div> : <ClinicIntake clinicId={membership?.clinicId} clinicName={membership?.clinicName} clinicRole={membership?.role} signedIn={Boolean(user)} />}
    </main>
  </div>;
}