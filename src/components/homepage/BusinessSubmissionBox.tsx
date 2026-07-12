import React, { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Food & Restaurants',
  'Beauty & Personal Care',
  'Tech & Software',
  'Retail & Shopping',
  'Professional Services',
  'Health & Wellness',
  'Automotive',
  'Home & Construction',
  'Arts & Entertainment',
  'Other',
];

// Blocked disposable-email domains (short list; extend as needed)
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'guerrillamail.com', '10minutemail.com',
  'trashmail.com', 'yopmail.com', 'throwaway.email', 'getnada.com',
]);

const submissionSchema = z.object({
  business_name: z.string().trim().min(2).max(200),
  website: z
    .string()
    .trim()
    .min(4)
    .max(500)
    .regex(/^https?:\/\/.+\..+/i, 'Website must start with http:// or https://'),
  email: z
    .string()
    .trim()
    .email()
    .max(255)
    .refine((v) => !DISPOSABLE_DOMAINS.has(v.split('@')[1]?.toLowerCase() ?? ''), {
      message: 'Please use a real business email address',
    }),
  phone: z.string().trim().min(7).max(30),
  owner_name: z.string().trim().min(2).max(200),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  category: z.string().min(1),
});

type FormState = z.infer<typeof submissionSchema>;

const initialForm: FormState = {
  business_name: '',
  website: '',
  email: '',
  phone: '',
  owner_name: '',
  city: '',
  state: '',
  category: '',
};

const BusinessSubmissionBox: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(initialForm);
  const [ownershipChecked, setOwnershipChecked] = useState(false);
  const [attestChecked, setAttestChecked] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // bot trap
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (k: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Honeypot: silently drop bots
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!ownershipChecked || !attestChecked) {
      toast({
        title: 'Please confirm both checkboxes',
        description: 'Both legal attestations are required to submit.',
        variant: 'destructive',
      });
      return;
    }

    const parsed = submissionSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString();
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast({
        title: 'Please fix the highlighted fields',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Insert directly — RLS allows anon INSERT when both attestations are true.
      const { data: submission, error: insertError } = await supabase
        .from('business_submissions')
        .insert({
          ...parsed.data,
          attests_ownership: true,
          attests_black_owned: true,
          submitter_user_agent: navigator.userAgent.slice(0, 500),
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Fire-and-forget Kayla verification (edge function)
      supabase.functions
        .invoke('verify-business-submission', {
          body: { submission_id: submission.id },
        })
        .catch((err) => console.warn('Kayla verify kick-off failed:', err));

      setSubmitted(true);
      toast({
        title: '🎉 Submission received!',
        description: "Kayla is verifying your business. You'll hear from us within 48 hours.",
      });
    } catch (err: any) {
      console.error('Submission failed:', err);
      toast({
        title: 'Something went wrong',
        description: err?.message ?? 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="w-full py-12 px-4">
        <div className="max-w-3xl mx-auto rounded-2xl border border-mansagold/40 bg-gradient-to-br from-mansablue/10 to-black p-10 text-center shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-mansagold mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Thank you — your business is in the queue.
          </h3>
          <p className="text-white/80 max-w-xl mx-auto">
            Kayla (our AI verification agent) is now searching the web to confirm
            your business details. Once approved by our admin team, your listing
            goes live in the directory and becomes discoverable by AI assistants.
            You'll receive an email within 48 hours.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="submit-business"
      className="w-full py-16 px-4 bg-gradient-to-b from-black via-mansablue/10 to-black"
      aria-labelledby="submit-business-heading"
    >
      <div className="max-w-4xl mx-auto rounded-2xl border-2 border-mansagold/60 bg-neutral-900 p-6 md:p-10 shadow-[0_0_60px_rgba(255,179,0,0.15)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-mansagold/20 px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-mansagold" />
            <span className="text-mansagold text-sm font-semibold tracking-wide uppercase">
              Free Verified Listing
            </span>
          </div>
          <h2
            id="submit-business-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Own a Black-owned business? Add it free.
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg">
            Get discovered by thousands of intentional shoppers — and by AI
            assistants like ChatGPT and Claude through our directory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="company_website_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="md:col-span-2">
            <Label htmlFor="business_name" className="text-white">Business Name *</Label>
            <Input
              id="business_name"
              value={form.business_name}
              onChange={(e) => setField('business_name')(e.target.value)}
              placeholder="e.g. Sweet Auburn Bakery"
              maxLength={200}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            {errors.business_name && <p className="text-red-400 text-xs mt-1">{errors.business_name}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="website" className="text-white">Website URL *</Label>
            <Input
              id="website"
              type="url"
              value={form.website}
              onChange={(e) => setField('website')(e.target.value)}
              placeholder="https://yourbusiness.com"
              maxLength={500}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            {errors.website && <p className="text-red-400 text-xs mt-1">{errors.website}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-white">Business Email *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setField('email')(e.target.value)}
              placeholder="owner@yourbusiness.com"
              maxLength={255}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setField('phone')(e.target.value)}
              placeholder="(555) 123-4567"
              maxLength={30}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="owner_name" className="text-white">Owner Full Name *</Label>
            <Input
              id="owner_name"
              value={form.owner_name}
              onChange={(e) => setField('owner_name')(e.target.value)}
              placeholder="Your full legal name"
              maxLength={200}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            {errors.owner_name && <p className="text-red-400 text-xs mt-1">{errors.owner_name}</p>}
          </div>

          <div>
            <Label htmlFor="city" className="text-white">City *</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setField('city')(e.target.value)}
              placeholder="Atlanta"
              maxLength={100}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="state" className="text-white">State *</Label>
            <Input
              id="state"
              value={form.state}
              onChange={(e) => setField('state')(e.target.value)}
              placeholder="GA"
              maxLength={100}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="category" className="text-white">Category *</Label>
            <Select value={form.category} onValueChange={setField('category')}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Legal attestations */}
          <div className="md:col-span-2 space-y-4 mt-2 p-4 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-start gap-3">
              <Checkbox
                id="ownership"
                checked={ownershipChecked}
                onCheckedChange={(v) => setOwnershipChecked(v === true)}
                className="mt-1 border-mansagold data-[state=checked]:bg-mansagold data-[state=checked]:text-black"
              />
              <Label htmlFor="ownership" className="text-white/90 text-sm leading-relaxed cursor-pointer">
                <strong className="text-mansagold">Ownership.</strong>{' '}
                I confirm that I am the legal owner or authorized representative
                of this business and have the right to submit it to the directory.
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="attest"
                checked={attestChecked}
                onCheckedChange={(v) => setAttestChecked(v === true)}
                className="mt-1 border-mansagold data-[state=checked]:bg-mansagold data-[state=checked]:text-black"
              />
              <Label htmlFor="attest" className="text-white/90 text-sm leading-relaxed cursor-pointer">
                <strong className="text-mansagold">Legal attestation.</strong>{' '}
                I attest under penalty of perjury that this business is
                Black-owned and that all information I have provided is accurate
                and truthful. I understand that submitting false information may
                result in permanent removal from the directory and possible legal
                action.
              </Label>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <Button
              type="submit"
              disabled={submitting || !ownershipChecked || !attestChecked}
              className="w-full bg-mansagold hover:bg-mansagold/90 text-black font-bold text-base py-6"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Submit My Business for Verification'
              )}
            </Button>
            <p className="text-white/50 text-xs text-center mt-3">
              Kayla, our AI verification agent, will review your submission and
              our team will approve it within 48 hours.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BusinessSubmissionBox;
