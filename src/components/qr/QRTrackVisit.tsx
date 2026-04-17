import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Receipt, Tag, ShieldCheck, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QRTrackVisitProps {
  businessId: string;
  businessName: string;
  qrCodeId?: string;
  pointsEarned: number;
  discountPercentage: number;
  onDone: () => void;
}

const QRTrackVisit: React.FC<QRTrackVisitProps> = ({
  businessId,
  businessName,
  qrCodeId,
  pointsEarned,
  discountPercentage,
  onDone,
}) => {
  const [step, setStep] = useState<"amount" | "cashier">("amount");
  const [amountStr, setAmountStr] = useState("");
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const amount = parseFloat(amountStr) || 0;
  const breakdown = useMemo(() => {
    const discount = amount * (discountPercentage / 100);
    const finalAmount = Math.max(0, amount - discount);
    return { discount, finalAmount };
  }, [amount, discountPercentage]);

  const submit = async (withPin: boolean) => {
    if (amount <= 0) {
      toast.error("Please enter your bill amount");
      return;
    }
    if (withPin && !/^\d{4,6}$/.test(pin)) {
      toast.error("Cashier PIN must be 4–6 digits");
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabase.functions.invoke("log-visit", {
        body: {
          businessId,
          qrCodeId,
          reportedAmount: amount,
          discountPercentage,
          cashierPin: withPin ? pin : undefined,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to log visit");

      if (data.confirmed) {
        toast.success("Visit confirmed by cashier ✓");
      } else {
        toast.success("Visit logged. Ask the cashier to confirm anytime.");
      }
      onDone();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to log visit";
      toast.error(msg === "invalid_pin" ? "That PIN didn't match. Try again." : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "cashier") {
    return (
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Hand to Cashier
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Bill: <strong>${breakdown.finalAmount.toFixed(2)}</strong> at {businessName}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            Show this screen to the cashier. They'll enter the store PIN to confirm your bill.
          </div>
          <div className="space-y-2">
            <Label htmlFor="cashier-pin">Cashier PIN</Label>
            <Input
              id="cashier-pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              disabled={submitting}
              className="text-center text-2xl tracking-widest"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("amount")} disabled={submitting} className="flex-1">
              Back
            </Button>
            <Button onClick={() => submit(true)} disabled={submitting || pin.length < 4} className="flex-1">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Visit"}
            </Button>
          </div>
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={submitting}
            className="block w-full text-center text-xs text-muted-foreground underline"
          >
            Skip — log without cashier confirm
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          Log Your Visit
        </CardTitle>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Store className="h-3 w-3" /> {businessName}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs">
          <strong>Pay your bill at the register</strong> as usual. Log the amount here so {businessName} can see the
          customers we send their way.
        </div>

        {discountPercentage > 0 && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-3">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-sm">
              Show your <strong>{discountPercentage}% discount</strong> to the cashier before they ring you up.
            </span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="visit-amount">Bill amount (USD)</Label>
          <Input
            id="visit-amount"
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
              <span>You'll pay at register</span>
              <span>${breakdown.finalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-2">
              <span>Points already earned</span>
              <Badge variant="secondary">+{pointsEarned} pts</Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onDone} disabled={submitting} className="flex-1">
            Skip
          </Button>
          <Button onClick={() => setStep("cashier")} disabled={amount <= 0 || submitting} className="flex-1">
            Next: Cashier Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRTrackVisit;
