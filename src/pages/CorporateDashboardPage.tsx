import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, TrendingUp, Users, DollarSign, Award, Settings } from 'lucide-react';
import SubscriptionOverview from '@/components/corporate-dashboard/SubscriptionOverview';
import ImpactMetrics from '@/components/corporate-dashboard/ImpactMetrics';
import BenefitsSection from '@/components/corporate-dashboard/BenefitsSection';
import SubscriptionManagement from '@/components/corporate-dashboard/SubscriptionManagement';

interface CorporateSubscription {
  id: string;
  company_name: string;
  tier: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string;
}

const CorporateDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<CorporateSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchSubscription();
  }, [user, navigate]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No subscription found
          toast.error('No active corporate subscription found. Please subscribe first.');
          navigate('/corporate-sponsorship');
          return;
        }
        throw error;
      }

      setSubscription(data);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dark flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Corporate Dashboard - Mansa Musa Marketplace</title>
        <meta name="description" content="Manage your corporate sponsorship and track your community impact." />
      </Helmet>

      <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-40 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Enhanced Header */}
          <div className="mb-8 animate-fade-in">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-amber-400/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Corporate</span>{' '}
                  <span className="text-white">Dashboard</span> 🏢
                </h1>
                <p className="text-slate-300 text-lg font-medium">
                  Welcome back, {subscription.company_name}! Track your impact and manage your sponsorship ✨
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-slate-800/50 border border-white/10 p-1">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900"
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="impact" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Impact</span>
              </TabsTrigger>
              <TabsTrigger 
                value="benefits" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900"
              >
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Benefits</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <SubscriptionOverview subscription={subscription} />
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Active Tier</CardTitle>
                    <Award className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize text-white">{subscription.tier}</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Your current sponsorship level
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Status</CardTitle>
                    <Users className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize text-white">{subscription.status}</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Subscription health
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Next Billing</CardTitle>
                    <DollarSign className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {subscription.cancel_at_period_end ? 'Cancels at period end' : 'Auto-renews'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="impact">
              <ImpactMetrics subscriptionId={subscription.id} />
            </TabsContent>

            <TabsContent value="benefits">
              <BenefitsSection subscriptionId={subscription.id} tier={subscription.tier} />
            </TabsContent>

            <TabsContent value="settings">
              <SubscriptionManagement 
                subscription={subscription} 
                onUpdate={fetchSubscription}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CorporateDashboardPage;
