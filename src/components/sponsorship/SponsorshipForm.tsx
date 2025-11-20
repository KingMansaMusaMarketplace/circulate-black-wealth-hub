
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const sponsorshipFormSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  website: z.string().url().optional().or(z.literal('')),
  sponsorshipTier: z.enum(['silver', 'gold', 'platinum']),
  industry: z.string().min(2, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  message: z.string().optional(),
});

type SponsorshipFormData = z.infer<typeof sponsorshipFormSchema>;

const SponsorshipForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<SponsorshipFormData>({
    resolver: zodResolver(sponsorshipFormSchema)
  });

  const sponsorshipTier = watch('sponsorshipTier');

  const onSubmit = async (data: SponsorshipFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sponsorship application submitted:', data);
      
      setIsSubmitted(true);
      toast.success('Thank you! Your sponsorship application has been submitted successfully.');
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="sponsorship-form" className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardContent className="pt-8">
              <CheckCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Application Submitted!</h3>
              <p className="text-blue-200 mb-6">
                Thank you for your interest in partnering with us. Our team will review your application 
                and contact you within 1-2 business days to discuss the next steps.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900"
              >
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="sponsorship-form" className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-yellow-400">
              Partnership Application
            </CardTitle>
            <CardDescription className="text-blue-200">
              Ready to make an impact? Fill out the form below and we'll be in touch soon.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName" className="text-blue-200">Company Name *</Label>
                  <Input
                    id="companyName"
                    {...register('companyName')}
                    placeholder="Your Company Name"
                    className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-400"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-400 mt-1">{errors.companyName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="contactName" className="text-blue-200">Contact Name *</Label>
                  <Input
                    id="contactName"
                    {...register('contactName')}
                    placeholder="Your Full Name"
                    className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-400"
                  />
                  {errors.contactName && (
                    <p className="text-sm text-red-400 mt-1">{errors.contactName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-blue-200">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="contact@company.com"
                    className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-400"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-blue-200">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="(555) 123-4567"
                    className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-400"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-400 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="website" className="text-blue-200">Company Website</Label>
                <Input
                  id="website"
                  {...register('website')}
                  placeholder="https://www.company.com"
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-400"
                />
                {errors.website && (
                  <p className="text-sm text-red-400 mt-1">{errors.website.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sponsorshipTier" className="text-blue-200">Preferred Sponsorship Tier *</Label>
                <Select onValueChange={(value) => setValue('sponsorshipTier', value as any)}>
                  <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                    <SelectValue placeholder="Select a sponsorship tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="silver" className="text-white hover:bg-slate-700">Silver Partner - $2,500/month</SelectItem>
                    <SelectItem value="gold" className="text-white hover:bg-slate-700">Gold Partner - $5,000/month</SelectItem>
                    <SelectItem value="platinum" className="text-white hover:bg-slate-700">Platinum Partner - $10,000/month</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sponsorshipTier && (
                  <p className="text-sm text-red-400 mt-1">{errors.sponsorshipTier.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry" className="text-blue-200">Industry *</Label>
                  <Input
                    id="industry"
                    {...register('industry')}
                    placeholder="e.g., Technology, Finance, Healthcare"
                    className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-400"
                  />
                  {errors.industry && (
                    <p className="text-sm text-red-400 mt-1">{errors.industry.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="companySize" className="text-blue-200">Company Size *</Label>
                  <Select onValueChange={(value) => setValue('companySize', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="startup" className="text-white hover:bg-slate-700">Startup (1-10 employees)</SelectItem>
                      <SelectItem value="small" className="text-white hover:bg-slate-700">Small (11-50 employees)</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-slate-700">Medium (51-200 employees)</SelectItem>
                      <SelectItem value="large" className="text-white hover:bg-slate-700">Large (201-1000 employees)</SelectItem>
                      <SelectItem value="enterprise" className="text-white hover:bg-slate-700">Enterprise (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.companySize && (
                    <p className="text-sm text-red-400 mt-1">{errors.companySize.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-blue-200">Additional Message</Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  placeholder="Tell us about your company's values, community involvement, or specific partnership interests..."
                  rows={4}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Partnership Application'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SponsorshipForm;
