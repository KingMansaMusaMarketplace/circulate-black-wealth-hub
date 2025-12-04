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
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-200">Total Points Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-400">{stats.totalPoints}</p>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-200">Total Points Earned</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">{stats.pointsEarned}</p>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-200">Total Points Redeemed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">{stats.pointsRedeemed}</p>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-200">Visits This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{stats.visitsThisMonth}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction History */}
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardDescription className="text-blue-200">
            Your complete history of points earned and redeemed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-blue-200">Business</TableHead>
                <TableHead className="text-blue-200">Action</TableHead>
                <TableHead className="text-blue-200">Points</TableHead>
                <TableHead className="text-blue-200">Date</TableHead>
                <TableHead className="text-blue-200">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{transaction.businessName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-blue-200">
                      {transaction.action === 'Scan' && <QrCode size={14} className="text-yellow-400" />}
                      {transaction.action === 'Review' && <Star size={14} className="text-yellow-400" />}
                      {transaction.action === 'Referral' && <Award size={14} className="text-yellow-400" />}
                      {transaction.action === 'Redemption' && <Calendar size={14} className="text-yellow-400" />}
                      {transaction.action}
                    </div>
                  </TableCell>
                  <TableCell className={transaction.points > 0 ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                    {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                  </TableCell>
                  <TableCell className="text-blue-200">{transaction.date}</TableCell>
                  <TableCell className="text-blue-200">{transaction.time}</TableCell>
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
