import React, { useState } from 'react';
import { DirectoryPartner, PartnerReferral, PartnerPayout, PartnerStats } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, DollarSign, TrendingUp, Copy, Code, Download, 
  ArrowUpRight, Clock, CheckCircle2, XCircle, Award
} from 'lucide-react';
import PartnerReferralsTable from './PartnerReferralsTable';
import PartnerPayoutsTable from './PartnerPayoutsTable';
import PartnerEmbedWidget from './PartnerEmbedWidget';
import PayoutRequestDialog from './PayoutRequestDialog';
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
            <h1 className="text-2xl font-bold">{partner.directory_name}</h1>
            {getTierBadge(partner.tier)}
            {getStatusBadge(partner.status)}
          </div>
          <p className="text-muted-foreground">Partner since {format(new Date(partner.created_at), 'MMMM yyyy')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCopyReferralLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Referral Link
          </Button>
          <Button 
            onClick={() => setShowPayoutDialog(true)}
            disabled={partner.pending_earnings <= 0 || partner.status !== 'active'}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Referral Link Card */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Your Referral Link</p>
              <code className="text-sm bg-background px-3 py-2 rounded border block overflow-x-auto">
                {partner.referral_link}
              </code>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Code: <strong>{partner.referral_code}</strong></p>
              <p className="text-xs text-muted-foreground">
                ${partner.flat_fee_per_signup} per signup + {partner.revenue_share_percent}% rev share
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-primary/60" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +{stats.thisMonthReferrals} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">{stats.totalConversions}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-500/60" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.conversionRate.toFixed(1)}% rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-500/60" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ${stats.paidEarnings.toFixed(2)} paid
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-2xl font-bold text-green-600">${stats.pendingEarnings.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500/60" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +${stats.thisMonthEarnings.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="referrals" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="embed">Embed Widget</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={exportReferralsCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>
                Businesses that signed up using your referral link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PartnerReferralsTable referrals={referrals} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Your earnings withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PartnerPayoutsTable payouts={payouts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Embed Stats Widget
              </CardTitle>
              <CardDescription>
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
      </Tabs>

      <PayoutRequestDialog
        open={showPayoutDialog}
        onOpenChange={setShowPayoutDialog}
        pendingAmount={partner.pending_earnings}
        onSubmit={onRequestPayout}
      />
    </div>
  );
};

export default PartnerDashboard;
