import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingDown, Receipt, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CommissionTransaction {
  id: string;
  transaction_amount: number;
  commission_rate: number;
  commission_amount: number;
  platform_fee: number;
  net_commission: number;
  status: string;
  transaction_type: string;
  created_at: string;
  booking_id?: string;
  transaction_id?: string;
}

interface BusinessCommissionReportProps {
  businessId: string;
}

export const BusinessCommissionReport = ({ businessId }: BusinessCommissionReportProps) => {
  const [transactions, setTransactions] = useState<CommissionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const { toast } = useToast();

  const loadCommissionData = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('commission_transactions')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (timeRange !== 'all') {
        const days = parseInt(timeRange);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading commission data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load commission data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      loadCommissionData();
    }
  }, [businessId, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate summary stats
  const totalVolume = transactions.reduce((sum, t) => sum + Number(t.transaction_amount), 0);
  const totalCommissionPaid = transactions.reduce((sum, t) => sum + Number(t.commission_amount), 0);
  const totalStripeFees = transactions.reduce((sum, t) => sum + Number(t.platform_fee), 0);
  const totalReceived = totalVolume - totalCommissionPaid - totalStripeFees;
  const avgCommissionRate = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + Number(t.commission_rate), 0) / transactions.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Commission Reports</h2>
          <p className="text-muted-foreground">Track platform fees and transaction costs</p>
        </div>
        
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalVolume)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Commission</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalCommissionPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {avgCommissionRate.toFixed(1)}% average rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stripe Fees</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalStripeFees)}
            </div>
            <p className="text-xs text-muted-foreground">
              Processing fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">You Received</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(totalReceived)}
            </div>
            <p className="text-xs text-muted-foreground">
              Net after fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Breakdown</CardTitle>
          <CardDescription>Understanding your costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Gross Revenue</h4>
                <p className="text-sm text-muted-foreground">Total customer payments</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{formatCurrency(totalVolume)}</div>
                <p className="text-xs text-muted-foreground">100%</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
              <div>
                <h4 className="font-semibold">Platform Commission</h4>
                <p className="text-sm text-muted-foreground">7.5% to platform</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">
                  -{formatCurrency(totalCommissionPaid)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalVolume > 0 ? ((totalCommissionPaid / totalVolume) * 100).toFixed(2) : 0}%
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg bg-red-50 dark:bg-red-950">
              <div>
                <h4 className="font-semibold">Stripe Processing Fees</h4>
                <p className="text-sm text-muted-foreground">~2.9% + $0.30 per transaction</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">
                  -{formatCurrency(totalStripeFees)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalVolume > 0 ? ((totalStripeFees / totalVolume) * 100).toFixed(2) : 0}%
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border-2 rounded-lg bg-green-50 dark:bg-green-950">
              <div>
                <h4 className="font-semibold text-green-700">Your Net Revenue</h4>
                <p className="text-sm text-muted-foreground">Amount deposited to your account</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(totalReceived)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalVolume > 0 ? ((totalReceived / totalVolume) * 100).toFixed(2) : 0}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Detailed breakdown of each transaction</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found for this period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Commission (7.5%)</TableHead>
                    <TableHead className="text-right">Stripe Fee</TableHead>
                    <TableHead className="text-right">You Received</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => {
                    const youReceived = Number(transaction.transaction_amount) - 
                                      Number(transaction.commission_amount) - 
                                      Number(transaction.platform_fee);
                    
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {transaction.transaction_type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(Number(transaction.transaction_amount))}
                        </TableCell>
                        <TableCell className="text-right text-orange-600">
                          -{formatCurrency(Number(transaction.commission_amount))}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(Number(transaction.platform_fee))}
                        </TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          {formatCurrency(youReceived)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={transaction.status === 'processed' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
