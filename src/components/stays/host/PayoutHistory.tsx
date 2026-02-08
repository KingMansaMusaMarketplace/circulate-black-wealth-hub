import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { HostPayout } from '@/types/vacation-rental';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { DollarSign, Clock, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';

const PayoutHistory: React.FC = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<HostPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    pending: 0,
    paid: 0,
  });

  useEffect(() => {
    if (user) {
      fetchPayouts();
    }
  }, [user]);

  const fetchPayouts = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('stays_host_payouts')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPayouts(data || []);

      // Calculate totals
      const pending = data?.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.net_amount, 0) || 0;
      const paid = data?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.net_amount, 0) || 0;
      setTotals({ pending, paid });
    } catch (err) {
      console.error('Error fetching payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Pending Payouts</p>
                <p className="text-3xl font-bold text-white">${totals.pending.toLocaleString()}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-400/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Paid</p>
                <p className="text-3xl font-bold text-white">${totals.paid.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout List */}
      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Payout History</CardTitle>
          <Button variant="outline" size="sm" className="border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-white/30" />
              <p>No payouts yet</p>
              <p className="text-sm text-white/40">
                Payouts will appear here after confirmed bookings
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-white font-medium">
                          ${payout.net_amount.toFixed(2)}
                        </p>
                        <p className="text-white/40 text-sm">
                          {payout.description || 'Booking payout'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {getStatusBadge(payout.status)}
                    <p className="text-white/40 text-xs mt-1">
                      {payout.paid_at 
                        ? format(new Date(payout.paid_at), 'MMM d, yyyy')
                        : payout.scheduled_date
                        ? `Scheduled: ${format(new Date(payout.scheduled_date), 'MMM d')}`
                        : format(new Date(payout.created_at), 'MMM d, yyyy')
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fee Breakdown Info */}
      <Card className="bg-slate-800/50 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-mansagold mt-0.5" />
            <div>
              <h4 className="text-white font-medium">How payouts work</h4>
              <p className="text-white/60 text-sm mt-1">
                Mansa Stays charges a 7.5% platform fee on each booking. 
                You receive the remaining 92.5% of the booking total, minus any processing fees. 
                Payouts are typically processed within 24 hours after guest check-in.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutHistory;
