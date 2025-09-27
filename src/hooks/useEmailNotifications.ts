import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WelcomeEmailData {
  userId: string;
  email: string;
  fullName: string;
  userType: 'customer' | 'business' | 'sponsor';
}

interface NotificationEmailData {
  userId: string;
  email: string;
  type: 'points_milestone' | 'reward_expiry' | 'new_business' | 'special_offer' | 'weekly_digest';
  subject: string;
  data: {
    fullName?: string;
    points?: number;
    businessName?: string;
    offerDetails?: string;
    rewardName?: string;
    expiryDate?: string;
    weeklyStats?: {
      pointsEarned: number;
      businessesVisited: number;
      rewardsRedeemed: number;
    };
  };
}

export const useEmailNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendWelcomeEmail = async (data: WelcomeEmailData) => {
    setIsLoading(true);
    try {
      console.log('Sending welcome email:', data);
      
      const { data: result, error } = await supabase.functions.invoke('send-welcome-email', {
        body: data
      });

      if (error) {
        console.error('Welcome email error:', error);
        throw error;
      }

      console.log('Welcome email sent successfully:', result);
      return { success: true, data: result };
      
    } catch (error: any) {
      console.error('Error sending welcome email:', error);
      toast({
        title: 'Email Error',
        description: 'Failed to send welcome email. Please check your connection.',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotificationEmail = async (data: NotificationEmailData) => {
    setIsLoading(true);
    try {
      console.log('Sending notification email:', data);
      
      const { data: result, error } = await supabase.functions.invoke('send-notification-email', {
        body: data
      });

      if (error) {
        console.error('Notification email error:', error);
        throw error;
      }

      console.log('Notification email sent successfully:', result);
      return { success: true, data: result };
      
    } catch (error: any) {
      console.error('Error sending notification email:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const sendPointsMilestoneEmail = async (userId: string, email: string, fullName: string, points: number) => {
    return sendNotificationEmail({
      userId,
      email,
      type: 'points_milestone',
      subject: `🏆 Congratulations! You've reached ${points} points!`,
      data: { fullName, points }
    });
  };

  const sendRewardExpiryEmail = async (userId: string, email: string, fullName: string, rewardName: string, expiryDate: string) => {
    return sendNotificationEmail({
      userId,
      email,
      type: 'reward_expiry',
      subject: `⚠️ Your ${rewardName} reward expires soon!`,
      data: { fullName, rewardName, expiryDate }
    });
  };

  const sendNewBusinessEmail = async (userId: string, email: string, fullName: string, businessName: string) => {
    return sendNotificationEmail({
      userId,
      email,
      type: 'new_business',
      subject: `🏪 New business: ${businessName} just joined!`,
      data: { fullName, businessName }
    });
  };

  const sendSpecialOfferEmail = async (userId: string, email: string, fullName: string, businessName: string, offerDetails: string) => {
    return sendNotificationEmail({
      userId,
      email,
      type: 'special_offer',
      subject: `🎁 Special offer from ${businessName}!`,
      data: { fullName, businessName, offerDetails }
    });
  };

  const sendWeeklyDigestEmail = async (userId: string, email: string, fullName: string, weeklyStats: { pointsEarned: number; businessesVisited: number; rewardsRedeemed: number; }) => {
    return sendNotificationEmail({
      userId,
      email,
      type: 'weekly_digest',
      subject: '📊 Your weekly community impact summary',
      data: { fullName, weeklyStats }
    });
  };

  return {
    isLoading,
    sendWelcomeEmail,
    sendNotificationEmail,
    sendPointsMilestoneEmail,
    sendRewardExpiryEmail,
    sendNewBusinessEmail,
    sendSpecialOfferEmail,
    sendWeeklyDigestEmail
  };
};