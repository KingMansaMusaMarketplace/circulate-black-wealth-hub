import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
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
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

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

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      color: 'bg-emerald-500' 
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
      color: 'bg-amber-500' 
    },
    { 
      name: 'Fraud', 
      used: getUsageForEndpoint('/fraud'), 
      limit: account.monthly_fraud_limit,
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{account.company_name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                {account.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {account.tier} Plan
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={loadDeveloperData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
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
                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <AlertCircle className="h-5 w-5" />
                      Save Your API Key
                    </CardTitle>
                    <CardDescription>
                      This is the only time you'll see this key. Copy it now and store it securely.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted p-3 rounded font-mono text-sm break-all">
                        {newlyCreatedKey}
                      </code>
                      <Button 
                        size="icon" 
                        onClick={() => copyToClipboard(newlyCreatedKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
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
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate API Key</DialogTitle>
                    <DialogDescription>
                      Create a new API key for your application.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keyEnv">Environment</Label>
                      <Select value={newKeyEnv} onValueChange={(v: 'test' | 'live') => setNewKeyEnv(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createApiKey} disabled={creatingKey}>
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
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No API keys yet. Generate your first key to get started.
                  </CardContent>
                </Card>
              ) : (
                apiKeys.map((key) => (
                  <Card key={key.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Key className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{key.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-sm text-muted-foreground font-mono">
                                {key.key_prefix}
                              </code>
                              <Badge variant={key.environment === 'live' ? 'default' : 'secondary'}>
                                {key.environment}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {key.last_used_at && (
                            <span className="text-xs text-muted-foreground">
                              Last used: {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => revokeApiKey(key.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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
                <Card key={stat.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.name} API
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stat.used.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      of {stat.limit.toLocaleString()} calls
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stat.color}`}
                        style={{ width: `${Math.min(100, (stat.used / stat.limit) * 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage by Endpoint</CardTitle>
                <CardDescription>
                  Detailed breakdown of API calls this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usage.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No API calls recorded yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {usage.map((u) => (
                      <div 
                        key={u.endpoint}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <code className="text-sm font-mono">{u.endpoint}</code>
                        <div className="text-right">
                          <div className="font-medium">{u.total_calls.toLocaleString()} calls</div>
                          <div className="text-xs text-muted-foreground">
                            {u.total_billed_units.toLocaleString()} billed units
                          </div>
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
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your developer account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={account.company_name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={account.company_website || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={account.company_description || ''} disabled />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Your current subscription tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold capitalize">{account.tier}</div>
                    <div className="text-muted-foreground">
                      {account.tier === 'free' && '$0/month'}
                      {account.tier === 'pro' && '$299/month'}
                      {account.tier === 'enterprise' && 'Custom pricing'}
                    </div>
                  </div>
                  {account.tier !== 'enterprise' && (
                    <Button>Upgrade Plan</Button>
                  )}
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
