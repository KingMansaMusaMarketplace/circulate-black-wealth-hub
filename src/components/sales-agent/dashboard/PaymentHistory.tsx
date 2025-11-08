import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, Calendar, Receipt } from 'lucide-react';
import { getAgentPayments } from '@/lib/api/payment-api';
import { format } from 'date-fns';

interface PaymentHistoryProps {
  agentId: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ agentId }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [agentId]);

  const loadPayments = async () => {
    try {
      const data = await getAgentPayments(agentId);
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'outline', label: 'Pending' },
      processing: { variant: 'secondary', label: 'Processing' },
      completed: { variant: 'default', label: 'Completed' },
      failed: { variant: 'destructive', label: 'Failed' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Track your commission payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No payment history yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total paid
  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Payment History
        </CardTitle>
        <CardDescription>
          Total Paid: <span className="text-primary font-semibold">${totalPaid.toFixed(2)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {payment.paid_at
                      ? format(new Date(payment.paid_at), 'MMM d, yyyy')
                      : 'Not paid yet'}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {payment.batch?.batch_number || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <DollarSign className="h-4 w-4" />
                    {parseFloat(payment.amount).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{payment.payment_method}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
