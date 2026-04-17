import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";

const CashierPinSettings: React.FC<{ businessId: string }> = ({ businessId }) => {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!/^\d{4,6}$/.test(pin)) {
      toast.error("PIN must be 4–6 digits");
      return;
    }
    if (pin !== confirm) {
      toast.error("PINs don't match");
      return;
    }
    try {
      setSaving(true);
      const { error } = await supabase.rpc("set_cashier_pin", {
        p_business_id: businessId,
        p_pin: pin,
      });
      if (error) throw error;
      toast.success("Cashier PIN updated");
      setPin("");
      setConfirm("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update PIN");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound className="h-4 w-4" /> Cashier PIN
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Share this 4–6 digit PIN with your staff. They'll tap it on the customer's phone to instantly
          confirm tracked visits — no Stripe required.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="pin">New PIN</Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              disabled={saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin-confirm">Confirm</Label>
            <Input
              id="pin-confirm"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              disabled={saving}
            />
          </div>
        </div>
        <Button onClick={save} disabled={saving || pin.length < 4} size="sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save PIN"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CashierPinSettings;
