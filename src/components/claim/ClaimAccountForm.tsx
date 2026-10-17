import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { savePendingClaim } from '@/components/auth/PendingClaimRedirect';
import { PasswordStrengthIndicator } from '@/components/auth/forms/PasswordStrengthIndicator';
import { passwordProblems } from '@/lib/auth-redirect';

/** Inline sign-up / sign-in so invited owners never leave the claim page. */
const ClaimAccountForm: React.FC<{ returnUrl: string }> = ({ returnUrl }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const problems = mode === 'signup' ? passwordProblems(password) : [];
    if (problems.length) { setError(`Your password needs ${problems.join(', ')}.`); return; }
    setBusy(true);
    savePendingClaim(returnUrl);
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}${returnUrl}`, data: { user_type: 'business' } },
        });
        if (err) throw err;
        if (!data.session) setCheckEmail(true);
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
      }
    } catch (err: any) {
      const msg = String(err?.message || 'Something went wrong');
      setError(/already registered|already exists/i.test(msg) ? 'You already have an account — sign in below.' : msg);
      if (/already registered|already exists/i.test(msg)) setMode('signin');
    } finally {
      setBusy(false);
    }
  };

  if (checkEmail) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center space-y-2">
        <p className="text-emerald-300 font-medium">Almost done — check your email</p>
        <p className="text-sm text-slate-300">
          We sent a confirmation link to <strong>{email}</strong>. Tap it and you'll come right back here to finish claiming.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="text-sm text-slate-300 text-center">
        {mode === 'signup'
          ? 'Use the email address this invitation was sent to and your listing is yours instantly.'
          : 'Sign in to claim this listing.'}
      </p>
      <div className="space-y-1">
        <Label htmlFor="claim-email" className="text-slate-300">Email</Label>
        <Input id="claim-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="claim-password" className="text-slate-300">{mode === 'signup' ? 'Choose a password' : 'Password'}</Label>
        <Input id="claim-password" type="password" required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        {mode === 'signup' && <PasswordStrengthIndicator password={password} />}
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full h-12 bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'signup' ? 'Create Account & Claim' : 'Sign In & Claim'}
      </Button>
      <button type="button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); }}
        className="w-full text-sm text-mansagold underline underline-offset-4">
        {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create a free account'}
      </button>
    </form>
  );
};

export default ClaimAccountForm;
