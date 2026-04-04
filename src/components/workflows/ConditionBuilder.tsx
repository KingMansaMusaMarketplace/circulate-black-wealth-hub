import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Plus, Trash2, X, Check } from 'lucide-react';
import { ConditionConfig, ConditionOperator, CONDITION_OPERATOR_LABELS } from '@/lib/api/workflow-api';

interface ConditionBuilderProps {
  onAdd: (config: ConditionConfig) => void;
  onCancel: () => void;
}

const COMMON_FIELDS = [
  { value: 'amount', label: 'Purchase Amount' },
  { value: 'customer.total_spent', label: 'Customer Total Spent' },
  { value: 'customer.visit_count', label: 'Customer Visit Count' },
  { value: 'customer.tags', label: 'Customer Tags' },
  { value: 'customer.status', label: 'Customer Status' },
  { value: 'product.category', label: 'Product Category' },
  { value: 'product.name', label: 'Product Name' },
];

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ onAdd, onCancel }) => {
  const [conditions, setConditions] = useState<Array<{
    field: string;
    operator: ConditionOperator;
    value: string;
  }>>([{ field: '', operator: 'equals', value: '' }]);

  const updateCondition = (index: number, updates: Partial<typeof conditions[0]>) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], ...updates };
    setConditions(updated);
  };

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: 'equals', value: '' }]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const valid = conditions.every(c => c.field.trim());
    if (!valid) return;

    onAdd({
      conditions: conditions.map(c => ({
        field: c.field,
        operator: c.operator,
        value: c.operator === 'exists' || c.operator === 'not_exists' ? '' : c.value,
      })),
    });
  };

  const isValueless = (op: ConditionOperator) => op === 'exists' || op === 'not_exists';

  return (
    <Card className="bg-purple-500/10 border-purple-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground text-lg flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-purple-400" />
          Add Condition (If/Then)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Only continue if ALL conditions are met
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={index} className="space-y-3 p-3 bg-background/50 rounded-lg border border-border">
            {index > 0 && (
              <div className="text-xs font-semibold text-purple-400 uppercase">AND</div>
            )}
            
            <div className="space-y-2">
              <Label className="text-foreground text-xs">Field</Label>
              <Select
                value={condition.field}
                onValueChange={(v) => updateCondition(index, { field: v })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select a field..." />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_FIELDS.map(f => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={condition.field}
                onChange={(e) => updateCondition(index, { field: e.target.value })}
                placeholder="Or type a custom field path (e.g. order.total)"
                className="bg-background border-border text-foreground text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-xs">Operator</Label>
              <Select
                value={condition.operator}
                onValueChange={(v) => updateCondition(index, { operator: v as ConditionOperator })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONDITION_OPERATOR_LABELS).map(([op, label]) => (
                    <SelectItem key={op} value={op}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isValueless(condition.operator) && (
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Value</Label>
                <Input
                  value={condition.value}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                  placeholder="e.g., 50, VIP, active"
                  className="bg-background border-border text-foreground"
                />
              </div>
            )}

            {conditions.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-300 h-7"
                onClick={() => removeCondition(index)}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Remove
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={addCondition}
          className="w-full border-dashed border-purple-500/30 text-purple-400"
        >
          <Plus className="h-3 w-3 mr-1" /> Add AND condition
        </Button>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            disabled={!conditions.every(c => c.field.trim())}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Check className="h-4 w-4 mr-1" /> Add Condition
          </Button>
          <Button variant="ghost" onClick={onCancel} className="text-muted-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
