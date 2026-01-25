import React from 'react';
import { PartnerReferral } from '@/types/partner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle2, Clock, Banknote } from 'lucide-react';

interface PartnerReferralsTableProps {
  referrals: PartnerReferral[];
}

const PartnerReferralsTable: React.FC<PartnerReferralsTableProps> = ({ referrals }) => {
  const getStatusBadge = (status: string, isConverted: boolean) => {
    if (status === 'paid') {
      return <Badge className="bg-green-500 text-white"><Banknote className="w-3 h-3 mr-1" />Paid</Badge>;
    }
    if (status === 'credited') {
      return <Badge className="bg-blue-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Credited</Badge>;
    }
    if (isConverted) {
      return <Badge variant="outline" className="text-green-600 border-green-600">Converted</Badge>;
    }
    return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
  };

  if (referrals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No referrals yet. Share your referral link to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-amber-500/30">
            <TableHead className="text-amber-400 font-semibold">Date</TableHead>
            <TableHead className="text-amber-400 font-semibold">Email</TableHead>
            <TableHead className="text-amber-400 font-semibold">Business Name</TableHead>
            <TableHead className="text-amber-400 font-semibold">Status</TableHead>
            <TableHead className="text-right text-amber-400 font-semibold">Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id} className="border-amber-500/20 hover:bg-amber-500/5">
              <TableCell className="whitespace-nowrap text-amber-100">
                {format(new Date(referral.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-amber-200">
                {referral.referred_email}
              </TableCell>
              <TableCell className="text-amber-100">
                {referral.referred_business_name || <span className="text-amber-500/50">—</span>}
              </TableCell>
              <TableCell>
                {getStatusBadge(referral.status, referral.is_converted)}
              </TableCell>
              <TableCell className="text-right font-semibold text-amber-300">
                ${referral.total_earned.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnerReferralsTable;
