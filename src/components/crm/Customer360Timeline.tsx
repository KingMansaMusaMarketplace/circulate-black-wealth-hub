import React from 'react';
import { CustomerInteraction } from '@/lib/api/customer-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Phone, Mail, Calendar, MessageSquare, DollarSign, 
  Headphones, HelpCircle, Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface Customer360TimelineProps {
  interactions: CustomerInteraction[];
  purchaseHistory: any[];
}

export const Customer360Timeline: React.FC<Customer360TimelineProps> = ({
  interactions,
  purchaseHistory
}) => {
  // Combine and sort all activities
  const allActivities = [
    ...interactions.map(i => ({
      type: 'interaction' as const,
      date: new Date(i.interaction_date),
      data: i
    })),
    ...purchaseHistory.map(p => ({
      type: 'purchase' as const,
      date: new Date(p.invoice_date || p.created_at),
      data: p
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getInteractionIcon = (type: string) => {
    const icons: Record<string, any> = {
      call: Phone,
      email: Mail,
      meeting: Calendar,
      note: MessageSquare,
      purchase: DollarSign,
      support: Headphones,
      other: HelpCircle
    };
    return icons[type] || MessageSquare;
  };

  const getInteractionColor = (type: string) => {
    const colors: Record<string, string> = {
      call: 'bg-green-500/20 text-green-400 border-green-500/30',
      email: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      meeting: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      note: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      purchase: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      support: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      other: 'bg-white/10 text-white/60 border-white/20'
    };
    return colors[type] || colors.other;
  };

  return (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-400" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-6">
            {allActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-200/60">No activity recorded yet</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-white/10" />
                
                <div className="space-y-6">
                  {allActivities.map((activity, index) => {
                    if (activity.type === 'interaction') {
                      const interaction = activity.data as CustomerInteraction;
                      const Icon = getInteractionIcon(interaction.interaction_type);
                      
                      return (
                        <div key={`interaction-${interaction.id}`} className="relative pl-12">
                          {/* Timeline dot */}
                          <div className={`absolute left-0 p-2 rounded-full border ${getInteractionColor(interaction.interaction_type)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/[0.07] transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-white">{interaction.subject}</h4>
                                <Badge variant="outline" className="mt-1 text-xs capitalize">
                                  {interaction.interaction_type}
                                </Badge>
                              </div>
                              <span className="text-xs text-blue-200/60">
                                {format(activity.date, 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>
                            {interaction.description && (
                              <p className="text-sm text-blue-200/80 mt-2">{interaction.description}</p>
                            )}
                            {interaction.outcome && (
                              <div className="mt-2 pt-2 border-t border-white/10">
                                <span className="text-xs text-blue-200/60">Outcome: </span>
                                <span className="text-sm text-white">{interaction.outcome}</span>
                              </div>
                            )}
                            {interaction.followup_required && interaction.followup_date && (
                              <div className="mt-2 flex items-center gap-2">
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                  Follow-up: {format(new Date(interaction.followup_date), 'MMM d')}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    } else {
                      const purchase = activity.data;
                      
                      return (
                        <div key={`purchase-${purchase.id}`} className="relative pl-12">
                          {/* Timeline dot */}
                          <div className="absolute left-0 p-2 rounded-full border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          
                          <div className="bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg p-4 border border-yellow-500/20 hover:from-yellow-500/15 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-white">
                                  Purchase - ${purchase.total_amount?.toFixed(2) || '0.00'}
                                </h4>
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mt-1">
                                  Invoice #{purchase.invoice_number || 'N/A'}
                                </Badge>
                              </div>
                              <span className="text-xs text-blue-200/60">
                                {format(activity.date, 'MMM d, yyyy')}
                              </span>
                            </div>
                            {purchase.status && (
                              <Badge variant="outline" className="mt-2 text-xs capitalize">
                                {purchase.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
