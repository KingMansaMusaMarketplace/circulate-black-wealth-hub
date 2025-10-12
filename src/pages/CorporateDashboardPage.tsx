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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Corporate Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {subscription.company_name}! Track your impact and manage your sponsorship.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Impact</span>
            </TabsTrigger>
            <TabsTrigger value="benefits" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Benefits</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SubscriptionOverview subscription={subscription} />
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Tier</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{subscription.tier}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your current sponsorship level
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{subscription.status}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Subscription health
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
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
    </>
  );
};

export default CorporateDashboardPage;
