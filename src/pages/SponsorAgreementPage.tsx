import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, FileSignature, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import {
  AGREEMENT_SECTIONS,
  AGREEMENT_VERSION,
  PAYMENT_SCHEDULES,
  SPONSOR_TIERS,
  formatUsd,
  getTier,
  installmentCents,
  type PaymentScheduleKey,
} from '@/lib/sponsorship/agreementTerms';

interface FormState {
  tier_key: string;
  payment_schedule: PaymentScheduleKey;
  company_name: string;
  company_website: string;
  billing_address: string;
  contact_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  po_number: string;
  category_exclusivity: boolean;
  signer_name: string;
  signer_title: string;
  signature_typed_name: string;
}

const initialState: FormState = {
  tier_key: '',
  payment_schedule: 'annual',
  company_name: '',
  company_website: '',
  billing_address: '',
  contact_name: '',
  contact_title: '',
  contact_email: '',
  contact_phone: '',
  po_number: '',
  category_exclusivity: false,
  signer_name: '',
  signer_title: '',
  signature_typed_name: '',
};

const SponsorAgreementPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ id: string; amount: number; tier: string } | null>(null);

  const tier = getTier(form.tier_key);
  const installment = useMemo(
    () => (tier ? installmentCents(tier.annualCents, form.payment_schedule) : 0),
    [tier, form.payment_schedule],
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const signatureMatches =
    form.signature_typed_name.trim().length > 1 &&
    form.signature_typed_name.trim().toLowerCase() === form.signer_name.trim().toLowerCase();

  const canSubmit =
    !!tier &&
    form.company_name.trim().length > 0 &&
    form.billing_address.trim().length > 4 &&
    form.contact_name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email.trim()) &&
    form.signer_name.trim().length > 0 &&
    signatureMatches &&
    agreed &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !tier) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('sign-sponsor-agreement', {
        body: {
          tier_key: form.tier_key,
          payment_schedule: form.payment_schedule,
          company_name: form.company_name.trim(),
          company_website: form.company_website.trim() || null,
          billing_address: form.billing_address.trim(),
          contact_name: form.contact_name.trim(),
          contact_title: form.contact_title.trim() || null,
          contact_email: form.contact_email.trim(),
          contact_phone: form.contact_phone.trim() || null,
          po_number: form.po_number.trim() || null,
          category_exclusivity: form.category_exclusivity,
          signer_name: form.signer_name.trim(),
          signer_title: form.signer_title.trim() || null,
          signature_typed_name: form.signature_typed_name.trim(),
          agreed_terms: true,
          agreement_version: AGREEMENT_VERSION,
        },
      });

      if (error) throw error;
      if ((data as any)?.error) throw new Error(JSON.stringify((data as any).error));

      setDone({
        id: (data as any).id,
        amount: (data as any).installment_amount_cents ?? installment,
        tier: (data as any).tier_name ?? tier.name,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Sponsor agreement signing failed:', err);
      toast.error('We could not record your signature. Please try again or email partnerships@1325.ai.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Helmet>
          <title>Sponsorship Agreement Signed | 1325.AI</title>
          <meta name="description" content="Your 1325.AI corporate sponsorship agreement has been signed electronically." />
        </Helmet>
        <main className="container mx-auto max-w-2xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden="true" />
          <h1 className="mt-6 text-3xl font-semibold">Agreement signed</h1>
          <p className="mt-4 text-muted-foreground">
            Thank you. Your {done.tier} sponsorship agreement has been recorded and a copy has been
            emailed to you for your files.
          </p>
          <div className="mt-8 rounded-lg border border-border bg-card p-6 text-left">
            <p className="text-sm text-muted-foreground">Next step</p>
            <p className="mt-2">
              Our partnerships team will send your invoice for{' '}
              <span className="font-semibold">{formatUsd(done.amount)}</span> with net-30 terms.
              You will be able to pay by card or bank transfer from the invoice link.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Record ID: {done.id}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Sign Your Sponsorship Agreement | 1325.AI</title>
        <meta
          name="description"
          content="Complete and electronically sign the 1325.AI corporate sponsorship agreement and order form online."
        />
        <link rel="canonical" href="https://1325.ai/sponsor-agreement" />
      </Helmet>

      <main className="container mx-auto max-w-3xl px-4 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-widest text-primary">1325.AI Partnerships</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Corporate Sponsorship Agreement
          </h1>
          <p className="mt-3 text-muted-foreground">
            Complete the order form, review the agreement, and sign electronically. An invoice with
            net-30 terms follows by email.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Order form */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-6 text-xl font-semibold">Order form</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="tier">Sponsorship tier *</Label>
                <Select value={form.tier_key} onValueChange={(v) => set('tier_key', v)}>
                  <SelectTrigger id="tier" className="mt-2">
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPONSOR_TIERS.map((t) => (
                      <SelectItem key={t.key} value={t.key}>
                        {t.name} — {t.annualLabel} / year
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="schedule">Payment schedule *</Label>
                <Select
                  value={form.payment_schedule}
                  onValueChange={(v) => set('payment_schedule', v as PaymentScheduleKey)}
                >
                  <SelectTrigger id="schedule" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_SCHEDULES.map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {tier && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatUsd(tier.annualCents)} per year — invoiced at{' '}
                    <span className="font-semibold text-foreground">{formatUsd(installment)}</span>{' '}
                    per installment.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="company_name">Organization legal name *</Label>
                <Input
                  id="company_name"
                  className="mt-2"
                  maxLength={200}
                  value={form.company_name}
                  onChange={(e) => set('company_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company_website">Website</Label>
                <Input
                  id="company_website"
                  className="mt-2"
                  maxLength={300}
                  value={form.company_website}
                  onChange={(e) => set('company_website', e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="billing_address">Billing address *</Label>
                <Textarea
                  id="billing_address"
                  className="mt-2"
                  rows={3}
                  maxLength={500}
                  value={form.billing_address}
                  onChange={(e) => set('billing_address', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact_name">Billing contact name *</Label>
                <Input
                  id="contact_name"
                  className="mt-2"
                  maxLength={150}
                  value={form.contact_name}
                  onChange={(e) => set('contact_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_title">Billing contact title</Label>
                <Input
                  id="contact_title"
                  className="mt-2"
                  maxLength={150}
                  value={form.contact_title}
                  onChange={(e) => set('contact_title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Billing email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  className="mt-2"
                  maxLength={255}
                  value={form.contact_email}
                  onChange={(e) => set('contact_email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Phone</Label>
                <Input
                  id="contact_phone"
                  className="mt-2"
                  maxLength={50}
                  value={form.contact_phone}
                  onChange={(e) => set('contact_phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="po_number">Purchase order number</Label>
                <Input
                  id="po_number"
                  className="mt-2"
                  maxLength={100}
                  value={form.po_number}
                  onChange={(e) => set('po_number', e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-start gap-3 text-sm">
                  <Checkbox
                    checked={form.category_exclusivity}
                    onCheckedChange={(v) => set('category_exclusivity', v === true)}
                    aria-label="Request category exclusivity"
                  />
                  <span>Request category exclusivity (subject to availability)</span>
                </label>
              </div>
            </div>
          </section>

          {/* Agreement */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Sponsorship agreement</h2>
              <span className="ml-auto text-xs text-muted-foreground">
                Version {AGREEMENT_VERSION}
              </span>
            </div>

            <ScrollArea className="h-80 rounded-md border border-border p-5">
              {AGREEMENT_SECTIONS.map((s) => (
                <div key={s.heading} className="mb-5 last:mb-0">
                  <h3 className="text-sm font-semibold">{s.heading}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </ScrollArea>

            <label className="mt-5 flex items-start gap-3 text-sm">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                aria-label="I have read and agree to the agreement"
              />
              <span>
                I have read the agreement above in full and I am authorized to bind my organization
                to it.
              </span>
            </label>
          </section>

          {/* Signature */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-6 flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Electronic signature</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="signer_name">Authorized signer full name *</Label>
                <Input
                  id="signer_name"
                  className="mt-2"
                  maxLength={150}
                  value={form.signer_name}
                  onChange={(e) => set('signer_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signer_title">Signer title</Label>
                <Input
                  id="signer_title"
                  className="mt-2"
                  maxLength={150}
                  value={form.signer_title}
                  onChange={(e) => set('signer_title', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="signature">Type your full name to sign *</Label>
                <Input
                  id="signature"
                  className="mt-2 font-serif text-lg italic"
                  maxLength={150}
                  placeholder="Your full legal name"
                  value={form.signature_typed_name}
                  onChange={(e) => set('signature_typed_name', e.target.value)}
                  required
                />
                {form.signature_typed_name.trim().length > 1 && !signatureMatches && (
                  <p className="mt-2 text-sm text-destructive">
                    Your typed signature must match the authorized signer name exactly.
                  </p>
                )}
              </div>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              By submitting this form you are signing electronically under the U.S. ESIGN Act. We
              record your typed name, the date and time, your IP address, your browser details, and
              the exact version of the agreement shown above.
            </p>

            <Button type="submit" size="lg" className="mt-6 w-full" disabled={!canSubmit}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recording signature…
                </>
              ) : (
                'Sign agreement and request invoice'
              )}
            </Button>
          </section>
        </form>
      </main>
    </div>
  );
};

export default SponsorAgreementPage;
