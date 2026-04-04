import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, UserPlus, Heart, Star, Gift, 
  MessageSquare, Zap, Clock, ArrowRight
} from 'lucide-react';
import { WorkflowTriggerType, WorkflowActionType } from '@/lib/api/workflow-api';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  triggerType: WorkflowTriggerType;
  triggerConfig: Record<string, any>;
  actions: Array<{
    action_type: WorkflowActionType;
    action_config: Record<string, any>;
    delay_seconds: number;
    is_condition: boolean;
    condition_config: any;
  }>;
}

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'welcome-new-customer',
    name: 'Welcome New Customer',
    description: 'Send a welcome email and tag new customers automatically.',
    category: 'Onboarding',
    icon: UserPlus,
    triggerType: 'customer_created',
    triggerConfig: {},
    actions: [
      {
        action_type: 'send_email',
        action_config: {
          subject: 'Welcome to {{business.name}}!',
          body: "Hi {{customer.name}},\n\nThank you for joining us! We're excited to have you.",
          template: 'welcome',
        },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
      {
        action_type: 'add_tag',
        action_config: { tag: 'new-customer' },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
    ],
  },
  {
    id: 'purchase-thank-you',
    name: 'Purchase Thank You',
    description: 'Thank customers after purchase and request a review after 3 days.',
    category: 'Sales',
    icon: ShoppingCart,
    triggerType: 'purchase',
    triggerConfig: {},
    actions: [
      {
        action_type: 'send_email',
        action_config: {
          subject: 'Thank you for your order!',
          body: 'Hi {{customer.name}},\n\nThanks for your purchase of ${{trigger.amount}}!',
        },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
      {
        action_type: 'send_email',
        action_config: {
          subject: 'How was your experience?',
          body: 'Hi {{customer.name}},\n\nWe hope you love your purchase. Could you leave us a quick review?',
        },
        delay_seconds: 259200, // 3 days
        is_condition: false,
        condition_config: null,
      },
    ],
  },
  {
    id: 'vip-customer',
    name: 'VIP Customer Recognition',
    description: 'Tag high-value customers and send a special offer when they spend over $500.',
    category: 'Loyalty',
    icon: Star,
    triggerType: 'threshold_reached',
    triggerConfig: { field: 'total_spent', threshold: 500 },
    actions: [
      {
        action_type: 'add_tag',
        action_config: { tag: 'vip-customer' },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
      {
        action_type: 'send_email',
        action_config: {
          subject: "You're a VIP! Here's a special reward 🎉",
          body: "Hi {{customer.name}},\n\nAs a thank you for your loyalty, here's an exclusive 20% discount!",
        },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
      {
        action_type: 'notify_user',
        action_config: { message: 'New VIP customer: {{customer.name}}' },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
    ],
  },
  {
    id: 'win-back-inactive',
    name: 'Win Back Inactive Customers',
    description: 'Re-engage customers who have been inactive for 30 days.',
    category: 'Retention',
    icon: Heart,
    triggerType: 'inactivity',
    triggerConfig: { days: 30 },
    actions: [
      {
        action_type: 'send_email',
        action_config: {
          subject: 'We miss you, {{customer.name}}!',
          body: "It's been a while! Come back and check out what's new. Here's 15% off your next visit.",
        },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
      {
        action_type: 'add_tag',
        action_config: { tag: 'win-back-sent' },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
    ],
  },
  {
    id: 'birthday-reward',
    name: 'Birthday Reward',
    description: 'Automatically send birthday wishes with a special discount.',
    category: 'Loyalty',
    icon: Gift,
    triggerType: 'custom',
    triggerConfig: { event: 'customer_birthday' },
    actions: [
      {
        action_type: 'send_email',
        action_config: {
          subject: 'Happy Birthday, {{customer.name}}! 🎂',
          body: "Wishing you a wonderful birthday! Enjoy a free treat on us — just show this email on your next visit.",
        },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
      {
        action_type: 'add_tag',
        action_config: { tag: 'birthday-reward-sent' },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
    ],
  },
  {
    id: 'new-review-followup',
    name: 'Review Follow-Up',
    description: 'Notify your team and thank the customer when a tag is added after review.',
    category: 'Engagement',
    icon: MessageSquare,
    triggerType: 'tag_added',
    triggerConfig: { tag: 'left-review' },
    actions: [
      {
        action_type: 'notify_user',
        action_config: { message: 'New review from {{customer.name}}!' },
        delay_seconds: 0,
        is_condition: false,
        condition_config: null,
      },
      {
        action_type: 'send_email',
        action_config: {
          subject: 'Thank you for your review!',
          body: 'Hi {{customer.name}},\n\nThank you for taking the time to leave us a review. It means a lot!',
        },
        delay_seconds: 3600, // 1 hour
        is_condition: false,
        condition_config: null,
      },
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Onboarding: 'bg-green-500/20 text-green-400 border-green-500/30',
  Sales: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Loyalty: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Retention: 'bg-red-500/20 text-red-400 border-red-500/30',
  Engagement: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

interface WorkflowTemplatesProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
  onClose: () => void;
}

export const WorkflowTemplates: React.FC<WorkflowTemplatesProps> = ({ onSelectTemplate, onClose }) => {
  const categories = [...new Set(TEMPLATES.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Workflow Templates
          </h2>
          <p className="text-sm text-blue-200/70 mt-1">
            Choose a template to get started quickly
          </p>
        </div>
        <Button variant="ghost" onClick={onClose} className="text-blue-200 hover:text-white">
          Back to list
        </Button>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-200/80 uppercase tracking-wider">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TEMPLATES.filter(t => t.category === category).map(template => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-yellow-500/30 transition-all cursor-pointer group"
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                        <Icon className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                            {template.name}
                          </h4>
                          <Badge className={CATEGORY_COLORS[template.category] || ''} variant="outline">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-blue-200/60 mb-2">{template.description}</p>
                        <div className="flex items-center gap-2 text-xs text-blue-200/40">
                          <span>{template.actions.length} actions</span>
                          {template.actions.some(a => a.delay_seconds > 0) && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Has delays
                            </span>
                          )}
                          <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 text-yellow-400 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export type { WorkflowTemplate };
export { TEMPLATES };
