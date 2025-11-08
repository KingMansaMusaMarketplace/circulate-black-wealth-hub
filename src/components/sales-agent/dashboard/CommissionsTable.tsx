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
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      due: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return variants[status.toLowerCase() as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
          <CardDescription>Loading commissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (commissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
          <CardDescription>No commission records yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Your commission history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission History</CardTitle>
        <CardDescription>
          {commissions.length} commission{commissions.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell className="font-medium text-green-600">
                  ${commission.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(commission.status)}>
                    {commission.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {format(new Date(commission.due_date), 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  {commission.paid_date ? (
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {format(new Date(commission.paid_date), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {commission.referrals?.subscription_amount && (
                    <span>on ${commission.referrals.subscription_amount} sub</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CommissionsTable;
