import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tag, Plus, Percent, DollarSign, Gift, Copy, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface PromoCode {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  uses_count: number;
  min_purchase_amount: number | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  applies_to: string;
  created_by: string | null;
  created_at: string;
}

const PromoCodeManager: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    max_uses: '',
    min_purchase_amount: '',
    valid_from: format(new Date(), 'yyyy-MM-dd'),
    valid_until: '',
    applies_to: 'all'
  });

  const { data: promoCodes, isLoading } = useQuery({
    queryKey: ['promo-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PromoCode[];
    }
  });

  const { data: redemptions } = useQuery({
    queryKey: ['promo-redemptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_code_redemptions')
        .select('*')
        .order('redeemed_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('promo_codes')
        .insert({
          code: formData.code.toUpperCase(),
          name: formData.name,
          description: formData.description || null,
          discount_type: formData.discount_type,
          discount_value: formData.discount_value,
          max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
          min_purchase_amount: formData.min_purchase_amount ? parseFloat(formData.min_purchase_amount) : null,
          valid_from: formData.valid_from,
          valid_until: formData.valid_until || null,
          applies_to: formData.applies_to,
          created_by: user?.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Promo code created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create promo code');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PromoCode> }) => {
      const { error } = await supabase
        .from('promo_codes')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast.success('Promo code updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast.success('Promo code deleted');
    }
  });

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      max_uses: '',
      min_purchase_amount: '',
      valid_from: format(new Date(), 'yyyy-MM-dd'),
      valid_until: '',
      applies_to: 'all'
    });
    setEditingCode(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const stats = {
    active: promoCodes?.filter(p => p.is_active).length || 0,
    totalRedemptions: redemptions?.length || 0,
    totalSaved: promoCodes?.reduce((acc, p) => acc + (p.uses_count * p.discount_value), 0) || 0
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-mansagold/10 border-mansagold/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Tag className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-white/60 text-sm">Active Codes</p>
                <p className="text-2xl font-bold text-mansagold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Gift className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Total Redemptions</p>
                <p className="text-2xl font-bold text-green-400">{stats.totalRedemptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Total Saved</p>
                <p className="text-2xl font-bold text-blue-400">${stats.totalSaved.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Percent className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-white/60 text-sm">Total Codes</p>
                <p className="text-2xl font-bold text-purple-400">{promoCodes?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Tag className="h-5 w-5 text-mansagold" />
              Promo Codes
            </CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Code
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-mansablue-dark border-white/20 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Promo Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/80">Code</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="SAVE20"
                        className="bg-white/5 border-white/20 text-white uppercase"
                      />
                      <Button type="button" variant="outline" onClick={generateRandomCode} className="shrink-0">
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/80">Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Summer Sale"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description..."
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/80">Discount Type</Label>
                      <Select
                        value={formData.discount_type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="points">Points</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white/80">Value</Label>
                      <Input
                        type="number"
                        value={formData.discount_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/80">Max Uses (optional)</Label>
                      <Input
                        type="number"
                        value={formData.max_uses}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
                        placeholder="Unlimited"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/80">Min Purchase</Label>
                      <Input
                        type="number"
                        value={formData.min_purchase_amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, min_purchase_amount: e.target.value }))}
                        placeholder="0"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/80">Valid From</Label>
                      <Input
                        type="date"
                        value={formData.valid_from}
                        onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/80">Valid Until</Label>
                      <Input
                        type="date"
                        value={formData.valid_until}
                        onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/80">Applies To</Label>
                    <Select
                      value={formData.applies_to}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, applies_to: value }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="first_time">First-Time Users</SelectItem>
                        <SelectItem value="returning">Returning Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => createMutation.mutate()}
                    disabled={!formData.code || !formData.name || createMutation.isPending}
                    className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
                  >
                    Create Promo Code
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
                {promoCodes?.map((code) => (
                  <div
                    key={code.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-mansagold font-mono text-lg font-bold">{code.code}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyCode(code.code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3 text-white/60" />
                          </Button>
                          <Badge className={code.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {code.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {code.discount_type === 'percentage' ? `${code.discount_value}%` : 
                             code.discount_type === 'points' ? `${code.discount_value} pts` :
                             `$${code.discount_value}`}
                          </Badge>
                        </div>
                        <p className="text-white font-medium">{code.name}</p>
                        {code.description && (
                          <p className="text-white/60 text-sm mt-1">{code.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-white/50 text-xs">
                          <span>Uses: {code.uses_count}{code.max_uses ? `/${code.max_uses}` : ''}</span>
                          <span>Valid: {format(new Date(code.valid_from), 'MMM d')} - {code.valid_until ? format(new Date(code.valid_until), 'MMM d') : 'No end'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={code.is_active}
                          onCheckedChange={(checked) => updateMutation.mutate({ id: code.id, updates: { is_active: checked } })}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(code.id)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {promoCodes?.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No promo codes yet</p>
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

export default PromoCodeManager;
