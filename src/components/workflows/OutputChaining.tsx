import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link2, Copy, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OutputChainingProps {
  actionIndex: number;
  previousActions: Array<{
    action_type: string;
    action_config: Record<string, any>;
    execution_order: number;
  }>;
  onInsertVariable: (variable: string) => void;
}

// Maps action types to their available output fields
const ACTION_OUTPUTS: Record<string, Array<{ field: string; label: string; example: string }>> = {
  send_email: [
    { field: 'email_sent', label: 'Email sent status', example: 'true' },
    { field: 'recipient', label: 'Recipient email', example: 'user@example.com' },
  ],
  add_tag: [
    { field: 'tag_added', label: 'Tag name added', example: 'vip-customer' },
  ],
  remove_tag: [
    { field: 'tag_removed', label: 'Tag name removed', example: 'inactive' },
  ],
  update_status: [
    { field: 'previous_status', label: 'Previous status', example: 'active' },
    { field: 'new_status', label: 'New status', example: 'premium' },
  ],
  webhook: [
    { field: 'response_status', label: 'Response status code', example: '200' },
    { field: 'response_body', label: 'Response body', example: '{"success": true}' },
  ],
  create_task: [
    { field: 'task_id', label: 'Created task ID', example: 'uuid-here' },
    { field: 'task_title', label: 'Task title', example: 'Follow up with customer' },
  ],
  update_customer_field: [
    { field: 'previous_value', label: 'Previous value', example: 'old_value' },
    { field: 'new_value', label: 'New value', example: 'new_value' },
  ],
  notify_user: [
    { field: 'notification_sent', label: 'Notification sent', example: 'true' },
  ],
};

// Built-in trigger variables
const TRIGGER_VARIABLES = [
  { field: 'trigger.type', label: 'Trigger type', example: 'purchase' },
  { field: 'trigger.amount', label: 'Amount (if purchase)', example: '49.99' },
  { field: 'trigger.customer_id', label: 'Customer ID', example: 'uuid' },
  { field: 'customer.name', label: 'Customer name', example: 'John Doe' },
  { field: 'customer.email', label: 'Customer email', example: 'john@example.com' },
  { field: 'business.name', label: 'Business name', example: 'My Store' },
];

export const OutputChaining: React.FC<OutputChainingProps> = ({
  actionIndex,
  previousActions,
  onInsertVariable,
}) => {
  if (actionIndex === 0 && previousActions.length === 0) {
    // Only show trigger variables
  }

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(`{{${variable}}}`);
    onInsertVariable(`{{${variable}}}`);
  };

  return (
    <TooltipProvider>
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-3 space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-blue-200/80">
            <Link2 className="h-3.5 w-3.5" />
            Available Variables
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-blue-200/40" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Click a variable to copy it. Paste it into any text field to use dynamic data from triggers or previous actions.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Trigger Variables */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/40 mb-1.5">Trigger Data</p>
            <div className="flex flex-wrap gap-1">
              {TRIGGER_VARIABLES.map(v => (
                <Tooltip key={v.field}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => copyVariable(v.field)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded hover:bg-blue-500/20 transition-colors"
                    >
                      <Copy className="h-2.5 w-2.5" />
                      {`{{${v.field}}}`}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{v.label}</p>
                    <p className="text-xs opacity-70">Example: {v.example}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Previous Action Outputs */}
          {previousActions.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-blue-200/40 mb-1.5">Previous Steps</p>
              <div className="space-y-2">
                {previousActions.map((action, idx) => {
                  const outputs = ACTION_OUTPUTS[action.action_type] || [];
                  if (outputs.length === 0) return null;

                  return (
                    <div key={idx}>
                      <p className="text-[10px] text-yellow-400/70 mb-1">
                        Step {action.execution_order + 1}: {action.action_type.replace(/_/g, ' ')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {outputs.map(output => {
                          const varPath = `steps.${action.execution_order}.${output.field}`;
                          return (
                            <Tooltip key={varPath}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => copyVariable(varPath)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/20 transition-colors"
                                >
                                  <Copy className="h-2.5 w-2.5" />
                                  {`{{${varPath}}}`}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">{output.label}</p>
                                <p className="text-xs opacity-70">Example: {output.example}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
