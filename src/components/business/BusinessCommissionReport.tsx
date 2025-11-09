import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingDown, Receipt, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [businessName, setBusinessName] = useState('');
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const loadCommissionData = async () => {
    try {
      setLoading(true);
      
      // Fetch business name
      const { data: businessData } = await supabase
        .from('businesses')
        .select('business_name')
        .eq('id', businessId)
        .single();
      
      if (businessData) {
        setBusinessName(businessData.business_name);
      }

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

  const exportToPDF = async () => {
    try {
      setExporting(true);
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(102, 126, 234);
      doc.text('Commission Report', 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(businessName || 'Business Report', 14, 28);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const periodText = timeRange === 'all' ? 'All Time' : `Last ${timeRange}`;
      doc.text(`Period: ${periodText}`, 14, 34);
      doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 40);

      // Summary Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 14, 52);
      
      const summaryData = [
        ['Total Revenue', formatCurrency(totalVolume)],
        ['Platform Commission (7.5%)', formatCurrency(totalCommissionPaid)],
        ['Stripe Processing Fees', formatCurrency(totalStripeFees)],
        ['Net Revenue (You Received)', formatCurrency(totalReceived)],
        ['Total Transactions', transactions.length.toString()],
        ['Average Commission Rate', `${avgCommissionRate.toFixed(1)}%`]
      ];

      autoTable(doc, {
        startY: 56,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [102, 126, 234] },
        margin: { left: 14, right: 14 }
      });

      // Fee Breakdown Section
      const finalY = (doc as any).lastAutoTable.finalY || 56;
      doc.setFontSize(14);
      doc.text('Fee Breakdown', 14, finalY + 12);

      const breakdownData = [
        ['Gross Revenue', formatCurrency(totalVolume), '100%'],
        ['Platform Commission', `-${formatCurrency(totalCommissionPaid)}`, `${totalVolume > 0 ? ((totalCommissionPaid / totalVolume) * 100).toFixed(2) : 0}%`],
        ['Stripe Fees', `-${formatCurrency(totalStripeFees)}`, `${totalVolume > 0 ? ((totalStripeFees / totalVolume) * 100).toFixed(2) : 0}%`],
        ['Net Revenue', formatCurrency(totalReceived), `${totalVolume > 0 ? ((totalReceived / totalVolume) * 100).toFixed(2) : 0}%`]
      ];

      autoTable(doc, {
        startY: finalY + 16,
        head: [['Description', 'Amount', 'Percentage']],
        body: breakdownData,
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234] },
        margin: { left: 14, right: 14 }
      });

      // Transactions Section
      if (transactions.length > 0) {
        const finalY2 = (doc as any).lastAutoTable.finalY || finalY + 16;
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Transaction History', 14, 20);

        const transactionData = transactions.map(t => {
          const youReceived = Number(t.transaction_amount) - Number(t.commission_amount) - Number(t.platform_fee);
          return [
            format(new Date(t.created_at), 'MMM dd, yyyy'),
            t.transaction_type.replace('_', ' '),
            formatCurrency(Number(t.transaction_amount)),
            formatCurrency(Number(t.commission_amount)),
            formatCurrency(Number(t.platform_fee)),
            formatCurrency(youReceived),
            t.status
          ];
        });

        autoTable(doc, {
          startY: 26,
          head: [['Date', 'Type', 'Amount', 'Commission', 'Stripe Fee', 'You Received', 'Status']],
          body: transactionData,
          theme: 'striped',
          headStyles: { fillColor: [102, 126, 234], fontSize: 8 },
          bodyStyles: { fontSize: 7 },
          margin: { left: 14, right: 14 },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 20 },
            2: { cellWidth: 22 },
            3: { cellWidth: 22 },
            4: { cellWidth: 22 },
            5: { cellWidth: 25 },
            6: { cellWidth: 20 }
          }
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      const fileName = `commission-report-${businessName.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);

      toast({
        title: 'Success',
        description: 'Commission report exported successfully'
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to export PDF',
        variant: 'destructive'
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Commission Reports</h2>
          <p className="text-muted-foreground">Track platform fees and transaction costs</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={exportToPDF} 
            disabled={exporting || transactions.length === 0}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
          
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
