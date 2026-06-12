import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function RedeemBetaCodePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in first, then redeem your code.");
      navigate("/auth?redirect=/redeem-beta");
      return;
    }
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Enter your beta code.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("redeem_beta_code", {
        p_beta_code: trimmed,
      });
      if (error) throw error;
      const result = data as { success: boolean; error?: string };
      if (result?.success) {
        toast.success("Beta code accepted! 🎉 Your free access is active.");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else if (result?.error === "not_authenticated") {
        toast.error("Please sign in first.");
        navigate("/auth?redirect=/redeem-beta");
      } else {
        toast.error("That code isn't valid, was already used, or has expired.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not redeem code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Redeem Beta Code | 1325.AI</title>
        <meta name="description" content="Redeem your 1325.AI beta tester code to activate free access." />
        <link rel="canonical" href="https://www.1325.ai/redeem-beta" />
      </Helmet>
      <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Redeem your beta code</CardTitle>
            <CardDescription>
              {user
                ? `Signed in as ${user.email}. Enter the code from your invite below.`
                : "Sign in first, then come back here to enter your beta code."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRedeem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Beta code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. C1AC2D49"
                  autoComplete="off"
                  className="uppercase tracking-wider"
                />
                <p className="text-xs text-muted-foreground">
                  Your code works even if your account email differs from the email your invite was sent to.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Redeeming..." : user ? "Redeem code" : "Sign in to redeem"}
              </Button>
              {!user && (
                <Link to="/auth?redirect=/redeem-beta" className="block text-center text-sm text-primary underline">
                  Go to sign in
                </Link>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
