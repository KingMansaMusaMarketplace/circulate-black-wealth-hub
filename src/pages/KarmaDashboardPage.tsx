import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingDown, TrendingUp, Calendar, Info, Star, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';

interface KarmaTransaction {
  id: string;
  user_id: string;
  change_amount: number;
  reason: string;
  source_type: string | null;
  source_id: string | null;
  balance_after: number;
  created_at: string;
}

interface ProfileWithKarma {
  id: string;
  economic_karma: number;
  karma_last_decay_at: string | null;
}

const KarmaDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch user's karma score
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['user-karma', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, economic_karma, karma_last_decay_at')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data as ProfileWithKarma;
    },
    enabled: !!user?.id
  });

  // Fetch karma transaction history
  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['karma-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('karma_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as KarmaTransaction[];
    },
    enabled: !!user?.id
  });

  const karmaScore = profile?.economic_karma || 100;
  const karmaLevel = karmaScore >= 90 ? 'Excellent' : karmaScore >= 70 ? 'Good' : karmaScore >= 50 ? 'Fair' : 'Needs Improvement';
  const karmaColor = karmaScore >= 90 ? 'text-green-400' : karmaScore >= 70 ? 'text-mansagold' : karmaScore >= 50 ? 'text-orange-400' : 'text-red-400';
  const karmaBgColor = karmaScore >= 90 ? 'bg-green-500/20' : karmaScore >= 70 ? 'bg-mansagold/20' : karmaScore >= 50 ? 'bg-orange-500/20' : 'bg-red-500/20';

  const getTransactionIcon = (changeAmount: number) => {
    return changeAmount > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    );
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      'monthly_decay': 'Monthly Activity Decay (5%)',
      'purchase': 'Purchase at Partner Business',
      'referral': 'Successful Referral',
      'review': 'Left a Review',
      'dispute': 'Dispute Filed',
      'cancellation': 'Booking Cancellation',
      'bonus': 'Loyalty Bonus',
      'initial': 'Account Created'
    };
    return labels[reason] || reason;
  };

  const positiveTransactions = transactions?.filter(t => t.change_amount > 0) || [];
  const negativeTransactions = transactions?.filter(t => t.change_amount < 0) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-mansablue-dark to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mansagold/20 border-2 border-mansagold/40 mb-4">
            <Sparkles className="w-10 h-10 text-mansagold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Economic <span className="text-mansagold">Karma</span>
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Your karma score reflects your engagement and reliability in the community. 
            Maintain high karma to unlock premium benefits.
          </p>
        </motion.div>

        {/* Main Karma Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mansagold/5 to-transparent pointer-events-none" />
            <CardContent className="p-8 relative">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Karma Score Circle */}
                <div className="relative">
                  <div className={`w-40 h-40 rounded-full ${karmaBgColor} flex items-center justify-center border-4 border-current ${karmaColor}`}>
                    <div className="text-center">
                      <p className={`text-5xl font-bold ${karmaColor}`}>
                        {loadingProfile ? '...' : Math.round(karmaScore)}
                      </p>
                      <p className="text-white/60 text-sm">/ 100</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Badge className={`${karmaBgColor} ${karmaColor} border-current`}>
                      {karmaLevel}
                    </Badge>
                  </div>
                </div>

                {/* Karma Details */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your Karma Score</h2>
                    <p className="text-white/60">
                      Based on your activity, purchases, reviews, and community engagement.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Score Progress</span>
                      <span className={karmaColor}>{Math.round(karmaScore)}%</span>
                    </div>
                    <Progress value={karmaScore} className="h-3" />
                  </div>

                  {profile?.karma_last_decay_at && (
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Clock className="w-4 h-4" />
                      Last decay: {formatDistanceToNow(new Date(profile.karma_last_decay_at), { addSuffix: true })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <TrendingDown className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-1">Monthly Decay</h4>
              <p className="text-white/60 text-sm">5% decay if inactive</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-mansagold mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-1">Earn Karma</h4>
              <p className="text-white/60 text-sm">Shop, review, refer</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-1">Min Floor</h4>
              <p className="text-white/60 text-sm">Can't drop below 10</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white/5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <TransactionList 
              transactions={transactions || []} 
              loading={loadingTransactions}
              getTransactionIcon={getTransactionIcon}
              getReasonLabel={getReasonLabel}
            />
          </TabsContent>

          <TabsContent value="earned" className="mt-6">
            <TransactionList 
              transactions={positiveTransactions} 
              loading={loadingTransactions}
              getTransactionIcon={getTransactionIcon}
              getReasonLabel={getReasonLabel}
              emptyMessage="No karma earned yet"
            />
          </TabsContent>

          <TabsContent value="lost" className="mt-6">
            <TransactionList 
              transactions={negativeTransactions} 
              loading={loadingTransactions}
              getTransactionIcon={getTransactionIcon}
              getReasonLabel={getReasonLabel}
              emptyMessage="No karma lost - keep it up!"
            />
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-mansagold" />
              How Economic Karma Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Ways to Earn
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Make purchases at partner businesses</li>
                  <li>• Leave reviews for businesses</li>
                  <li>• Refer friends who sign up</li>
                  <li>• Complete your profile</li>
                  <li>• Participate in community events</li>
                </ul>
              </div>
              <div>
                <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> Ways to Lose
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• 5% monthly decay if inactive</li>
                  <li>• Cancelling bookings</li>
                  <li>• Filing disputes</li>
                  <li>• Policy violations</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-mansagold/10 border border-mansagold/20">
              <p className="text-white/80 text-sm">
                <strong className="text-mansagold">Pro Tip:</strong> Stay active by making at least one purchase 
                or interaction monthly to avoid the 5% decay. Your karma score never drops below 10.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Transaction List Component
interface TransactionListProps {
  transactions: KarmaTransaction[];
  loading: boolean;
  getTransactionIcon: (amount: number) => React.ReactNode;
  getReasonLabel: (reason: string) => string;
  emptyMessage?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  loading,
  getTransactionIcon,
  getReasonLabel,
  emptyMessage = "No transactions yet"
}) => {
  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-white/60">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-0">
        <div className="divide-y divide-white/10">
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${tx.change_amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {getTransactionIcon(tx.change_amount)}
                </div>
                <div>
                  <p className="text-white font-medium">{getReasonLabel(tx.reason)}</p>
                  <p className="text-white/50 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(tx.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.change_amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.change_amount > 0 ? '+' : ''}{tx.change_amount.toFixed(1)}
                </p>
                <p className="text-white/50 text-sm">Balance: {tx.balance_after.toFixed(1)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KarmaDashboardPage;
