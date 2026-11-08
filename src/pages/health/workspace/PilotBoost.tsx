import React, { useCallback, useEffect, useState } from 'react';
import FHIR from 'fhirclient';
import { AlertTriangle, PlugZap, Rocket, Unplug } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BOOST_CLIENT_ID, BOOST_NOTICE, BOOST_SANDBOX_ISS, BOOST_SCOPE, activeConditions, activeMedicines, allergyNames, boostInsights, boostRedirectUri,
  isSandboxServer, latestCreatinine, patientSummary, type BoostInsights,
} from '@/lib/clinical/boost-smart';
import { EGFR_NOTE } from '@/lib/clinical/fairness';
import { RX_CHECKER_NOTICE } from '@/lib/clinical/prescriptions';

type Chart = { name: string; birthDate: string | null; gender: string | null; conditions: string[]; medicines: string[]; allergies: string[]; creatinine: ReturnType<typeof latestCreatinine>; insights: BoostInsights };

const gold = 'bg-mansagold text-mansablue hover:bg-mansagold-dark';
const isCallback = () => { const p = new URLSearchParams(window.location.search); return p.has('code') && p.has('state'); };
const hasSession = () => { try { return !!sessionStorage.getItem('SMART_KEY'); } catch { return false; } };

/** Forget the sandbox sign-in kept in this browser tab. */
function clearSmartSession() {
  try {
    const key = sessionStorage.getItem('SMART_KEY');
    if (key) sessionStorage.removeItem(JSON.parse(key));
    sessionStorage.removeItem('SMART_KEY');
  } catch { /* nothing stored */ }
}

export default function PilotBoost() {
  const [chart, setChart] = useState<Chart | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const loadChart = useCallback(async () => {
    setStatus('loading'); setError('');
    try {
      const client = await FHIR.oauth2.ready();
      if (!isSandboxServer(client.state.serverUrl)) { clearSmartSession(); throw new Error('Only the public test sandbox is allowed in the pilot.'); }
      const patient = await client.patient.read();
      const id = client.patient.id;
      const get = async (q: string) => { try { return (await client.request(q, { flat: true, pageLimit: 1 })) as Record<string, unknown>[]; } catch { return []; } };
      const [cond, meds, alg, cr] = await Promise.all([
        get(`Condition?patient=${id}&_count=100`), get(`MedicationRequest?patient=${id}&_count=100`),
        get(`AllergyIntolerance?patient=${id}&_count=50`), get(`Observation?patient=${id}&code=http://loinc.org|2160-0&_sort=-date&_count=5`),
      ]);
      const s = patientSummary(patient);
      const conditions = [...new Set(activeConditions(cond))];
      const medicines = activeMedicines(meds);
      const allergies = [...new Set(allergyNames(alg))];
      const creatinine = latestCreatinine(cr);
      setChart({ ...s, conditions, medicines, allergies, creatinine, insights: boostInsights({ birthDate: s.birthDate, gender: s.gender, medicines, allergies, creatinine }) });
      setStatus('idle');
    } catch (e) {
      setStatus('error'); setError(e instanceof Error ? e.message : 'The test chart could not be opened. Connect again.');
    }
  }, []);

  useEffect(() => { if (isCallback() || hasSession()) void loadChart(); }, [loadChart]);

  const connect = () => {
    setStatus('connecting');
    clearSmartSession();
    void FHIR.oauth2.authorize({ iss: BOOST_SANDBOX_ISS, clientId: BOOST_CLIENT_ID, scope: BOOST_SCOPE, redirectUri: boostRedirectUri(window.location.origin), pkceMode: 'ifSupported' });
  };
  const disconnect = () => { clearSmartSession(); setChart(null); setStatus('idle'); };

  return (
    <div className="space-y-4">
      <p role="note" className="flex gap-2 rounded-md border border-mansagold/40 bg-mansagold/10 p-3 text-xs text-muted-foreground"><AlertTriangle className="h-4 w-4 shrink-0 text-mansagold" />{BOOST_NOTICE}</p>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Rocket className="h-4 w-4 text-mansagold" />BOOST — keep your current EHR, add 1325 on top</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">This uses <b className="text-foreground">SMART on FHIR</b>, the standard “app launch” that Epic, Oracle Health (Cerner), athenahealth and other EHRs support. Click connect, pick a made-up patient and a made-up doctor on the sandbox screen, and you come back here with that patient’s chart plus 1325’s add-ons.</p>
          <div className="flex flex-wrap gap-2">
            {!chart ? <Button className={gold} disabled={status === 'connecting' || status === 'loading'} onClick={connect}><PlugZap className="mr-1 h-4 w-4" />{status === 'connecting' ? 'Opening the sandbox…' : status === 'loading' ? 'Reading the test chart…' : 'Connect to test EHR sandbox'}</Button>
              : <><Button variant="outline" onClick={connect}><PlugZap className="mr-1 h-4 w-4" />Pick another test patient</Button><Button variant="ghost" onClick={disconnect}><Unplug className="mr-1 h-4 w-4" />Disconnect</Button></>}
          </div>
          {error && <p role="alert" className="text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">Next step for Epic: register this app (free) at fhir.epic.com to get an Epic client ID. The same connection then works with Epic’s test sandbox. Real hospitals also need their own approval before go-live.</p>
        </CardContent>
      </Card>

      {chart && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="flex flex-wrap items-center gap-2 text-lg">{chart.name}<Badge variant="outline">Sandbox test patient</Badge></CardTitle>
              <p className="text-sm text-muted-foreground">Born {chart.birthDate ?? 'unknown'} · {chart.gender ?? 'sex not recorded'} · read from the outside EHR, nothing saved in 1325</p></CardHeader>
          </Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-base">From the outside EHR</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><b>Problems</b><p className="text-muted-foreground">{chart.conditions.length ? chart.conditions.slice(0, 15).join(', ') : 'None listed'}</p></div>
              <div><b>Active medicines</b><p className="text-muted-foreground">{chart.medicines.length ? chart.medicines.slice(0, 20).join(', ') : 'None listed'}</p></div>
              <div><b>Allergies</b><p className="text-muted-foreground">{chart.allergies.length ? chart.allergies.join(', ') : 'None listed'}</p></div>
              <div><b>Latest creatinine</b><p className="text-muted-foreground">{chart.creatinine ? `${chart.creatinine.value} ${chart.creatinine.unit} on ${chart.creatinine.date}` : 'None found'}</p></div>
            </CardContent></Card>
          <Card className="border-mansagold/40"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Rocket className="h-4 w-4 text-mansagold" />1325 BOOST add-ons</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div><b>Kidney function (race-free eGFR)</b>
                {chart.insights.egfr.ok ? <p className="text-lg font-semibold">{chart.insights.egfr.egfr} <span className="text-sm font-normal text-muted-foreground">mL/min/1.73m² · {chart.insights.egfr.stage}</span></p>
                  : <p className="text-muted-foreground">{chart.insights.egfr.reason}{chart.insights.egfr.both ? ` Female ${chart.insights.egfr.both.female}, male ${chart.insights.egfr.both.male}.` : ''}</p>}
                <p className="text-xs text-muted-foreground">{EGFR_NOTE}</p></div>
              <div><b>Medicine & allergy check</b>
                {chart.insights.medicineWarnings.length ? <ul className="mt-1 list-disc space-y-1 pl-5 text-destructive">{chart.insights.medicineWarnings.map((w) => <li key={w}>{w}</li>)}</ul>
                  : <p className="text-muted-foreground">No warnings from the starter check.</p>}
                <p className="text-xs text-muted-foreground">{RX_CHECKER_NOTICE}</p></div>
              <div><b>Social needs</b><p className="text-muted-foreground">Most EHRs don’t screen for housing, food, transport, utilities or safety. In 1325 the front desk records it in two minutes (Social needs tab on a pilot chart).</p></div>
            </CardContent></Card>
        </div>
      )}
    </div>
  );
}
