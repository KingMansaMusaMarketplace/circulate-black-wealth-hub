import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
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
  'bg-black border-white/10 text-white placeholder:text-white/30 focus:border-mansagold/50';

const SponsorshipForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SponsorshipFormData>({
    resolver: zodResolver(sponsorshipFormSchema),
  });

  const onSubmit = async (data: SponsorshipFormData) => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('submit-sponsorship-inquiry', {
        body: data,
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      console.log('Partnership brief submitted:', result);
      setIsSubmitted(true);
      toast.success('Brief request received. A partnerships lead will respond within 1 business day.');
      reset();
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
          <Card className="max-w-2xl mx-auto text-center bg-black border-mansagold/30">
            <CardContent className="pt-12 pb-12">
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
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="sponsorship-form" className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">
              Partnership Intake
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Request a Partnership Brief.
            </h2>
            <p className="text-white/55 mt-4 max-w-xl mx-auto">
              Submissions are reviewed by our Partnerships team within 2 business days.
            </p>
          </div>

          <Card className="bg-black border-white/10">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName" className="text-white/70">Company Name *</Label>
                    <Input id="companyName" {...register('companyName')} className={inputClass} />
                    {errors.companyName && <p className="text-xs text-red-400 mt-1">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="contactName" className="text-white/70">Contact Name *</Label>
                    <Input id="contactName" {...register('contactName')} className={inputClass} />
                    {errors.contactName && <p className="text-xs text-red-400 mt-1">{errors.contactName.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white/70">Title / Role</Label>
                    <Input id="title" {...register('title')} placeholder="e.g. VP of Brand Partnerships" className={inputClass} />
                  </div>
                  <div>
                    <Label htmlFor="industry" className="text-white/70">Industry *</Label>
                    <Input id="industry" {...register('industry')} className={inputClass} />
                    {errors.industry && <p className="text-xs text-red-400 mt-1">{errors.industry.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-white/70">Work Email *</Label>
                    <Input id="email" type="email" {...register('email')} className={inputClass} />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white/70">Direct Phone *</Label>
                    <Input id="phone" {...register('phone')} className={inputClass} />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="text-white/70">Company Website</Label>
                  <Input id="website" {...register('website')} placeholder="https://" className={inputClass} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Company Size *</Label>
                    <Select onValueChange={(v) => setValue('companySize', v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Select size" /></SelectTrigger>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="1-50">1 – 50 employees</SelectItem>
                        <SelectItem value="51-500">51 – 500 employees</SelectItem>
                        <SelectItem value="501-5000">501 – 5,000 employees</SelectItem>
                        <SelectItem value="5000+">5,000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.companySize && <p className="text-xs text-red-400 mt-1">{errors.companySize.message}</p>}
                  </div>
                  <div>
                    <Label className="text-white/70">Annual Marketing / CSR Budget *</Label>
                    <Select onValueChange={(v) => setValue('budget', v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Select range" /></SelectTrigger>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="under-100k">Under $100K</SelectItem>
                        <SelectItem value="100k-500k">$100K – $500K</SelectItem>
                        <SelectItem value="500k-2m">$500K – $2M</SelectItem>
                        <SelectItem value="2m-10m">$2M – $10M</SelectItem>
                        <SelectItem value="10m+">$10M+</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.budget && <p className="text-xs text-red-400 mt-1">{errors.budget.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Primary Objective *</Label>
                    <Select onValueChange={(v) => setValue('objective', v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Select objective" /></SelectTrigger>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="brand">Brand visibility</SelectItem>
                        <SelectItem value="impact">Community impact</SelectItem>
                        <SelectItem value="talent">Talent pipeline</SelectItem>
                        <SelectItem value="data">Data & insights</SelectItem>
                        <SelectItem value="multi">All of the above</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.objective && <p className="text-xs text-red-400 mt-1">{errors.objective.message}</p>}
                  </div>
                  <div>
                    <Label className="text-white/70">Decision Timeline *</Label>
                    <Select onValueChange={(v) => setValue('timeline', v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Select timeline" /></SelectTrigger>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="this-quarter">This quarter</SelectItem>
                        <SelectItem value="next-quarter">Next quarter</SelectItem>
                        <SelectItem value="next-year">Next 12 months</SelectItem>
                        <SelectItem value="exploratory">Exploratory</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.timeline && <p className="text-xs text-red-400 mt-1">{errors.timeline.message}</p>}
                  </div>
                </div>

                <div>
                  <Label className="text-white/70">Preferred Tier *</Label>
                  <Select onValueChange={(v) => setValue('sponsorshipTier', v as any)}>
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
                  {errors.sponsorshipTier && <p className="text-xs text-red-400 mt-1">{errors.sponsorshipTier.message}</p>}
                </div>

                <div>
                  <Label htmlFor="message" className="text-white/70">Additional Context</Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    placeholder="Tell us about your brand's values, target communities, and what success looks like."
                    rows={4}
                    className={inputClass}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-mansagold hover:bg-mansagold/90 text-slate-900 font-semibold py-6 rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Request Partnership Brief'
                  )}
                </Button>

                <p className="text-center text-xs text-white/40 pt-2">
                  Submissions are reviewed by our Partnerships team within 2 business days.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipForm;
