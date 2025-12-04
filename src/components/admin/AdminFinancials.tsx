import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, CreditCard, Clock, CheckCircle, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  customer_id: string;
  business_id: string;
  amount: number;
  transaction_type: string;
  created_at: string;
  description: string | null;
}

interface Commission {
  id: string;
  sales_agent_id: string;
  amount: number;
  status: string;
  due_date: string | null;
  paid_date: string | null;
}

interface PlatformTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  status: string;
  created_at: string;
  description: string | null;
}

const AdminFinancials: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [platformTransactions, setPlatformTransactions] = useState<PlatformTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('30');

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - parseInt(timeFilter));

      const [transactionsRes, commissionsRes, platformRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*')
          .gte('created_at', dateFilter.toISOString())
          .order('created_at', { ascending: false }),
        supabase
          .from('agent_commissions')
          .select('*')
          .order('due_date', { ascending: false }),
        supabase
          .from('platform_transactions')
          .select('*')
          .gte('created_at', dateFilter.toISOString())
          .order('created_at', { ascending: false }),
      ]);

      if (transactionsRes.error) throw transactionsRes.error;
      if (commissionsRes.error) throw commissionsRes.error;

      setTransactions(transactionsRes.data || []);
      setCommissions(commissionsRes.data || []);
      setPlatformTransactions(platformRes.data || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  };

  const markCommissionPaid = async (commissionId: string) => {
    try {
      const { error } = await supabase
        .from('agent_commissions')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
        })
        .eq('id', commissionId);

      if (error) throw error;
      toast.success('Commission marked as paid');
      fetchData();
    } catch (error) {
      console.error('Error updating commission:', error);
      toast.error('Failed to update commission');
    }
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending');
  const totalPendingCommissions = pendingCommissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const paidCommissions = commissions.filter(c => c.status === 'paid');
  const totalPaidCommissions = paidCommissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/20">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Transactions</p>
                <p className="text-3xl font-bold text-blue-400">{transactions.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Pending Commissions</p>
                <p className="text-3xl font-bold text-yellow-400">${totalPendingCommissions.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Paid Commissions</p>
                <p className="text-3xl font-bold text-emerald-400">${totalPaidCommissions.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchData} variant="outline" className="border-white/10 text-blue-200 hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Commissions */}
      {pendingCommissions.length > 0 && (
        <Card className="backdrop-blur-xl bg-yellow-500/10 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Commission Payouts ({pendingCommissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingCommissions.slice(0, 10).map((commission) => (
              <div
                key={commission.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">${Number(commission.amount).toFixed(2)}</p>
                  <p className="text-blue-300 text-sm">
                    Due: {commission.due_date ? format(new Date(commission.due_date), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => markCommissionPaid(commission.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Paid
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-yellow-400" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 20).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${Number(transaction.amount) >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {Number(transaction.amount) >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {transaction.description || transaction.transaction_type}
                      </p>
                      <p className="text-blue-300 text-sm">
                        {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${Number(transaction.amount) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(transaction.amount) >= 0 ? '+' : ''}${Math.abs(Number(transaction.amount)).toFixed(2)}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-blue-300">
                  No transactions found in this period
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinancials;
