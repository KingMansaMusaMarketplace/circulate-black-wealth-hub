import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Users, Code, Building2, Handshake, DollarSign, 
  ArrowUpRight, ArrowRight, RefreshCw, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEcosystemStats } from '@/hooks/use-technical-partner';
import EcosystemImpactCard from '@/components/shared/EcosystemImpactCard';

const AdminEcosystemDashboard: React.FC = () => {
  const { stats, loading } = useEcosystemStats();

  // Mock technical partners list (would come from DB)
  const technicalPartners = [
    { id: '1', developerName: 'AfroMarket', partnerName: 'Black Pages Network', appReferrals: 234, earnings: 450.00, status: 'active' },
    { id: '2', developerName: 'LocalFirst', partnerName: 'DMV Directory', appReferrals: 156, earnings: 280.00, status: 'active' },
    { id: '3', developerName: 'CommunityShop', partnerName: null, appReferrals: 89, earnings: 125.00, status: 'pending' },
  ];

  // Mock cross-pollination metrics
  const crossMetrics = {
    partnersBecomingDevelopers: 3,
    developersBecomingPartners: 2,
    businessesInBothPools: 156,
    combinedRevenue: (stats?.total_partner_earnings || 0) + (stats?.total_technical_partner_earnings || 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Handshake className="h-7 w-7 text-mansagold" />
            Partner-Developer Ecosystem
          </h2>
          <p className="text-white/60 mt-1">
            Combined revenue streams and cross-pollination metrics
          </p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
          Live Metrics
        </Badge>
      </div>

      {/* Ecosystem Impact Card */}
      <EcosystemImpactCard variant="full" />

      {/* Revenue Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Partner Revenue</p>
                <p className="text-2xl font-bold text-amber-400">
                  ${(stats?.total_partner_earnings || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Users className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              From {stats?.active_partners || 0} partners
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Technical Partner Revenue</p>
                <p className="text-2xl font-bold text-blue-400">
                  ${(stats?.total_technical_partner_earnings || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Code className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              From {stats?.technical_partners || 0} tech partners
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Combined Revenue</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ${crossMetrics.combinedRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/20">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-emerald-400/70 mt-2 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Ecosystem synergy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Cross-Pollination</p>
                <p className="text-2xl font-bold text-purple-400">
                  {crossMetrics.partnersBecomingDevelopers + crossMetrics.developersBecomingPartners}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Handshake className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Users in both programs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technical Partners Table */}
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="h-5 w-5 text-mansagold" />
                Technical Partners
              </CardTitle>
              <CardDescription className="text-slate-400">
                Developers earning from both APIs and referrals
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {technicalPartners.map((tp, index) => (
              <motion.div
                key={tp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-mansablue/20 flex items-center justify-center">
                    <Code className="h-5 w-5 text-mansablue" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{tp.developerName}</p>
                    <p className="text-xs text-white/50">
                      {tp.partnerName ? `Partner: ${tp.partnerName}` : 'Developer only'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{tp.appReferrals}</p>
                    <p className="text-xs text-white/50">App Referrals</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-400">${tp.earnings.toFixed(2)}</p>
                    <p className="text-xs text-white/50">Earnings</p>
                  </div>
                  <Badge className={
                    tp.status === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  }>
                    {tp.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Virtuous Cycle Visualization */}
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mansagold" />
            Virtuous Cycle Health
          </CardTitle>
          <CardDescription className="text-slate-400">
            The feedback loop between partners, businesses, developers, and apps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 flex-wrap py-6">
            {/* Partner Node */}
            <div className="text-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 w-32">
              <Users className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{stats?.active_partners || 0}</p>
              <p className="text-xs text-white/50">Partners</p>
            </div>
            
            <ArrowRight className="h-6 w-6 text-white/30" />
            
            {/* Business Node */}
            <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 w-32">
              <Building2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{stats?.partner_referred_businesses || 0}</p>
              <p className="text-xs text-white/50">Businesses</p>
            </div>
            
            <ArrowRight className="h-6 w-6 text-white/30" />
            
            {/* Developer Node */}
            <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/30 w-32">
              <Code className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{stats?.active_developers || 0}</p>
              <p className="text-xs text-white/50">Developers</p>
            </div>
            
            <ArrowRight className="h-6 w-6 text-white/30" />
            
            {/* App Node */}
            <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/30 w-32">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{stats?.app_attributed_businesses || 0}</p>
              <p className="text-xs text-white/50">App Integrations</p>
            </div>
          </div>
          
          <p className="text-center text-sm text-white/40 mt-4">
            Partners bring businesses → Businesses become API data → Developers build apps → Apps drive value → More referrals
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
          <Link to="/partner-portal">
            <Users className="h-4 w-4 mr-2" />
            Partner Portal
            <ExternalLink className="h-3 w-3 ml-2" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
          <Link to="/developers">
            <Code className="h-4 w-4 mr-2" />
            Developer Portal
            <ExternalLink className="h-3 w-3 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminEcosystemDashboard;
