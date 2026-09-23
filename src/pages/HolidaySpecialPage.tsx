import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Gift, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { shouldHideStripePayments } from "@/utils/platform-utils";

const START = Date.parse("2026-10-01T05:00:00Z");
const END = Date.parse("2027-01-01T06:00:00Z");

const perks = [
  "Kayla and the 42 Agentic AI Employees working for your business",
  "Online booking and appointment requests from customers",
  "Priority placement and a verified, claimed profile",
  "~4 Roles Covered — over $18,000 a month in staff time saved",
];

export default function HolidaySpecialPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const now = Date.now();
  const status = now < START ? "soon" : now >= END ? "ended" : "open";
  const hidePay = shouldHideStripePayments();

  const start = async () => {
    if (!user) {
      navigate("/signup?redirect=/holiday-special");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-holiday-checkout");
      if (error || !data?.url) throw new Error(data?.error || error?.message || "Checkout failed");
      window.open(data.url, "_blank");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Holiday Special: 1325.AI Pro $149/mo Locked Forever</title>
        <meta name="description" content="Sign up October 1 – December 31 and lock in 1325.AI Pro at $149 a month forever. Regular price $299." />
      </Helmet>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1 text-sm font-semibold text-primary">
          <Gift className="h-4 w-4" /> Holiday Special · Oct 1 – Dec 31
        </div>
        <h1 className="mt-6 text-4xl font-extrabold md:text-6xl">
          1325.AI Pro for <span className="text-primary">$149/mo</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Locked in forever. Regular price <span className="line-through">$299/mo</span>.
        </p>

        <Card className="mt-10 text-left">
          <CardContent className="space-y-4 p-6 md:p-8">
            {perks.map((p) => (
              <div key={p} className="flex gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-base">{p}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-10">
          {hidePay ? (
            <p className="text-muted-foreground">Visit 1325.ai in your browser to sign up.</p>
          ) : status === "open" ? (
            <Button size="lg" className="h-14 px-10 text-lg font-bold" onClick={start} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}Lock in $149/mo
            </Button>
          ) : status === "soon" ? (
            <p className="text-lg font-semibold">Sign-ups open October 1, 2026.</p>
          ) : (
            <p className="text-lg font-semibold">The Holiday Special has ended. See current plans on our pricing page.</p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            For sign-ups October 1 – December 31, 2026. Price stays $149/month while your subscription stays active. Questions? Call 312.900.6004.
          </p>
        </div>
      </section>
    </main>
  );
}
