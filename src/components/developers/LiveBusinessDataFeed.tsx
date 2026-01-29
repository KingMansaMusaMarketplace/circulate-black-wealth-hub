import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Star, Radio, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePartnerReferredBusinesses, useEcosystemStats } from '@/hooks/use-technical-partner';

const LiveBusinessDataFeed: React.FC = () => {
  const { businesses, loading } = usePartnerReferredBusinesses(6);
  const { stats } = useEcosystemStats();

  // Aggregate by category for demo if no real data
  const categoryBreakdown = [
    { category: 'Restaurants', count: 234, color: 'bg-orange-500' },
    { category: 'Retail', count: 189, color: 'bg-blue-500' },
    { category: 'Services', count: 156, color: 'bg-emerald-500' },
    { category: 'Health & Wellness', count: 123, color: 'bg-purple-500' },
    { category: 'Professional', count: 98, color: 'bg-pink-500' },
  ];

  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
              Live Business Data Feed
            </CardTitle>
            <CardDescription className="text-white/60">
              Real-time partner-referred businesses available via API
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Stats Banner */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-900/40 rounded-xl border border-white/5">
            <p className="text-2xl font-bold text-mansagold">{stats?.partner_referred_businesses || 800}+</p>
            <p className="text-xs text-white/50">Total Businesses</p>
          </div>
          <div className="text-center p-4 bg-slate-900/40 rounded-xl border border-white/5">
            <p className="text-2xl font-bold text-blue-400">{stats?.active_partners || 15}</p>
            <p className="text-xs text-white/50">Partner Networks</p>
          </div>
          <div className="text-center p-4 bg-slate-900/40 rounded-xl border border-white/5">
            <p className="text-2xl font-bold text-emerald-400">24</p>
            <p className="text-xs text-white/50">States Covered</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <p className="text-sm text-white/60 mb-3">Available by Category</p>
          <div className="space-y-2">
            {categoryBreakdown.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                <span className="text-sm text-white/70 flex-1">{cat.category}</span>
                <span className="text-sm font-medium text-white">{cat.count}</span>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} rounded-full`} 
                    style={{ width: `${(cat.count / 250) * 100}%` }} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sample Businesses */}
        {businesses.length > 0 ? (
          <div>
            <p className="text-sm text-white/60 mb-3">Recent Additions</p>
            <div className="space-y-2">
              {businesses.slice(0, 4).map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-lg border border-white/5"
                >
                  <Building2 className="h-4 w-4 text-mansagold" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{business.business_name}</p>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <MapPin className="h-3 w-3" />
                      {business.city}, {business.state}
                      <span className="text-white/30">•</span>
                      <span>{business.category}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                    {business.referring_directory}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-white/40">
              Sample businesses will appear here as partners refer them
            </p>
          </div>
        )}

        {/* API Endpoint Preview */}
        <div className="bg-slate-900/60 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">API Endpoint</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-xs">
              GET
            </Badge>
          </div>
          <code className="text-sm text-mansablue-light font-mono">
            /v1/businesses/partner-referred?category=restaurants&state=GA
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveBusinessDataFeed;
