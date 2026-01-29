import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Key, 
  Copy, 
  Trash2, 
  Plus, 
  BarChart3, 
  Settings,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';

interface DeveloperAccount {
  id: string;
  company_name: string;
  company_website: string | null;
  company_description: string | null;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'pending' | 'active' | 'suspended';
  monthly_cmal_limit: number;
  monthly_voice_limit: number;
  monthly_susu_limit: number;
  monthly_fraud_limit: number;
  created_at: string;
}

interface ApiKey {
  id: string;
  key_prefix: string;
  name: string;
  environment: 'test' | 'live';
  rate_limit_per_minute: number;
  scopes: string[];
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

interface UsageStats {
  endpoint: string;
  total_calls: number;
  total_billed_units: number;
}

const DeveloperDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<DeveloperAccount | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<UsageStats[]>([]);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'test' | 'live'>('test');
  const [creatingKey, setCreatingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/developers/signup');
      return;
    }
    loadDeveloperData();
  }, [user, navigate]);

  const loadDeveloperData = async () => {
    try {
      setLoading(true);
      
      // Load developer account
      const { data: accountData, error: accountError } = await supabase
        .from('developer_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (accountError) throw accountError;

      if (!accountData) {
        navigate('/developers/signup');
        return;
      }

      setAccount(accountData as DeveloperAccount);

      // Load API keys
      const { data: keysData, error: keysError } = await supabase
        .from('api_keys')
        .select('*')
        .eq('developer_id', accountData.id)
        .is('revoked_at', null)
        .order('created_at', { ascending: false });

      if (keysError) throw keysError;
      setApiKeys((keysData as ApiKey[]) || []);

      // Load usage stats
      const { data: usageData, error: usageError } = await supabase
        .rpc('get_developer_monthly_usage', { p_developer_id: accountData.id });

      if (!usageError && usageData) {
        setUsage(usageData as UsageStats[]);
      }
    } catch (error) {
      console.error('Error loading developer data:', error);
      toast.error('Failed to load developer data');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!account || !newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    setCreatingKey(true);
    try {
      // Generate a random key
      const randomBytes = new Uint8Array(24);
      crypto.getRandomValues(randomBytes);
      const randomPart = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .substring(0, 32);
      
      const prefix = newKeyEnv === 'live' ? '1325_live_' : '1325_test_';
      const fullKey = prefix + randomPart;
      
      // Hash the key
      const encoder = new TextEncoder();
      const data = encoder.encode(fullKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Store the hashed key
      const { error } = await supabase
        .from('api_keys')
        .insert({
          developer_id: account.id,
          key_hash: keyHash,
          key_prefix: fullKey.substring(0, 16) + '...',
          name: newKeyName,
          environment: newKeyEnv,
        });

      if (error) throw error;

      setNewlyCreatedKey(fullKey);
      setNewKeyName('');
      setShowNewKeyDialog(false);
      await loadDeveloperData();
      toast.success('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setCreatingKey(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', keyId);

      if (error) throw error;

      await loadDeveloperData();
      toast.success('API key revoked');
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast.error('Failed to revoke API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getUsageForEndpoint = (prefix: string): number => {
    return usage
      .filter(u => u.endpoint.includes(prefix))
      .reduce((sum, u) => sum + (u.total_billed_units || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-mansablue-dark to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  if (!account) {
    return null;
  }

  const usageStats = [
    { 
      name: 'CMAL', 
      used: getUsageForEndpoint('/cmal'), 
      limit: account.monthly_cmal_limit,
      color: 'bg-mansablue' 
    },
    { 
      name: 'Voice', 
      used: getUsageForEndpoint('/voice'), 
      limit: account.monthly_voice_limit,
      color: 'bg-violet-500' 
    },
    { 
      name: 'Susu', 
      used: getUsageForEndpoint('/susu'), 
      limit: account.monthly_susu_limit,
      color: 'bg-mansagold' 
    },
    { 
      name: 'Fraud', 
      used: getUsageForEndpoint('/fraud'), 
      limit: account.monthly_fraud_limit,
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-mansablue-dark to-slate-900 p-6">
      {/* Decorative elements */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansagold/5 to-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-mansablue/5 to-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{account.company_name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={account.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-500/20 text-slate-400'}>
                {account.status}
              </Badge>
              <Badge variant="outline" className="capitalize border-mansagold/50 text-mansagold">
                {account.tier} Plan
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={loadDeveloperData} className="border-white/20 text-white hover:bg-white/10">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList className="bg-slate-800/60 border border-white/10 p-1">
            <TabsTrigger value="keys" className="data-[state=active]:bg-mansablue data-[state=active]:text-white text-white/60">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-mansablue data-[state=active]:text-white text-white/60">
              <BarChart3 className="h-4 w-4 mr-2" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-mansablue data-[state=active]:text-white text-white/60">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            {/* Show newly created key */}
            {newlyCreatedKey && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-mansagold/50 bg-mansagold/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-mansagold">
                      <AlertCircle className="h-5 w-5" />
                      Save Your API Key
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      This is the only time you'll see this key. Copy it now and store it securely.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-slate-900/80 p-3 rounded font-mono text-sm break-all text-mansagold border border-white/10">
                        {newlyCreatedKey}
                      </code>
                      <Button 
                        size="icon" 
                        onClick={() => copyToClipboard(newlyCreatedKey)}
                        className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 border-white/20 text-white hover:bg-white/10"
                      onClick={() => setNewlyCreatedKey(null)}
                    >
                      I've saved this key
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Create new key dialog */}
            <div className="flex justify-end">
              <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Generate API Key</DialogTitle>
                    <DialogDescription className="text-white/60">
                      Create a new API key for your application.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName" className="text-white/80">Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="bg-slate-800 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keyEnv" className="text-white/80">Environment</Label>
                      <Select value={newKeyEnv} onValueChange={(v: 'test' | 'live') => setNewKeyEnv(v)}>
                        <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/20">
                          <SelectItem value="test" className="text-white">Test</SelectItem>
                          <SelectItem value="live" className="text-white">Live</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewKeyDialog(false)} className="border-white/20 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                    <Button onClick={createApiKey} disabled={creatingKey} className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark">
                      {creatingKey && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Generate Key
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* API Keys List */}
            <div className="space-y-4">
              {apiKeys.length === 0 ? (
                <Card className="glass-card border-white/10">
                  <CardContent className="py-8 text-center text-white/60">
                    No API keys yet. Generate your first key to get started.
                  </CardContent>
                </Card>
              ) : (
                apiKeys.map((key) => (
                  <Card key={key.id} className="glass-card border-white/10">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Key className="h-5 w-5 text-mansagold" />
                          <div>
                            <div className="font-medium text-white">{key.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-sm text-white/60 font-mono">
                                {key.key_prefix}
                              </code>
                              <Badge className={key.environment === 'live' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-500/20 text-slate-400 border-slate-500/50'}>
                                {key.environment}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {key.last_used_at && (
                            <span className="text-xs text-white/40">
                              Last used: {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => revokeApiKey(key.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {usageStats.map((stat) => (
                <Card key={stat.name} className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/60">
                      {stat.name} API
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stat.used.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/40 mb-2">
                      of {stat.limit.toLocaleString()} calls
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stat.color}`}
                        style={{ width: `${Math.min(100, (stat.used / stat.limit) * 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Usage by Endpoint</CardTitle>
                <CardDescription className="text-white/60">
                  Detailed breakdown of API calls this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usage.length === 0 ? (
                  <div className="text-center text-white/60 py-8">
                    No API calls recorded yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {usage.map((u) => (
                      <div 
                        key={u.endpoint}
                        className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                      >
                        <code className="text-sm font-mono text-mansablue-light">{u.endpoint}</code>
                        <div className="flex items-center gap-4">
                          <span className="text-white/60 text-sm">{u.total_calls} calls</span>
                          <span className="text-mansagold font-medium">{u.total_billed_units} units</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
                <CardDescription className="text-white/60">
                  Manage your developer account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white/80">Company Name</Label>
                  <p className="text-white mt-1">{account.company_name}</p>
                </div>
                {account.company_website && (
                  <div>
                    <Label className="text-white/80">Website</Label>
                    <p className="text-mansablue mt-1">{account.company_website}</p>
                  </div>
                )}
                <div>
                  <Label className="text-white/80">Current Plan</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="capitalize bg-mansagold/20 text-mansagold border-mansagold/50">
                      {account.tier}
                    </Badge>
                    <Button variant="link" className="text-mansablue p-0 h-auto">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-white/80">Member Since</Label>
                  <p className="text-white/60 mt-1">{new Date(account.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
