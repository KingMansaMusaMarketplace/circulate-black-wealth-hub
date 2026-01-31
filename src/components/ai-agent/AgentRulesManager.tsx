import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Zap, Settings, Play } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAgentRules, 
  createAgentRule, 
  updateAgentRule, 
  deleteAgentRule,
  toggleAgentRule,
  RULE_TYPE_LABELS,
  AGENT_ACTION_LABELS
} from '@/lib/api/ai-agent-api';

interface AgentRulesManagerProps {
  businessId: string;
}

const AgentRulesManager: React.FC<AgentRulesManagerProps> = ({ businessId }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    rule_type: 'lead_qualification',
    action_type: 'send_notification',
    confidence_threshold: 0.7,
    requires_approval: true
  });

  const { data: rules, isLoading } = useQuery({
    queryKey: ['agent-rules', businessId],
    queryFn: () => getAgentRules(businessId)
  });

  const createMutation = useMutation({
    mutationFn: () => createAgentRule({
      ...newRule,
      business_id: businessId,
      trigger_conditions: {},
      action_config: {},
      is_active: true
    }),
    onSuccess: () => {
      toast.success('Rule created successfully');
      setIsDialogOpen(false);
      setNewRule({
        name: '',
        description: '',
        rule_type: 'lead_qualification',
        action_type: 'send_notification',
        confidence_threshold: 0.7,
        requires_approval: true
      });
      queryClient.invalidateQueries({ queryKey: ['agent-rules'] });
    },
    onError: (error) => {
      toast.error('Failed to create rule', { description: error.message });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      toggleAgentRule(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-rules'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAgentRule,
    onSuccess: () => {
      toast.success('Rule deleted');
      queryClient.invalidateQueries({ queryKey: ['agent-rules'] });
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Agent Rules
          </CardTitle>
          <CardDescription>
            Configure when and how the AI agent takes autonomous actions
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Agent Rule</DialogTitle>
              <DialogDescription>
                Define when the AI should take autonomous actions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input
                  placeholder="e.g., Auto-qualify hot leads"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what this rule does..."
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <Select
                    value={newRule.rule_type}
                    onValueChange={(value) => setNewRule({ ...newRule, rule_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(RULE_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Action Type</Label>
                  <Select
                    value={newRule.action_type}
                    onValueChange={(value) => setNewRule({ ...newRule, action_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AGENT_ACTION_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confidence Threshold: {Math.round(newRule.confidence_threshold * 100)}%</Label>
                <Slider
                  value={[newRule.confidence_threshold * 100]}
                  onValueChange={([value]) => setNewRule({ ...newRule, confidence_threshold: value / 100 })}
                  max={100}
                  min={50}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  AI must be at least this confident to take action
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Approval</Label>
                  <p className="text-xs text-muted-foreground">
                    Human must approve before action executes
                  </p>
                </div>
                <Switch
                  checked={newRule.requires_approval}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, requires_approval: checked })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => createMutation.mutate()} disabled={!newRule.name}>
                Create Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules?.map((rule: any) => (
            <div 
              key={rule.id} 
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                rule.is_active ? 'bg-background' : 'bg-muted/50 opacity-60'
              }`}
            >
              <Switch
                checked={rule.is_active}
                onCheckedChange={(checked) => 
                  toggleMutation.mutate({ id: rule.id, isActive: checked })
                }
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{rule.name}</h4>
                  <Badge variant="outline">{RULE_TYPE_LABELS[rule.rule_type]}</Badge>
                  <Badge variant="secondary">{AGENT_ACTION_LABELS[rule.action_type]}</Badge>
                  {rule.requires_approval && (
                    <Badge variant="outline" className="text-yellow-600">
                      Needs Approval
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Confidence: {Math.round(rule.confidence_threshold * 100)}%</span>
                  <span>Executed: {rule.execution_count} times</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(rule.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {!rules?.length && (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No agent rules configured yet.</p>
              <p className="text-sm">Create a rule to automate AI actions.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentRulesManager;
