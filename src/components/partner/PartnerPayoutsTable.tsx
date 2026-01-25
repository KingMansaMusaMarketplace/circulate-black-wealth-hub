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
          <TableRow className="border-amber-500/30">
            <TableHead className="text-amber-400 font-semibold">Requested</TableHead>
            <TableHead className="text-amber-400 font-semibold">Amount</TableHead>
            <TableHead className="text-amber-400 font-semibold">Method</TableHead>
            <TableHead className="text-amber-400 font-semibold">Status</TableHead>
            <TableHead className="text-amber-400 font-semibold">Processed</TableHead>
            <TableHead className="text-amber-400 font-semibold">Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts.map((payout) => (
            <TableRow key={payout.id} className="border-amber-500/20 hover:bg-amber-500/5">
              <TableCell className="whitespace-nowrap text-amber-100">
                {format(new Date(payout.requested_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="font-semibold text-amber-300">
                ${payout.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-amber-200">
                {getMethodLabel(payout.payout_method)}
              </TableCell>
              <TableCell>
                {getStatusBadge(payout.status)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-amber-100">
                {payout.processed_at 
                  ? format(new Date(payout.processed_at), 'MMM d, yyyy') 
                  : <span className="text-amber-500/50">—</span>
                }
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-amber-200">
                {payout.payment_reference || <span className="text-amber-500/50">—</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnerPayoutsTable;
