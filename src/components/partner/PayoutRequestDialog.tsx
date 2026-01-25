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
  minimumThreshold?: number;
  onSubmit: (amount: number, method: string) => Promise<void>;
}

const PayoutRequestDialog: React.FC<PayoutRequestDialogProps> = ({
  open,
  onOpenChange,
  pendingAmount,
  minimumThreshold = 50,
  onSubmit,
}) => {
  const [amount, setAmount] = useState(pendingAmount.toString());
  const [method, setMethod] = useState('bank_transfer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < minimumThreshold || numAmount > pendingAmount) {
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
    return !isNaN(numAmount) && numAmount >= minimumThreshold && numAmount <= pendingAmount;
  };

  const isBelowThreshold = pendingAmount < minimumThreshold;

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
            <p className="text-xs text-muted-foreground mt-1">
              Minimum payout: ${minimumThreshold.toFixed(2)}
            </p>
          </div>

          {isBelowThreshold ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Your balance is below the ${minimumThreshold.toFixed(2)} minimum threshold.
                Keep referring businesses to reach the payout minimum!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Withdraw</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min={minimumThreshold}
                    max={pendingAmount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setAmount(pendingAmount.toString())}
                  >
                    Withdraw full balance
                  </Button>
                  {parseFloat(amount) < minimumThreshold && (
                    <span className="text-xs text-destructive">
                      Minimum: ${minimumThreshold.toFixed(2)}
                    </span>
                  )}
                </div>
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
                  Payouts are processed monthly within 5-7 business days.
                </p>
              </div>
            </>
          )}
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
