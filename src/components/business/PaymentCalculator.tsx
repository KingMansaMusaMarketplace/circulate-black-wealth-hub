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
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Payment Calculator
        </CardTitle>
        <CardDescription>
          See exactly how much you receive for any transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Customer Payment Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7 text-lg font-semibold"
              placeholder="100.00"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-200 dark:border-green-800">
            <div>
              <p className="text-sm text-muted-foreground">Customer Pays</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                ${customerPayment.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-700 dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Platform Commission (7.5%)</span>
              </div>
              <span className="font-semibold text-orange-600">
                -${platformCommission.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm">Stripe Processing Fee</span>
              </div>
              <span className="font-semibold text-red-600">
                -${stripeFee.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <div>
              <p className="text-sm text-muted-foreground">You Receive</p>
              <p className="text-3xl font-bold text-primary">
                ${businessReceives.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Percent className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {businessPercentage.toFixed(1)}% of total
                </p>
              </div>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <h4 className="font-semibold text-sm">What's Included in Your Fee:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Secure payment processing with Stripe</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Customer loyalty & rewards program</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Digital receipts & transaction tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Customer insights & analytics dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Marketing to your customers via app</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>24/7 customer support</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCalculator;
