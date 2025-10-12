import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CheckoutParams {
  tier: string;
  companyName: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export const useCorporateCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const startCheckout = async (params: CheckoutParams) => {
    try {
      setIsLoading(true);

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with checkout",
          variant: "destructive",
        });
        return null;
      }

      // Call edge function to create checkout session
      const { data, error } = await supabase.functions.invoke("create-corporate-checkout", {
        body: {
          tier: params.tier,
          companyName: params.companyName,
          email: session.user.email,
          logoUrl: params.logoUrl,
          websiteUrl: params.websiteUrl,
        },
      });

      if (error) {
        console.error("Checkout error:", error);
        toast({
          title: "Checkout Failed",
          description: error.message || "Failed to start checkout process",
          variant: "destructive",
        });
        return null;
      }

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
        return data;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { startCheckout, isLoading };
};
