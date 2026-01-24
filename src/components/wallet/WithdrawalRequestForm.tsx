import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Banknote, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawalRequestFormProps {
  walletBalance: number;
  onSuccess?: () => void;
}

const WITHDRAWAL_FEE_RATE = 0.02; // 2% withdrawal fee
const MIN_WITHDRAWAL = 10;

const paymentMethods = [
  { value: 'paypal', label: 'PayPal', placeholder: 'PayPal email address' },
  { value: 'venmo', label: 'Venmo', placeholder: 'Venmo username or phone' },
  { value: 'zelle', label: 'Zelle', placeholder: 'Zelle email or phone' },
  { value: 'cash_app', label: 'Cash App', placeholder: 'Cash App $cashtag' },
  { value: 'bank_transfer', label: 'Bank Transfer', placeholder: 'Bank account details' },
];

const WithdrawalRequestForm: React.FC<WithdrawalRequestFormProps> = ({ 
  walletBalance, 
  onSuccess 
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [notes, setNotes] = useState('');

  const numericAmount = parseFloat(amount) || 0;
  const fee = numericAmount * WITHDRAWAL_FEE_RATE;
  const netAmount = numericAmount - fee;
  const canWithdraw = numericAmount >= MIN_WITHDRAWAL && numericAmount <= walletBalance;

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user.id,
          amount: numericAmount,
          payment_method: paymentMethod,
          payment_details: { details: paymentDetails },
          user_notes: notes || null,
          platform_fee: fee,
          net_amount: netAmount,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-requests'] });
      toast.success('Withdrawal request submitted! We\'ll process it within 2-3 business days.');
      setOpen(false);
      resetForm();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Failed to submit request: ' + (error as Error).message);
    },
  });

  const resetForm = () => {
    setAmount('');
    setPaymentMethod('');
    setPaymentDetails('');
    setNotes('');
  };

  const selectedMethod = paymentMethods.find(m => m.value === paymentMethod);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
          disabled={walletBalance < MIN_WITHDRAWAL}
        >
          <Banknote className="w-4 h-4" />
          <span>Request Cash Out</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-400" />
            Request Withdrawal
          </DialogTitle>
          <CardDescription>
            Cash out your wallet balance to your preferred payment method
          </CardDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Available Balance */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-slate-400">Available Balance</p>
            <p className="text-2xl font-bold text-emerald-400">${walletBalance.toFixed(2)}</p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                min={MIN_WITHDRAWAL}
                max={walletBalance}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9"
                placeholder={`Min $${MIN_WITHDRAWAL}`}
              />
            </div>
            {numericAmount > 0 && numericAmount < MIN_WITHDRAWAL && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Minimum withdrawal is ${MIN_WITHDRAWAL}
              </p>
            )}
            {numericAmount > walletBalance && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Amount exceeds your balance
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Details */}
          {paymentMethod && (
            <div className="space-y-2">
              <Label htmlFor="paymentDetails">{selectedMethod?.label} Details</Label>
              <Input
                id="paymentDetails"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder={selectedMethod?.placeholder}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
              rows={2}
            />
          </div>

          {/* Fee Breakdown */}
          {numericAmount >= MIN_WITHDRAWAL && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Withdrawal Amount</span>
                <span>${numericAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee (2%)</span>
                <span className="text-red-400">-${fee.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span>You'll Receive</span>
                <span className="text-emerald-400">${netAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Processing Time Notice */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Withdrawals are typically processed within 2-3 business days after approval.</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => createRequestMutation.mutate()}
            disabled={!canWithdraw || !paymentMethod || !paymentDetails || createRequestMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {createRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalRequestForm;
