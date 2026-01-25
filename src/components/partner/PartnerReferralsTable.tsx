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
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell className="whitespace-nowrap">
                {format(new Date(referral.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {referral.referred_email}
              </TableCell>
              <TableCell>
                {referral.referred_business_name || <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>
                {getStatusBadge(referral.status, referral.is_converted)}
              </TableCell>
              <TableCell className="text-right font-medium">
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
