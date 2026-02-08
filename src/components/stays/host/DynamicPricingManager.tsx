import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { PropertyPricingRule } from '@/types/vacation-rental';
import { format } from 'date-fns';
import { Plus, Percent, DollarSign, Calendar, Trash2, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface DynamicPricingManagerProps {
  propertyId: string;
  baseNightlyRate: number;
}

const DynamicPricingManager: React.FC<DynamicPricingManagerProps> = ({
  propertyId,
  baseNightlyRate,
}) => {
  const [rules, setRules] = useState<PropertyPricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<PropertyPricingRule> | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rule_type: 'weekend' as PropertyPricingRule['rule_type'],
    adjustment_type: 'percent' as 'percent' | 'fixed',
    adjustment_value: 0,
    start_date: '',
    end_date: '',
    min_nights: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchRules();
  }, [propertyId]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_pricing_rules')
        .select('*')
        .eq('property_id', propertyId)
        .order('priority', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (err) {
      console.error('Error fetching pricing rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async () => {
    setSaving(true);
    try {
      const ruleData = {
        property_id: propertyId,
        name: formData.name,
        rule_type: formData.rule_type,
        adjustment_type: formData.adjustment_type,
        adjustment_value: formData.adjustment_value,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        min_nights: formData.min_nights || null,
        days_of_week: formData.rule_type === 'weekend' ? [5, 6] : null, // Fri, Sat
        is_active: formData.is_active,
        priority: rules.length,
      };

      if (editingRule?.id) {
        const { error } = await supabase
          .from('property_pricing_rules')
          .update(ruleData)
          .eq('id', editingRule.id);
        if (error) throw error;
        toast.success('Pricing rule updated');
      } else {
        const { error } = await supabase
          .from('property_pricing_rules')
          .insert(ruleData);
        if (error) throw error;
        toast.success('Pricing rule created');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRules();
    } catch (err) {
      console.error('Error saving rule:', err);
      toast.error('Failed to save pricing rule');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('property_pricing_rules')
        .delete()
        .eq('id', ruleId);
      if (error) throw error;
      toast.success('Pricing rule deleted');
      fetchRules();
    } catch (err) {
      console.error('Error deleting rule:', err);
      toast.error('Failed to delete rule');
    }
  };

  const toggleRuleActive = async (rule: PropertyPricingRule) => {
    try {
      const { error } = await supabase
        .from('property_pricing_rules')
        .update({ is_active: !rule.is_active })
        .eq('id', rule.id);
      if (error) throw error;
      fetchRules();
    } catch (err) {
      console.error('Error toggling rule:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rule_type: 'weekend',
      adjustment_type: 'percent',
      adjustment_value: 0,
      start_date: '',
      end_date: '',
      min_nights: 0,
      is_active: true,
    });
    setEditingRule(null);
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case 'weekend': return 'Weekend Pricing';
      case 'seasonal': return 'Seasonal Pricing';
      case 'last_minute': return 'Last Minute Discount';
      case 'length_of_stay': return 'Length of Stay Discount';
      case 'custom': return 'Custom Rule';
      default: return type;
    }
  };

  const getAdjustmentDisplay = (rule: PropertyPricingRule) => {
    const isIncrease = rule.adjustment_value > 0;
    const Icon = isIncrease ? TrendingUp : TrendingDown;
    const colorClass = isIncrease ? 'text-red-400' : 'text-green-400';
    
    return (
      <span className={`flex items-center gap-1 ${colorClass}`}>
        <Icon className="w-4 h-4" />
        {rule.adjustment_type === 'percent' 
          ? `${Math.abs(rule.adjustment_value)}%`
          : `$${Math.abs(rule.adjustment_value)}`
        }
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Dynamic Pricing</CardTitle>
          <p className="text-white/60 text-sm mt-1">
            Base rate: ${baseNightlyRate}/night
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-mansagold text-black hover:bg-mansagold/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingRule ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-white">Rule Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Weekend Premium"
                  className="bg-slate-800 border-white/20 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Rule Type</Label>
                <Select
                  value={formData.rule_type}
                  onValueChange={(v) => setFormData({ ...formData, rule_type: v as any })}
                >
                  <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="weekend">Weekend Pricing</SelectItem>
                    <SelectItem value="seasonal">Seasonal Pricing</SelectItem>
                    <SelectItem value="last_minute">Last Minute Discount</SelectItem>
                    <SelectItem value="length_of_stay">Length of Stay Discount</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Adjustment Type</Label>
                  <Select
                    value={formData.adjustment_type}
                    onValueChange={(v) => setFormData({ ...formData, adjustment_type: v as any })}
                  >
                    <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      <SelectItem value="percent">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">
                    {formData.adjustment_type === 'percent' ? 'Percentage' : 'Amount'} (+/-)
                  </Label>
                  <Input
                    type="number"
                    value={formData.adjustment_value}
                    onChange={(e) => setFormData({ ...formData, adjustment_value: parseFloat(e.target.value) || 0 })}
                    placeholder={formData.adjustment_type === 'percent' ? '20' : '50'}
                    className="bg-slate-800 border-white/20 text-white"
                  />
                </div>
              </div>

              {(formData.rule_type === 'seasonal' || formData.rule_type === 'custom') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Start Date</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="bg-slate-800 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">End Date</Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="bg-slate-800 border-white/20 text-white"
                    />
                  </div>
                </div>
              )}

              {formData.rule_type === 'length_of_stay' && (
                <div>
                  <Label className="text-white">Minimum Nights</Label>
                  <Input
                    type="number"
                    value={formData.min_nights}
                    onChange={(e) => setFormData({ ...formData, min_nights: parseInt(e.target.value) || 0 })}
                    placeholder="7"
                    className="bg-slate-800 border-white/20 text-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label className="text-white">Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <Button
                onClick={handleSaveRule}
                disabled={saving || !formData.name}
                className="w-full bg-mansagold text-black hover:bg-mansagold/90"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {rules.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Percent className="w-12 h-12 mx-auto mb-3 text-white/30" />
            <p>No pricing rules yet</p>
            <p className="text-sm text-white/40">
              Add rules to automatically adjust your nightly rate
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  rule.is_active
                    ? 'bg-slate-900/50 border-white/10'
                    : 'bg-slate-900/20 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={() => toggleRuleActive(rule)}
                  />
                  <div>
                    <p className="text-white font-medium">{rule.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs text-white/60 border-white/20">
                        {getRuleTypeLabel(rule.rule_type)}
                      </Badge>
                      {rule.start_date && rule.end_date && (
                        <span className="text-xs text-white/40">
                          {format(new Date(rule.start_date), 'MMM d')} - {format(new Date(rule.end_date), 'MMM d')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {getAdjustmentDisplay(rule)}
                    <p className="text-xs text-white/40 mt-1">
                      ≈ ${(baseNightlyRate * (1 + (rule.adjustment_type === 'percent' ? rule.adjustment_value / 100 : rule.adjustment_value / baseNightlyRate))).toFixed(0)}/night
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicPricingManager;
