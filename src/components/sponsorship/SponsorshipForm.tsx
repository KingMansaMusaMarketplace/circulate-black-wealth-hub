
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { subscriptionService } from '@/lib/services/subscription-service';
import { createSponsorProfile } from '@/lib/api/sponsor-api';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  contactName: z.string().min(2, { message: 'Contact name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  sponsorshipTier: z.enum(['silver', 'gold', 'platinum'], {
    required_error: 'Please select a sponsorship tier.',
  }),
  message: z.string().optional(),
});

const SponsorshipForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: user?.email || '',
      phone: '',
      sponsorshipTier: 'silver',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // First, create the sponsor profile in our database
      const sponsorProfileResult = await createSponsorProfile({
        company_name: values.companyName,
        contact_name: values.contactName,
        email: values.email,
        phone: values.phone,
        sponsorship_tier: values.sponsorshipTier,
        message: values.message
      });

      if (!sponsorProfileResult.success) {
        throw new Error('Failed to create sponsor profile');
      }

      // Then create the checkout session
      const checkoutOptions = {
        userType: 'corporate' as const,
        email: values.email,
        name: values.contactName,
        companyName: values.companyName,
        tier: values.sponsorshipTier,
        phone: values.phone,
        message: values.message
      };
      
      const { url } = await subscriptionService.createCheckoutSession(checkoutOptions);
      
      // Open checkout in new window
      window.open(url, '_blank');
      
      toast.success('Sponsor profile created! Complete your subscription in the new tab.');
      
      // Clear form if successful
      form.reset();
      
    } catch (error) {
      console.error('Sponsorship submission error:', error);
      toast.error('There was a problem processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50" id="sponsorship-form">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Become a Corporate Sponsor</h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and our team will contact you to discuss the sponsorship details.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="sponsorshipTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsorship Tier <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="silver">Silver ($2,000/month)</SelectItem>
                          <SelectItem value="gold">Gold ($5,000/month)</SelectItem>
                          <SelectItem value="platinum">Platinum ($10,000/month)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your company and goals for sponsorship" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-mansablue hover:bg-mansablue-dark text-lg py-6" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Submit Sponsorship Application'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipForm;
