import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Gift, TrendingUp, Store, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNoireCommunityCredits } from '@/hooks/useNoireCommunityCredits';

const NoireCommunityRewards: React.FC = () => {
  const { balance, transactions, loading } = useNoireCommunityCredits();

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-white/5 rounded-xl" />
            <div className="h-12 bg-white/5 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-mansagold" />
          Community Credits
        </CardTitle>
        <p className="text-white/50 text-xs">Earn credits riding to Black-owned businesses, redeem at those same businesses</p>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-mansagold/20 to-amber-500/10 border border-mansagold/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-xs uppercase tracking-wider">Available Credits</span>
            <Badge variant="outline" className="border-mansagold/30 text-mansagold text-xs">
              <Gift className="h-3 w-3 mr-1" />
              Redeemable
            </Badge>
          </div>
          <div className="text-4xl font-bold text-mansagold font-mono">
            {balance.credits_balance.toFixed(0)}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="text-xs">
              <span className="text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {balance.total_earned.toFixed(0)} earned
              </span>
            </div>
            <div className="text-xs">
              <span className="text-white/40 flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3" />
                {balance.total_redeemed.toFixed(0)} redeemed
              </span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '🚗', label: 'Ride to a\nbusiness', detail: '+5 credits' },
            { icon: '⭐', label: 'Rate your\nexperience', detail: '+2 credits' },
            { icon: '🛍️', label: 'Redeem at\nthe business', detail: 'Spend credits' },
          ].map((step, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">{step.icon}</div>
              <p className="text-white/60 text-[10px] leading-tight whitespace-pre-line">{step.label}</p>
              <p className="text-mansagold text-[10px] font-semibold mt-1">{step.detail}</p>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <div>
            <h4 className="text-white/60 text-xs uppercase tracking-wider mb-2">Recent Activity</h4>
            <div className="space-y-2">
              {transactions.slice(0, 5).map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      tx.transaction_type === 'earned' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'
                    }`}>
                      {tx.transaction_type === 'earned' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    </div>
                    <div>
                      <p className="text-white text-xs">{tx.description || (tx.business as any)?.business_name || 'Credit'}</p>
                      <p className="text-white/30 text-[10px]">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-semibold ${
                    tx.transaction_type === 'earned' ? 'text-emerald-400' : 'text-white/40'
                  }`}>
                    {tx.transaction_type === 'earned' ? '+' : '-'}{tx.amount}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoireCommunityRewards;
