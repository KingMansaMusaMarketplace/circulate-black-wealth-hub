import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, Tag, MinusCircle, UserCog, Bell, 
  CheckSquare, Edit3, Webhook, X, Plus
} from 'lucide-react';
import { WorkflowActionType, ACTION_TYPE_LABELS } from '@/lib/api/workflow-api';

interface ActionBuilderProps {
  onAdd: (actionType: WorkflowActionType, actionConfig: Record<string, any>) => void;
  onCancel: () => void;
}

const ACTION_ICONS: Record<WorkflowActionType, any> = {
  send_email: Mail,
  add_tag: Tag,
  remove_tag: MinusCircle,
  update_status: UserCog,
  notify_user: Bell,
  create_task: CheckSquare,
  update_customer_field: Edit3,
  webhook: Webhook
};

export const ActionBuilder: React.FC<ActionBuilderProps> = ({ onAdd, onCancel }) => {
  const [actionType, setActionType] = useState<WorkflowActionType | null>(null);
  const [actionConfig, setActionConfig] = useState<Record<string, any>>({});

  const updateConfig = (key: string, value: any) => {
    setActionConfig({ ...actionConfig, [key]: value });
  };

  const handleAdd = () => {
    if (actionType) {
      onAdd(actionType, actionConfig);
    }
  };

  const renderActionConfig = () => {
    if (!actionType) return null;

    switch (actionType) {
      case 'send_email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Email Subject</Label>
              <Input
                value={actionConfig.subject || ''}
                onChange={(e) => updateConfig('subject', e.target.value)}
                placeholder="e.g., Thank you for your purchase!"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email Template</Label>
              <Select
                value={actionConfig.template || ''}
                onValueChange={(value) => updateConfig('template', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thank_you">Thank You</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="vip_upgrade">VIP Upgrade</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {actionConfig.template === 'custom' && (
              <div className="space-y-2">
                <Label className="text-white">Email Body</Label>
                <Textarea
                  value={actionConfig.body || ''}
                  onChange={(e) => updateConfig('body', e.target.value)}
                  placeholder="Enter your custom email content..."
                  className="bg-white/5 border-white/20 text-white min-h-[100px]"
                />
              </div>
            )}
          </div>
        );

      case 'add_tag':
      case 'remove_tag':
        return (
          <div className="space-y-2">
            <Label className="text-white">Tag Name</Label>
            <Input
              value={actionConfig.tag_name || ''}
              onChange={(e) => updateConfig('tag_name', e.target.value)}
              placeholder="e.g., VIP, High Value, Active"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
        );

      case 'update_status':
        return (
          <div className="space-y-2">
            <Label className="text-white">New Status</Label>
            <Select
              value={actionConfig.new_status || ''}
              onValueChange={(value) => updateConfig('new_status', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'notify_user':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Notification Title</Label>
              <Input
                value={actionConfig.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="e.g., New VIP Customer!"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Notification Message</Label>
              <Textarea
                value={actionConfig.message || ''}
                onChange={(e) => updateConfig('message', e.target.value)}
                placeholder="Enter notification details..."
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>
        );

      case 'create_task':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Task Title</Label>
              <Input
                value={actionConfig.task_title || ''}
                onChange={(e) => updateConfig('task_title', e.target.value)}
                placeholder="e.g., Follow up with customer"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Due in (days)</Label>
              <Input
                type="number"
                value={actionConfig.due_days || 7}
                onChange={(e) => updateConfig('due_days', parseInt(e.target.value) || 7)}
                min={1}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>
        );

      case 'update_customer_field':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Field to Update</Label>
              <Select
                value={actionConfig.field || ''}
                onValueChange={(value) => updateConfig('field', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lifecycle_stage">Lifecycle Stage</SelectItem>
                  <SelectItem value="customer_status">Customer Status</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">New Value</Label>
              <Input
                value={actionConfig.new_value || ''}
                onChange={(e) => updateConfig('new_value', e.target.value)}
                placeholder="Enter new value"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Webhook URL</Label>
              <Input
                value={actionConfig.url || ''}
                onChange={(e) => updateConfig('url', e.target.value)}
                placeholder="https://..."
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">HTTP Method</Label>
              <Select
                value={actionConfig.method || 'POST'}
                onValueChange={(value) => updateConfig('method', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isValid = actionType && (
    (actionType === 'add_tag' && actionConfig.tag_name) ||
    (actionType === 'remove_tag' && actionConfig.tag_name) ||
    (actionType === 'update_status' && actionConfig.new_status) ||
    (actionType === 'send_email' && actionConfig.subject) ||
    (actionType === 'notify_user' && actionConfig.title) ||
    (actionType === 'create_task' && actionConfig.task_title) ||
    (actionType === 'update_customer_field' && actionConfig.field && actionConfig.new_value) ||
    (actionType === 'webhook' && actionConfig.url)
  );

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white text-lg">Add Action</CardTitle>
        <Button size="icon" variant="ghost" onClick={onCancel} className="text-white/60 hover:text-white">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white">Action Type</Label>
          <Select
            value={actionType || ''}
            onValueChange={(value) => {
              setActionType(value as WorkflowActionType);
              setActionConfig({});
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACTION_TYPE_LABELS).map(([type, label]) => {
                const Icon = ACTION_ICONS[type as WorkflowActionType];
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

        {renderActionConfig()}

        {actionType && (
          <Button
            onClick={handleAdd}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
