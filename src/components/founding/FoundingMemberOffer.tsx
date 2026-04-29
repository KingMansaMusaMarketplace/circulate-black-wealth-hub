import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, Loader2 } from "lucide-react";
import { useFoundingSlots } from "@/hooks/useFoundingSlots";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  FOUNDING_MEMBER_PRICE_MONTHLY_USD,
  REGULAR_PRO_PRICE_MONTHLY_USD,
} from "@/lib/constants/founding-member";
import { shouldHideStripePayments } from "@/utils/platform-utils";

export const FoundingMemberOffer = () => {
  const { remaining, isFull, loading: slotsLoading } = useFoundingSlots();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (shouldHideStripePayments()) return null;

  const startCheckout = async (
    fn: "create-founding-checkout" | "create-pro-checkout",
  ) => {
    if (!user) {
      sessionStorage.setItem(
        "pendingSubscription",
        fn === "create-founding-checkout" ? "founding_pro" : "pro",
      );
      navigate("/signup");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke(fn, {
        body: {},
      });
      if (error) throw error;
      if (data?.error === "SLOTS_FULL") {
        toast.info(
          "All 100 Founding spots are taken — switching you to regular Pro at $249/mo.",
        );
        return startCheckout("create-pro-checkout");
      }
      if (data?.error === "ALREADY_FOUNDING_MEMBER") {
        toast.success(
          `You're already Founding Member #${data.slot_number}. Welcome back!`,
        );
        navigate("/dashboard");
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data?.error ?? "Could not start checkout");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (slotsLoading) {
    return (
      <Card className="border-mansagold/30 bg-card">
        <CardContent className="py-12 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (isFull) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <Badge variant="outline" className="w-fit">Sold Out</Badge>
          <CardTitle className="text-2xl">
            Founding 100 — sold out
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            All 100 Founding Member spots are claimed. Join Pro at our regular
            rate:
          </p>
          <div className="text-4xl font-bold">
            ${REGULAR_PRO_PRICE_MONTHLY_USD}
            <span className="text-base font-normal text-muted-foreground">
              /mo
            </span>
          </div>
          <Button
            size="lg"
            className="w-full"
            disabled={submitting}
            onClick={() => startCheckout("create-pro-checkout")}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Get Pro"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-mansagold/40 bg-gradient-to-b from-mansagold/5 to-transparent">
      <div className="absolute right-4 top-4">
        <Badge className="bg-mansagold text-mansablue">
          <Sparkles className="mr-1 h-3 w-3" />
          {remaining} of 100 left
        </Badge>
      </div>
      <CardHeader>
        <Badge variant="outline" className="w-fit border-mansagold/60 text-mansagold">
          Founding 100
        </Badge>
        <CardTitle className="text-2xl">
          Pro — ${FOUNDING_MEMBER_PRICE_MONTHLY_USD}/mo, locked in forever
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Save ${REGULAR_PRO_PRICE_MONTHLY_USD - FOUNDING_MEMBER_PRICE_MONTHLY_USD}/mo
          vs regular price. Your rate never increases — even if we raise Pro pricing later.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">${FOUNDING_MEMBER_PRICE_MONTHLY_USD}</span>
          <span className="text-muted-foreground">/month, forever</span>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Lock className="mt-0.5 h-4 w-4 text-mansagold" />
            Rate locked in for life — no future price hikes
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-mansagold" />
            Founding Member badge on your profile
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-mansagold" />
            Full Pro access: all 33 AI agents, priority support, advanced analytics
          </li>
        </ul>
        <Button
          size="lg"
          className="w-full bg-mansagold text-mansablue hover:bg-mansagold/90"
          disabled={submitting}
          onClick={() => startCheckout("create-founding-checkout")}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            `Claim Founding Spot — $${FOUNDING_MEMBER_PRICE_MONTHLY_USD}/mo forever`
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          After 100 spots fill, Pro returns to ${REGULAR_PRO_PRICE_MONTHLY_USD}/mo.
        </p>
      </CardContent>
    </Card>
  );
};

export default FoundingMemberOffer;
