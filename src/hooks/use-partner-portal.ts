import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  DirectoryPartner, 
  PartnerReferral, 
  PartnerPayout, 
  PartnerStats,
  PartnerLinkClick,
  PartnerInvoice,
  PartnerBonusMilestone,
  LeaderboardEntry,
  FunnelData,
  UTMPerformance,
} from '@/types/partner';

export function usePartnerPortal() {
  const [partner, setPartner] = useState<DirectoryPartner | null>(null);
  const [referrals, setReferrals] = useState<PartnerReferral[]>([]);
  const [payouts, setPayouts] = useState<PartnerPayout[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [clicks, setClicks] = useState<PartnerLinkClick[]>([]);
  const [invoices, setInvoices] = useState<PartnerInvoice[]>([]);
  const [milestones, setMilestones] = useState<PartnerBonusMilestone[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData>({ clicks: 0, signups: 0, conversions: 0 });
  const [utmPerformance, setUtmPerformance] = useState<UTMPerformance[]>([]);
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

      // Fetch all partner data in parallel
      const [
        referralsResult,
        payoutsResult,
        clicksResult,
        invoicesResult,
        milestonesResult,
        leaderboardResult,
      ] = await Promise.all([
        supabase
          .from('partner_referrals')
          .select('*')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('partner_payouts')
          .select('*')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('partner_link_clicks')
          .select('*')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false })
          .limit(500),
        supabase
          .from('partner_invoices')
          .select('*')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('partner_bonus_milestones')
          .select('*')
          .eq('is_active', true)
          .order('referrals_required', { ascending: true }),
        supabase
          .from('partner_leaderboard')
          .select('*')
          .limit(20),
      ]);

      if (referralsResult.error) throw referralsResult.error;
      if (payoutsResult.error) throw payoutsResult.error;
      
      const referralsData = referralsResult.data || [];
      const payoutsData = payoutsResult.data || [];
      const clicksData = clicksResult.data || [];
      const invoicesData = invoicesResult.data || [];
      const milestonesData = milestonesResult.data || [];
      const leaderboardData = leaderboardResult.data || [];

      setReferrals(referralsData as PartnerReferral[]);
      setPayouts(payoutsData as PartnerPayout[]);
      setClicks(clicksData as PartnerLinkClick[]);
      setInvoices(invoicesData as PartnerInvoice[]);
      setMilestones(milestonesData as PartnerBonusMilestone[]);
      setLeaderboard(leaderboardData as LeaderboardEntry[]);

      // Calculate funnel data
      const totalClicks = clicksData.length;
      const totalSignups = referralsData.length;
      const totalConversions = referralsData.filter(r => r.is_converted).length;
      setFunnelData({ clicks: totalClicks, signups: totalSignups, conversions: totalConversions });

      // Calculate UTM performance
      const utmMap = new Map<string, UTMPerformance>();
      referralsData.forEach(ref => {
        const key = `${ref.utm_source || 'direct'}-${ref.utm_medium || ''}-${ref.utm_campaign || ''}`;
        const existing = utmMap.get(key) || {
          source: ref.utm_source || 'direct',
          medium: ref.utm_medium || '',
          campaign: ref.utm_campaign || '',
          clicks: 0,
          signups: 0,
          conversions: 0,
          earnings: 0,
        };
        existing.signups++;
        if (ref.is_converted) existing.conversions++;
        existing.earnings += Number(ref.total_earned);
        utmMap.set(key, existing);
      });
      
      // Add click counts from clicks data
      clicksData.forEach(click => {
        const key = `${click.utm_source || 'direct'}-${click.utm_medium || ''}-${click.utm_campaign || ''}`;
        const existing = utmMap.get(key);
        if (existing) {
          existing.clicks++;
        } else {
          utmMap.set(key, {
            source: click.utm_source || 'direct',
            medium: click.utm_medium || '',
            campaign: click.utm_campaign || '',
            clicks: 1,
            signups: 0,
            conversions: 0,
            earnings: 0,
          });
        }
      });
      
      setUtmPerformance(Array.from(utmMap.values()));

      // Calculate stats
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const thisMonthReferrals = referralsData.filter(
        r => new Date(r.created_at) >= thisMonth
      );
      
      const paidPayouts = payoutsData.filter(p => p.status === 'completed');
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
          status: 'pending',
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
      
      const minimumThreshold = partner.minimum_payout_threshold || 50;
      if (amount < minimumThreshold) {
        throw new Error(`Minimum payout amount is $${minimumThreshold.toFixed(2)}`);
      }
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

  const updateSettings = async (field: string, value: boolean | number) => {
    if (!partner) return;
    
    try {
      const { error } = await supabase
        .from('directory_partners')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', partner.id);

      if (error) throw error;

      setPartner(prev => prev ? { ...prev, [field]: value } : null);
      
      toast({
        title: 'Settings Updated',
        description: 'Your preferences have been saved.',
      });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings',
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

  const downloadInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    // For now, generate a simple text-based receipt
    // In production, this would fetch a PDF from storage
    const receiptContent = `
PARTNER PAYOUT INVOICE
======================
Invoice #: ${invoice.invoice_number}
Date: ${new Date(invoice.invoice_date).toLocaleDateString()}

Partner: ${partner?.directory_name}
Email: ${partner?.contact_email}

Amount: $${invoice.amount.toFixed(2)}
Tax: $${invoice.tax_amount.toFixed(2)}
-----------------------
Total: $${invoice.total_amount.toFixed(2)}

Status: ${invoice.status.toUpperCase()}

Thank you for being a Mansa Musa Marketplace partner!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoice_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchPartnerData();
  }, [fetchPartnerData]);

  return {
    partner,
    referrals,
    payouts,
    stats,
    clicks,
    invoices,
    milestones,
    leaderboard,
    funnelData,
    utmPerformance,
    loading,
    isPartner,
    applyAsPartner,
    requestPayout,
    updateSettings,
    copyReferralLink,
    getEmbedCode,
    downloadInvoice,
    refetch: fetchPartnerData,
  };
}
