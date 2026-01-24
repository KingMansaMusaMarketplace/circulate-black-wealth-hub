import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Receipt, 
  Users, 
  Gift, 
  ShoppingBag,
  RefreshCw,
  Banknote
} from 'lucide-react';
import { format } from 'date-fns';

interface WalletTransaction {
  id: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  source: string;
  description: string | null;
  balance_before: number;
  balance_after: number;
  created_at: string;
}

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'susu_payout':
      return Users;
    case 'reward':
      return Gift;
    case 'purchase':
      return ShoppingBag;
    case 'refund':
      return RefreshCw;
    case 'withdrawal':
      return Banknote;
    default:
      return Receipt;
  }
};

const getSourceLabel = (source: string) => {
  switch (source) {
    case 'susu_payout':
      return 'Susu Payout';
    case 'reward':
      return 'Reward';
    case 'purchase':
      return 'Purchase';
    case 'refund':
      return 'Refund';
    case 'withdrawal':
      return 'Withdrawal';
    case 'manual_adjustment':
      return 'Adjustment';
    default:
      return source;
  }
};

const WalletTransactionHistory: React.FC = () => {
  const { user } = useAuth();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['wallet-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as WalletTransaction[];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
        <CardContent className="p-6 text-center">
          <p className="text-slate-400">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-mansagold" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No transactions yet</p>
            <p className="text-slate-500 text-sm">Your wallet activity will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {transactions.map((tx) => {
                const Icon = getSourceIcon(tx.source);
                const isCredit = tx.transaction_type === 'credit';
                
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isCredit ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {isCredit ? (
                          <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium text-sm">
                            {tx.description || getSourceLabel(tx.source)}
                          </p>
                          <Badge variant="outline" className="text-xs border-white/20 text-slate-400">
                            <Icon className="w-3 h-3 mr-1" />
                            {getSourceLabel(tx.source)}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-xs">
                          {format(new Date(tx.created_at), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isCredit ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isCredit ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                      </p>
                      <p className="text-slate-500 text-xs">
                        Balance: ${Number(tx.balance_after).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletTransactionHistory;
