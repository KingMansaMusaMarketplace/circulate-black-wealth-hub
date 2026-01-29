import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Building2, TrendingUp, Handshake, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEcosystemStats } from '@/hooks/use-technical-partner';

interface PartnerPoweredApp {
  name: string;
  description: string;
  partnerSources: string[];
  businessesUsed: number;
  apiCalls: string;
  isFeatured?: boolean;
}

const PartnerPoweredShowcase: React.FC = () => {
  const { stats, loading } = useEcosystemStats();

  // Example partner-powered apps
  const partnerPoweredApps: PartnerPoweredApp[] = [
    {
      name: 'AfroMarket',
      description: 'Uses partner-referred business data to power local discovery',
      partnerSources: ['Black Pages Network', 'DMV Directory'],
      businessesUsed: 234,
      apiCalls: '45K/mo',
      isFeatured: true,
    },
    {
      name: 'LocalFirst',
      description: 'Community marketplace built on partner-sourced businesses',
      partnerSources: ['Atlanta Business League'],
      businessesUsed: 156,
      apiCalls: '28K/mo',
      isFeatured: true,
    },
    {
      name: 'CommunityBank',
      description: 'Credit union platform using partner network data',
      partnerSources: ['Houston Black Chamber'],
      businessesUsed: 89,
      apiCalls: '12K/mo',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="glass-card border-mansagold/30 bg-gradient-to-r from-mansagold/10 to-amber-500/5">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-mansagold/20 border border-mansagold/30">
                <Handshake className="h-8 w-8 text-mansagold" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Partner-Powered Apps
                  <Badge className="bg-mansagold/20 text-mansagold border-mansagold/50">
                    Ecosystem
                  </Badge>
                </h2>
                <p className="text-white/60 text-sm">
                  Apps built using data from our {stats?.active_partners || 0}+ partner directories
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-mansagold">{stats?.partner_referred_businesses || 0}+</p>
                <p className="text-xs text-white/50">Businesses Available</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{stats?.app_attributed_businesses || 0}</p>
                <p className="text-xs text-white/50">Apps Using Data</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner-Powered Apps Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partnerPoweredApps.map((app, index) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full glass-card border-white/10 hover:border-mansagold/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    {app.name}
                    {app.isFeatured && (
                      <Star className="h-4 w-4 text-mansagold fill-mansagold" />
                    )}
                  </CardTitle>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-xs">
                    <Handshake className="h-3 w-3 mr-1" />
                    Partner-Powered
                  </Badge>
                </div>
                <CardDescription className="text-white/60 text-sm">
                  {app.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Partner Sources */}
                <div>
                  <p className="text-xs text-white/40 mb-2">Data Sources</p>
                  <div className="flex flex-wrap gap-1">
                    {app.partnerSources.map((source) => (
                      <Badge 
                        key={source} 
                        variant="outline" 
                        className="text-xs border-white/20 text-white/70"
                      >
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm bg-slate-900/40 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-white/70">{app.businessesUsed} businesses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-white/70">{app.apiCalls}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA to Partner Program */}
      <Card className="glass-card border-white/10">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-mansagold/10 border border-mansagold/30">
                <Users className="h-6 w-6 text-mansagold" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Own a Business Directory?</h3>
                <p className="text-sm text-white/60">
                  Become a partner and earn when developers use your business data
                </p>
              </div>
            </div>
            <Button asChild className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold">
              <Link to="/partner-portal">
                Join Partner Program
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerPoweredShowcase;
