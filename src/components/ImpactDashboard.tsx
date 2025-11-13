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
      <Card className="w-full glass-card bg-white/10 border-white/20">
        <CardHeader className="text-center py-12">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-mansagold to-mansagold-dark flex items-center justify-center mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-3">Track Your Impact</CardTitle>
          <CardDescription className="text-lg text-white/80">
            Sign in to see how you're building Black wealth and circulating money within the community
          </CardDescription>
          <div className="mt-8 flex gap-4 justify-center">
            <Button size="lg" className="gradient-gold text-mansablue-dark hover-glow-gold font-bold">
              Sign In
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Card className="animate-pulse glass-card bg-white/10 border-white/20">
          <CardHeader>
            <div className="h-8 bg-white/20 rounded w-1/3" />
            <div className="h-5 bg-white/20 rounded w-2/3 mt-3" />
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-white/20 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) return null;

  const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <Card className="glass-card bg-white/10 border-white/20 hover:scale-105 hover-glow-gold transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-white/70">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {trend && (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-mansagold/30 to-mansagold-dark/30 flex items-center justify-center">
            <Icon className="h-7 w-7 text-mansagold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-mansagold to-mansagold-dark flex items-center justify-center animate-pulse-slow shadow-lg shadow-mansagold/50">
            <Heart className="h-8 w-8 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Your Impact Story</h1>
            <p className="text-lg text-white/80">Building Black wealth, one transaction at a time</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={shareImpact} className="border-white/40 text-white hover:bg-white/10 hover-glow-gold">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 hover-glow-gold">
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/10 border border-white/20">
          <TabsTrigger value="week" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">This Week</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">This Month</TabsTrigger>
          <TabsTrigger value="year" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">This Year</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-6 mt-6">
          {/* AI-Generated Impact Story */}
          <Card className="glass-card bg-gradient-to-br from-mansagold/20 to-white/10 border-mansagold/30 hover:scale-[1.02] transition-all duration-300 hover-glow-gold">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-mansagold animate-pulse" />
                <CardTitle className="text-2xl text-white">Your Impact Story</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed whitespace-pre-line text-white/90">
                {report.story}
              </p>
            </CardContent>
          </Card>

          {/* Personal Stats Grid */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Your Personal Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <h2 className="text-2xl font-semibold mb-6 text-white">Community Collective Power</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <Card className="glass-card bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Businesses You've Empowered</CardTitle>
                <CardDescription className="text-lg text-white/70">These Black-owned businesses are thriving because of you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {report.stats.businesses.map((business) => (
                    <Badge key={business.id} variant="secondary" className="px-4 py-2 text-base bg-mansagold/20 text-white border border-mansagold/30 hover:bg-mansagold/30 transition-colors">
                      {business.business_name}
                      <span className="text-sm text-white/60 ml-2">• {business.category}</span>
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
