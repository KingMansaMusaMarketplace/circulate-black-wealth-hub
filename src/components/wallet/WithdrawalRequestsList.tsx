import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Banknote, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  platform_fee: number;
  net_amount: number;
  requested_at: string;
  reviewed_at: string | null;
  completed_at: string | null;
  rejection_reason: string | null;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending':
      return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Pending Review' };
    case 'approved':
      return { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Approved' };
    case 'processing':
      return { icon: Loader2, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Processing' };
    case 'completed':
      return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Completed' };
    case 'rejected':
      return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Rejected' };
    case 'failed':
      return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Failed' };
    default:
      return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', label: status };
  }
};

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    paypal: 'PayPal',
    venmo: 'Venmo',
    zelle: 'Zelle',
    cash_app: 'Cash App',
    bank_transfer: 'Bank Transfer',
  };
  return labels[method] || method;
};

const WithdrawalRequestsList: React.FC = () => {
  const { user } = useAuth();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['withdrawal-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });
      if (error) throw error;
      return data as WithdrawalRequest[];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-2">Loading requests...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Banknote className="w-5 h-5 text-emerald-400" />
          Withdrawal Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!requests || requests.length === 0 ? (
          <div className="text-center py-8">
            <Banknote className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No withdrawal requests yet</p>
            <p className="text-slate-500 text-sm">Request a cash-out when you're ready</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {requests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div
                    key={request.id}
                    className="p-4 rounded-lg bg-slate-900/50 border border-white/5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">${Number(request.amount).toFixed(2)}</p>
                        <p className="text-slate-500 text-xs">
                          via {getPaymentMethodLabel(request.payment_method)}
                        </p>
                      </div>
                      <Badge className={`${statusConfig.bg} ${statusConfig.color} border-none`}>
                        <StatusIcon className={`w-3 h-3 mr-1 ${request.status === 'processing' ? 'animate-spin' : ''}`} />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>Requested: {format(new Date(request.requested_at), 'MMM d, yyyy h:mm a')}</p>
                      {request.completed_at && (
                        <p className="text-emerald-400">
                          Completed: {format(new Date(request.completed_at), 'MMM d, yyyy')}
                        </p>
                      )}
                      {request.rejection_reason && (
                        <p className="text-red-400">Reason: {request.rejection_reason}</p>
                      )}
                      <p>
                        Fee: ${Number(request.platform_fee).toFixed(2)} | 
                        Net: <span className="text-emerald-400">${Number(request.net_amount).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default WithdrawalRequestsList;
