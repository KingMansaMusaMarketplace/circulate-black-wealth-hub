import React from 'react';
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
import { format } from 'date-fns';
import { DollarSign, Calendar, Clock } from 'lucide-react';

interface Commission {
  id: string;
  amount: number;
  status: string;
  due_date: string;
  paid_date?: string;
  referrals?: {
    subscription_amount: number;
    referral_date: string;
  };
}

interface CommissionsTableProps {
  commissions: Commission[];
  isLoading: boolean;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({ commissions, isLoading }) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
      paid: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      due: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    };
    return variants[status.toLowerCase() as keyof typeof variants] || 'bg-muted/30 text-muted-foreground border-border/50';
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-semibold text-foreground">
            Commission History
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Loading commissions...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (commissions.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-semibold text-foreground">
            Commission History
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            No commission records yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-body">Your commission history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-display font-semibold text-foreground">
          Commission History
        </CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          {commissions.length} commission{commissions.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/40">
                <TableHead className="font-body font-semibold text-foreground">Amount</TableHead>
                <TableHead className="font-body font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-body font-semibold text-foreground">Due Date</TableHead>
                <TableHead className="font-body font-semibold text-foreground">Paid Date</TableHead>
                <TableHead className="text-right font-body font-semibold text-foreground">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map((commission) => (
                <TableRow key={commission.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-display font-bold text-green-600 dark:text-green-400">
                    ${commission.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadge(commission.status)} font-body border`}>
                      {commission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm font-body">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {format(new Date(commission.due_date), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {commission.paid_date ? (
                      <div className="flex items-center gap-1 text-sm font-body">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(commission.paid_date), 'MMM d, yyyy')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm font-body">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground font-body">
                    {commission.referrals?.subscription_amount && (
                      <span>on ${commission.referrals.subscription_amount} sub</span>
                    )}
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

export default CommissionsTable;