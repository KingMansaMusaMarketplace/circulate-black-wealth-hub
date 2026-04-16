import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, Receipt, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { shouldHideStripePayments } from "@/utils/platform-utils";

interface QRPayBillProps {
  businessId: string;
  businessName: string;
  qrCodeId?: string;
  pointsEarned: number;
  discountPercentage: number;
  onCancel: () => void;
}

const COMMISSION_RATE = 7.5;

const QRPayBill: React.FC<QRPayBillProps> = ({
  businessId,
  businessName,
  qrCodeId,
  pointsEarned,
  discountPercentage,
  onCancel,
}) => {
  const [amountStr, setAmountStr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const amount = parseFloat(amountStr) || 0;

  const breakdown = useMemo(() => {
    const discount = amount * (discountPercentage / 100);
    const finalAmount = Math.max(0, amount - discount);
    const bonusPoints = Math.floor(finalAmount * 10); // 10 pts/$
    return {
      discount,
      finalAmount,
      bonusPoints,
      totalPoints: pointsEarned + bonusPoints,
    };
  }, [amount, discountPercentage, pointsEarned]);

  const handlePay = async () => {
    if (amount <= 0) {
      toast.error("Please enter your bill amount");
      return;
    }
    if (breakdown.finalAmount < 0.5) {
      toast.error("Total must be at least $0.50");
      return;
    }

    if (shouldHideStripePayments()) {
      toast.error("In-app payments are not available on iOS. Please pay at the business.");
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabase.functions.invoke("process-qr-transaction", {
        body: {
          businessId,
          qrCodeId,
          amount, // pre-discount bill
          discountPercentage,
          description: `Bill payment at ${businessName}`,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/qr-scanner?canceled=1`,
        },
      });

      if (error) throw error;
      if (!data?.success || !data?.url) {
        throw new Error(data?.error || "Failed to start checkout");
      }

      // Redirect to Stripe Checkout (Apple Pay / Google Pay supported automatically)
      window.location.href = data.url;
    } catch (err) {
      console.error("Pay bill error:", err);
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          Pay Your Bill
        </CardTitle>
        <p className="text-sm text-muted-foreground">at {businessName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {discountPercentage > 0 && (
          <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-3">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {discountPercentage}% discount unlocked from your scan
            </span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="bill-amount">Bill amount (USD)</Label>
          <Input
            id="bill-amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            disabled={submitting}
          />
        </div>

        {amount > 0 && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            {discountPercentage > 0 && (
              <div className="flex justify-between text-primary">
                <span>Discount ({discountPercentage}%)</span>
                <span>−${breakdown.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total to pay</span>
              <span>${breakdown.finalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-2">
              <span>Points you'll earn</span>
              <Badge variant="secondary">+{breakdown.totalPoints} pts</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Includes scan bonus ({pointsEarned}) + {breakdown.bonusPoints} from purchase.
              Platform fee: {COMMISSION_RATE}%.
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onCancel} disabled={submitting} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handlePay} disabled={submitting || amount <= 0} className="flex-1">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ${breakdown.finalAmount.toFixed(2)}
              </>
            )}
          </Button>
        </div>

        <p className="text-[11px] text-center text-muted-foreground">
          Secure checkout by Stripe • Apple Pay & Google Pay supported
        </p>
      </CardContent>
    </Card>
  );
};

export default QRPayBill;
