
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QrCode, Star, Award, Calendar } from 'lucide-react';

interface LoyaltyStats {
  totalPoints: number;
  pointsEarned: number;
  pointsRedeemed: number;
  visitsThisMonth: number;
}

interface LoyaltyTransaction {
  id: number | string;
  businessName: string;
  action: string;
  points: number;
  date: string;
  time: string;
}

interface LoyaltyHistoryProps {
  stats: LoyaltyStats;
  transactions: LoyaltyTransaction[];
}

const LoyaltyHistory: React.FC<LoyaltyHistoryProps> = ({ stats, transactions }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Points Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPoints}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Points Earned</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.pointsEarned}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Points Redeemed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.pointsRedeemed}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visits This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.visitsThisMonth}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your complete history of points earned and redeemed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.businessName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {transaction.action === 'Scan' && <QrCode size={14} />}
                      {transaction.action === 'Review' && <Star size={14} />}
                      {transaction.action === 'Referral' && <Award size={14} />}
                      {transaction.action === 'Redemption' && <Calendar size={14} />}
                      {transaction.action}
                    </div>
                  </TableCell>
                  <TableCell className={transaction.points > 0 ? "text-green-600" : "text-red-600"}>
                    {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyHistory;
