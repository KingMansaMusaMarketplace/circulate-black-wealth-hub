import React from 'react';
import { PartnerPayout } from '@/types/partner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';

interface PartnerPayoutsTableProps {
  payouts: PartnerPayout[];
}

const PartnerPayoutsTable: React.FC<PartnerPayoutsTableProps> = ({ payouts }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 text-white"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      case 'check':
        return 'Check';
      default:
        return method;
    }
  };

  if (payouts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No payouts yet. Request your first payout when you have pending earnings!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requested</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Processed</TableHead>
            <TableHead>Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts.map((payout) => (
            <TableRow key={payout.id}>
              <TableCell className="whitespace-nowrap">
                {format(new Date(payout.requested_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="font-medium">
                ${payout.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                {getMethodLabel(payout.payout_method)}
              </TableCell>
              <TableCell>
                {getStatusBadge(payout.status)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {payout.processed_at 
                  ? format(new Date(payout.processed_at), 'MMM d, yyyy') 
                  : <span className="text-muted-foreground">—</span>
                }
              </TableCell>
              <TableCell className="max-w-[150px] truncate">
                {payout.payment_reference || <span className="text-muted-foreground">—</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnerPayoutsTable;
