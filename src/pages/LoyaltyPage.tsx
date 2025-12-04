import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import LoyaltyHistory from '@/components/loyalty/LoyaltyHistory';
import RewardsTab from '@/components/loyalty/RewardsTab';
import { useLoyaltyRewards } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';
import Loading from '@/components/ui/loading';

const LoyaltyPage = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('history');
  
  // Use the loyalty rewards hook
  const { totalPoints, redeemReward } = useLoyaltyRewards();
  
  // State for loyalty points and transactions
  const [loyaltyStats, setLoyaltyStats] = useState({
    totalPoints,
    pointsEarned: 445,
    pointsRedeemed: 100,
    visitsThisMonth: 5,
  });
  
  const [transactions, setTransactions] = useState([
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
  ]);
  
  const [rewards, setRewards] = useState([
    {
      id: 1,
      title: "$10 off at Soul Food Kitchen",
      description: "Get $10 off your next purchase of $30 or more at Soul Food Kitchen.",
      pointsCost: 100,
      category: "Restaurant Deals",
      expiresAt: "2023-06-30"
    },
    {
      id: 2,
      title: "Free Haircut at Prestigious Cuts",
      description: "Redeem a free haircut at Prestigious Cuts barber shop.",
      pointsCost: 200,
      category: "Beauty & Wellness",
      expiresAt: "2023-07-15"
    },
    {
      id: 3,
      title: "20% off any book at Heritage Bookstore",
      description: "Get 20% off any book purchase at Heritage Bookstore.",
      pointsCost: 75,
      category: "Retail Rewards",
    },
    {
      id: 4,
      title: "Free Financial Consultation",
      description: "Redeem a 30-minute financial consultation at Prosperity Financial.",
      pointsCost: 150,
      category: "Services",
      expiresAt: "2023-08-01"
    },
    {
      id: 5,
      title: "$25 Mansa Musa Gift Card",
      description: "Get a $25 gift card to use at any participating business.",
      pointsCost: 250,
      category: "Gift Cards",
    },
    {
      id: 6,
      title: "Buy One Get One Free at Royal Apparel",
      description: "Buy any item and get one of equal or lesser value for free.",
      pointsCost: 175,
      category: "Retail Rewards",
      expiresAt: "2023-07-31"
    }
  ]);
  
  // Handle reward redemption
  const handleRedeemReward = (rewardId: number, pointsCost: number) => {
    // Check if user has enough points
    if (loyaltyStats.totalPoints < pointsCost) {
      toast.error("Not enough points to redeem this reward");
      return;
    }
    
    // Update points balance
    setLoyaltyStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints - pointsCost,
      pointsRedeemed: prev.pointsRedeemed + pointsCost
    }));
    
    // Add transaction for this redemption
    const newTransaction = {
      id: Date.now(),
      businessName: "Rewards Program",
      action: "Redemption",
      points: -pointsCost,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Find the reward to show in the toast
    const redeemedReward = rewards.find(r => r.id === rewardId);
    
    toast.success("Reward Redeemed", {
      description: `You've redeemed "${redeemedReward?.title}". ${pointsCost} points have been deducted.`
    });
  };
  
  // Show loading state while checking auth status
  if (loading) {
    return (
      <DashboardLayout title="Loyalty History" location="">
        <Loading text="Loading loyalty rewards..." />
      </DashboardLayout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <DashboardLayout 
      title="Loyalty Program" 
      icon={<Award className="mr-2 h-5 w-5" />}
    >
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 -m-6 p-6 relative overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 space-y-6">
          {/* Decorative Banner */}
          <div className="relative overflow-hidden rounded-2xl h-32 backdrop-blur-xl bg-white/5 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-blue-500/20" />
            <div className="absolute top-4 right-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-4 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="relative h-full flex items-center px-8">
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-1">Your Rewards</h2>
                <p className="text-blue-200 text-sm">Earn points and redeem exclusive rewards</p>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 backdrop-blur-xl bg-white/5 border border-white/10">
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 text-blue-200"
              >
                History
              </TabsTrigger>
              <TabsTrigger 
                value="rewards"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 text-blue-200"
              >
                Redeem Rewards
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="space-y-6">
              <LoyaltyHistory stats={loyaltyStats} transactions={transactions} />
            </TabsContent>
            
            <TabsContent value="rewards">
              <RewardsTab 
                availablePoints={loyaltyStats.totalPoints}
                rewards={rewards}
                onRedeem={handleRedeemReward}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoyaltyPage;
