
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import ReferralsList from './ReferralsList';
import CommissionsList from './CommissionsList';
import ReferralCode from './ReferralCode';

const AgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    loading, 
    agent, 
    referrals, 
    commissions,
    totalEarned,
    totalPending
  } = useSalesAgent();

  if (loading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="animate-spin w-12 h-12 border-t-4 border-mansablue border-solid rounded-full"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center p-8">
        <p>You are not registered as a sales agent.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEarned)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals.length}</div>
          </CardContent>
        </Card>
      </div>

      <ReferralCode referralCode={agent.referral_code} />

      <Tabs defaultValue="referrals">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>
        <TabsContent value="referrals">
          <ReferralsList referrals={referrals} />
        </TabsContent>
        <TabsContent value="commissions">
          <CommissionsList commissions={commissions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDashboard;
