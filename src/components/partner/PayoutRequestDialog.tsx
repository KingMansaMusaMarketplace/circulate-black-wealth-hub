import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

interface PayoutRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingAmount: number;
  onSubmit: (amount: number, method: string) => Promise<void>;
}

const PayoutRequestDialog: React.FC<PayoutRequestDialogProps> = ({
  open,
  onOpenChange,
  pendingAmount,
  onSubmit,
}) => {
  const [amount, setAmount] = useState(pendingAmount.toString());
  const [method, setMethod] = useState('bank_transfer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > pendingAmount) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(numAmount, method);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const isValid = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= pendingAmount;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Request Payout
          </DialogTitle>
          <DialogDescription>
            Request a withdrawal of your pending earnings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold text-green-600">${pendingAmount.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Withdraw</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={pendingAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => setAmount(pendingAmount.toString())}
            >
              Withdraw full balance
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payout Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer (ACH)</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Payouts are processed within 5-7 business days.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid() || loading}>
            {loading ? 'Requesting...' : 'Request Payout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutRequestDialog;
