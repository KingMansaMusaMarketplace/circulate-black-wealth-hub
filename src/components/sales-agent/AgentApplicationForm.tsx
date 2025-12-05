
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { submitSalesAgentApplication } from '@/lib/api/sales-agent-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Update the form schema with proper validation
const formSchema = z.object({
  full_name: z.string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(100, { message: 'Name must be less than 100 characters' })
    .trim(),
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .max(255, { message: 'Email must be less than 255 characters' })
    .trim()
    .toLowerCase(),
  phone: z.string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(20, { message: 'Phone number must be less than 20 characters' })
    .regex(/^[0-9\s\-\+\(\)]+$/, { message: 'Please enter a valid phone number' }),
  recruiter_code: z.string()
    .max(50, { message: 'Recruiter code must be less than 50 characters' })
    .optional()
    .or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface AgentApplicationFormProps {
  onSuccess?: () => void;
}

const AgentApplicationForm: React.FC<AgentApplicationFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.user_metadata?.name || '',
      email: user?.email || '',
      phone: '',
      recruiter_code: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to apply');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate all fields before submission
      if (!values.full_name || values.full_name.trim().length < 3) {
        throw new Error('Please enter your full name (minimum 3 characters)');
      }
      
      if (!values.email || !values.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      // Make sure to pass all required fields
      await submitSalesAgentApplication({
        user_id: user.id,
        full_name: values.full_name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone?.trim() || undefined,
        recruiter_code: values.recruiter_code?.trim() || undefined,
      });
      
      toast.success('Application Submitted!', {
        description: 'Your sales agent application has been submitted successfully. You\'ll be contacted soon.'
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Unable to submit your application. Please try again.';
      
      if (error.message) {
        if (error.message.includes('duplicate') || error.message.includes('already exists')) {
          errorMessage = 'You have already submitted an application. Please check your application status.';
        } else if (error.message.includes('permission') || error.message.includes('denied')) {
          errorMessage = 'Permission denied. Please make sure you are logged in.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error('Application Submission Failed', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-xl border-2 border-mansagold/20 shadow-2xl hover:shadow-mansagold/30 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mansagold-dark via-mansagold to-mansagold-light animate-pulse" />
      <CardHeader className="border-b border-mansagold/20 bg-gradient-to-r from-mansagold/5 via-mansablue/5 to-mansagold/5 relative">
        <CardTitle className="text-2xl bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light bg-clip-text text-transparent">
          Sales Agent Application
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Apply to become a Mansa Musa Marketplace sales agent and earn commissions on referrals.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recruiter_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recruiter's Code (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter referral code if recruited by another agent" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    If another agent referred you, enter their code here. They'll earn bonuses when you're approved!
                  </p>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-semibold shadow-xl shadow-mansagold/30 hover:shadow-2xl hover:shadow-mansagold/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-foreground/70 border-t border-mansagold/20 bg-gradient-to-r from-mansagold/5 via-mansablue/5 to-mansagold/5">
        After submission, you'll need to complete a qualification test.
      </CardFooter>
    </Card>
  );
};

export default AgentApplicationForm;
