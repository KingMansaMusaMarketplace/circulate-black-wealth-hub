import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CheckCircle, Loader2, Building2, UserRound, Target, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const sponsorshipFormSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  title: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  website: z.string().url().optional().or(z.literal('')),
  sponsorshipTier: z.enum(['recommend', 'founding', 'bronze', 'silver', 'gold', 'platinum', 'partner']),
  industry: z.string().min(2, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  budget: z.string().min(1, 'Budget range is required'),
  objective: z.string().min(1, 'Primary objective is required'),
  timeline: z.string().min(1, 'Decision timeline is required'),
  message: z.string().optional(),
});

type SponsorshipFormData = z.infer<typeof sponsorshipFormSchema>;

const inputClass =
  'h-11 bg-white/[0.02] border-white/10 text-white placeholder:text-white/25 focus:border-mansagold/60 focus:ring-1 focus:ring-mansagold/30 rounded-md transition-colors';

const labelClass = 'text-white/70 text-xs font-medium tracking-wide uppercase mb-1.5 block';

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="text-xs text-red-400/90 mt-1.5">{msg}</p> : null;

const SectionHeader: React.FC<{ icon: React.ReactNode; step: string; title: string; subtitle: string }> = ({
  icon,
  step,
  title,
  subtitle,
}) => (
  <div className="flex items-start gap-4 pb-6 mb-6 border-b border-white/[0.06]">
    <div className="flex-shrink-0 w-10 h-10 rounded-md border border-mansagold/30 bg-mansagold/[0.06] flex items-center justify-center text-mansagold">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-mansagold/80 tracking-[0.25em] uppercase mb-1">{step}</p>
      <h3 className="font-playfair text-xl text-white">{title}</h3>
      <p className="text-white/45 text-sm mt-1">{subtitle}</p>
    </div>
  </div>
);

const SponsorshipForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SponsorshipFormData>({
    resolver: zodResolver(sponsorshipFormSchema),
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const tier = (e as CustomEvent<string>).detail;
      if (!tier) return;
      setSelectedTier(tier);
      setValue('sponsorshipTier', tier as any, { shouldValidate: true });
    };
    window.addEventListener('sponsorship:preselect-tier', handler as EventListener);
    return () => window.removeEventListener('sponsorship:preselect-tier', handler as EventListener);
  }, [setValue]);

  const onSubmit = async (data: SponsorshipFormData) => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('submit-sponsorship-inquiry', {
        body: data,
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      setIsSubmitted(true);
      toast.success('Brief request received. A partnerships lead will respond within 1 business day.');
      reset();
      setSelectedTier(undefined);
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="sponsorship-form" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-black border border-mansagold/30 rounded-lg text-white">
            <div className="pt-12 pb-12 px-6">
              <CheckCircle className="h-12 w-12 text-mansagold mx-auto mb-6" />
              <h3 className="font-playfair text-3xl font-semibold text-white mb-4">
                Brief request received.
              </h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
                A partnerships lead will respond within one business day to schedule
                your discovery call.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
              >
                Submit another inquiry
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sponsorship-form" className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">
              Partnership Intake
            </p>
            <h2 className="font-playfair text-3xl md:text-5xl font-semibold text-white tracking-tight">
              Request a Partnership Brief
            </h2>
            <div className="w-16 h-px bg-mansagold/50 mx-auto my-6" />
            <p className="text-white/55 max-w-xl mx-auto leading-relaxed">
              Confidential intake — reviewed by our Partnerships team within 2 business days.
              All submissions are treated as private and non-disclosed.
            </p>
          </div>

          <Card className="bg-gradient-to-b from-white/[0.02] to-transparent border-white/10 shadow-2xl shadow-black/40">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-14">

                {/* SECTION 1 — Company */}
                <div>
                  <SectionHeader
                    icon={<Building2 className="w-5 h-5" />}
                    step="Section 01"
                    title="Company Profile"
                    subtitle="Tell us who we'd be partnering with."
                  />

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="companyName" className={labelClass}>Company Name<span className="text-mansagold ml-1">*</span></Label>
                      <Input id="companyName" {...register('companyName')} placeholder="Acme Corporation" className={inputClass} />
                      <FieldError msg={errors.companyName?.message} />
                    </div>
                    <div>
                      <Label htmlFor="industry" className={labelClass}>Industry<span className="text-mansagold ml-1">*</span></Label>
                      <Input id="industry" {...register('industry')} placeholder="Financial Services, Retail, Tech…" className={inputClass} />
                      <FieldError msg={errors.industry?.message} />
                    </div>
                    <div>
                      <Label className={labelClass}>Company Size<span className="text-mansagold ml-1">*</span></Label>
                      <Select onValueChange={(v) => setValue('companySize', v, { shouldValidate: true })}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select size" /></SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="1-50">1 – 50 employees</SelectItem>
                          <SelectItem value="51-500">51 – 500 employees</SelectItem>
                          <SelectItem value="501-5000">501 – 5,000 employees</SelectItem>
                          <SelectItem value="5000+">5,000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError msg={errors.companySize?.message} />
                    </div>
                    <div>
                      <Label htmlFor="website" className={labelClass}>Company Website</Label>
                      <Input id="website" {...register('website')} placeholder="https://" className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* SECTION 2 — Contact */}
                <div>
                  <SectionHeader
                    icon={<UserRound className="w-5 h-5" />}
                    step="Section 02"
                    title="Primary Contact"
                    subtitle="The decision-maker or point of contact for this engagement."
                  />

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="contactName" className={labelClass}>Full Name<span className="text-mansagold ml-1">*</span></Label>
                      <Input id="contactName" {...register('contactName')} placeholder="Jane Doe" className={inputClass} />
                      <FieldError msg={errors.contactName?.message} />
                    </div>
                    <div>
                      <Label htmlFor="title" className={labelClass}>Title / Role</Label>
                      <Input id="title" {...register('title')} placeholder="VP of Brand Partnerships" className={inputClass} />
                    </div>
                    <div>
                      <Label htmlFor="email" className={labelClass}>Work Email<span className="text-mansagold ml-1">*</span></Label>
                      <Input id="email" type="email" {...register('email')} placeholder="jane@company.com" className={inputClass} />
                      <FieldError msg={errors.email?.message} />
                    </div>
                    <div>
                      <Label htmlFor="phone" className={labelClass}>Direct Phone<span className="text-mansagold ml-1">*</span></Label>
                      <Input id="phone" {...register('phone')} placeholder="+1 (555) 000-0000" className={inputClass} />
                      <FieldError msg={errors.phone?.message} />
                    </div>
                  </div>
                </div>

                {/* SECTION 3 — Partnership */}
                <div>
                  <SectionHeader
                    icon={<Target className="w-5 h-5" />}
                    step="Section 03"
                    title="Partnership Objectives"
                    subtitle="Help us tailor the brief to your goals and timeline."
                  />

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label className={labelClass}>Annual Marketing / CSR Budget<span className="text-mansagold ml-1">*</span></Label>
                      <Select onValueChange={(v) => setValue('budget', v, { shouldValidate: true })}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select range" /></SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="under-100k">Under $100K</SelectItem>
                          <SelectItem value="100k-500k">$100K – $500K</SelectItem>
                          <SelectItem value="500k-2m">$500K – $2M</SelectItem>
                          <SelectItem value="2m-10m">$2M – $10M</SelectItem>
                          <SelectItem value="10m+">$10M+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError msg={errors.budget?.message} />
                    </div>
                    <div>
                      <Label className={labelClass}>Decision Timeline<span className="text-mansagold ml-1">*</span></Label>
                      <Select onValueChange={(v) => setValue('timeline', v, { shouldValidate: true })}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select timeline" /></SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="this-quarter">This quarter</SelectItem>
                          <SelectItem value="next-quarter">Next quarter</SelectItem>
                          <SelectItem value="next-year">Next 12 months</SelectItem>
                          <SelectItem value="exploratory">Exploratory</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError msg={errors.timeline?.message} />
                    </div>
                    <div>
                      <Label className={labelClass}>Primary Objective<span className="text-mansagold ml-1">*</span></Label>
                      <Select onValueChange={(v) => setValue('objective', v, { shouldValidate: true })}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select objective" /></SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="brand">Brand visibility</SelectItem>
                          <SelectItem value="impact">Community impact</SelectItem>
                          <SelectItem value="talent">Talent pipeline</SelectItem>
                          <SelectItem value="data">Data & insights</SelectItem>
                          <SelectItem value="multi">All of the above</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError msg={errors.objective?.message} />
                    </div>
                    <div>
                      <Label className={labelClass}>Preferred Tier<span className="text-mansagold ml-1">*</span></Label>
                      <Select
                        value={selectedTier}
                        onValueChange={(v) => {
                          setSelectedTier(v);
                          setValue('sponsorshipTier', v as any, { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select tier" /></SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="recommend">Not sure — recommend a tier</SelectItem>
                          <SelectItem value="founding">Founding Sponsor — $21K/yr</SelectItem>
                          <SelectItem value="bronze">Bronze Partner — $60K/yr</SelectItem>
                          <SelectItem value="silver">Silver Partner — $180K/yr</SelectItem>
                          <SelectItem value="gold">Gold Partner — $300K/yr</SelectItem>
                          <SelectItem value="platinum">Platinum Partner — $600K/yr</SelectItem>
                          <SelectItem value="partner">Founding Partner — by invitation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError msg={errors.sponsorshipTier?.message} />
                    </div>
                  </div>

                  <div className="mt-5">
                    <Label htmlFor="message" className={labelClass}>Additional Context</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Tell us about your brand's values, target communities, and what success looks like."
                      rows={5}
                      className={`${inputClass} h-auto py-3 resize-none`}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
                    <div className="flex items-center gap-3 text-xs text-white/45">
                      <Lock className="w-3.5 h-3.5 text-mansagold/70" />
                      <span>Encrypted transmission · Confidential intake · No third-party sharing</span>
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-mansagold hover:bg-mansagold/90 text-slate-900 font-semibold px-10 py-6 rounded-md shadow-lg shadow-mansagold/10"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Request Partnership Brief
                          <ShieldCheck className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipForm;
