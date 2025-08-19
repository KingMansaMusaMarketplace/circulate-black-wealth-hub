import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logPasswordUpdate } from '@/lib/security/audit-logger';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MFASetup from '@/components/auth/MFASetup';

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  newPassword: z.string().min(6, {
    message: 'New password must be at least 6 characters.',
  }),
  confirmPassword: z.string().min(6, {
    message: 'Confirm password must be at least 6 characters.',
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const SecuritySettings = () => {
  const { updateUserPassword, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);
      
      if (!user?.email) {
        throw new Error('User email not found');
      }
      
      // Verify current password by attempting to sign in with current credentials
      const verificationResult = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });
      
      if (verificationResult.error) {
        throw new Error('Current password is incorrect');
      }
      
      // Now update the password
      const result = await updateUserPassword(data.currentPassword, data.newPassword);
      
      if (!result.success) throw new Error(result.error?.message || 'Failed to update password');
      
      // Log the password update for security audit
      await logPasswordUpdate(user.id);
      
      form.reset();
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating your password.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="password" className="space-y-6">
      <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="mfa">Two-Factor Auth</TabsTrigger>
      </TabsList>
      
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password Security</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="mfa">
        <MFASetup />
      </TabsContent>
    </Tabs>
  );
};

export default SecuritySettings;
