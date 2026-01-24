import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletBalanceProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ variant = 'full', className = '' }) => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['wallet-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentTransactions } = useQuery({
    queryKey: ['wallet-recent-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const balance = Number(profile?.wallet_balance || 0);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="p-2 rounded-lg bg-emerald-500/20">
          <Wallet className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Wallet</p>
          <p className="text-lg font-bold text-emerald-400">
            {isLoading ? '...' : `$${balance.toFixed(2)}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-slate-800/60 backdrop-blur-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Wallet Balance</p>
                <p className="text-3xl font-bold text-white">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    `$${balance.toFixed(2)}`
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Available</span>
            </div>
          </div>

          {recentTransactions && recentTransactions.length > 0 && (
            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Recent Activity</p>
              <div className="space-y-2">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {tx.transaction_type === 'credit' ? (
                        <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-slate-300 truncate max-w-[150px]">
                        {tx.description || tx.source.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={tx.transaction_type === 'credit' ? 'text-emerald-400' : 'text-red-400'}>
                      {tx.transaction_type === 'credit' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletBalance;
