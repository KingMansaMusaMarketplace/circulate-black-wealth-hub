import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { 
  TechnicalPartner, 
  EcosystemCrossStats, 
  PartnerReferredBusiness,
  DeveloperEcosystemData,
  PartnerDeveloperImpact
} from '@/types/technical-partner';

export function useEcosystemStats() {
  const [stats, setStats] = useState<EcosystemCrossStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('ecosystem_cross_stats')
          .select('*')
          .single();

        if (error) throw error;
        setStats(data as EcosystemCrossStats);
      } catch (error) {
        console.error('Error fetching ecosystem stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}

export function usePartnerReferredBusinesses(limit = 10) {
  const [businesses, setBusinesses] = useState<PartnerReferredBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data, error } = await supabase
          .from('partner_referred_businesses_api')
          .select('*')
          .limit(limit);

        if (error) throw error;
        setBusinesses((data || []) as PartnerReferredBusiness[]);
      } catch (error) {
        console.error('Error fetching partner-referred businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [limit]);

  return { businesses, loading };
}

export function useTechnicalPartner() {
  const { user } = useAuth();
  const [technicalPartner, setTechnicalPartner] = useState<TechnicalPartner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTechnicalPartner = async () => {
      try {
        // First get developer account
        const { data: devAccount, error: devError } = await supabase
          .from('developer_accounts')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (devError) throw devError;
        if (!devAccount) {
          setLoading(false);
          return;
        }

        // Then get technical partner status
        const { data, error } = await supabase
          .from('technical_partners')
          .select('*')
          .eq('developer_id', devAccount.id)
          .maybeSingle();

        if (error) throw error;
        setTechnicalPartner(data as TechnicalPartner | null);
      } catch (error) {
        console.error('Error fetching technical partner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicalPartner();
  }, [user]);

  const applyAsTechnicalPartner = async (appName: string, appUrl?: string) => {
    if (!user) {
      toast.error('Please sign in first');
      return false;
    }

    try {
      // Get developer account
      const { data: devAccount, error: devError } = await supabase
        .from('developer_accounts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (devError) throw devError;
      if (!devAccount) {
        toast.error('You need a developer account first');
        return false;
      }

      // Create technical partner application
      const { data, error } = await supabase
        .from('technical_partners')
        .insert({
          developer_id: devAccount.id,
          app_name: appName,
          app_url: appUrl || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      setTechnicalPartner(data as TechnicalPartner);
      toast.success('Technical Partner application submitted!');
      return true;
    } catch (error) {
      console.error('Error applying as technical partner:', error);
      toast.error('Failed to submit application');
      return false;
    }
  };

  return { technicalPartner, loading, applyAsTechnicalPartner };
}

export function useDeveloperEcosystemData(): { data: DeveloperEcosystemData | null; loading: boolean } {
  const { user } = useAuth();
  const [data, setData] = useState<DeveloperEcosystemData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Get ecosystem stats
        const { data: stats } = await supabase
          .from('ecosystem_cross_stats')
          .select('*')
          .single();

        // Get developer account
        const { data: devAccount } = await supabase
          .from('developer_accounts')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        let technicalPartnerStatus = null;
        let technicalPartnerEarnings = 0;

        if (devAccount) {
          const { data: techPartner } = await supabase
            .from('technical_partners')
            .select('status, total_app_earnings')
            .eq('developer_id', devAccount.id)
            .maybeSingle();

          if (techPartner) {
            technicalPartnerStatus = techPartner.status;
            technicalPartnerEarnings = techPartner.total_app_earnings || 0;
          }
        }

        setData({
          appsUsingPartnerData: stats?.app_attributed_businesses || 0,
          businessesAvailable: stats?.partner_referred_businesses || 0,
          apiCallsFromPartnerData: 0, // Would come from usage logs
          partnerNetworks: stats?.active_partners || 0,
          technicalPartnerStatus,
          technicalPartnerEarnings,
        });
      } catch (error) {
        console.error('Error fetching developer ecosystem data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading };
}

export function usePartnerDeveloperImpact(partnerId?: string): { impact: PartnerDeveloperImpact | null; loading: boolean } {
  const [impact, setImpact] = useState<PartnerDeveloperImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerId) {
      setLoading(false);
      return;
    }

    const fetchImpact = async () => {
      try {
        // Get apps using this partner's referred businesses
        const { data: attributions, count } = await supabase
          .from('app_business_attributions')
          .select('api_calls_generated, earnings_attributed', { count: 'exact' })
          .limit(1000);

        // Check if partner is also a technical partner
        const { data: techPartner } = await supabase
          .from('technical_partners')
          .select('status')
          .eq('partner_id', partnerId)
          .maybeSingle();

        const totalApiCalls = attributions?.reduce((sum, a) => sum + (a.api_calls_generated || 0), 0) || 0;
        const totalEarnings = attributions?.reduce((sum, a) => sum + (a.earnings_attributed || 0), 0) || 0;

        setImpact({
          appsUsingReferrals: count || 0,
          apiCallsGenerated: totalApiCalls,
          additionalEarnings: totalEarnings,
          isTechnicalPartner: !!techPartner,
          technicalPartnerStatus: techPartner?.status || null,
        });
      } catch (error) {
        console.error('Error fetching partner developer impact:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, [partnerId]);

  return { impact, loading };
}
