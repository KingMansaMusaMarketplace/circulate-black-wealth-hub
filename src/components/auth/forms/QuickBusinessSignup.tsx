import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MailCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { trackFunnelEvent } from '@/lib/analytics/funnel-tracker';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  businessName: z.string().trim().min(2, 'Please enter your business name').max(120),
});

interface Props {
  referralCode?: string;
  defaultBusinessName?: string;
  onUsePassword?: () => void;
}

/** Short business sign-up: three fields, one button, passwordless email sign-in link. */
const QuickBusinessSignup: React.FC<Props> = ({ referralCode = '', defaultBusinessName = '', onUsePassword }) => {
  const [values, setValues] = useState({ fullName: '', email: '', businessName: defaultBusinessName });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [failure, setFailure] = useState('');
  const [started, setStarted] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!started) { setStarted(true); trackFunnelEvent('business_signup_started', { ref: referralCode || null }); }
    setValues((v) => ({ ...v, [k]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailure('');
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const { fullName, email, businessName } = parsed.data;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/business/onboarding`,
        data: {
          user_type: 'business',
          full_name: fullName,
          business_name: businessName,
          referral_code: referralCode || null,
          profile_completion_percentage: 25,
        },
      },
    });
    setLoading(false);
    if (error) {
      setFailure(error.message.toLowerCase().includes('rate')
        ? 'Too many tries. Please wait a minute and try again.'
        : 'We could not send your sign-in link. Please try again.');
      return;
    }
    trackFunnelEvent('business_signup_link_sent', { ref: referralCode || null });
    setSentTo(email);
  };

  if (sentTo) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl border-2 border-mansagold/50 bg-card p-6 md:p-8 text-center shadow-2xl">
        <MailCheck className="w-12 h-12 text-mansagold mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
        <p className="text-muted-foreground">
          We sent a sign-in link to <strong className="text-foreground">{sentTo}</strong>. Tap it to finish setting up your free listing.
        </p>
        <button type="button" onClick={() => setSentTo('')} className="mt-4 text-sm text-mansagold underline">
          Wrong email? Start again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-xl mx-auto rounded-3xl border-2 border-mansagold/50 bg-card p-6 md:p-8 shadow-2xl space-y-4">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">List your business free</h1>
        <p className="text-muted-foreground mt-1">Takes 30 seconds. No password, no credit card.</p>
      </div>
      {([
        ['fullName', 'Your name', 'text', 'name'],
        ['email', 'Email', 'email', 'email'],
        ['businessName', 'Business name', 'text', 'organization'],
      ] as const).map(([k, label, type, ac]) => (
        <div key={k} className="space-y-1">
          <Label htmlFor={`qbs-${k}`} className="text-foreground font-semibold">{label}</Label>
          <Input id={`qbs-${k}`} type={type} autoComplete={ac} value={values[k]} onChange={set(k)} className="h-12 text-base" aria-invalid={!!errors[k]} />
          {errors[k] && <p className="text-sm text-destructive">{errors[k]}</p>}
        </div>
      ))}
      {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
      <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold bg-mansagold text-black hover:bg-mansagold/90">
        {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending…</> : 'Get My Free Listing'}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        By continuing you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        {' '}Already have an account? <Link to="/login" className="underline text-mansagold">Sign in</Link>
        {onUsePassword && <> · <button type="button" onClick={onUsePassword} className="underline">Use a password instead</button></>}
      </p>
    </form>
  );
};

export default QuickBusinessSignup;
