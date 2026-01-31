import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart, UserPlus, UserCog, Tag, MinusCircle, 
  Clock, TrendingUp, Settings
} from 'lucide-react';
import { WorkflowTriggerType, TRIGGER_TYPE_LABELS } from '@/lib/api/workflow-api';

interface TriggerSelectorProps {
  triggerType: WorkflowTriggerType;
  triggerConfig: Record<string, any>;
  onTriggerTypeChange: (type: WorkflowTriggerType) => void;
  onTriggerConfigChange: (config: Record<string, any>) => void;
}

const TRIGGER_ICONS: Record<WorkflowTriggerType, any> = {
  purchase: ShoppingCart,
  customer_created: UserPlus,
  customer_updated: UserCog,
  tag_added: Tag,
  tag_removed: MinusCircle,
  inactivity: Clock,
  threshold_reached: TrendingUp,
  custom: Settings
};

export const TriggerSelector: React.FC<TriggerSelectorProps> = ({
  triggerType,
  triggerConfig,
  onTriggerTypeChange,
  onTriggerConfigChange
}) => {
  const updateConfig = (key: string, value: any) => {
    onTriggerConfigChange({ ...triggerConfig, [key]: value });
  };

  const renderTriggerConfig = () => {
    switch (triggerType) {
      case 'purchase':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Minimum Amount ($)</Label>
              <Input
                type="number"
                value={triggerConfig.min_amount || ''}
                onChange={(e) => updateConfig('min_amount', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Maximum Amount ($)</Label>
              <Input
                type="number"
                value={triggerConfig.max_amount || ''}
                onChange={(e) => updateConfig('max_amount', parseFloat(e.target.value) || undefined)}
                placeholder="No limit"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>
        );

      case 'tag_added':
      case 'tag_removed':
        return (
          <div className="space-y-2">
            <Label className="text-white">Tag Name (leave empty for any tag)</Label>
            <Input
              value={triggerConfig.tag_name || ''}
              onChange={(e) => updateConfig('tag_name', e.target.value)}
              placeholder="e.g., VIP"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
        );

      case 'inactivity':
        return (
          <div className="space-y-2">
            <Label className="text-white">Days of Inactivity</Label>
            <Input
              type="number"
              value={triggerConfig.days || 30}
              onChange={(e) => updateConfig('days', parseInt(e.target.value) || 30)}
              min={1}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
        );

      case 'threshold_reached':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Metric</Label>
              <Select
                value={triggerConfig.metric || 'lifetime_value'}
                onValueChange={(value) => updateConfig('metric', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lifetime_value">Lifetime Value</SelectItem>
                  <SelectItem value="total_purchases">Total Purchases</SelectItem>
                  <SelectItem value="total_interactions">Total Interactions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Threshold Value</Label>
              <Input
                type="number"
                value={triggerConfig.threshold || ''}
                onChange={(e) => updateConfig('threshold', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 1000"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>
        );

      case 'customer_created':
      case 'customer_updated':
        return (
          <div className="space-y-2">
            <Label className="text-white">Filter by Source (optional)</Label>
            <Input
              value={triggerConfig.source || ''}
              onChange={(e) => updateConfig('source', e.target.value)}
              placeholder="e.g., website, referral"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Trigger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white">When this happens...</Label>
          <Select
            value={triggerType}
            onValueChange={(value) => onTriggerTypeChange(value as WorkflowTriggerType)}
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TRIGGER_TYPE_LABELS).map(([type, label]) => {
                const Icon = TRIGGER_ICONS[type as WorkflowTriggerType];
                return (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {renderTriggerConfig()}
      </CardContent>
    </Card>
  );
};
