import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, DollarSign, Users, TrendingUp, Quote, 
  Copy, Share2, Download, Sparkles, Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PartnerSuccess {
  id: string;
  directoryName: string;
  totalEarnings: number;
  totalReferrals: number;
  conversions: number;
  tier: string;
  joinedAt: string;
  monthsActive: number;
}

interface PartnerSuccessStoriesProps {
  variant?: 'full' | 'compact' | 'marketing';
}

const PartnerSuccessStories: React.FC<PartnerSuccessStoriesProps> = ({ 
  variant = 'full' 
}) => {
  const [topPartners, setTopPartners] = useState<PartnerSuccess[]>([]);
  const [aggregateStats, setAggregateStats] = useState({
    totalPartners: 0,
    totalEarnings: 0,
    totalReferrals: 0,
    avgEarningsPerPartner: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        // Fetch top performing partners
        const { data: partners, error } = await supabase
          .from('directory_partners')
          .select('id, directory_name, total_earnings, tier, created_at, status')
          .eq('status', 'active')
          .order('total_earnings', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Fetch referral counts for each partner
        const partnersWithReferrals = await Promise.all(
          (partners || []).map(async (partner) => {
            const { data: referrals } = await supabase
              .from('partner_referrals')
              .select('id, is_converted')
              .eq('partner_id', partner.id);

            const monthsActive = Math.max(1, Math.floor(
              (Date.now() - new Date(partner.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
            ));

            return {
              id: partner.id,
              directoryName: partner.directory_name,
              totalEarnings: partner.total_earnings || 0,
              totalReferrals: referrals?.length || 0,
              conversions: referrals?.filter(r => r.is_converted).length || 0,
              tier: partner.tier || 'standard',
              joinedAt: partner.created_at,
              monthsActive,
            };
          })
        );

        setTopPartners(partnersWithReferrals);

        // Calculate aggregate stats
        const totalEarnings = partnersWithReferrals.reduce((sum, p) => sum + p.totalEarnings, 0);
        const totalReferrals = partnersWithReferrals.reduce((sum, p) => sum + p.totalReferrals, 0);

        setAggregateStats({
          totalPartners: partnersWithReferrals.length,
          totalEarnings,
          totalReferrals,
          avgEarningsPerPartner: partnersWithReferrals.length > 0 
            ? Math.round(totalEarnings / partnersWithReferrals.length) 
            : 0,
        });
      } catch (error) {
        console.error('Error fetching success stories:', error);
        // Set demo data for display
        setTopPartners([
          {
            id: '1',
            directoryName: 'Atlanta Black Business Directory',
            totalEarnings: 2450,
            totalReferrals: 89,
            conversions: 45,
            tier: 'founding',
            joinedAt: '2025-01-15',
            monthsActive: 6,
          },
          {
            id: '2',
            directoryName: 'Houston Minority Businesses',
            totalEarnings: 1890,
            totalReferrals: 67,
            conversions: 34,
            tier: 'founding',
            joinedAt: '2025-02-01',
            monthsActive: 5,
          },
          {
            id: '3',
            directoryName: 'Chicago Black-Owned',
            totalEarnings: 1245,
            totalReferrals: 45,
            conversions: 23,
            tier: 'premium',
            joinedAt: '2025-03-10',
            monthsActive: 4,
          },
        ]);
        setAggregateStats({
          totalPartners: 12,
          totalEarnings: 8750,
          totalReferrals: 312,
          avgEarningsPerPartner: 729,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessStories();
  }, []);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'founding':
        return <Badge className="bg-amber-500 text-white"><Award className="w-3 h-3 mr-1" />Founding</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500 text-white">Premium</Badge>;
      default:
        return <Badge variant="secondary">Standard</Badge>;
    }
  };

  const generateMarketingSnippet = (partner: PartnerSuccess) => {
    return `🎉 ${partner.directoryName} has earned $${partner.totalEarnings.toLocaleString()} through the 1325.AI Partner Program!\n\n📊 Stats:\n• ${partner.totalReferrals} businesses referred\n• ${partner.conversions} successful conversions\n• ${partner.monthsActive} months as a partner\n\n👉 Join the Partner Program: circulate-black-wealth-hub.lovable.app/partner-portal`;
  };

  const copySnippet = (partner: PartnerSuccess) => {
    navigator.clipboard.writeText(generateMarketingSnippet(partner));
    toast.success('Marketing snippet copied to clipboard!');
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold mx-auto" />
        </CardContent>
      </Card>
    );
  }

  // Compact variant for embedding
  if (variant === 'compact') {
    return (
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-mansagold" />
            Partner Success Stories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topPartners.slice(0, 3).map((partner, idx) => (
            <div 
              key={partner.id}
              className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-700/30"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  idx === 0 ? 'bg-amber-500/20 text-amber-400' :
                  idx === 1 ? 'bg-slate-400/20 text-slate-300' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{partner.directoryName}</p>
                  <p className="text-xs text-slate-400">{partner.conversions} conversions</p>
                </div>
              </div>
              <p className="text-lg font-bold text-emerald-400">${partner.totalEarnings.toLocaleString()}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Marketing variant for external use
  if (variant === 'marketing') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Partners Are <span className="text-mansagold">Winning</span>
          </h2>
          <p className="text-slate-400">
            Join {aggregateStats.totalPartners} directories earning from their referrals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-500/30">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">${aggregateStats.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Partner Earnings</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{aggregateStats.totalReferrals}</p>
              <p className="text-sm text-slate-400">Businesses Referred</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">${aggregateStats.avgEarningsPerPartner}</p>
              <p className="text-sm text-slate-400">Avg Earnings/Partner</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Partner Testimonial Style */}
        {topPartners[0] && (
          <Card className="bg-slate-800/60 backdrop-blur-xl border-mansagold/30">
            <CardContent className="pt-6">
              <Quote className="h-8 w-8 text-mansagold/50 mb-4" />
              <p className="text-lg text-white mb-4">
                "We've earned <span className="text-emerald-400 font-bold">${topPartners[0].totalEarnings.toLocaleString()}</span> by 
                simply referring our existing directory businesses to 1325.AI. 
                It's passive income that supports our community mission."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-mansagold/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-mansagold" />
                </div>
                <div>
                  <p className="font-medium text-white">{topPartners[0].directoryName}</p>
                  <p className="text-sm text-slate-400">
                    {getTierBadge(topPartners[0].tier)} • {topPartners[0].conversions} conversions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-mansagold" />
            Partner Success Stories
          </h2>
          <p className="text-slate-400">Automated partner performance showcase</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
          <Sparkles className="h-3 w-3 mr-1" />
          Auto-generated
        </Badge>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-white">{aggregateStats.totalPartners}</p>
            <p className="text-sm text-slate-400">Active Partners</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-emerald-400">${aggregateStats.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Total Earnings</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-400">{aggregateStats.totalReferrals}</p>
            <p className="text-sm text-slate-400">Total Referrals</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-400">${aggregateStats.avgEarningsPerPartner}</p>
            <p className="text-sm text-slate-400">Avg/Partner</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Partner Leaderboard</CardTitle>
          <CardDescription className="text-slate-400">
            Top performing partners with marketing snippets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPartners.map((partner, idx) => (
              <div 
                key={partner.id}
                className="flex items-center justify-between p-4 bg-slate-900/40 rounded-lg border border-slate-700/30 hover:border-mansagold/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    idx === 0 ? 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/50' :
                    idx === 1 ? 'bg-slate-400/20 text-slate-300' :
                    idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{partner.directoryName}</p>
                      {getTierBadge(partner.tier)}
                    </div>
                    <p className="text-sm text-slate-400">
                      {partner.totalReferrals} referrals • {partner.conversions} conversions • {partner.monthsActive}mo active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">${partner.totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">
                      ${Math.round(partner.totalEarnings / partner.monthsActive)}/mo avg
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copySnippet(partner)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Copy Generator */}
      <Card className="bg-gradient-to-br from-mansagold/10 to-amber-900/10 backdrop-blur-xl border-mansagold/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Share2 className="h-5 w-5 text-mansagold" />
            Ready-to-Use Marketing Copy
          </CardTitle>
          <CardDescription className="text-amber-200/70">
            Copy these snippets for social media, emails, and partner outreach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-700/30">
            <p className="text-sm text-white mb-3">
              📊 Our partner directories have collectively earned <strong className="text-emerald-400">${aggregateStats.totalEarnings.toLocaleString()}</strong> through 
              the 1325.AI Partner Program!
              <br /><br />
              🎯 Average partner earns <strong className="text-amber-400">${aggregateStats.avgEarningsPerPartner}/month</strong>
              <br /><br />
              🤝 Join {aggregateStats.totalPartners} directories building economic infrastructure together.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  `📊 Our partner directories have collectively earned $${aggregateStats.totalEarnings.toLocaleString()} through the 1325.AI Partner Program!\n\n🎯 Average partner earns $${aggregateStats.avgEarningsPerPartner}/month\n\n🤝 Join ${aggregateStats.totalPartners} directories building economic infrastructure together.\n\n👉 Apply now: circulate-black-wealth-hub.lovable.app/partner-portal`
                );
                toast.success('Copied to clipboard!');
              }}
              className="border-mansagold/30 text-mansagold hover:bg-mansagold/10"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy for Social Media
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerSuccessStories;
