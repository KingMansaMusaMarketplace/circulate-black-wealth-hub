import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Loader2, Mail } from 'lucide-react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { readPreviewPass, signinCodeMessage } from '../preview-credentials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSampleClinic } from './clinic-registration';
import { useApprovedViewer } from '../ApprovedViewer';

/** Shown when the signed-in clinic account is not the email the current viewing was approved for. */
export function SwitchClinicAccount({ signedInEmail, approvedEmail }: { signedInEmail: string; approvedEmail: string }) {
  const [busy, setBusy] = useState(false);
  return <div className="flex min-h-[70vh] items-center justify-center p-6"><Card className="w-full max-w-md">
    <CardHeader><CardTitle>Switch to your approved email</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">You're signed in as <strong className="text-foreground">{signedInEmail}</strong>, but this viewing is approved for <strong className="text-foreground">{approvedEmail}</strong>.</p>
      <p className="text-sm text-muted-foreground">Click below, then sign in with <strong className="text-foreground">{approvedEmail}</strong>. Your viewing stays open.</p>
      <Button disabled={busy} className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={async () => { setBusy(true); try { await supabase.auth.signOut(); } finally { setBusy(false); } }}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign out and switch to {approvedEmail}</Button>
    </CardContent>
  </Card></div>;
}

/** Password-free sign-in for approved guests: a 6-digit code goes only to the email of their current approved viewing. */
function EmailCodeSignIn({ approvedEmail }: { approvedEmail: string }) {
  const [stage, setStage] = useState<'idle' | 'sent'>('idle');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const call = async (body: Record<string, unknown>) => {
    const pass = readPreviewPass();
    if (!pass) throw new Error(signinCodeMessage('not_approved'));
    const { data, error: failure } = await supabase.functions.invoke('health-access', { body: { ...body, ...pass } });
    let result = data as Record<string, unknown> | null;
    if (failure instanceof FunctionsHttpError) { try { result = await failure.context.json(); } catch { result = null; } }
    else if (failure) throw new Error(signinCodeMessage('unavailable'));
    if (!result?.ok) throw new Error(signinCodeMessage(result?.reason, result?.tries_left));
    return result;
  };
  const send = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try { await call({ action: 'code_send' }); setStage('sent'); setCode(''); }
    catch (e) { setError(e instanceof Error ? e.message : signinCodeMessage(null)); }
    finally { setBusy(false); }
  };
  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !/^[0-9]{6}$/.test(code)) return;
    setBusy(true); setError('');
    try {
      const result = await call({ action: 'code_verify', code });
      const { error: otpError } = await supabase.auth.verifyOtp({ token_hash: String(result.token_hash), type: 'magiclink' });
      if (otpError) throw new Error('The code was accepted but sign-in did not finish. Send yourself a new code.');
    } catch (e) { setError(e instanceof Error ? e.message : signinCodeMessage(null)); }
    finally { setBusy(false); }
  };
  return <div className="space-y-3 rounded-md border border-mansagold/40 p-3">
    {stage === 'idle' ? <>
      <p className="text-sm text-muted-foreground">No password? We'll email a 6-digit code to <strong className="text-foreground">{approvedEmail}</strong>.</p>
      <Button type="button" disabled={busy} className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={send}>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}Email me a sign-in code</Button>
    </> : <form onSubmit={verify} className="space-y-3">
      <p role="status" className="text-sm text-foreground">We sent a code to <strong>{approvedEmail}</strong>. Check your inbox (and Spam or Junk). It expires in 10 minutes.</p>
      <div className="space-y-2"><Label htmlFor="clinical-code">6-digit code</Label><Input id="clinical-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} disabled={busy} className="text-center text-lg tracking-[0.4em]" /></div>
      <Button type="submit" disabled={busy || code.length !== 6} className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark">{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign in with code</Button>
      <Button type="button" variant="link" disabled={busy} className="h-auto p-0 text-sm text-mansagold" onClick={send}>Send a new code</Button>
    </form>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}

export function ClinicSignIn() {
  const approved = useApprovedViewer();
  const canUseCode = Boolean(approved?.email) && Boolean(readPreviewPass());
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState(approved?.email ?? '');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [resetSentTo, setResetSentTo] = useState('');
  const sendReset = async () => {
    const target = email.trim();
    if (busy) return;
    if (!target) { setError('Type your email above first, then click "Forgot password?".'); return; }
    setBusy(true); setError('');
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(target, { redirectTo: `${window.location.origin}/reset-password` });
      if (resetError) throw new Error(resetError.message);
      setResetSentTo(target); setPassword('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not send the reset email. Please try again.'); }
    finally { setBusy(false); }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const response = mode === 'in'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/health/app` } });
      if (response.error) {
        if (mode === 'in' && /invalid login credentials/i.test(response.error.message)) throw new Error('That password doesn\'t match this email. Click "Forgot password?" below to set a new one.');
        throw new Error(response.error.message);
      }
      if (mode === 'up' && !response.data.session) { setConfirmation(true); setPassword(''); }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not complete sign-in. Please try again.'); }
    finally { setBusy(false); }
  };
  return <div className="flex min-h-[70vh] items-center justify-center p-6"><Card className="w-full max-w-sm">
    <CardHeader><CardTitle>{confirmation ? 'Confirm your email' : mode === 'in' ? 'Sign in to 1325 Clinical EMR / EHR' : 'Create your clinic account'}</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      {approved?.email && !confirmation && <p role="note" className="rounded-md border border-mansagold/40 bg-mansagold/10 p-3 text-sm text-foreground">Your viewing is approved for <strong>{approved.email}</strong>. Sign in with that same email.</p>}
      {canUseCode && approved?.email && !confirmation && mode === 'in' && <>
        <EmailCodeSignIn approvedEmail={approved.email} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or use your password<span className="h-px flex-1 bg-border" /></div>
      </>}
      {confirmation ? <div role="status" className="space-y-4"><Mail className="h-6 w-6 text-mansagold" /><p className="text-sm text-muted-foreground">Check your email for a confirmation link. After confirming, sign in to register your sample clinic. No clinic has been created yet.</p><Button variant="outline" className="w-full" onClick={() => { setConfirmation(false); setMode('in'); }}>Return to sign in</Button></div> : <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="clinical-email">Email</Label><Input id="clinical-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} /></div>
        <div className="space-y-2"><Label htmlFor="clinical-password">Password</Label><Input id="clinical-password" type="password" autoComplete={mode === 'up' ? 'new-password' : 'current-password'} required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} /></div>
        {mode === 'in' && <Button type="button" variant="link" disabled={busy} className="h-auto p-0 text-sm text-mansagold" onClick={sendReset}>Forgot password?</Button>}
        {resetSentTo && <p role="status" className="rounded-md border border-mansagold/40 bg-mansagold/10 p-3 text-sm text-foreground">We sent a password reset link to <strong>{resetSentTo}</strong>. Check your inbox (and Spam or Junk), choose a new password, then come back here and sign in.</p>}
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