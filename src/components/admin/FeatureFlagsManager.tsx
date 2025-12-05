import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Flag, Plus, Percent, Users, Trash2, Edit, ToggleLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureFlag {
  id: string;
  flag_key: string;
  flag_name: string;
  description: string | null;
  is_enabled: boolean;
  rollout_percentage: number;
  target_user_types: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

const FeatureFlagsManager: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    flag_key: '',
    flag_name: '',
    description: '',
    rollout_percentage: 100,
    target_user_types: [] as string[]
  });

  const { data: flags, isLoading } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as FeatureFlag[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('feature_flags')
        .insert({
          flag_key: formData.flag_key.toLowerCase().replace(/\s+/g, '_'),
          flag_name: formData.flag_name,
          description: formData.description || null,
          rollout_percentage: formData.rollout_percentage,
          target_user_types: formData.target_user_types,
          created_by: user?.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Feature flag created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create feature flag');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FeatureFlag> }) => {
      const { error } = await supabase
        .from('feature_flags')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast.success('Feature flag updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast.success('Feature flag deleted');
    }
  });

  const resetForm = () => {
    setFormData({
      flag_key: '',
      flag_name: '',
      description: '',
      rollout_percentage: 100,
      target_user_types: []
    });
  };

  const toggleUserType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      target_user_types: prev.target_user_types.includes(type)
        ? prev.target_user_types.filter(t => t !== type)
        : [...prev.target_user_types, type]
    }));
  };

  const stats = {
    total: flags?.length || 0,
    enabled: flags?.filter(f => f.is_enabled).length || 0,
    partial: flags?.filter(f => f.is_enabled && f.rollout_percentage < 100).length || 0
  };

  const userTypes = ['customer', 'business', 'sales_agent', 'admin'];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-mansagold/10 border-mansagold/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Flag className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-white/60 text-sm">Total Flags</p>
                <p className="text-2xl font-bold text-mansagold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ToggleLeft className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Enabled</p>
                <p className="text-2xl font-bold text-green-400">{stats.enabled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Percent className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-white/60 text-sm">Partial Rollout</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.partial}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Flag className="h-5 w-5 text-mansagold" />
              Feature Flags
            </CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Flag
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-mansablue-dark border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Feature Flag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/80">Flag Key</Label>
                    <Input
                      value={formData.flag_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, flag_key: e.target.value }))}
                      placeholder="new_checkout_flow"
                      className="bg-white/5 border-white/20 text-white font-mono"
                    />
                    <p className="text-white/40 text-xs mt-1">Unique identifier used in code</p>
                  </div>
                  <div>
                    <Label className="text-white/80">Display Name</Label>
                    <Input
                      value={formData.flag_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, flag_name: e.target.value }))}
                      placeholder="New Checkout Flow"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this feature does..."
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Rollout Percentage: {formData.rollout_percentage}%</Label>
                    <Slider
                      value={[formData.rollout_percentage]}
                      onValueChange={([value]) => setFormData(prev => ({ ...prev, rollout_percentage: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-white/40 text-xs mt-1">Percentage of users who will see this feature</p>
                  </div>
                  <div>
                    <Label className="text-white/80">Target User Types</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userTypes.map(type => (
                        <Badge
                          key={type}
                          variant={formData.target_user_types.includes(type) ? 'default' : 'outline'}
                          className={`cursor-pointer ${
                            formData.target_user_types.includes(type) 
                              ? 'bg-mansagold text-mansablue-dark' 
                              : 'border-white/20 text-white/60'
                          }`}
                          onClick={() => toggleUserType(type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-white/40 text-xs mt-1">Leave empty for all users</p>
                  </div>
                  <Button
                    onClick={() => createMutation.mutate()}
                    disabled={!formData.flag_key || !formData.flag_name || createMutation.isPending}
                    className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
                  >
                    Create Feature Flag
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {flags?.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-mansagold font-mono text-sm bg-mansagold/10 px-2 py-0.5 rounded">
                            {flag.flag_key}
                          </code>
                          <Badge className={flag.is_enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {flag.is_enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          {flag.rollout_percentage < 100 && (
                            <Badge variant="outline" className="text-xs">
                              {flag.rollout_percentage}% rollout
                            </Badge>
                          )}
                        </div>
                        <p className="text-white font-medium">{flag.flag_name}</p>
                        {flag.description && (
                          <p className="text-white/60 text-sm mt-1">{flag.description}</p>
                        )}
                        {flag.target_user_types.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Users className="h-3 w-3 text-white/40" />
                            <span className="text-white/40 text-xs">
                              {flag.target_user_types.join(', ')}
                            </span>
                          </div>
                        )}
                        <p className="text-white/30 text-xs mt-2">
                          Updated {format(new Date(flag.updated_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <Switch
                            checked={flag.is_enabled}
                            onCheckedChange={(checked) => updateMutation.mutate({ id: flag.id, updates: { is_enabled: checked } })}
                          />
                          <span className="text-white/40 text-xs">
                            {flag.is_enabled ? 'On' : 'Off'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(flag.id)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Rollout Slider */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">Rollout: {flag.rollout_percentage}%</span>
                      </div>
                      <Slider
                        value={[flag.rollout_percentage]}
                        onValueChange={([value]) => updateMutation.mutate({ id: flag.id, updates: { rollout_percentage: value } })}
                        max={100}
                        step={5}
                        disabled={!flag.is_enabled}
                      />
                    </div>
                  </div>
                ))}
                {flags?.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No feature flags yet</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureFlagsManager;
