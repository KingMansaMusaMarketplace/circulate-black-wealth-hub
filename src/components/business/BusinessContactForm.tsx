import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, CheckCircle, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const contactFormSchema = z.object({
  sender_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  sender_email: z.string().email('Please enter a valid email').max(255, 'Email too long'),
  sender_phone: z.string().max(20, 'Phone number too long').optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long (max 2000 characters)'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface BusinessContactFormProps {
  businessId: string;
  businessName: string;
}

export const BusinessContactForm: React.FC<BusinessContactFormProps> = ({ 
  businessId, 
  businessName 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      sender_name: '',
      sender_email: '',
      sender_phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('business_contact_requests')
        .insert({
          business_id: businessId,
          sender_name: data.sender_name.trim(),
          sender_email: data.sender_email.trim().toLowerCase(),
          sender_phone: data.sender_phone?.trim() || null,
          subject: data.subject.trim(),
          message: data.message.trim(),
        });

      if (error) throw error;

      // Optionally trigger email notification via edge function
      try {
        await supabase.functions.invoke('notify-business-contact', {
          body: {
            businessId,
            senderName: data.sender_name,
            subject: data.subject,
          },
        });
      } catch {
        // Email notification is optional, don't fail the whole request
      }

      setIsSubmitted(true);
      reset();
      toast.success('Message sent successfully!');
    } catch (error: any) {
      console.error('Error sending contact request:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
          <p className="text-blue-200 mb-4">
            Your message has been sent to {businessName}. They will respond to you via email.
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-yellow-400" />
          Contact {businessName}
        </CardTitle>
        <CardDescription className="text-blue-200 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Your contact info is shared only with this business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sender_name" className="text-white">
                Your Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="sender_name"
                {...register('sender_name')}
                placeholder="John Doe"
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-300/50"
              />
              {errors.sender_name && (
                <p className="text-sm text-red-400">{errors.sender_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender_email" className="text-white">
                Your Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="sender_email"
                type="email"
                {...register('sender_email')}
                placeholder="you@example.com"
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-300/50"
              />
              {errors.sender_email && (
                <p className="text-sm text-red-400">{errors.sender_email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_phone" className="text-white">
              Phone Number <span className="text-blue-300/70">(optional)</span>
            </Label>
            <Input
              id="sender_phone"
              type="tel"
              {...register('sender_phone')}
              placeholder="(555) 123-4567"
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-300/50"
            />
            {errors.sender_phone && (
              <p className="text-sm text-red-400">{errors.sender_phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white">
              Subject <span className="text-red-400">*</span>
            </Label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="What's this about?"
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-300/50"
            />
            {errors.subject && (
              <p className="text-sm text-red-400">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Message <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell them what you're looking for..."
              rows={4}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-300/50 resize-none"
            />
            {errors.message && (
              <p className="text-sm text-red-400">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 font-semibold"
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessContactForm;
