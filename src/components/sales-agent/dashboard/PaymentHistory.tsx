import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  payment_method: string;
  batch?: {
    batch_number: string;
    payment_date: string;
  };
  created_at: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
  isLoading: boolean;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments, isLoading }) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      processing: 'outline',
      failed: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>View your commission payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No payment history available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment History
        </CardTitle>
        <CardDescription>View your commission payment history</CardDescription>
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
              <TableHead>Paid Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {payment.batch?.batch_number || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">${parseFloat(payment.amount.toString()).toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{payment.payment_method}</span>
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>
                  {payment.paid_at 
                    ? format(new Date(payment.paid_at), 'MMM dd, yyyy')
                    : <span className="text-muted-foreground">-</span>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
