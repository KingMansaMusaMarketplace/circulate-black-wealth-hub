import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Users, TrendingUp, Eye, CheckCircle, XCircle, Clock, Settings, ExternalLink, Download, AlertTriangle, ChevronRight } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const tierPrices = {
  platinum: 15000,
  gold: 5000,
  silver: 1500,
  bronze: 500,
};

const tierPlacements = {
  platinum: ['Homepage Banner', 'Footer', 'Sidebar', 'Directory Featured', 'All Pages'],
  gold: ['Homepage Banner', 'Footer', 'Sidebar', 'Directory Featured'],
  silver: ['Footer', 'Sidebar', 'Directory'],
  bronze: ['Footer'],
};

interface Sponsor {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  status: string;
  is_visible: boolean;
  logo_approved: boolean;
  display_priority: number;
  admin_notes: string | null;
  created_at: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
}

export default function AdminSponsorsPage() {
  const { user, userRole } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Export sponsors to CSV
  const exportToCSV = () => {
    if (!subscriptions || subscriptions.length === 0) {
      toast.error('No sponsors to export');
      return;
    }

    const headers = ['Company Name', 'Tier', 'Status', 'Logo Approved', 'Visible', 'Created At', 'Renewal Date', 'Website'];
    const rows = subscriptions.map(s => [
      s.company_name,
      s.tier,
      s.status,
      s.logo_approved ? 'Yes' : 'No',
      s.is_visible ? 'Yes' : 'No',
      format(new Date(s.created_at), 'yyyy-MM-dd'),
      s.current_period_end ? format(new Date(s.current_period_end), 'yyyy-MM-dd') : 'N/A',
      s.website_url || ''
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sponsors_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Sponsors exported successfully');
  };

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Sponsor[];
    },
    enabled: userRole === 'admin',
  });

  const { data: allMetrics } = useQuery({
    queryKey: ['admin-sponsor-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_impact_metrics')
        .select('*');

      if (error) throw error;
      return data;
    },
    enabled: userRole === 'admin',
  });

  const updateSponsorMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Sponsor> }) => {
      const { error } = await supabase
        .from('corporate_subscriptions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Log the action
      await supabase.from('sponsor_admin_audit').insert({
        admin_user_id: user?.id,
        sponsor_id: id,
        action: Object.keys(updates).join(', '),
        new_value: updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sponsors'] });
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast.success('Sponsor updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update sponsor');
      console.error(error);
    },
  });

  const toggleVisibility = (sponsor: Sponsor) => {
    updateSponsorMutation.mutate({
      id: sponsor.id,
      updates: { is_visible: !sponsor.is_visible },
    });
  };

  const toggleLogoApproval = (sponsor: Sponsor) => {
    updateSponsorMutation.mutate({
      id: sponsor.id,
      updates: { logo_approved: !sponsor.logo_approved },
    });
  };

  const saveAdminNotes = (sponsor: Sponsor) => {
    updateSponsorMutation.mutate({
      id: sponsor.id,
      updates: { admin_notes: adminNotes },
    });
    setEditingSponsor(null);
  };

  // Wait for auth to load before checking role
  if (!user && userRole === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-3xl font-bold mb-6 text-mansagold">Sponsor Management</h1>
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="h-4 w-20 bg-white/10 animate-pulse rounded mb-4"></div>
                <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-3xl font-bold mb-6 text-mansagold">Sponsor Management</h1>
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="h-4 w-20 bg-white/10 animate-pulse rounded mb-4"></div>
                <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeSponsors = subscriptions?.filter((s) => s.status === 'active') || [];
  const pendingApproval = subscriptions?.filter((s) => s.logo_url && !s.logo_approved) || [];
  const expiringSoon = subscriptions?.filter((s) => {
    if (!s.current_period_end || s.status !== 'active') return false;
    const daysLeft = differenceInDays(new Date(s.current_period_end), new Date());
    return daysLeft >= 0 && daysLeft <= 30;
  }) || [];
  const totalRevenue = activeSponsors.reduce(
    (sum, s) => sum + (tierPrices[s.tier as keyof typeof tierPrices] || 0),
    0
  );
  const totalImpressions = allMetrics?.reduce((sum, m) => sum + (m.impressions || 0), 0) || 0;
  const totalClicks = allMetrics?.reduce((sum, m) => sum + (m.clicks || 0), 0) || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      case 'past_due':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-500/10 text-purple-500';
      case 'gold':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'silver':
        return 'bg-zinc-500/10 text-zinc-400';
      case 'bronze':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDaysUntilRenewal = (endDate: string | null) => {
    if (!endDate) return null;
    return differenceInDays(new Date(endDate), new Date());
  };

  const SponsorRow = ({ sponsor }: { sponsor: Sponsor }) => {
    const daysLeft = getDaysUntilRenewal(sponsor.current_period_end);
    
    return (
    <TableRow key={sponsor.id} className="cursor-pointer hover:bg-white/5 border-white/10" onClick={() => navigate(`/admin/sponsors/${sponsor.id}`)}>
      <TableCell className="font-medium text-white">
        <div className="flex items-center gap-3">
          {sponsor.logo_url ? (
            <img 
              src={sponsor.logo_url} 
              alt={sponsor.company_name} 
              className="h-10 w-10 object-contain rounded bg-white/10 border border-white/20"
            />
          ) : (
            <div className="h-10 w-10 bg-white/10 rounded flex items-center justify-center text-xs text-white/60">
              No logo
            </div>
          )}
          <div>
            <div className="font-semibold flex items-center gap-2 text-white">
              {sponsor.company_name}
              {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
                <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs">
                  {daysLeft}d left
                </Badge>
              )}
            </div>
            {sponsor.website_url && (
              <a 
                href={sponsor.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-mansagold/70 hover:text-mansagold flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                Website
              </a>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getTierColor(sponsor.tier)}>{sponsor.tier.toUpperCase()}</Badge>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(sponsor.status)}>{sponsor.status}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {sponsor.logo_url ? (
            sponsor.logo_approved ? (
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" /> Approved
              </Badge>
            ) : (
              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <Clock className="h-3 w-3 mr-1" /> Pending
              </Badge>
            )
          ) : (
            <Badge className="bg-white/10 text-white/60 border border-white/20">
              <XCircle className="h-3 w-3 mr-1" /> No Logo
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Switch
          checked={sponsor.is_visible}
          onCheckedChange={() => toggleVisibility(sponsor)}
          disabled={updateSponsorMutation.isPending}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {sponsor.logo_url && (
            <Button
              variant={sponsor.logo_approved ? "outline" : "default"}
              size="sm"
              onClick={(e) => { e.stopPropagation(); toggleLogoApproval(sponsor); }}
              disabled={updateSponsorMutation.isPending}
              className={sponsor.logo_approved ? "border-white/20 text-white/80 hover:bg-white/10" : "bg-mansagold text-slate-900 hover:bg-mansagold/80"}
            >
              {sponsor.logo_approved ? 'Revoke' : 'Approve'}
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingSponsor(sponsor);
                  setAdminNotes(sponsor.admin_notes || '');
                }}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()} className="bg-slate-900 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-mansagold">Manage {sponsor.company_name}</DialogTitle>
                <DialogDescription className="text-white/60">
                  Configure sponsor settings and add admin notes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Tier Placements</Label>
                  <div className="flex flex-wrap gap-2">
                    {tierPlacements[sponsor.tier as keyof typeof tierPlacements]?.map((placement) => (
                      <Badge key={placement} variant="secondary" className="bg-white/10 text-white/80">{placement}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-white/80">Display Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    defaultValue={sponsor.display_priority}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      updateSponsorMutation.mutate({
                        id: sponsor.id,
                        updates: { display_priority: parseInt(e.target.value) || 0 },
                      });
                    }}
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <p className="text-xs text-white/40">Higher numbers appear first</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white/80">Admin Notes</Label>
                  <Textarea
                    id="notes"
                    value={adminNotes}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes about this sponsor..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                  />
                </div>
                <Button onClick={() => saveAdminNotes(sponsor)} className="bg-mansagold text-slate-900 hover:bg-mansagold/80">Save Notes</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10" onClick={(e) => { e.stopPropagation(); navigate(`/admin/sponsors/${sponsor.id}`); }}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-mansagold">Sponsor Management</h1>
          <div className="flex items-center gap-3">
            {expiringSoon.length > 0 && (
              <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {expiringSoon.length} Expiring Soon
              </Badge>
            )}
            {pendingApproval.length > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                {pendingApproval.length} Pending Approval
              </Badge>
            )}
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              className="border-mansagold/50 text-mansagold hover:bg-mansagold/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium text-white/80">Active Sponsors</span>
              <Users className="h-4 w-4 text-mansagold" />
            </div>
            <div className="text-2xl font-bold text-white">{activeSponsors.length}</div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium text-white/80">Monthly Revenue</span>
              <DollarSign className="h-4 w-4 text-mansagold" />
            </div>
            <div className="text-2xl font-bold text-mansagold">${totalRevenue.toLocaleString()}</div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium text-white/80">Total Impressions</span>
              <Eye className="h-4 w-4 text-mansagold" />
            </div>
            <div className="text-2xl font-bold text-white">{totalImpressions.toLocaleString()}</div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium text-white/80">Total Clicks</span>
              <TrendingUp className="h-4 w-4 text-mansagold" />
            </div>
            <div className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</div>
          </div>
        </div>

        {/* Placement Preview */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl mb-8">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-mansagold">Placement Preview</h3>
            <p className="text-sm text-white/60">Where sponsor logos will appear based on tier</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <h4 className="font-semibold mb-2 text-sm text-white">Homepage Banner</h4>
                <div className="text-xs text-mansagold/80 mb-2">Platinum & Gold</div>
                <div className="flex flex-wrap gap-1">
                  {activeSponsors
                    .filter(s => s.is_visible && s.logo_approved && ['platinum', 'gold'].includes(s.tier))
                    .slice(0, 3)
                    .map(s => (
                      <div key={s.id} className="h-6 w-6 bg-white/10 rounded" title={s.company_name}>
                        {s.logo_url && <img src={s.logo_url} alt="" className="h-full w-full object-contain" />}
                      </div>
                    ))}
                </div>
              </div>
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <h4 className="font-semibold mb-2 text-sm text-white">Footer</h4>
                <div className="text-xs text-mansagold/80 mb-2">All Tiers</div>
                <div className="flex flex-wrap gap-1">
                  {activeSponsors
                    .filter(s => s.is_visible && s.logo_approved)
                    .slice(0, 4)
                    .map(s => (
                      <div key={s.id} className="h-6 w-6 bg-white/10 rounded" title={s.company_name}>
                        {s.logo_url && <img src={s.logo_url} alt="" className="h-full w-full object-contain" />}
                      </div>
                    ))}
                </div>
              </div>
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <h4 className="font-semibold mb-2 text-sm text-white">Directory Sidebar</h4>
                <div className="text-xs text-mansagold/80 mb-2">Silver+</div>
                <div className="flex flex-wrap gap-1">
                  {activeSponsors
                    .filter(s => s.is_visible && s.logo_approved && ['platinum', 'gold', 'silver'].includes(s.tier))
                    .slice(0, 3)
                    .map(s => (
                      <div key={s.id} className="h-6 w-6 bg-white/10 rounded" title={s.company_name}>
                        {s.logo_url && <img src={s.logo_url} alt="" className="h-full w-full object-contain" />}
                      </div>
                    ))}
                </div>
              </div>
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <h4 className="font-semibold mb-2 text-sm text-white">Directory Featured</h4>
                <div className="text-xs text-mansagold/80 mb-2">Gold+</div>
                <div className="flex flex-wrap gap-1">
                  {activeSponsors
                    .filter(s => s.is_visible && s.logo_approved && ['platinum', 'gold'].includes(s.tier))
                    .slice(0, 3)
                    .map(s => (
                      <div key={s.id} className="h-6 w-6 bg-white/10 rounded" title={s.company_name}>
                        {s.logo_url && <img src={s.logo_url} alt="" className="h-full w-full object-contain" />}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sponsors Table with Tabs */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-mansagold">All Sponsors</h3>
            <p className="text-sm text-white/60">Manage and monitor all sponsorships</p>
          </div>
          <div className="p-6">
            <Tabs defaultValue="all">
              <TabsList className="mb-4 bg-white/10 border border-white/10">
                <TabsTrigger value="all" className="data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 text-white/70">All ({subscriptions?.length || 0})</TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 text-white/70">Active ({activeSponsors.length})</TabsTrigger>
                <TabsTrigger value="expiring" className="data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 text-white/70">
                  Expiring Soon ({expiringSoon.length})
                  {expiringSoon.length > 0 && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-orange-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 text-white/70">
                  Pending Approval ({pendingApproval.length})
                  {pendingApproval.length > 0 && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-yellow-500" />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-mansagold">Company</TableHead>
                        <TableHead className="text-mansagold">Tier</TableHead>
                        <TableHead className="text-mansagold">Status</TableHead>
                        <TableHead className="text-mansagold">Logo Status</TableHead>
                        <TableHead className="text-mansagold">Visible</TableHead>
                        <TableHead className="text-mansagold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions?.map((sponsor) => (
                        <SponsorRow key={sponsor.id} sponsor={sponsor} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="active">
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-mansagold">Company</TableHead>
                        <TableHead className="text-mansagold">Tier</TableHead>
                        <TableHead className="text-mansagold">Status</TableHead>
                        <TableHead className="text-mansagold">Logo Status</TableHead>
                        <TableHead className="text-mansagold">Visible</TableHead>
                        <TableHead className="text-mansagold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeSponsors.map((sponsor) => (
                        <SponsorRow key={sponsor.id} sponsor={sponsor} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="expiring">
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-mansagold">Company</TableHead>
                        <TableHead className="text-mansagold">Tier</TableHead>
                        <TableHead className="text-mansagold">Status</TableHead>
                        <TableHead className="text-mansagold">Logo Status</TableHead>
                        <TableHead className="text-mansagold">Visible</TableHead>
                        <TableHead className="text-mansagold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiringSoon.map((sponsor) => (
                        <SponsorRow key={sponsor.id} sponsor={sponsor} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="pending">
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-mansagold">Company</TableHead>
                        <TableHead className="text-mansagold">Tier</TableHead>
                        <TableHead className="text-mansagold">Status</TableHead>
                        <TableHead className="text-mansagold">Logo Status</TableHead>
                        <TableHead className="text-mansagold">Visible</TableHead>
                        <TableHead className="text-mansagold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApproval.map((sponsor) => (
                        <SponsorRow key={sponsor.id} sponsor={sponsor} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}