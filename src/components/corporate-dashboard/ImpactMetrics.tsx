import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrendingUp, Users, DollarSign, Building } from 'lucide-react';

interface ImpactMetricsProps {
  subscriptionId: string;
}

interface Metrics {
  businesses_supported: number;
  total_transactions: number;
  community_reach: number;
  economic_impact: number;
}

const ImpactMetrics: React.FC<ImpactMetricsProps> = ({ subscriptionId }) => {
  const [metrics, setMetrics] = useState<Metrics>({
    businesses_supported: 0,
    total_transactions: 0,
    community_reach: 0,
    economic_impact: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [subscriptionId]);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsor_impact_metrics')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('metric_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setMetrics({
          businesses_supported: data.businesses_supported || 0,
          total_transactions: data.total_transactions || 0,
          community_reach: data.community_reach || 0,
          economic_impact: data.economic_impact || 0,
        });
      }
    } catch (error: any) {
      console.error('Error fetching metrics:', error);
      toast.error('Failed to load impact metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Impact</CardTitle>
          <CardDescription>
            Track the real difference your sponsorship is making
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Businesses Supported</p>
              </div>
              <p className="text-3xl font-bold">{metrics.businesses_supported}</p>
              <p className="text-xs text-muted-foreground">
                Black-owned businesses helped
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              </div>
              <p className="text-3xl font-bold">{metrics.total_transactions}</p>
              <p className="text-xs text-muted-foreground">
                Customer transactions facilitated
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Community Reach</p>
              </div>
              <p className="text-3xl font-bold">{metrics.community_reach.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                People impacted
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Economic Impact</p>
              </div>
              <p className="text-3xl font-bold">
                ${metrics.economic_impact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground">
                Wealth circulated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Impact Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            As a {metrics.businesses_supported > 0 ? 'valued' : 'new'} corporate sponsor, you're part of a movement that's creating real economic change in Black communities.
          </p>
          {metrics.businesses_supported > 0 && (
            <>
              <p className="text-muted-foreground">
                Your support has helped <strong>{metrics.businesses_supported} Black-owned businesses</strong> grow and thrive, 
                facilitating <strong>{metrics.total_transactions} transactions</strong> and circulating 
                <strong> ${metrics.economic_impact.toLocaleString()}</strong> in economic value.
              </p>
              <p className="text-muted-foreground">
                Together, we're building wealth, creating opportunities, and strengthening communities.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactMetrics;
