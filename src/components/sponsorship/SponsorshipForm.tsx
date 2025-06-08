
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { subscriptionService } from '@/lib/services/subscription-service';
import { createSponsorProfile } from '@/lib/api/sponsor-api';
import { useAuth } from '@/contexts/AuthContext';
import {
  ContactInformationSection,
  CompanyDetailsSection,
  CompanyAddressSection,
  SponsorshipDetailsSection
} from './form-sections';

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
        message: values.message,
        contactTitle: values.contactTitle,
        companyAddress: values.companyAddress,
        companyCity: values.companyCity,
        companyState: values.companyState,
        companyZipCode: values.companyZipCode,
        companyWebsite: values.companyWebsite,
        industry: values.industry,
        companySize: values.companySize
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
                <ContactInformationSection control={form.control} />
                <CompanyDetailsSection control={form.control} />
                <CompanyAddressSection control={form.control} />
                <SponsorshipDetailsSection control={form.control} />
                
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
