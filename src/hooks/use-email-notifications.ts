
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationData {
  type: 'new_business' | 'verification_approved' | 'new_customer';
  businessId?: string;
  userId: string;
  recipientEmail: string;
  businessName?: string;
  customerName?: string;
}

export const useEmailNotifications = () => {
  const [sending, setSending] = useState(false);

  const sendNotification = async (data: NotificationData) => {
    setSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('send-business-notification', {
        body: data
      });

      if (error) throw error;

      console.log('Notification sent successfully:', result);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification: ' + error.message);
      return { success: false, error };
    } finally {
      setSending(false);
    }
  };

  const sendWelcomeEmail = async (userType: 'business' | 'customer', email: string, userId: string, name: string) => {
    const notificationType = userType === 'business' ? 'new_business' : 'new_customer';
    
    return sendNotification({
      type: notificationType,
      userId,
      recipientEmail: email,
      businessName: userType === 'business' ? name : undefined,
      customerName: userType === 'customer' ? name : undefined
    });
  };

  const sendVerificationApprovalEmail = async (businessId: string, businessName: string, email: string, userId: string) => {
    return sendNotification({
      type: 'verification_approved',
      businessId,
      userId,
      recipientEmail: email,
      businessName
    });
  };

  return {
    sending,
    sendNotification,
    sendWelcomeEmail,
    sendVerificationApprovalEmail
  };
};
