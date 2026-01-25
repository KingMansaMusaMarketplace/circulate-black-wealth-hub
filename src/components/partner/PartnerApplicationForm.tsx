import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Building2, Globe, Mail, Phone, FileText } from 'lucide-react';

const applicationSchema = z.object({
  directory_name: z.string().min(2, 'Directory name must be at least 2 characters').max(100),
  directory_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  contact_email: z.string().email('Please enter a valid email'),
  contact_phone: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface PartnerApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => Promise<any>;
}

const PartnerApplicationForm: React.FC<PartnerApplicationFormProps> = ({ onSubmit }) => {
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      directory_name: '',
      directory_url: '',
      contact_email: '',
      contact_phone: '',
      description: '',
    },
  });

  const handleSubmit = async (data: ApplicationFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Building2 className="h-5 w-5 text-amber-400" />
          Partner Application
        </CardTitle>
        <CardDescription className="text-slate-400">
          Tell us about your directory to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="directory_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-400 font-semibold">Directory Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input {...field} placeholder="Atlanta Black Business Directory" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="directory_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-400 font-semibold">Directory Website</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input {...field} placeholder="https://yourblackbusinessdirectory.com" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormDescription>Your current directory website (if any)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-400 font-semibold">Contact Email *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input {...field} type="email" placeholder="you@example.com" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-400 font-semibold">Contact Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input {...field} placeholder="(555) 123-4567" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-400 font-semibold">About Your Directory</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea 
                        {...field} 
                        placeholder="Tell us about your directory, your member base, and why you want to partner with 1325.ai..." 
                        className="pl-10 min-h-[100px]"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Max 500 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-slate-700/40 rounded-lg p-4 space-y-2 border border-slate-600/30">
              <h4 className="font-medium text-white">Partner Benefits</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• <strong className="text-amber-400">$5</strong> for every business that signs up</li>
                <li>• <strong className="text-amber-400">10%</strong> revenue share on premium upgrades</li>
                <li>• <strong className="text-amber-400">Founding Partner</strong> badge for early adopters</li>
                <li>• Full analytics dashboard with CSV exports</li>
                <li>• Embeddable stats widget for your site</li>
              </ul>
            </div>

            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Submitting...' : 'Apply to Become a Partner'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PartnerApplicationForm;
