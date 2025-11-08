import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import DashboardStats from '@/components/sales-agent/dashboard/DashboardStats';
import ReferralsList from '@/components/sales-agent/dashboard/ReferralsList';
import EarningsBreakdown from '@/components/sales-agent/dashboard/EarningsBreakdown';
import TeamOverview from '@/components/sales-agent/dashboard/TeamOverview';
import CommissionsTable from '@/components/sales-agent/dashboard/CommissionsTable';
import TierProgressCard from '@/components/sales-agent/dashboard/TierProgressCard';
import EarningsChart from '@/components/sales-agent/dashboard/EarningsChart';
import ReferralsChart from '@/components/sales-agent/dashboard/ReferralsChart';
import PerformanceMetrics from '@/components/sales-agent/dashboard/PerformanceMetrics';
import PaymentHistory from '@/components/sales-agent/dashboard/PaymentHistory';
import {
  getAgentReferrals,
  getAgentCommissions,
  getTeamOverrides,
  getRecruitmentBonuses,
  getRecruitedAgents
} from '@/lib/api/sales-agent-api';

const SalesAgentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading: agentLoading, isAgent, agent } = useSalesAgent();

  const [referrals, setReferrals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [teamOverrides, setTeamOverrides] = useState<any[]>([]);
  const [recruitmentBonuses, setRecruitmentBonuses] = useState<any[]>([]);
  const [recruitedAgents, setRecruitedAgents] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!agentLoading && !isAgent) {
      navigate('/sales-agent-signup');
      return;
    }
  }, [user, isAgent, agentLoading, navigate]);

  useEffect(() => {
    if (agent?.id) {
      loadDashboardData();
    }
  }, [agent?.id]);

  const loadDashboardData = async () => {
    if (!agent?.id) return;

    setIsLoadingData(true);
    try {
      const [
        referralsData,
        commissionsData,
        overridesData,
        bonusesData,
        recruitedData
      ] = await Promise.all([
        getAgentReferrals(agent.id),
        getAgentCommissions(agent.id),
        getTeamOverrides(agent.id),
        getRecruitmentBonuses(agent.id),
        getRecruitedAgents(agent.id)
      ]);

      setReferrals(referralsData || []);
      setCommissions(commissionsData || []);
      setTeamOverrides(overridesData || []);
      setRecruitmentBonuses(bonusesData || []);
      setRecruitedAgents(recruitedData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const copyReferralCode = () => {
    if (agent?.referral_code) {
      navigator.clipboard.writeText(agent.referral_code);
      toast.success('Referral code copied to clipboard!');
    }
  };

  const copyReferralLink = () => {
    if (agent?.referral_code) {
      const link = `${window.location.origin}/business-signup?ref=${agent.referral_code}`;
      navigator.clipboard.writeText(link);
      toast.success('Referral link copied to clipboard!');
    }
  };

  if (agentLoading || !agent) {
    return (
      <ResponsiveLayout title="Agent Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mansablue mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const totalEarned = agent.total_earned || 0;
  const pendingCommissions = agent.total_pending || 0;
  const directCommissions = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);
  const teamOverridesTotal = teamOverrides
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.override_amount), 0);
  const recruitmentBonusesTotal = recruitmentBonuses
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + parseFloat(b.bonus_amount), 0);

  return (
    <ResponsiveLayout title="Agent Dashboard">
      <Helmet>
        <title>Sales Agent Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Manage your sales agent account and track your earnings" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {agent.full_name}!</h1>
            <p className="text-muted-foreground mt-1">
              Here's your sales performance overview
            </p>
          </div>
          
          <Card className="w-full sm:w-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Your Referral Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="text-2xl font-bold bg-muted px-3 py-1 rounded">
                  {agent.referral_code}
                </code>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyReferralCode}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Code
                </Button>
                <Button size="sm" variant="outline" onClick={copyReferralLink}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <DashboardStats
          totalReferrals={agent.lifetime_referrals || 0}
          totalEarned={totalEarned}
          pendingCommissions={pendingCommissions}
          recruitedAgents={recruitedAgents.length}
          tier={agent.tier || 'bronze'}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <PerformanceMetrics 
              referrals={referrals} 
              commissions={commissions}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <TierProgressCard agentId={agent.id} />
              <div className="lg:col-span-2">
                <EarningsBreakdown
                  directCommissions={directCommissions}
                  teamOverrides={teamOverridesTotal}
                  recruitmentBonuses={recruitmentBonusesTotal}
                  totalEarnings={totalEarned}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EarningsChart
                commissions={commissions}
                teamOverrides={teamOverrides}
                recruitmentBonuses={recruitmentBonuses}
              />
              <ReferralsChart referrals={referrals} />
            </div>
            
            <ReferralsList referrals={referrals.slice(0, 5)} isLoading={isLoadingData} />
            <TeamOverview
              recruitedAgents={recruitedAgents}
              teamOverrides={teamOverrides}
              isLoading={isLoadingData}
            />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralsList referrals={referrals} isLoading={isLoadingData} />
          </TabsContent>

          <TabsContent value="team">
            <TeamOverview
              recruitedAgents={recruitedAgents}
              teamOverrides={teamOverrides}
              isLoading={isLoadingData}
            />
          </TabsContent>

          <TabsContent value="commissions">
            <CommissionsTable commissions={commissions} isLoading={isLoadingData} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentHistory agentId={agent.id} />
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default SalesAgentDashboardPage;
