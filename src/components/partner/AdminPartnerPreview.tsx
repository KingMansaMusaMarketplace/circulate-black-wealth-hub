import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DirectoryPartner, PartnerReferral, PartnerPayout, PartnerStats } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Eye, Loader2, Users } from 'lucide-react';
import PartnerDashboard from './PartnerDashboard';
import { useToast } from '@/hooks/use-toast';

const AdminPartnerPreview: React.FC = () => {
  const [partners, setPartners] = useState<DirectoryPartner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<DirectoryPartner | null>(null);
  const [referrals, setReferrals] = useState<PartnerReferral[]>([]);
  const [payouts, setPayouts] = useState<PartnerPayout[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPartner, setLoadingPartner] = useState(false);
  const { toast } = useToast();

  // Fetch all partners for the selector
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from('directory_partners')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPartners((data || []) as DirectoryPartner[]);
      } catch (error: any) {
        console.error('Error fetching partners:', error);
        toast({
          title: 'Error',
          description: 'Failed to load partners',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [toast]);

  // Fetch selected partner's full data
  const fetchPartnerData = async (partnerId: string) => {
    try {
      setLoadingPartner(true);
      
      // Fetch partner
      const { data: partnerData, error: partnerError } = await supabase
        .from('directory_partners')
        .select('*')
        .eq('id', partnerId)
        .single();

      if (partnerError) throw partnerError;
      setSelectedPartner(partnerData as DirectoryPartner);

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('partner_referrals')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;
      setReferrals((referralsData || []) as PartnerReferral[]);

      // Fetch payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('partner_payouts')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (payoutsError) throw payoutsError;
      setPayouts((payoutsData || []) as PartnerPayout[]);

      // Calculate stats
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const thisMonthReferrals = (referralsData || []).filter(
        (r: any) => new Date(r.created_at) >= thisMonth
      );
      
      const paidPayouts = (payoutsData || []).filter((p: any) => p.status === 'completed');
      const paidEarnings = paidPayouts.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

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
        thisMonthEarnings: thisMonthReferrals.reduce((sum: number, r: any) => sum + Number(r.total_earned), 0),
      });

    } catch (error: any) {
      console.error('Error fetching partner data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load partner data',
        variant: 'destructive',
      });
    } finally {
      setLoadingPartner(false);
    }
  };

  const handlePartnerSelect = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    fetchPartnerData(partnerId);
  };

  const handleBack = () => {
    setSelectedPartnerId(null);
    setSelectedPartner(null);
    setReferrals([]);
    setPayouts([]);
    setStats(null);
  };

  // Admin-only copy link (read-only preview)
  const handleCopyReferralLink = () => {
    if (!selectedPartner) return;
    navigator.clipboard.writeText(selectedPartner.referral_link);
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard (Admin Preview)',
    });
  };

  // Admin can't request payouts on behalf of partners
  const handleRequestPayout = async () => {
    toast({
      title: 'Admin Preview Mode',
      description: 'Payout requests can only be made by the partner themselves.',
      variant: 'default',
    });
  };

  const getEmbedCode = () => {
    if (!selectedPartner) return '';
    return `<iframe src="https://1325.ai/embed/partner-stats/${selectedPartner.embed_token}" width="300" height="200" frameborder="0"></iframe>`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show partner selector if no partner selected
  if (!selectedPartnerId || !selectedPartner || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-900">
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="w-5 h-5 text-amber-400" />
                Admin Partner Dashboard Preview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Select a partner to view their dashboard as they would see it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {partners.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No partners yet</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Partners will appear here once they apply
                  </p>
                </div>
              ) : (
                <>
                  <Select onValueChange={handlePartnerSelect} value={selectedPartnerId || undefined}>
                    <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white">
                      <SelectValue placeholder="Select a partner to preview..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {partners.map((partner) => (
                        <SelectItem 
                          key={partner.id} 
                          value={partner.id}
                          className="text-white hover:bg-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <span>{partner.directory_name}</span>
                            <Badge 
                              variant={partner.status === 'active' ? 'default' : 'outline'}
                              className={partner.status === 'active' ? 'bg-green-500 text-white' : ''}
                            >
                              {partner.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {partner.tier}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {loadingPartner && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-slate-400">Loading partner dashboard...</span>
                    </div>
                  )}

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-slate-300 mb-3">All Partners ({partners.length})</h3>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {partners.map((partner) => (
                        <div 
                          key={partner.id}
                          onClick={() => handlePartnerSelect(partner.id)}
                          className="p-3 rounded-lg bg-slate-900/40 border border-slate-700/50 hover:border-amber-500/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">{partner.directory_name}</p>
                              <p className="text-sm text-slate-400">{partner.contact_email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={partner.status === 'active' ? 'default' : 'outline'}
                                className={partner.status === 'active' ? 'bg-green-500 text-white' : 'text-slate-400'}
                              >
                                {partner.status}
                              </Badge>
                              <Button size="sm" variant="ghost" className="text-amber-400 hover:text-amber-300">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show the actual dashboard with admin indicator
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-900">
      {/* Admin Preview Banner */}
      <div className="bg-amber-500/20 border-b border-amber-500/30 py-2 px-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/20"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to List
            </Button>
            <Badge className="bg-amber-500 text-slate-900">
              <Eye className="w-3 h-3 mr-1" />
              Admin Preview Mode
            </Badge>
          </div>
          <p className="text-sm text-amber-300">
            Viewing as: <strong>{selectedPartner.directory_name}</strong>
          </p>
        </div>
      </div>

      <PartnerDashboard
        partner={selectedPartner}
        stats={stats}
        referrals={referrals}
        payouts={payouts}
        onCopyReferralLink={handleCopyReferralLink}
        onRequestPayout={handleRequestPayout}
        getEmbedCode={getEmbedCode}
      />
    </div>
  );
};

export default AdminPartnerPreview;
