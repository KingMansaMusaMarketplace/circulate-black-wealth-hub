
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
      <section id="sponsorship-form" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-mansablue mb-4">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in partnering with us. Our team will review your application 
                and contact you within 1-2 business days to discuss the next steps.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="sponsorship-form" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-mansablue">
              Partnership Application
            </CardTitle>
            <CardDescription>
              Ready to make an impact? Fill out the form below and we'll be in touch soon.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    {...register('companyName')}
                    placeholder="Your Company Name"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    {...register('contactName')}
                    placeholder="Your Full Name"
                  />
                  {errors.contactName && (
                    <p className="text-sm text-red-600 mt-1">{errors.contactName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="contact@company.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="website">Company Website</Label>
                <Input
                  id="website"
                  {...register('website')}
                  placeholder="https://www.company.com"
                />
                {errors.website && (
                  <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sponsorshipTier">Preferred Sponsorship Tier *</Label>
                <Select onValueChange={(value) => setValue('sponsorshipTier', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sponsorship tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="silver">Silver Partner - $2,500/month</SelectItem>
                    <SelectItem value="gold">Gold Partner - $5,000/month</SelectItem>
                    <SelectItem value="platinum">Platinum Partner - $10,000/month</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sponsorshipTier && (
                  <p className="text-sm text-red-600 mt-1">{errors.sponsorshipTier.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    {...register('industry')}
                    placeholder="e.g., Technology, Finance, Healthcare"
                  />
                  {errors.industry && (
                    <p className="text-sm text-red-600 mt-1">{errors.industry.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select onValueChange={(value) => setValue('companySize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                      <SelectItem value="small">Small (11-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                      <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.companySize && (
                    <p className="text-sm text-red-600 mt-1">{errors.companySize.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="message">Additional Message</Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  placeholder="Tell us about your company's values, community involvement, or specific partnership interests..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-mansablue hover:bg-mansablue-dark"
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
