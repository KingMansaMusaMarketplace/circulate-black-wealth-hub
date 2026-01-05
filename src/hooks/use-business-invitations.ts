import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface BusinessInvitation {
  id: string;
  inviter_user_id: string;
  inviter_business_id: string | null;
  invitee_email: string;
  invitee_business_name: string | null;
  invitation_token: string;
  message: string | null;
  status: 'pending' | 'opened' | 'signed_up' | 'expired';
  opened_at: string | null;
  signed_up_at: string | null;
  converted_business_id: string | null;
  points_awarded: number;
  created_at: string;
  expires_at: string;
}

export const useBusinessInvitations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's sent invitations
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['business-invitations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('business_invitations')
        .select('*')
        .eq('inviter_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as BusinessInvitation[];
    },
    enabled: !!user,
  });

  // Get invitation stats
  const stats = {
    total: invitations?.length || 0,
    pending: invitations?.filter(i => i.status === 'pending').length || 0,
    opened: invitations?.filter(i => i.status === 'opened').length || 0,
    signedUp: invitations?.filter(i => i.status === 'signed_up').length || 0,
    pointsEarned: invitations?.reduce((sum, i) => sum + (i.points_awarded || 0), 0) || 0,
  };

  // Send invitation mutation
  const sendInvitation = useMutation({
    mutationFn: async ({ 
      email, 
      businessName, 
      message 
    }: { 
      email: string; 
      businessName?: string; 
      message?: string;
    }) => {
      if (!user) throw new Error('Must be logged in to send invitations');

      const { data, error } = await supabase
        .from('business_invitations')
        .insert({
          inviter_user_id: user.id,
          invitee_email: email,
          invitee_business_name: businessName || null,
          message: message || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Send email via edge function
      try {
        await supabase.functions.invoke('send-business-invitation', {
          body: {
            invitationId: data.id,
            email,
            businessName,
            message,
            inviterName: user.user_metadata?.full_name || user.email,
          }
        });
      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError);
        // Don't fail the whole operation if email fails
      }

      return data as BusinessInvitation;
    },
    onSuccess: (data) => {
      toast.success('Invitation sent!', {
        description: `Invitation sent to ${data.invitee_email}`
      });
      queryClient.invalidateQueries({ queryKey: ['business-invitations'] });
    },
    onError: (error) => {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    }
  });

  // Bulk send invitations
  const sendBulkInvitations = useMutation({
    mutationFn: async (invitations: { email: string; businessName?: string }[]) => {
      if (!user) throw new Error('Must be logged in to send invitations');

      const results = await Promise.allSettled(
        invitations.map(inv => 
          supabase
            .from('business_invitations')
            .insert({
              inviter_user_id: user.id,
              invitee_email: inv.email,
              invitee_business_name: inv.businessName || null,
            })
            .select()
            .single()
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { successful, failed, total: invitations.length };
    },
    onSuccess: (data) => {
      toast.success(`Sent ${data.successful} invitations!`, {
        description: data.failed > 0 ? `${data.failed} failed to send` : undefined
      });
      queryClient.invalidateQueries({ queryKey: ['business-invitations'] });
    },
    onError: (error) => {
      console.error('Error sending bulk invitations:', error);
      toast.error('Failed to send invitations');
    }
  });

  // Get shareable invitation link
  const getInviteLink = () => {
    if (!user) return '';
    // Use referral code if available, otherwise use user id
    const baseUrl = window.location.origin;
    return `${baseUrl}/business-signup?ref=${user.id}`;
  };

  // Copy invite link
  const copyInviteLink = () => {
    const link = getInviteLink();
    navigator.clipboard.writeText(link);
    toast.success('Invite link copied!', {
      description: 'Share this with business owners to invite them to the platform'
    });
  };

  return {
    invitations: invitations || [],
    stats,
    isLoading,
    sendInvitation: sendInvitation.mutate,
    sendBulkInvitations: sendBulkInvitations.mutate,
    isSending: sendInvitation.isPending || sendBulkInvitations.isPending,
    getInviteLink,
    copyInviteLink,
  };
};
