
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { Award, Calendar, QrCode, Star } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LoyaltyHistoryPage = () => {
  const { user, loading } = useAuth();
  
  // Sample transaction data
  const transactions = [
    {
      id: 1,
      businessName: "Soul Food Kitchen",
      action: "Scan",
      points: 15,
      date: "2023-05-01",
      time: "14:30"
    },
    {
      id: 2,
      businessName: "Prestigious Cuts",
      action: "Review",
      points: 25,
      date: "2023-04-28",
      time: "11:15"
    },
    {
      id: 3,
      businessName: "Heritage Bookstore",
      action: "Scan",
      points: 10,
      date: "2023-04-25",
      time: "16:45"
    },
    {
      id: 4,
      businessName: "Prosperity Financial",
      action: "Referral",
      points: 50,
      date: "2023-04-20",
      time: "09:30"
    },
    {
      id: 5,
      businessName: "Soul Food Kitchen",
      action: "Redemption",
      points: -100,
      date: "2023-04-15",
      time: "18:20"
    },
    {
      id: 6,
      businessName: "Ebony Crafts",
      action: "Scan",
      points: 12,
      date: "2023-04-10",
      time: "13:45"
    },
    {
      id: 7,
      businessName: "Royal Apparel",
      action: "Scan",
      points: 15,
      date: "2023-04-05",
      time: "15:30"
    },
  ];

  // Sample loyalty stats
  const loyaltyStats = {
    totalPoints: 345,
    pointsEarned: 445,
    pointsRedeemed: 100,
    visitsThisMonth: 5,
  };
  
  // Show loading state while checking auth status
  if (loading) {
    return (
      <DashboardLayout title="Loyalty History" location="">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <DashboardLayout 
      title="Loyalty History" 
      icon={<Award className="mr-2 h-5 w-5" />}
    >
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Points Balance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loyaltyStats.totalPoints}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Points Earned</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{loyaltyStats.pointsEarned}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Points Redeemed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{loyaltyStats.pointsRedeemed}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Visits This Month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loyaltyStats.visitsThisMonth}</p>
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
    </DashboardLayout>
  );
};

export default LoyaltyHistoryPage;
