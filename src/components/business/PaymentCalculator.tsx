import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Percent, TrendingDown, TrendingUp } from 'lucide-react';

const PaymentCalculator = () => {
  const [amount, setAmount] = useState<string>('100');

  const parseAmount = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  };

  const customerPayment = parseAmount(amount);
  const platformCommission = customerPayment * 0.075; // 7.5%
  const stripeFee = customerPayment * 0.029 + 0.30; // 2.9% + $0.30
  const businessReceives = customerPayment - platformCommission - stripeFee;
  const businessPercentage = customerPayment > 0 ? (businessReceives / customerPayment) * 100 : 0;

  return (
    <Card className="border-2 border-white/20 shadow-xl bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl text-white font-bold">
          <DollarSign className="h-7 w-7 text-mansagold" />
          Payment Calculator
        </CardTitle>
        <CardDescription className="text-base mt-2 text-white/80 font-medium">
          See exactly how much you receive for any transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Input Section */}
        <div className="space-y-3">
          <Label htmlFor="amount" className="text-base font-bold text-white">Customer Payment Amount</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-xl font-bold">$</span>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 text-2xl font-bold h-16 text-center bg-slate-800 text-white border-white/30 focus:border-mansagold"
              placeholder="100.00"
            />
          </div>
        </div>

        {/* Calculation Breakdown */}
        <div className="space-y-4">
          {/* Customer Pays */}
          <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-900/60 to-green-900/40 rounded-xl border-2 border-emerald-500/50">
            <div className="space-y-1">
              <p className="text-sm font-bold text-emerald-300 uppercase tracking-wide">Customer Pays</p>
              <p className="text-3xl font-bold text-emerald-400">
                ${customerPayment.toFixed(2)}
              </p>
            </div>
            <div className="bg-emerald-800/60 p-4 rounded-full">
              <DollarSign className="h-7 w-7 text-emerald-400" />
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-3 p-5 bg-slate-800/60 rounded-xl border border-white/20">
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-3">Deductions</p>
            
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-orange-900/50 p-2 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-orange-400" />
                </div>
                <span className="text-base font-semibold text-white">Platform Commission (7.5%)</span>
              </div>
              <span className="text-lg font-bold text-orange-400">
                -${platformCommission.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <div className="bg-red-900/50 p-2 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-base font-semibold text-white">Stripe Processing Fee (2.9% + $0.30)</span>
              </div>
              <span className="text-lg font-bold text-red-400">
                -${stripeFee.toFixed(2)}
              </span>
            </div>
          </div>

          {/* You Receive */}
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-mansagold/20 to-amber-600/10 rounded-xl border-2 border-mansagold/60 shadow-lg">
            <div className="space-y-2">
              <p className="text-sm font-bold text-white uppercase tracking-wide">You Receive</p>
              <p className="text-4xl font-bold text-mansagold">
                ${businessReceives.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="bg-mansagold/30 px-3 py-1 rounded-full">
                  <p className="text-sm font-bold text-mansagold">
                    {businessPercentage.toFixed(1)}% of total
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-mansagold/30 p-4 rounded-full">
              <TrendingUp className="h-8 w-8 text-mansagold" />
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="pt-6 border-t-2 border-white/20 space-y-4">
          <h4 className="font-bold text-lg text-white">What&apos;s Included in Your Fee:</h4>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-mansagold text-xl font-bold flex-shrink-0">✓</span>
              <span className="text-base font-medium text-white">Secure payment processing with Stripe</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-mansagold text-xl font-bold flex-shrink-0">✓</span>
              <span className="text-base font-medium text-white">Customer loyalty & rewards program</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-mansagold text-xl font-bold flex-shrink-0">✓</span>
              <span className="text-base font-medium text-white">Digital receipts & transaction tracking</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-mansagold text-xl font-bold flex-shrink-0">✓</span>
              <span className="text-base font-medium text-white">Customer insights & analytics dashboard</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-mansagold text-xl font-bold flex-shrink-0">✓</span>
              <span className="text-base font-medium text-white">Marketing to your customers via app</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-mansagold text-xl font-bold flex-shrink-0">✓</span>
              <span className="text-base font-medium text-white">24/7 customer support</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCalculator;
