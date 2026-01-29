import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Code2, 
  Key, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Eye,
  Ban,
  RotateCcw,
  ExternalLink,
  Users,
  Zap,
  DollarSign,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DeveloperAccount {
  id: string;
  user_id: string;
  company_name: string;
  contact_email: string;
  website_url: string | null;
  plan_type: string;
  status: string;
  created_at: string;
  monthly_api_calls: number;
  profiles?: { full_name: string | null; email: string | null } | null;
}

interface ApiKey {
  id: string;
  developer_id: string;
  name: string;
  key_prefix: string;
  environment: string;
  rate_limit_per_minute: number;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

interface UsageLog {
  id: string;
  endpoint: string;
  method: string;
  response_status: number;
  latency_ms: number | null;
  billed_units: number;
  request_timestamp: string;
}

const AdminDevelopers: React.FC = () => {
  const [developers, setDevelopers] = useState<DeveloperAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState<DeveloperAccount | null>(null);
  const [developerKeys, setDeveloperKeys] = useState<ApiKey[]>([]);
  const [developerUsage, setDeveloperUsage] = useState<UsageLog[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stats, setStats] = useState({
    totalDevelopers: 0,
    activeDevelopers: 0,
    totalApiCalls: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchDevelopers();
    fetchStats();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const { data, error } = await supabase
        .from('developer_accounts')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevelopers(data || []);
    } catch (error) {
      console.error('Error fetching developers:', error);
      toast.error('Failed to load developer accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total developers
      const { count: totalDevelopers } = await supabase
        .from('developer_accounts')
        .select('*', { count: 'exact', head: true });

      // Get active developers (status = 'active')
      const { count: activeDevelopers } = await supabase
        .from('developer_accounts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get total API calls (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: usageData } = await supabase
        .from('api_usage_logs')
        .select('billed_units')
        .gte('request_timestamp', thirtyDaysAgo.toISOString());

      const totalApiCalls = usageData?.reduce((sum, log) => sum + (log.billed_units || 1), 0) || 0;

      // Estimate revenue (simplified calculation)
      const { data: proDevs } = await supabase
        .from('developer_accounts')
        .select('plan_type')
        .eq('status', 'active');

      const proCount = proDevs?.filter(d => d.plan_type === 'pro').length || 0;
      const enterpriseCount = proDevs?.filter(d => d.plan_type === 'enterprise').length || 0;
      const totalRevenue = (proCount * 299) + (enterpriseCount * 999); // Rough estimate

      setStats({
        totalDevelopers: totalDevelopers || 0,
        activeDevelopers: activeDevelopers || 0,
        totalApiCalls,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchDeveloperDetails = async (developer: DeveloperAccount) => {
    setSelectedDeveloper(developer);
    setDetailsOpen(true);

    try {
      // Fetch API keys
      const { data: keys } = await supabase
        .from('api_keys')
        .select('*')
        .eq('developer_id', developer.id)
        .order('created_at', { ascending: false });

      setDeveloperKeys(keys || []);

      // Fetch recent usage logs
      const { data: usage } = await supabase
        .from('api_usage_logs')
        .select('*')
        .eq('developer_id', developer.id)
        .order('request_timestamp', { ascending: false })
        .limit(50);

      setDeveloperUsage(usage || []);
    } catch (error) {
      console.error('Error fetching developer details:', error);
    }
  };

  const updateDeveloperStatus = async (developerId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('developer_accounts')
        .update({ status: newStatus })
        .eq('id', developerId);

      if (error) throw error;
      
      toast.success(`Developer status updated to ${newStatus}`);
      fetchDevelopers();
      
      if (selectedDeveloper?.id === developerId) {
        setSelectedDeveloper({ ...selectedDeveloper, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update developer status');
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', keyId);

      if (error) throw error;
      
      toast.success('API key revoked');
      if (selectedDeveloper) {
        fetchDeveloperDetails(selectedDeveloper);
      }
    } catch (error) {
      console.error('Error revoking key:', error);
      toast.error('Failed to revoke API key');
    }
  };

  const filteredDevelopers = developers.filter(dev => 
    dev.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.contact_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Badge variant="outline" className="border-white/20 text-white/70">Free</Badge>;
      case 'pro':
        return <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Pro</Badge>;
      case 'enterprise':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Enterprise</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mansagold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-mansagold/20">
                <Users className="h-6 w-6 text-mansagold" />
              </div>
              <div>
                <p className="text-sm text-white/60">Total Developers</p>
                <p className="text-2xl font-bold text-white">{stats.totalDevelopers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Active Developers</p>
                <p className="text-2xl font-bold text-white">{stats.activeDevelopers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">API Calls (30d)</p>
                <p className="text-2xl font-bold text-white">{stats.totalApiCalls.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Est. MRR</p>
                <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Developer List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-mansagold" />
                Developer Accounts
              </CardTitle>
              <CardDescription className="text-white/60">
                Manage API developers and monitor their usage
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search developers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/60">Company</TableHead>
                  <TableHead className="text-white/60">Contact</TableHead>
                  <TableHead className="text-white/60">Plan</TableHead>
                  <TableHead className="text-white/60">Status</TableHead>
                  <TableHead className="text-white/60">API Calls</TableHead>
                  <TableHead className="text-white/60">Joined</TableHead>
                  <TableHead className="text-white/60">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevelopers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-white/60 py-8">
                      No developers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevelopers.map((dev) => (
                    <TableRow key={dev.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium">
                        <div className="flex flex-col">
                          <span>{dev.company_name}</span>
                          {dev.website_url && (
                            <a 
                              href={dev.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-mansagold hover:underline flex items-center gap-1"
                            >
                              {dev.website_url.replace(/^https?:\/\//, '').slice(0, 30)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">
                        <div className="flex flex-col">
                          <span>{dev.profiles?.full_name || 'N/A'}</span>
                          <span className="text-xs text-white/50">{dev.contact_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(dev.plan_type)}</TableCell>
                      <TableCell>{getStatusBadge(dev.status)}</TableCell>
                      <TableCell className="text-white/80">
                        {dev.monthly_api_calls.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white/60 text-sm">
                        {format(new Date(dev.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => fetchDeveloperDetails(dev)}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {dev.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateDeveloperStatus(dev.id, 'suspended')}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateDeveloperStatus(dev.id, 'active')}
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Developer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Code2 className="h-5 w-5 text-mansagold" />
              {selectedDeveloper?.company_name}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Developer account details and API usage
            </DialogDescription>
          </DialogHeader>

          {selectedDeveloper && (
            <div className="space-y-6 mt-4">
              {/* Account Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 mb-1">Status</p>
                  {getStatusBadge(selectedDeveloper.status)}
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 mb-1">Plan</p>
                  {getPlanBadge(selectedDeveloper.plan_type)}
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 mb-1">Monthly Calls</p>
                  <p className="font-semibold">{selectedDeveloper.monthly_api_calls.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 mb-1">Member Since</p>
                  <p className="font-semibold text-sm">{format(new Date(selectedDeveloper.created_at), 'MMM d, yyyy')}</p>
                </div>
              </div>

              {/* API Keys */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Key className="h-4 w-4 text-mansagold" />
                  API Keys ({developerKeys.length})
                </h3>
                <div className="space-y-2">
                  {developerKeys.length === 0 ? (
                    <p className="text-white/50 text-sm">No API keys created</p>
                  ) : (
                    developerKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{key.name}</p>
                            <p className="text-xs text-white/50">
                              {key.key_prefix}••••••• | {key.environment} | {key.rate_limit_per_minute} req/min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {key.last_used_at && (
                            <span className="text-xs text-white/40 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last used: {format(new Date(key.last_used_at), 'MMM d, HH:mm')}
                            </span>
                          )}
                          {key.revoked_at ? (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Revoked</Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => revokeApiKey(key.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Usage */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-mansagold" />
                  Recent API Activity
                </h3>
                <div className="max-h-64 overflow-y-auto rounded-lg border border-white/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60 text-xs">Endpoint</TableHead>
                        <TableHead className="text-white/60 text-xs">Method</TableHead>
                        <TableHead className="text-white/60 text-xs">Status</TableHead>
                        <TableHead className="text-white/60 text-xs">Latency</TableHead>
                        <TableHead className="text-white/60 text-xs">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {developerUsage.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-white/50 py-4">
                            No API activity recorded
                          </TableCell>
                        </TableRow>
                      ) : (
                        developerUsage.map((log) => (
                          <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                            <TableCell className="text-white/80 text-xs font-mono">{log.endpoint}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                                {log.method}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={log.response_status < 400 
                                ? "bg-green-500/20 text-green-400 border-green-500/30" 
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                              }>
                                {log.response_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white/60 text-xs">
                              {log.latency_ms ? `${log.latency_ms}ms` : '-'}
                            </TableCell>
                            <TableCell className="text-white/50 text-xs">
                              {format(new Date(log.request_timestamp), 'MMM d, HH:mm:ss')}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDevelopers;
