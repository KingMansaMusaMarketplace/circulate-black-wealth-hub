import React, { useState } from 'react';
import { DirectoryPartner, PartnerReferral, PartnerPayout, PartnerStats } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, DollarSign, TrendingUp, Copy, Code, Download, 
  ArrowUpRight, Clock, CheckCircle2, XCircle, Award, HelpCircle, Megaphone
} from 'lucide-react';
import PartnerReferralsTable from './PartnerReferralsTable';
import PartnerPayoutsTable from './PartnerPayoutsTable';
import PartnerEmbedWidget from './PartnerEmbedWidget';
import PayoutRequestDialog from './PayoutRequestDialog';
import PartnerFAQ from './PartnerFAQ';
import { PartnerMarketingHub } from './marketing';
import { format } from 'date-fns';

interface PartnerDashboardProps {
  partner: DirectoryPartner;
  stats: PartnerStats;
  referrals: PartnerReferral[];
  payouts: PartnerPayout[];
  onCopyReferralLink: () => void;
  onRequestPayout: (amount: number, method: string) => Promise<void>;
  getEmbedCode: () => string;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({
  partner,
  stats,
  referrals,
  payouts,
  onCopyReferralLink,
  onRequestPayout,
  getEmbedCode,
}) => {
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'founding':
        return <Badge className="bg-amber-500 text-white"><Award className="w-3 h-3 mr-1" />Founding Partner</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500 text-white">Premium</Badge>;
      default:
        return <Badge variant="secondary">Standard</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="w-3 h-3 mr-1" />Pending Approval</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportReferralsCSV = () => {
    const headers = ['Date', 'Email', 'Business Name', 'Status', 'Converted', 'Earned'];
    const rows = referrals.map(r => [
      format(new Date(r.created_at), 'yyyy-MM-dd'),
      r.referred_email,
      r.referred_business_name || 'N/A',
      r.status,
      r.is_converted ? 'Yes' : 'No',
      `$${r.total_earned.toFixed(2)}`,
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `partner-referrals-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{partner.directory_name}</h1>
            {getTierBadge(partner.tier)}
            {getStatusBadge(partner.status)}
          </div>
          <p className="text-slate-400">Partner since {format(new Date(partner.created_at), 'MMMM yyyy')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCopyReferralLink} className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Copy className="w-4 h-4 mr-2" />
            Copy Referral Link
          </Button>
          <Button 
            onClick={() => setShowPayoutDialog(true)}
            disabled={partner.pending_earnings <= 0 || partner.status !== 'active'}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Referral Link Card */}
      <Card className="mb-8 border-amber-500/30 bg-amber-500/10 backdrop-blur-xl">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium mb-1 text-slate-300">Your Referral Link</p>
              <code className="text-sm bg-slate-900/60 px-3 py-2 rounded border border-slate-700 block overflow-x-auto text-amber-400">
                {partner.referral_link}
              </code>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Code: <strong className="text-amber-400">{partner.referral_code}</strong></p>
              <p className="text-xs text-slate-400">
                ${partner.flat_fee_per_signup} per signup + {partner.revenue_share_percent}% rev share
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Referrals</p>
                <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400/60" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              +{stats.thisMonthReferrals} this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Conversions</p>
                <p className="text-2xl font-bold text-white">{stats.totalConversions}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-emerald-400/60" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {stats.conversionRate.toFixed(1)}% rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-400/60" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ${stats.paidEarnings.toFixed(2)} paid
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Payout</p>
                <p className="text-2xl font-bold text-emerald-400">${stats.pendingEarnings.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-400/60" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              +${stats.thisMonthEarnings.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="referrals" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="bg-slate-800/60 border border-slate-700/50 inline-flex min-w-max">
              <TabsTrigger value="referrals" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Referrals</TabsTrigger>
              <TabsTrigger value="marketing" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-400 font-medium">
                <Megaphone className="w-4 h-4 mr-1" />
                Marketing
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Analytics</TabsTrigger>
              <TabsTrigger value="payouts" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Payouts</TabsTrigger>
              <TabsTrigger value="embed" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Embed</TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                <HelpCircle className="w-4 h-4 mr-1" />
                FAQ
              </TabsTrigger>
            </TabsList>
          </div>
          <Button variant="outline" size="sm" onClick={exportReferralsCSV} className="border-slate-600 text-slate-300 hover:bg-slate-800 shrink-0">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <TabsContent value="referrals">
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Recent Referrals</CardTitle>
              <CardDescription className="text-slate-400">
                Businesses that signed up using your referral link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PartnerReferralsTable referrals={referrals} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <PartnerMarketingHub partner={partner} stats={stats} />
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Payout History</CardTitle>
              <CardDescription className="text-slate-400">
                Your earnings withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PartnerPayoutsTable payouts={payouts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed">
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Code className="w-5 h-5 text-amber-400" />
                Embed Stats Widget
              </CardTitle>
              <CardDescription className="text-slate-400">
                Add this widget to your directory site to show your partnership stats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PartnerEmbedWidget 
                embedCode={getEmbedCode()} 
                stats={stats}
                partnerName={partner.directory_name}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
            <CardContent className="pt-6">
              <PartnerFAQ variant="full" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PayoutRequestDialog
        open={showPayoutDialog}
        onOpenChange={setShowPayoutDialog}
        pendingAmount={partner.pending_earnings}
        minimumThreshold={partner.minimum_payout_threshold || 50}
        onSubmit={onRequestPayout}
      />
    </div>
  );
};

export default PartnerDashboard;
