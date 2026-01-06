import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Users, CreditCard, Download } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  created_at: string;
  customer_id: string;
  business_id: string | null;
  description: string | null;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

interface CommissionPayment {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  paid_at: string | null;
  created_at: string;
  sales_agent_id: string;
  sales_agents: {
    user_id: string;
    commission_rate: number;
    profiles: {
      email: string;
      full_name: string | null;
    };
  };
}

const FinancialManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [commissions, setCommissions] = useState<CommissionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    activeTransactions: 0,
  });

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Load transactions (fetch profiles separately since FK may not exist)
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (transactionsError) throw transactionsError;
      
      // Fetch associated profiles for transactions
      const customerIds = transactionsData?.map(t => t.customer_id).filter(Boolean) || [];
      let profilesForTransactions: any[] = [];
      
      if (customerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', customerIds);
        profilesForTransactions = profilesData || [];
      }
      
      const profilesMap = new Map(profilesForTransactions.map(p => [p.id, p]));
      
      const enrichedTransactions = transactionsData?.map(t => ({
        ...t,
        profiles: profilesMap.get(t.customer_id) || null
      })) || [];
      
      setTransactions(enrichedTransactions);

      // Load commission payments
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('commission_payments')
        .select(`
          *,
          sales_agents(
            user_id,
            commission_rate,
            profiles(email, full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (commissionsError) throw commissionsError;
      setCommissions(commissionsData || []);

      // Calculate stats
      const totalRevenue = transactionsData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const pendingCommissions = commissionsData?.filter(c => c.status === 'pending').reduce((sum, c) => sum + Number(c.amount), 0) || 0;
      const paidCommissions = commissionsData?.filter(c => c.status === 'paid').reduce((sum, c) => sum + Number(c.amount), 0) || 0;

      setStats({
        totalRevenue,
        pendingCommissions,
        paidCommissions,
        activeTransactions: transactionsData?.length || 0,
      });
    } catch (error: any) {
      toast.error('Failed to load financial data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCommissionPaid = async (commissionId: string) => {
    try {
      const { error } = await supabase
        .from('commission_payments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', commissionId);

      if (error) throw error;
      
      toast.success('Commission marked as paid');
      loadFinancialData();
    } catch (error: any) {
      toast.error('Failed to update commission: ' + error.message);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Export completed');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pending Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${stats.pendingCommissions.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Paid Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.paidCommissions.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Active Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTransactions}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="commissions">
            Commissions {commissions.filter(c => c.status === 'pending').length > 0 && 
              `(${commissions.filter(c => c.status === 'pending').length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Transactions</CardTitle>
                  <CardDescription>View and manage platform transactions</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(transactions, 'transactions')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.profiles.full_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{transaction.profiles.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.transaction_type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">${Number(transaction.amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commission Payments</CardTitle>
                  <CardDescription>Manage sales agent commission payments</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(commissions, 'commissions')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell>
                          {format(new Date(commission.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {commission.sales_agents.profiles.full_name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {commission.sales_agents.profiles.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${Number(commission.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{commission.payment_method}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                            {commission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {commission.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkCommissionPaid(commission.id)}
                            >
                              Mark Paid
                            </Button>
                          )}
                          {commission.status === 'paid' && commission.paid_at && (
                            <span className="text-sm text-gray-500">
                              Paid {format(new Date(commission.paid_at), 'MMM d, yyyy')}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
