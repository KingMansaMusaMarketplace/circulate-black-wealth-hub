import React from 'react';
import { Customer, CustomerInteraction } from '@/lib/api/customer-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, MapPin, DollarSign, Calendar, 
  Tag, TrendingUp, Activity, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { Customer360Timeline } from './Customer360Timeline';
import { Customer360Sidebar } from './Customer360Sidebar';

interface Customer360ViewProps {
  customer: Customer;
  interactions: CustomerInteraction[];
  purchaseHistory: any[];
  onLogInteraction: () => void;
  onRefresh: () => void;
}

export const Customer360View: React.FC<Customer360ViewProps> = ({
  customer,
  interactions,
  purchaseHistory,
  onLogInteraction,
  onRefresh
}) => {
  const initials = `${customer.first_name[0]}${customer.last_name[0]}`.toUpperCase();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      inactive: 'bg-white/10 text-white/60 border-white/20',
      vip: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[status] || colors.active;
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-blue-500/20 text-blue-400',
      prospect: 'bg-purple-500/20 text-purple-400',
      customer: 'bg-green-500/20 text-green-400',
      evangelist: 'bg-yellow-500/20 text-yellow-400',
      churned: 'bg-red-500/20 text-red-400'
    };
    return colors[stage] || 'bg-white/10 text-white/60';
  };

  // Calculate metrics
  const totalInteractions = interactions.length;
  const lastInteraction = interactions[0]?.interaction_date;
  const daysSinceLastContact = lastInteraction 
    ? Math.floor((new Date().getTime() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - Customer Profile & Timeline */}
      <div className="lg:col-span-2 space-y-6">
        {/* Customer Header Card */}
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 border-2 border-yellow-500/40">
                <AvatarFallback className="text-2xl text-yellow-400 bg-transparent font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {customer.first_name} {customer.last_name}
                  </h2>
                  <Badge className={getStatusColor(customer.customer_status)}>
                    {customer.customer_status}
                  </Badge>
                  <Badge className={getStageColor(customer.lifecycle_stage)}>
                    {customer.lifecycle_stage}
                  </Badge>
                </div>
                
                {customer.company && (
                  <p className="text-blue-200 mb-1">{customer.job_title} at {customer.company}</p>
                )}
                
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-blue-200/80">
                  {customer.email && (
                    <a href={`mailto:${customer.email}`} className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                      <Mail className="h-4 w-4" />
                      {customer.email}
                    </a>
                  )}
                  {customer.phone && (
                    <a href={`tel:${customer.phone}`} className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </a>
                  )}
                  {(customer.city || customer.state) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {[customer.city, customer.state].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-green-300/70">Lifetime Value</p>
                  <p className="text-xl font-bold text-green-400">${customer.lifetime_value.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-300/70">Purchases</p>
                  <p className="text-xl font-bold text-blue-400">{customer.total_purchases}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-purple-300/70">Interactions</p>
                  <p className="text-xl font-bold text-purple-400">{totalInteractions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-yellow-300/70">Days Since Contact</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {daysSinceLastContact !== null ? daysSinceLastContact : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Customer360Timeline 
          interactions={interactions} 
          purchaseHistory={purchaseHistory}
        />
      </div>

      {/* Sidebar */}
      <Customer360Sidebar 
        customer={customer}
        onLogInteraction={onLogInteraction}
        onRefresh={onRefresh}
      />
    </div>
  );
};
