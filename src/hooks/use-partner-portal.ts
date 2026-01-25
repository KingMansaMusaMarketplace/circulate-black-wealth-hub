import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DirectoryPartner, PartnerReferral, PartnerPayout, PartnerStats } from '@/types/partner';

export function usePartnerPortal() {
  const [partner, setPartner] = useState<DirectoryPartner | null>(null);
  const [referrals, setReferrals] = useState<PartnerReferral[]>([]);
  const [payouts, setPayouts] = useState<PartnerPayout[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPartner, setIsPartner] = useState(false);
  const { toast } = useToast();

  const fetchPartnerData = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch partner record
      const { data: partnerData, error: partnerError } = await supabase
        .from('directory_partners')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (partnerError && partnerError.code !== 'PGRST116') {
        throw partnerError;
      }

      if (!partnerData) {
        setIsPartner(false);
        setLoading(false);
        return;
      }

      setPartner(partnerData as DirectoryPartner);
      setIsPartner(true);

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('partner_referrals')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;
      setReferrals((referralsData || []) as PartnerReferral[]);

      // Fetch payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('partner_payouts')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      if (payoutsError) throw payoutsError;
      setPayouts((payoutsData || []) as PartnerPayout[]);

      // Calculate stats
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const thisMonthReferrals = (referralsData || []).filter(
        r => new Date(r.created_at) >= thisMonth
      );
      
      const paidPayouts = (payoutsData || []).filter(p => p.status === 'completed');
      const paidEarnings = paidPayouts.reduce((sum, p) => sum + Number(p.amount), 0);

      setStats({
        totalReferrals: partnerData.total_referrals,
        totalConversions: partnerData.total_conversions,
        conversionRate: partnerData.total_referrals > 0 
          ? (partnerData.total_conversions / partnerData.total_referrals) * 100 
          : 0,
        totalEarnings: Number(partnerData.total_earnings),
        pendingEarnings: Number(partnerData.pending_earnings),
        paidEarnings,
        thisMonthReferrals: thisMonthReferrals.length,
        thisMonthEarnings: thisMonthReferrals.reduce((sum, r) => sum + Number(r.total_earned), 0),
      });

    } catch (error: any) {
      console.error('Error fetching partner data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load partner data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const applyAsPartner = async (data: {
    directory_name: string;
    directory_url?: string;
    contact_email: string;
    contact_phone?: string;
    description?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: newPartner, error } = await supabase
        .from('directory_partners')
        .insert({
          user_id: user.id,
          directory_name: data.directory_name,
          directory_url: data.directory_url || null,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone || null,
          description: data.description || null,
          status: 'pending', // Explicitly set to pending
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email to partner and notification to admin
      try {
        await supabase.functions.invoke('send-partner-notification', {
          body: {
            type: 'application',
            partnerId: newPartner.id,
            partnerEmail: data.contact_email,
            partnerName: data.directory_name,
          },
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the application if email fails
      }

      setPartner(newPartner as DirectoryPartner);
      setIsPartner(true);

      toast({
        title: 'Application Submitted!',
        description: 'Check your email for confirmation. We\'ll notify you once approved.',
      });

      return newPartner;
    } catch (error: any) {
      console.error('Error applying as partner:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const requestPayout = async (amount: number, method: string = 'bank_transfer') => {
    try {
      if (!partner) throw new Error('Not a partner');
      if (amount > partner.pending_earnings) {
        throw new Error('Insufficient pending earnings');
      }

      const { error } = await supabase
        .from('partner_payouts')
        .insert({
          partner_id: partner.id,
          amount,
          payout_method: method,
        });

      if (error) throw error;

      toast({
        title: 'Payout Requested',
        description: `Your payout request of $${amount.toFixed(2)} has been submitted.`,
      });

      await fetchPartnerData();
    } catch (error: any) {
      console.error('Error requesting payout:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to request payout',
        variant: 'destructive',
      });
    }
  };

  const copyReferralLink = () => {
    if (!partner) return;
    navigator.clipboard.writeText(partner.referral_link);
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard',
    });
  };

  const getEmbedCode = () => {
    if (!partner) return '';
    return `<iframe src="https://1325.ai/embed/partner-stats/${partner.embed_token}" width="300" height="200" frameborder="0"></iframe>`;
  };

  useEffect(() => {
    fetchPartnerData();
  }, [fetchPartnerData]);

  return {
    partner,
    referrals,
    payouts,
    stats,
    loading,
    isPartner,
    applyAsPartner,
    requestPayout,
    copyReferralLink,
    getEmbedCode,
    refetch: fetchPartnerData,
  };
}
