import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSampleClinic } from './clinic-registration';

export function ClinicSignIn() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const response = mode === 'in'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/health/app` } });
      if (response.error) throw new Error(response.error.message);
      if (mode === 'up' && !response.data.session) { setConfirmation(true); setPassword(''); }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not complete sign-in. Please try again.'); }
    finally { setBusy(false); }
  };
  return <div className="flex min-h-[70vh] items-center justify-center p-6"><Card className="w-full max-w-sm">
    <CardHeader><CardTitle>{confirmation ? 'Confirm your email' : mode === 'in' ? 'Sign in to 1325 Clinical' : 'Create your clinic account'}</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      {confirmation ? <div role="status" className="space-y-4"><Mail className="h-6 w-6 text-mansagold" /><p className="text-sm text-muted-foreground">Check your email for a confirmation link. After confirming, sign in to register your sample clinic. No clinic has been created yet.</p><Button variant="outline" className="w-full" onClick={() => { setConfirmation(false); setMode('in'); }}>Return to sign in</Button></div> : <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="clinical-email">Email</Label><Input id="clinical-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} /></div>
        <div className="space-y-2"><Label htmlFor="clinical-password">Password</Label><Input id="clinical-password" type="password" autoComplete={mode === 'up' ? 'new-password' : 'current-password'} required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark">{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{mode === 'in' ? 'Sign in' : 'Create account'}</Button>
        <Button type="button" variant="ghost" disabled={busy} className="h-auto w-full whitespace-normal text-sm" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setError(''); }}>{mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}</Button>
      </form>}
      <Link to="/health" className="block text-center text-xs text-muted-foreground underline">Take the guided tour instead</Link>
    </CardContent>
  </Card></div>;
}

export function CreateSampleClinic({ onDone }: { onDone: (clinicId: string) => Promise<void> }) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const clinicId = savedId ?? await registerSampleClinic(name, specialty);
      setSavedId(clinicId);
      await onDone(clinicId);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save your clinic. Please try again.'); }
    finally { setBusy(false); }
  };
  return <div className="flex min-h-[70vh] items-center justify-center p-6"><Card className="w-full max-w-md">
    <CardHeader><CardTitle>{savedId ? 'Your clinic was saved' : 'Set up your sample clinic'}</CardTitle></CardHeader>
    <CardContent><form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-muted-foreground">Register clinic information only. Your workspace includes fictional patients; agreement signing and real patient uploads remain locked.</p>
      <div className="space-y-2"><Label htmlFor="clinical-name">Clinic name</Label><Input id="clinical-name" required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} disabled={busy || Boolean(savedId)} /></div>
      <div className="space-y-2"><Label htmlFor="clinical-specialty">Specialty (optional)</Label><Input id="clinical-specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} disabled={busy || Boolean(savedId)} /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy || name.trim().length < 2} className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark">{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{busy ? 'Opening clinic…' : savedId ? 'Retry opening saved clinic' : 'Create clinic & open workspace'}</Button>
    </form></CardContent>
  </Card></div>;
}