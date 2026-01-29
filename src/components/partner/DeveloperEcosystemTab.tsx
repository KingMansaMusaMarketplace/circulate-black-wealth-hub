import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Code, 
  TrendingUp, 
  Building2, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePartnerDeveloperImpact, useTechnicalPartner } from '@/hooks/use-technical-partner';
import { DirectoryPartner } from '@/types/partner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface DeveloperEcosystemTabProps {
  partner: DirectoryPartner;
}

const DeveloperEcosystemTab: React.FC<DeveloperEcosystemTabProps> = ({ partner }) => {
  const { impact, loading: impactLoading } = usePartnerDeveloperImpact(partner.id);
  const { technicalPartner, loading: techLoading, applyAsTechnicalPartner } = useTechnicalPartner();
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [appName, setAppName] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!appName.trim()) {
      toast.error('Please enter your app name');
      return;
    }
    setApplying(true);
    const success = await applyAsTechnicalPartner(appName, appUrl);
    setApplying(false);
    if (success) {
      setShowApplyDialog(false);
      setAppName('');
      setAppUrl('');
    }
  };

  // Example apps using this partner's data
  const appsUsingData = [
    { name: 'LocalFirst App', apiCalls: '12K/mo', earnings: 45.00 },
    { name: 'CommunityShop', apiCalls: '8K/mo', earnings: 32.00 },
    { name: 'NeighborDeals', apiCalls: '5K/mo', earnings: 18.50 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="glass-card border-mansablue/30 bg-gradient-to-r from-mansablue/10 to-blue-500/5">
        <CardContent className="py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-mansablue/20 border border-mansablue/30">
                <Code className="h-8 w-8 text-mansablue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Developer Ecosystem Impact</h2>
                <p className="text-white/60 text-sm">
                  See how your referrals power the developer API platform
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {impact?.appsUsingReferrals || appsUsingData.length}
                </p>
                <p className="text-xs text-white/50">Apps Using Data</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {impact?.apiCallsGenerated?.toLocaleString() || '25K'}
                </p>
                <p className="text-xs text-white/50">API Calls/Month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-mansagold">
                  ${impact?.additionalEarnings?.toFixed(2) || '95.50'}
                </p>
                <p className="text-xs text-white/50">Extra Earnings</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Apps Using Your Data */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              Apps Using Your Referrals
            </CardTitle>
            <CardDescription className="text-slate-400">
              Developer apps built on your referred business data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {appsUsingData.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Code className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{app.name}</p>
                    <p className="text-xs text-white/50">{app.apiCalls} API calls</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                  +${app.earnings.toFixed(2)}
                </Badge>
              </motion.div>
            ))}
            
            {appsUsingData.length === 0 && (
              <div className="text-center py-8 text-white/40">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No apps are using your data yet</p>
                <p className="text-xs mt-1">Refer more businesses to increase API value</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Partner CTA */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-mansagold" />
              Become a Technical Partner
            </CardTitle>
            <CardDescription className="text-slate-400">
              Build apps + earn from referrals = Double revenue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {technicalPartner ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-900/40 rounded-lg border border-white/5">
                  {technicalPartner.status === 'active' ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                      <div>
                        <p className="font-medium text-white">You're a Technical Partner!</p>
                        <p className="text-xs text-white/50">
                          Earning {technicalPartner.revenue_share_percent}% on app referrals
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Clock className="h-6 w-6 text-amber-400" />
                      <div>
                        <p className="font-medium text-white">Application Pending</p>
                        <p className="text-xs text-white/50">
                          We'll review your app: {technicalPartner.app_name}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {technicalPartner.status === 'active' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-slate-900/40 rounded-lg border border-white/5">
                      <p className="text-xl font-bold text-mansagold">
                        {technicalPartner.total_app_referrals}
                      </p>
                      <p className="text-xs text-white/50">App Referrals</p>
                    </div>
                    <div className="text-center p-3 bg-slate-900/40 rounded-lg border border-white/5">
                      <p className="text-xl font-bold text-emerald-400">
                        ${technicalPartner.total_app_earnings.toFixed(2)}
                      </p>
                      <p className="text-xs text-white/50">App Earnings</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {[
                    'Earn 5% on businesses referred through your app',
                    'Get preferential API pricing',
                    'Featured in Developer Showcase',
                    'Stack earnings with partner referrals',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-mansagold" />
                      <span className="text-sm text-white/70">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold">
                      Apply as Technical Partner
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-white">Technical Partner Application</DialogTitle>
                      <DialogDescription className="text-white/60">
                        Tell us about the app you're building with our APIs
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="appName" className="text-white/80">App Name *</Label>
                        <Input
                          id="appName"
                          placeholder="e.g., LocalFirst Marketplace"
                          value={appName}
                          onChange={(e) => setAppName(e.target.value)}
                          className="bg-slate-800 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="appUrl" className="text-white/80">App URL (optional)</Label>
                        <Input
                          id="appUrl"
                          placeholder="https://your-app.com"
                          value={appUrl}
                          onChange={(e) => setAppUrl(e.target.value)}
                          className="bg-slate-800 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowApplyDialog(false)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleApply} 
                        disabled={applying}
                        className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark"
                      >
                        {applying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Submit Application
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Developer Portal Link */}
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-mansablue/10 border border-mansablue/30">
                <Code className="h-6 w-6 text-mansablue" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Ready to Build?</h3>
                <p className="text-sm text-white/60">
                  Access the Developer Portal to get API keys and start building
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="border-mansablue/50 text-mansablue hover:bg-mansablue/10">
              <Link to="/developers">
                Open Developer Portal
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperEcosystemTab;
