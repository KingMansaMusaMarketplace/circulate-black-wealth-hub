import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Loader2 } from 'lucide-react';
import { paymentService } from '@/lib/services/payment-service';
import { toast } from 'sonner';

interface PaymentFormProps {
  businessId: string;
  businessName: string;
  onSuccess?: (paymentIntentId: string) => void;
  suggestedAmount?: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  businessId,
  businessName,
  onSuccess,
  suggestedAmount = 0,
}) => {
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      
      const result = await paymentService.createPaymentIntent({
        businessId,
        amount: amountValue,
        description: description || `Payment to ${businessName}`,
      });

      toast.success('Payment initiated successfully!');
      
      // In a real implementation, you would use Stripe Elements here
      // to collect payment details and confirm the payment
      console.log('Payment Intent Created:', result);
      
      if (onSuccess) {
        onSuccess(result.paymentIntentId);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Pay {businessName}</span>
        </CardTitle>
        <CardDescription>
          Secure payment processing powered by Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this payment for?"
              rows={3}
            />
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform fee (2.5%)</span>
                <span className="font-medium">${(parseFloat(amount) * 0.025).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Business receives: ${(parseFloat(amount) * 0.975).toFixed(2)}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-mansablue hover:bg-mansablue/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Pay ${parseFloat(amount || '0').toFixed(2)}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Secure payment processing • Your payment information is encrypted
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
