import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Loader2, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CheckoutStatus {
  paid: boolean;
  payment_status: string;
  amount_total: number;
  recurring_amount?: number | null;
  is_trial?: boolean;
  currency: string;
  interval: string | null;

  tier: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  access_unlocked: boolean;
  customer_email: string | null;
}

const TIER_LABELS: Record<string, string> = {
  kayla_essentials: 'Kayla Essentials',
  kayla_essentials_annual: 'Kayla Essentials (Annual)',
  kayla_starter: 'Kayla Starter',
  kayla_starter_annual: 'Kayla Starter (Annual)',
  kayla_pro: 'Kayla Pro',
  kayla_pro_annual: 'Kayla Pro (Annual)',
  kayla_pro_founders: "Kayla Pro — Founders' Lock",
  founding_pro: "Kayla Pro — Founders' Lock",
  kayla_enterprise: 'Kayla Enterprise',
  business_pro: 'Business Pro',
  business_pro_annual: 'Business Pro (Annual)',
  sponsor_founding: 'Founding Corporate Sponsor',
};

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

const PaymentConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { refreshSubscription } = useSubscription();

  const sessionId = searchParams.get('session_id');
  const isFounding = searchParams.get('tier') === 'founding';
  const [status, setStatus] = useState<CheckoutStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [foundingSlot, setFoundingSlot] = useState<number | null>(null);
  const foundingClaimed = useRef(false);
  const stopped = useRef(false);

  // Founders' Lock: claim the numbered slot once the payment has cleared.
  const claimFoundingSlot = useCallback(async () => {
    if (!isFounding || !sessionId || foundingClaimed.current) return;
    foundingClaimed.current = true;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        foundingClaimed.current = false;
        return;
      }
      const { data, error: fnError } = await supabase.functions.invoke(
        'verify-founding-checkout',
        {
          body: { session_id: sessionId },
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (!fnError && data?.success) {
        setFoundingSlot(data.slot_number ?? null);
      } else {
        foundingClaimed.current = false;
      }
    } catch {
      foundingClaimed.current = false;
    }
  }, [isFounding, sessionId]);


  const fetchStatus = useCallback(async () => {
    if (!sessionId) {
      setError('We could not find a checkout reference in this link.');
      return true;
    }
    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-checkout-status', {
        body: { session_id: sessionId },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setStatus(data as CheckoutStatus);
      if (data?.paid) {
        await claimFoundingSlot();
        await refreshSubscription().catch(() => undefined);
      }
      return Boolean(data?.paid && data?.access_unlocked);
    } catch (err) {
      console.warn('[PaymentConfirmation] status check failed', err);
      return false;
    }
  }, [sessionId, refreshSubscription, claimFoundingSlot]);


  useEffect(() => {
    if (authLoading || !user) return;
    stopped.current = false;

    const run = async () => {
      for (let i = 0; i < 30 && !stopped.current; i++) {
        const done = await fetchStatus();
        setAttempts(i + 1);
        if (done) return;
        await new Promise((r) => setTimeout(r, i < 5 ? 2000 : 5000));
      }
    };
    run();

    return () => {
      stopped.current = true;
    };
  }, [authLoading, user, fetchStatus]);

  const paid = !!status?.paid;
  const unlocked = paid && !!status?.access_unlocked;
  const isTrial = !!status?.is_trial;
  const planPrice =
    status && status.recurring_amount ? formatMoney(status.recurring_amount, status.currency) : null;
  const dueNow = status ? formatMoney(status.amount_total, status.currency) : null;
  const amount = isTrial ? planPrice ?? dueNow : dueNow;
  const planName = status?.tier ? TIER_LABELS[status.tier] ?? 'your plan' : 'your plan';
  const intervalLabel =
    status?.interval === 'year' ? 'per year' : status?.interval === 'month' ? 'per month' : '';
  const renewDate = formatDate(status?.current_period_end ?? null);
  const trialDate = formatDate(status?.trial_end ?? null);


  if (!authLoading && !user) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#1a1f3c] to-[#0d2847] p-4">
        <Card className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Please sign in</CardTitle>
            <CardDescription className="text-slate-300">
              Sign in with the same email you used at checkout so we can show your payment status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/login')}>Sign in</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Confirmation - 1325.AI</title>
        <meta
          name="description"
          content="Track your 1325.AI payment and see exactly what must clear before your account access unlocks."
        />
      </Helmet>

      <div className="dark min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#1a1f3c] to-[#0d2847] p-4 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <Card className="max-w-lg w-full relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <div
              className={`mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center shadow-lg ${
                unlocked
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-amber-500/25'
                  : 'bg-white/10 border border-white/15'
              }`}
            >
              {unlocked ? (
                <CheckCircle2 className="h-12 w-12 text-slate-900" />
              ) : (
                <Clock className="h-10 w-10 text-amber-400 animate-pulse" />
              )}
            </div>
            <CardTitle className="text-2xl text-white">
              {unlocked ? 'You’re all set' : 'Confirming your payment'}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {unlocked
                ? 'Your payment cleared and your account is fully unlocked.'
                : 'Your card has been submitted. Access unlocks the moment the payment below clears.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {foundingSlot !== null && (
              <div className="rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-400/15 to-yellow-500/5 p-4 text-center">
                <p className="text-xs uppercase tracking-widest text-amber-300/80">
                  Founders' Lock secured
                </p>
                <p className="text-2xl font-semibold text-white mt-1">
                  Founding Member #{foundingSlot}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Your $149/mo rate is locked in for life.
                </p>
              </div>
            )}
            {/* The amount that must clear */}

            <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-amber-300/80 mb-2">
                {isTrial ? 'Your plan price after the free trial' : 'Amount that must clear'}
              </p>
              <p className="text-4xl font-semibold text-white">
                {amount ?? <Loader2 className="h-7 w-7 animate-spin text-amber-400 mx-auto" />}
              </p>
              {status && (
                <p className="text-sm text-slate-300 mt-2">
                  {planName}
                  {intervalLabel ? ` · ${intervalLabel}` : ''}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-3">
                {isTrial ? (
                  <>
                    You pay <span className="text-white">{dueNow ?? '$0.00'}</span> today — your free
                    trial starts as soon as your card is verified. The amount above is what bills
                    when the trial ends{trialDate ? ` on ${trialDate}` : ''}, and you can cancel
                    before then at no charge.
                  </>
                ) : (
                  <>
                    Nothing else is charged today. Your access unlocks only after this exact amount
                    clears your bank or card issuer.
                  </>
                )}
              </p>

            </div>

            {/* Step tracker */}
            <div className="space-y-3">
              {[
                {
                  label: 'Card submitted at checkout',
                  done: true,
                  detail: status?.customer_email ? `Receipt goes to ${status.customer_email}` : '',
                },
                {
                  label: amount ? `${amount} clears your card issuer` : 'Payment clears your card issuer',
                  done: paid,
                  detail: paid
                    ? 'Cleared'
                    : 'Usually seconds — some banks take a few minutes.',
                },
                {
                  label: 'Account access unlocks',
                  done: unlocked,
                  detail: unlocked ? 'Unlocked' : 'Waiting on the payment above.',
                },
              ].map((step) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      step.done ? 'bg-amber-400/20' : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                    ) : (
                      <Lock className="h-3 w-3 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm ${step.done ? 'text-white' : 'text-slate-300'}`}>
                      {step.label}
                    </p>
                    {step.detail && <p className="text-xs text-slate-400">{step.detail}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Billing details */}
            {status && (paid || renewDate) && (
              <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2 text-sm">
                {trialDate && (
                  <div className="flex justify-between text-slate-300">
                    <span>Free trial ends</span>
                    <span className="text-white">{trialDate}</span>
                  </div>
                )}
                {renewDate && (
                  <div className="flex justify-between text-slate-300">
                    <span>Next charge of {amount}</span>
                    <span className="text-white">{renewDate}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 text-xs pt-2 border-t border-white/10">
                  <span>Cancel anytime</span>
                  <span>No cancellation fee</span>
                </div>
              </div>
            )}

            {/* Still pending after a while */}
            {!paid && attempts >= 8 && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  Still waiting on your bank. You can safely close this page — we email you the
                  second it clears, and your account unlocks automatically. Nothing is charged twice.
                </p>
              </div>
            )}

            {error && <p className="text-sm text-red-300 text-center">{error}</p>}

            <div className="space-y-2">
              <Button
                onClick={() => navigate('/dashboard')}
                disabled={!unlocked}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold disabled:opacity-40"
                size="lg"
              >
                {unlocked ? 'Go to my dashboard' : 'Dashboard unlocks after payment clears'}
              </Button>
              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Payments are processed by Stripe. 1325.AI never sees your card number.
              </p>
              <p className="text-[11px] text-slate-500 text-center">
                Questions? <Link to="/contact" className="underline">Contact support</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentConfirmationPage;
