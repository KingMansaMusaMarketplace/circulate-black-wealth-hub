import React from 'react';
import { Customer } from '@/lib/api/customer-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, Mail, Phone, DollarSign, Calendar, Tag, 
  RefreshCw, Clock, Gift
} from 'lucide-react';
import { format } from 'date-fns';
import { CustomerTagsManager } from './CustomerTagsManager';
import { toast } from 'sonner';

interface Customer360SidebarProps {
  customer: Customer;
  onLogInteraction: () => void;
  onRefresh: () => void;
}

export const Customer360Sidebar: React.FC<Customer360SidebarProps> = ({
  customer,
  onLogInteraction,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <Button
            onClick={onLogInteraction}
            className="w-full justify-start bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 hover:from-yellow-400 hover:to-yellow-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Interaction
          </Button>
          
          {customer.email && (
            <Button
              variant="outline"
              className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.href = `mailto:${customer.email}`}
            >
              <Mail className="h-4 w-4 mr-2 text-blue-400" />
              Send Email
            </Button>
          )}
          
          {customer.phone && (
            <Button
              variant="outline"
              className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.href = `tel:${customer.phone}`}
            >
              <Phone className="h-4 w-4 mr-2 text-green-400" />
              Call Customer
            </Button>
          )}
          
          <Button
            variant="outline"
            className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={() => toast.info('Invoice feature coming soon!')}
          >
            <DollarSign className="h-4 w-4 mr-2 text-yellow-400" />
            Create Invoice
          </Button>

          <Separator className="bg-white/10 my-2" />
          
          <Button
            variant="ghost"
            className="w-full justify-start text-blue-200 hover:text-white hover:bg-white/10"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Tag className="h-4 w-4 text-yellow-400" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <CustomerTagsManager customer={customer} onUpdate={onRefresh} />
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Calendar className="h-4 w-4 text-yellow-400" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {customer.next_followup_date && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-blue-200">Next Follow-up</span>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {format(new Date(customer.next_followup_date), 'MMM d')}
              </Badge>
            </div>
          )}
          
          {customer.last_purchase_date && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-sm text-blue-200">Last Purchase</span>
              </div>
              <span className="text-sm text-white">
                {format(new Date(customer.last_purchase_date), 'MMM d, yyyy')}
              </span>
            </div>
          )}
          
          {customer.last_contact_date && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-200">Last Contact</span>
              </div>
              <span className="text-sm text-white">
                {format(new Date(customer.last_contact_date), 'MMM d, yyyy')}
              </span>
            </div>
          )}
          
          {customer.birthday && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-pink-400" />
                <span className="text-sm text-blue-200">Birthday</span>
              </div>
              <span className="text-sm text-white">
                {format(new Date(customer.birthday), 'MMM d')}
              </span>
            </div>
          )}
          
          {customer.anniversary && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-blue-200">Anniversary</span>
              </div>
              <span className="text-sm text-white">
                {format(new Date(customer.anniversary), 'MMM d')}
              </span>
            </div>
          )}

          {!customer.next_followup_date && !customer.last_purchase_date && !customer.birthday && !customer.anniversary && (
            <p className="text-sm text-blue-200/60 text-center py-2">No dates recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {customer.notes && (
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-white text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-blue-200/80 whitespace-pre-wrap">{customer.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Customer Since */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-xs text-blue-200/60 mb-1">Customer Since</p>
            <p className="text-sm font-medium text-white">
              {format(new Date(customer.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
