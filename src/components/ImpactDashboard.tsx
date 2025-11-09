import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Store, 
  DollarSign, 
  Clock, 
  Heart,
  Sparkles,
  Share2,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ImpactStats {
  totalSpent: number;
  uniqueBusinesses: number;
  totalVisits: number;
  transactionCount: number;
  businesses: Array<{ id: string; business_name: string; category: string }>;
}

interface CommunityStats {
  totalCirculation: number;
  activeUsers: number;
  businessesSupported: number;
  circulationTimeHours: number;
}

interface ImpactReport {
  story: string;
  stats: ImpactStats;
  communityStats: CommunityStats;
}

export const ImpactDashboard = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<ImpactReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      loadImpactReport();
    }
  }, [user, period]);

  const loadImpactReport = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('generate-impact-report', {
        body: { userId: user.id, period }
      });

      if (error) throw error;

      setReport(data);
    } catch (error) {
      console.error('Error loading impact report:', error);
      toast.error('Failed to load impact report');
    } finally {
      setIsLoading(false);
    }
  };

  const shareImpact = () => {
    if (!report) return;
    
    const text = `I've circulated $${report.stats.totalSpent.toFixed(2)} in the Black community through Mansa Musa Marketplace this ${period}! Join me in building economic empowerment. 💪`;
    
    if (navigator.share) {
      navigator.share({ text, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Impact story copied to clipboard!');
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Track Your Impact</CardTitle>
          <CardDescription>Sign in to see how you're building Black wealth</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) return null;

  const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Impact Story</h1>
            <p className="text-muted-foreground">Building Black wealth, one transaction at a time</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={shareImpact}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="year">This Year</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-6 mt-6">
          {/* AI-Generated Impact Story */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <CardTitle>Your Impact Story</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {report.story}
              </p>
            </CardContent>
          </Card>

          {/* Personal Stats Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Personal Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={DollarSign}
                label="Money Circulated"
                value={`$${report.stats.totalSpent.toFixed(2)}`}
                trend="Building wealth"
              />
              <StatCard
                icon={Store}
                label="Businesses Supported"
                value={report.stats.uniqueBusinesses}
                trend="Growing network"
              />
              <StatCard
                icon={TrendingUp}
                label="Transactions"
                value={report.stats.transactionCount}
                trend="Active contributor"
              />
              <StatCard
                icon={Heart}
                label="Business Visits"
                value={report.stats.totalVisits}
                trend="Engaged explorer"
              />
            </div>
          </div>

          {/* Community Impact */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Community Collective Power</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={DollarSign}
                label="Total Community Circulation"
                value={`$${report.communityStats.totalCirculation.toLocaleString()}`}
              />
              <StatCard
                icon={Users}
                label="Active Members"
                value={report.communityStats.activeUsers}
              />
              <StatCard
                icon={Store}
                label="Businesses Thriving"
                value={report.communityStats.businessesSupported}
              />
              <StatCard
                icon={Clock}
                label="Dollar Circulation Time"
                value={`${report.communityStats.circulationTimeHours}h`}
                trend={`From 6h baseline`}
              />
            </div>
          </div>

          {/* Businesses You've Supported */}
          {report.stats.businesses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Businesses You've Empowered</CardTitle>
                <CardDescription>These Black-owned businesses are thriving because of you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {report.stats.businesses.map((business) => (
                    <Badge key={business.id} variant="secondary" className="px-3 py-1.5">
                      {business.business_name}
                      <span className="text-xs text-muted-foreground ml-2">• {business.category}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
