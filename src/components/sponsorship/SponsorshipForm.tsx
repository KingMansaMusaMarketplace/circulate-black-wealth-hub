
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
import { useAuth } from '@/contexts/auth';

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
      
      // Map tier to price
      const tierPriceMap = {
        silver: 'STRIPE_SILVER_PRICE_ID',
        gold: 'STRIPE_GOLD_PRICE_ID',
        platinum: 'STRIPE_PLATINUM_PRICE_ID',
      };
      
      const selectedTier = values.sponsorshipTier;
      
      // In a real implementation, this would come from environment variables
      // For now we just demonstrate the concept
      const checkoutOptions = {
        userType: 'business' as const,
        email: values.email,
        name: values.contactName,
        businessName: values.companyName,
        tier: selectedTier,
        // We'd use the actual price ID in production
        priceId: tierPriceMap[selectedTier]
      };
      
      // Call the checkout service
      const { url } = await subscriptionService.createCheckoutSession(checkoutOptions);
      
      // Open checkout in new window
      window.open(url, '_blank');
      
      toast.success('Redirecting to checkout page...');
      
    } catch (error) {
      console.error('Sponsorship checkout error:', error);
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
                      <FormLabel>Company Name</FormLabel>
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
                      <FormLabel>Contact Name</FormLabel>
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
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Phone</FormLabel>
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
                      <FormLabel>Sponsorship Tier</FormLabel>
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
