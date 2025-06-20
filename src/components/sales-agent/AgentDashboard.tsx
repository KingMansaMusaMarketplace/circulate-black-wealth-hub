
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-mansablue/10 shadow hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mansablue">{formatCurrency(totalEarned)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-mansablue/10 shadow hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mansablue">{formatCurrency(totalPending)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-mansablue/10 shadow hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mansablue">{referrals.length}</div>
          </CardContent>
        </Card>
      </div>

      <ReferralCode referralCode={agent.referral_code} />

      <Tabs defaultValue="referrals" className="bg-white p-4 rounded-lg shadow border border-blue-100">
        <TabsList className="grid grid-cols-2 mb-4 bg-blue-50">
          <TabsTrigger value="referrals" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Referrals</TabsTrigger>
          <TabsTrigger value="commissions" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Commissions</TabsTrigger>
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
