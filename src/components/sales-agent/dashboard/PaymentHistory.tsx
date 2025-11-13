import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, Receipt } from 'lucide-react';
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
      completed: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
      processing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      failed: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants] || 'bg-muted/30'} font-body border`}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-semibold text-foreground">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted/30 animate-pulse rounded-lg shimmer" />
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-display font-semibold text-foreground">
            <DollarSign className="h-5 w-5 text-primary/60" />
            Payment History
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            View your commission payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-2">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="font-body text-foreground font-medium">No payment history yet</p>
              <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
                Your commission payments will appear here once they're processed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-display font-semibold text-foreground">
          <DollarSign className="h-5 w-5 text-primary/60" />
          Payment History
        </CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          View your commission payment history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/40">
                <TableHead className="font-body font-semibold text-foreground">Date</TableHead>
                <TableHead className="font-body font-semibold text-foreground">Batch</TableHead>
                <TableHead className="font-body font-semibold text-foreground">Amount</TableHead>
                <TableHead className="font-body font-semibold text-foreground">Method</TableHead>
                <TableHead className="font-body font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-body font-semibold text-foreground">Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2 font-body">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-body">
                      {payment.batch?.batch_number || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-display font-bold text-green-600 dark:text-green-400">
                      ${parseFloat(payment.amount.toString()).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize font-body">{payment.payment_method}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <span className="font-body">
                      {payment.paid_at 
                        ? format(new Date(payment.paid_at), 'MMM dd, yyyy')
                        : <span className="text-muted-foreground">-</span>
                      }
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;