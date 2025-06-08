
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
  // Contact Information
  contactName: z.string().min(2, { message: 'Contact name must be at least 2 characters.' }),
  contactTitle: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  
  // Company Details
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  companyWebsite: z.string().url({ message: 'Please enter a valid website URL.' }).optional().or(z.literal('')),
  industry: z.string().min(1, { message: 'Please select an industry.' }),
  companySize: z.string().min(1, { message: 'Please select company size.' }),
  
  // Company Address
  companyAddress: z.string().min(5, { message: 'Please enter a complete address.' }),
  companyCity: z.string().min(2, { message: 'Please enter a valid city.' }),
  companyState: z.string().min(2, { message: 'Please enter a valid state.' }),
  companyZipCode: z.string().min(5, { message: 'Please enter a valid ZIP code.' }),
  
  // Sponsorship Details
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
      contactName: '',
      contactTitle: '',
      email: user?.email || '',
      phone: '',
      companyName: '',
      companyWebsite: '',
      industry: '',
      companySize: '',
      companyAddress: '',
      companyCity: '',
      companyState: '',
      companyZipCode: '',
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
        contact_title: values.contactTitle,
        email: values.email,
        phone: values.phone,
        company_address: values.companyAddress,
        company_city: values.companyCity,
        company_state: values.companyState,
        company_zip_code: values.companyZipCode,
        company_website: values.companyWebsite,
        industry: values.industry,
        company_size: values.companySize,
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Become a Corporate Sponsor</h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and our team will contact you to discuss the sponsorship details.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Contact Information Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    
                    <FormField
                      control={form.control}
                      name="contactTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Marketing Director" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@company.com" {...field} />
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
                </div>

                {/* Company Details Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Company Details</h3>
                  
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
                    name="companyWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.yourcompany.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="finance">Financial Services</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="real-estate">Real Estate</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="non-profit">Non-Profit</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="501-1000">501-1000 employees</SelectItem>
                              <SelectItem value="1000+">1000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Company Address Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Company Address</h3>
                  
                  <FormField
                    control={form.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="companyCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companyState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companyZipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sponsorship Details Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Sponsorship Details</h3>
                  
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
                </div>
                
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
