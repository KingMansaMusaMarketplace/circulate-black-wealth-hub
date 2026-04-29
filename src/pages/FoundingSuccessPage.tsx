import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { FOUNDING_MEMBER_PRICE_MONTHLY_USD } from "@/lib/constants/founding-member";

type Status = "verifying" | "success" | "error";

const FoundingSuccessPage = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<Status>("verifying");
  const [slot, setSlot] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setStatus("error");
        setErrorMsg("Missing session id.");
        return;
      }
      const { data, error } = await supabase.functions.invoke(
        "verify-founding-checkout",
        { body: { session_id: sessionId } },
      );
      if (error || data?.error) {
        setStatus("error");
        setErrorMsg(data?.error ?? error?.message ?? "Verification failed");
        return;
      }
      setSlot(data.slot_number);
      setStatus("success");
    };
    verify();
  }, [sessionId]);

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg border-mansagold/40 bg-gradient-to-b from-mansagold/5 to-transparent">
        <CardHeader className="text-center">
          {status === "verifying" && (
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-mansagold" />
          )}
          {status === "success" && (
            <CheckCircle2 className="mx-auto h-12 w-12 text-mansagold" />
          )}
          {status === "error" && (
            <Sparkles className="mx-auto h-10 w-10 text-destructive" />
          )}
          <CardTitle className="mt-4 text-2xl">
            {status === "verifying" && "Confirming your Founding Member spot…"}
            {status === "success" && `You're Founding Member #${slot}`}
            {status === "error" && "We couldn't confirm your payment"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {status === "success" && (
            <>
              <p className="text-muted-foreground">
                Welcome to the Founding 100. Your Pro access is active and your
                rate is locked at{" "}
                <strong className="text-foreground">
                  ${FOUNDING_MEMBER_PRICE_MONTHLY_USD}/month
                </strong>{" "}
                forever.
              </p>
              <Button asChild size="lg" className="w-full">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <p className="text-muted-foreground">{errorMsg}</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/pricing">Back to Pricing</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FoundingSuccessPage;
