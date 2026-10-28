import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { EMPTY_VERIFICATION, verifyClinicalFacilities, type ClinicalVerification } from './clinical-verification';

export default function ClinicalFacilityVerification() {
  const [result, setResult] = useState<ClinicalVerification>(EMPTY_VERIFICATION);
  const [checking, setChecking] = useState(true);
  const version = useRef(0);
  const refresh = useCallback(async () => {
    const current = ++version.current;
    setChecking(true);
    setResult(EMPTY_VERIFICATION);
    try {
      const next = await verifyClinicalFacilities();
      if (version.current === current) setResult(next);
    } catch {
      if (version.current === current) setResult({ ...EMPTY_VERIFICATION, status: 'failed' });
    } finally {
      if (version.current === current) setChecking(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      ++version.current;
      setResult(EMPTY_VERIFICATION);
      setChecking(true);
      // Defer Auth calls until Supabase's auth event callback has returned.
      queueMicrotask(() => { void refresh(); });
    });
    const interval = window.setInterval(() => { void refresh(); }, 30000);
    const onFocus = () => { void refresh(); };
    window.addEventListener('focus', onFocus);
    return () => { ++version.current; subscription.unsubscribe(); window.clearInterval(interval); window.removeEventListener('focus', onFocus); };
  }, [refresh]);
  const status = checking ? 'Checking Clinical sign-in and facility permission…'
    : result.status === 'verified' ? 'Clinical sign-in and facility permission verified'
    : result.status === 'no-access' ? 'Signed in · no facility access confirmed under the current preview approval'
    : result.status === 'failed' ? 'Verification failed · facility permissions unknown'
    : 'Clinical sign-in required · facility permissions not verified';
  return <section aria-label="Clinical facility sign-in verification" className="space-y-3 border-y border-border py-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h4 className="font-semibold">1325 Clinical facility access</h4><Button variant="outline" size="sm" disabled={checking} onClick={() => { void refresh(); }}><RefreshCw className="mr-2 h-4 w-4" />Recheck Clinical sign-in</Button></div>
    <p role="status" className="text-sm">{status}</p>
    {result.checkedAt && <p className="text-xs text-muted-foreground">Last permission check: <time dateTime={result.checkedAt}>{new Date(result.checkedAt).toUTCString()}</time></p>}
    {result.clinics.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><caption className="sr-only">Current viewer's server-verified Clinical facility memberships, separate from fictional export examples</caption><thead><tr>{['Clinical facility', 'Permission', 'Facility export status', 'Kenya exchange'].map(label => <th key={label} className="px-3 py-2 font-medium">{label}</th>)}</tr></thead><tbody>{result.clinics.map(clinic => <tr key={clinic.id} className="border-t border-border"><th scope="row" className="px-3 py-3 font-medium break-words">{clinic.name}</th><td className="px-3 py-3">Verified member · {clinic.role}</td><td className="px-3 py-3"><span className="flex items-center gap-2"><Lock className="h-4 w-4 shrink-0" />No facility packet · export unavailable</span></td><td className="px-3 py-3">Not verified · not connected</td></tr>)}</tbody></table></div>}
    <p className="text-xs text-muted-foreground">Clinical membership is not Kenya facility registration or national exchange authorization. No real facility packet is created or downloaded. Fictional packet validation below is separate.</p>
  </section>;
}