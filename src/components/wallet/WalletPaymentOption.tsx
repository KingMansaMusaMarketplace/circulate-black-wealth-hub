import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard } from 'lucide-react';

interface WalletPaymentOptionProps {
  amount: number;
  onPayWithWallet: () => void;
  onPayWithCard: () => void;
  isProcessing?: boolean;
}

const WalletPaymentOption: React.FC<WalletPaymentOptionProps> = ({
  amount,
  onPayWithWallet,
  onPayWithCard,
  isProcessing = false,
}) => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
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
  });

  const walletBalance = Number(profile?.wallet_balance || 0);
  const hasEnoughBalance = walletBalance >= amount;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-300">Choose Payment Method</p>
      
      {/* Wallet Option */}
      <Card 
        className={`border cursor-pointer transition-all ${
          hasEnoughBalance 
            ? 'border-emerald-500/30 bg-emerald-900/10 hover:border-emerald-400/50' 
            : 'border-white/10 bg-slate-800/40 opacity-60'
        }`}
        onClick={hasEnoughBalance && !isProcessing ? onPayWithWallet : undefined}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${hasEnoughBalance ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
              <Wallet className={`w-5 h-5 ${hasEnoughBalance ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <p className="text-white font-medium">Pay with Wallet</p>
              <p className="text-sm text-slate-400">
                Balance: <span className={hasEnoughBalance ? 'text-emerald-400' : 'text-red-400'}>
                  ${walletBalance.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
          {hasEnoughBalance ? (
            <Button 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Use Wallet'}
            </Button>
          ) : (
            <span className="text-xs text-red-400">Insufficient balance</span>
          )}
        </CardContent>
      </Card>

      {/* Card Option */}
      <Card 
        className="border border-white/10 bg-slate-800/40 hover:border-mansagold/30 cursor-pointer transition-all"
        onClick={!isProcessing ? onPayWithCard : undefined}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-mansagold/20">
              <CreditCard className="w-5 h-5 text-mansagold" />
            </div>
            <div>
              <p className="text-white font-medium">Pay with Card</p>
              <p className="text-sm text-slate-400">Credit or debit card</p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            className="border-mansagold/50 text-mansagold hover:bg-mansagold/10"
            disabled={isProcessing}
          >
            Use Card
          </Button>
        </CardContent>
      </Card>

      {/* Amount Summary */}
      <div className="pt-2 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Amount to pay</span>
          <span className="text-white font-semibold">${amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default WalletPaymentOption;
