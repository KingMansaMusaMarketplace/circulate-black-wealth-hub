
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import ReferralsList from './ReferralsList';
import CommissionsList from './CommissionsList';
import ReferralCode from './ReferralCode';
import BadgesShowcase from './BadgesShowcase';
import AgentQRCodeGenerator from './AgentQRCodeGenerator';
import QRCodeAnalytics from './QRCodeAnalytics';

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferralCode referralCode={agent.referral_code} />
        <AgentQRCodeGenerator referralCode={agent.referral_code} />
      </div>

      <QRCodeAnalytics referralCode={agent.referral_code} />
      
      {/* Marketing Materials Button */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-full">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Marketing Materials Library</h3>
                <p className="text-sm text-muted-foreground">Download social media graphics, email templates, and more</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/marketing-materials'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Browse Materials
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="referrals" className="bg-white p-4 rounded-lg shadow border border-blue-100">
        <TabsList className="grid grid-cols-5 mb-4 bg-blue-50">
          <TabsTrigger value="referrals" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Customer Referrals</TabsTrigger>
          <TabsTrigger value="commissions" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Commissions</TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Achievements</TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">My Team</TabsTrigger>
          <TabsTrigger value="recruitment" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Recruitment</TabsTrigger>
        </TabsList>
        <TabsContent value="referrals">
          <ReferralsList referrals={referrals} />
        </TabsContent>
        <TabsContent value="commissions">
          <CommissionsList commissions={commissions} />
        </TabsContent>
        <TabsContent value="achievements">
          <BadgesShowcase agentId={agent.id} />
        </TabsContent>
        <TabsContent value="team">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-mansablue">Agents You've Recruited</h3>
            <p className="text-sm text-gray-600 mb-4">
              Earn 7.5% override commissions on your team's earned commissions for 6 months after recruitment.
            </p>
            <div className="text-center text-gray-500 py-8">
              <p>No recruited agents yet. Share your referral code with potential agents!</p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="recruitment">
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-mansablue/10 border-mansablue/20">
              <h3 className="text-lg font-semibold mb-2 text-mansablue">Agent Recruitment Program</h3>
              <p className="text-sm text-gray-600 mb-4">
                Build your sales team and earn additional income through two streams:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-sm mb-1 text-gray-700">One-Time Bonus</p>
                  <p className="text-2xl font-bold text-mansablue mb-1">$75</p>
                  <p className="text-xs text-gray-500">After recruited agent makes 3 business sales</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-sm mb-1 text-gray-700">Team Override</p>
                  <p className="text-2xl font-bold text-mansablue mb-1">7.5%</p>
                  <p className="text-xs text-gray-500">Of their commissions for 6 months</p>
                </div>
              </div>
            </Card>
            
            <Tabs defaultValue="bonuses" className="w-full">
              <TabsList className="bg-blue-50">
                <TabsTrigger value="bonuses" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Recruitment Bonuses</TabsTrigger>
                <TabsTrigger value="overrides" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Team Overrides</TabsTrigger>
              </TabsList>
              <TabsContent value="bonuses">
                <Card className="p-6 text-center text-gray-500">
                  <p>No recruitment bonuses yet. Refer other agents to earn $75 bonuses after they make 3 business sales!</p>
                </Card>
              </TabsContent>
              <TabsContent value="overrides">
                <Card className="p-6 text-center text-gray-500">
                  <p>No team override commissions yet. Recruit agents and earn 7.5% on their commissions for 6 months!</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDashboard;
