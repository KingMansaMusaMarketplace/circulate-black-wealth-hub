import React, { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2, ShieldCheck, Lock, Clock, Sparkles } from 'lucide-react';

// Fortune-100-grade category taxonomy, grouped for scannability.
const CATEGORY_GROUPS: { label: string; items: string[] }[] = [
  {
    label: 'Food, Beverage & Hospitality',
    items: [
      'Restaurant',
      'Soul Food Restaurant',
      'Caribbean / Jamaican Restaurant',
      'African Restaurant',
      'Barbecue Restaurant',
      'Vegan / Plant-Based',
      'Bakery & Desserts',
      'Coffee Shop / Café',
      'Juice Bar / Smoothies',
      'Food Truck',
      'Catering & Private Chef',
      'Bar / Lounge / Nightlife',
      'Hotel / Bed & Breakfast',
      'Event Venue',
    ],
  },
  {
    label: 'Beauty, Grooming & Wellness',
    items: [
      'Hair Salon',
      'Natural Hair Salon',
      'African Hair Braiding',
      'Barbershop',
      'Nail Salon',
      'Lash & Brow Studio',
      'Skincare / Esthetician',
      'Makeup Artist',
      'Day Spa & Massage',
      'Tattoo & Piercing Studio',
      'Beauty Supply / Cosmetics Brand',
    ],
  },
  {
    label: 'Health, Fitness & Medical',
    items: [
      'Primary Care / Medical Practice',
      'Dental Practice',
      'Mental Health / Therapy',
      'Chiropractor',
      'Physical Therapy',
      'Doula / Midwife',
      'Pharmacy',
      'Personal Trainer',
      'Fitness Studio / Gym',
      'Yoga / Pilates Studio',
      'Nutritionist / Dietitian',
    ],
  },
  {
    label: 'Retail & E-Commerce',
    items: [
      'Clothing & Apparel Boutique',
      'Streetwear Brand',
      'Children\'s Apparel',
      'Jewelry & Accessories',
      'Shoes & Sneakers',
      'Bookstore',
      'Art & Home Décor',
      'Gift Shop',
      'Grocery / Specialty Foods',
      'Online Store / DTC Brand',
    ],
  },
  {
    label: 'Professional & Business Services',
    items: [
      'Law Firm / Attorney',
      'Accounting & Tax',
      'Bookkeeping',
      'Financial Advisor',
      'Insurance Agency',
      'Real Estate Brokerage',
      'Mortgage Broker',
      'Business Consulting',
      'HR & Recruiting',
      'Marketing & PR Agency',
      'Notary / Paralegal',
    ],
  },
  {
    label: 'Technology & Digital',
    items: [
      'Software / SaaS',
      'IT Services & Managed IT',
      'Cybersecurity',
      'Web Development',
      'Mobile App Development',
      'AI / Data Analytics',
      'Digital Marketing / SEO',
      'Graphic & Web Design',
      'Cloud / DevOps',
    ],
  },
  {
    label: 'Media, Arts & Entertainment',
    items: [
      'Photography Studio',
      'Videography & Film Production',
      'Recording / Music Studio',
      'DJ / Live Entertainment',
      'Podcast Production',
      'Art Gallery',
      'Publishing',
      'Event Planning',
    ],
  },
  {
    label: 'Construction, Trades & Home Services',
    items: [
      'General Contractor',
      'Electrical Contractor',
      'Plumbing',
      'HVAC',
      'Roofing',
      'Landscaping / Lawn Care',
      'Cleaning Services',
      'Pest Control',
      'Interior Design',
      'Moving & Storage',
    ],
  },
  {
    label: 'Automotive & Transportation',
    items: [
      'Auto Repair Shop',
      'Auto Detailing',
      'Car Wash',
      'Tire & Wheel',
      'Rideshare / Livery',
      'Trucking / Logistics',
      'Delivery / Courier',
    ],
  },
  {
    label: 'Education & Childcare',
    items: [
      'Tutoring',
      'Private School',
      'Daycare / Preschool',
      'Test Prep',
      'Vocational Training',
      'Music / Dance Instruction',
      'Coaching / Mentorship',
    ],
  },
  {
    label: 'Finance & Real Estate',
    items: [
      'Credit Union / Bank',
      'Investment Firm',
      'Property Management',
      'Home Builder / Developer',
      'Commercial Real Estate',
    ],
  },
  {
    label: 'Manufacturing, Agriculture & Industrial',
    items: [
      'Manufacturing',
      'Farming & Agriculture',
      'Wholesale / Distribution',
      'Warehousing',
      'Import / Export',
    ],
  },
  {
    label: 'Nonprofit, Community & Faith',
    items: [
      'Nonprofit Organization',
      'Faith-Based Organization',
      'Community Development',
      'Advocacy / Civic',
    ],
  },
  {
    label: 'Other',
    items: ['Other — not listed above'],
  },
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
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (k: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (honeypot) { setSubmitted(true); return; }

    if (!ownershipChecked || !attestChecked) {
      toast({
        title: 'Please confirm both attestations',
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
      toast({ title: 'Please fix the highlighted fields', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
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

      supabase.functions
        .invoke('verify-business-submission', { body: { submission_id: submission.id } })
        .catch((err) => console.warn('Kayla verify kick-off failed:', err));

      setSubmitted(true);
      toast({
        title: 'Submission received',
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
      <section className="relative w-full py-16 px-4" style={{ background: '#0a0a0a', zIndex: 10, isolation: 'isolate' }}>
        <div className="max-w-3xl mx-auto rounded-md bg-white p-10 text-center shadow-2xl border border-neutral-200">
          <div className="h-1 w-16 mx-auto mb-6" style={{ background: '#FFB300' }} />
          <CheckCircle2 className="w-14 h-14 mx-auto mb-4" style={{ color: '#003366' }} />
          <h3 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-3 tracking-tight">
            Thank you — your submission is in review.
          </h3>
          <p className="text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Kayla, our AI verification agent, is confirming your business details.
            Once approved, your listing goes live in the directory and becomes
            discoverable by AI assistants like ChatGPT and Claude. You'll receive
            a confirmation email within 48 hours.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="submit-business"
      className="relative w-full py-12 px-4"
      style={{ background: '#0a0a0a', zIndex: 10, isolation: 'isolate' }}
      aria-labelledby="submit-business-heading"
    >
      <div
        className="max-w-3xl mx-auto bg-white rounded-md shadow-2xl overflow-hidden"
        style={{ border: '1px solid #e5e7eb' }}
      >
        {/* Corporate header band */}
        <div style={{ background: '#003366' }} className="px-6 md:px-8 py-6 relative">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#FFB300' }} />
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8" style={{ background: '#FFB300' }} />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#FFB300' }}>
              Verified Business Registry
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mansagold text-text-on-gold text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3 h-3" /> 100% Free
            </span>
          </div>
          <h2
            id="submit-business-heading"
            className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Register your Black-owned business for free.
          </h2>
          <p className="mt-2 text-white/75 max-w-2xl leading-relaxed text-sm md:text-base">
            Join the national directory trusted by intentional consumers and
            surfaced by leading AI assistants. Verification is <strong className="text-white">100% free</strong> — no credit card, no hidden fees, no listing cost. Most reviews are completed within 48 hours.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
            <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" style={{ color: '#FFB300' }} /> 100% free — no credit card required</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" style={{ color: '#FFB300' }} /> Human-reviewed by our compliance team</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" style={{ color: '#FFB300' }} /> Encrypted &amp; confidential</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" style={{ color: '#FFB300' }} /> 48-hour turnaround</span>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-8 md:px-12 py-10 space-y-10">
          {/* Honeypot */}
          <input
            type="text" name="company_website_url" value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true"
          />

          {/* Section: Business */}
          <fieldset className="space-y-5">
            <legend className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-1">
              Section 01 — Business Information
            </legend>

            <div>
              <Label htmlFor="business_name" className="text-neutral-900 text-sm font-medium">Legal Business Name</Label>
              <Input
                id="business_name" value={form.business_name}
                onChange={(e) => setField('business_name')(e.target.value)}
                placeholder="e.g. Sweet Auburn Bakery, LLC"
                maxLength={200} required
                className="mt-1.5 h-11 bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#003366] focus-visible:border-[#003366]"
              />
              {errors.business_name && <p className="text-red-600 text-xs mt-1">{errors.business_name}</p>}
            </div>

            <div>
              <Label htmlFor="website" className="text-neutral-900 text-sm font-medium">Website URL</Label>
              <Input
                id="website" type="url" value={form.website}
                onChange={(e) => setField('website')(e.target.value)}
                placeholder="https://yourbusiness.com"
                maxLength={500} required
                className="mt-1.5 h-11 bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#003366] focus-visible:border-[#003366]"
              />
              {errors.website && <p className="text-red-600 text-xs mt-1">{errors.website}</p>}
            </div>

            <div>
              <Label htmlFor="category" className="text-neutral-900 text-sm font-medium">Industry Category</Label>
              <Select value={form.category} onValueChange={setField('category')}>
                <SelectTrigger className="mt-1.5 h-11 bg-white border-neutral-300 text-neutral-900 rounded-sm focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]">
                  <SelectValue placeholder="Select the category that best describes your business" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {CATEGORY_GROUPS.map((group) => (
                    <SelectGroup key={group.label}>
                      <SelectLabel className="text-[10px] uppercase tracking-widest text-neutral-500">
                        {group.label}
                      </SelectLabel>
                      {group.items.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="city" className="text-neutral-900 text-sm font-medium">City</Label>
                <Input
                  id="city" value={form.city}
                  onChange={(e) => setField('city')(e.target.value)}
                  placeholder="Atlanta" maxLength={100} required
                  className="mt-1.5 h-11 bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#003366] focus-visible:border-[#003366]"
                />
                {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state" className="text-neutral-900 text-sm font-medium">State</Label>
                <Input
                  id="state" value={form.state}
                  onChange={(e) => setField('state')(e.target.value)}
                  placeholder="GA" maxLength={100} required
                  className="mt-1.5 h-11 bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#003366] focus-visible:border-[#003366]"
                />
                {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>
          </fieldset>

          <div className="h-px bg-neutral-200" />

          {/* Section: Owner */}
          <fieldset className="space-y-5">
            <legend className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-1">
              Section 02 — Owner &amp; Contact
            </legend>

            <div>
              <Label htmlFor="owner_name" className="text-neutral-900 text-sm font-medium">Owner Full Legal Name</Label>
              <Input
                id="owner_name" value={form.owner_name}
                onChange={(e) => setField('owner_name')(e.target.value)}
                placeholder="First and last name" maxLength={200} required
                className="mt-1.5 h-11 bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#003366] focus-visible:border-[#003366]"
              />
              {errors.owner_name && <p className="text-red-600 text-xs mt-1">{errors.owner_name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="email" className="text-neutral-900 text-sm font-medium">Business Email</Label>
                <Input
                  id="email" type="email" value={form.email}
                  onChange={(e) => setField('email')(e.target.value)}
                  placeholder="owner@yourbusiness.com" maxLength={255} required
                  className="mt-1.5 h-11 bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#003366] focus-visible:border-[#003366]"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="text-neutral-900 text-sm font-medium">Business Phone</Label>
                <Input
                  id="phone" type="tel" value={form.phone}
                  onChange={(e) => setField('phone')(e.target.value)}
                  placeholder="(555) 123-4567" maxLength={30} required
                  className="mt-1.5 h-11 bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#003366] focus-visible:border-[#003366]"
                />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </fieldset>

          <div className="h-px bg-neutral-200" />

          {/* Section: Attestations */}
          <fieldset className="space-y-5">
            <legend className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-1">
              Section 03 — Legal Attestations
            </legend>

            <div className="rounded-sm border border-neutral-300 bg-neutral-50 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="ownership" checked={ownershipChecked}
                  onCheckedChange={(v) => setOwnershipChecked(v === true)}
                  className="mt-0.5 border-neutral-400 data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366] data-[state=checked]:text-white"
                />
                <Label htmlFor="ownership" className="text-neutral-800 text-sm leading-relaxed cursor-pointer font-normal">
                  <span className="font-semibold text-neutral-900">Ownership. </span>
                  I certify that I am the legal owner or a duly authorized
                  representative of the business identified above and possess the
                  authority to register it in this directory.
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="attest" checked={attestChecked}
                  onCheckedChange={(v) => setAttestChecked(v === true)}
                  className="mt-0.5 border-neutral-400 data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366] data-[state=checked]:text-white"
                />
                <Label htmlFor="attest" className="text-neutral-800 text-sm leading-relaxed cursor-pointer font-normal">
                  <span className="font-semibold text-neutral-900">Legal attestation. </span>
                  I attest under penalty of perjury that this business is
                  Black-owned and that all information provided herein is accurate
                  and truthful. I acknowledge that fraudulent submissions may
                  result in permanent removal and potential legal action.
                </Label>
              </div>
            </div>
          </fieldset>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting || !ownershipChecked || !attestChecked}
              className="w-full h-12 rounded-sm text-white font-semibold text-sm tracking-wide uppercase disabled:opacity-50"
              style={{ background: '#003366' }}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</>
              ) : (
                'Submit for Free Verification'
              )}
            </Button>
            <p className="text-neutral-500 text-xs text-center mt-4 leading-relaxed">
              By submitting, you agree to our free verification process. Your
              information is encrypted in transit and reviewed by Kayla, our AI
              verification agent, followed by human approval. There is never a charge
              for a standard directory listing.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BusinessSubmissionBox;
