/**
 * @fileoverview QR Code Transaction Processing Engine
 *
 * Creates a Stripe Checkout Session with:
 * - 7.5% platform commission (split via Stripe Connect)
 * - Discount applied to the customer's bill (from QR code)
 * - Apple Pay / Google Pay supported automatically by Checkout
 * - Returns a `url` for the client to redirect into Stripe Checkout
 *
 * © 2024-2026 Thomas D. Bowling. All rights reserved.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const COMMISSION_RATE = 7.5; // 7.5% platform commission

const qrTransactionSchema = z.object({
  businessId: z.string().uuid(),
  qrCodeId: z.string().uuid().optional(),
  amount: z.number().positive().max(99999.99), // pre-discount bill (USD)
  discountPercentage: z.number().min(0).max(100).optional().default(0),
  description: z.string().max(500).optional(),
  customerEmail: z.string().email().max(255).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as any ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const rawBody = await req.json();
    const parseResult = qrTransactionSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request data",
          details: parseResult.error.errors,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const {
      businessId, qrCodeId, amount, discountPercentage, description,
      customerEmail, successUrl, cancelUrl,
    } = parseResult.data;

    // Get business payment account
    const { data: paymentAccount, error: accountError } = await supabase
      .from("business_payment_accounts")
      .select("stripe_account_id, charges_enabled")
      .eq("business_id", businessId)
      .single();

    if (accountError || !paymentAccount) {
      throw new Error("Business has not connected Stripe yet");
    }
    if (!paymentAccount.charges_enabled) {
      throw new Error("Business cannot accept payments yet");
    }

    // Get business name for line item
    const { data: business } = await supabase
      .from("businesses")
      .select("business_name")
      .eq("id", businessId)
      .single();

    // Apply discount to the bill the customer pays
    const discountedAmount = amount * (1 - (discountPercentage || 0) / 100);
    const finalAmountCents = Math.max(50, Math.round(discountedAmount * 100)); // Stripe min 50¢
    const commissionCents = Math.round(finalAmountCents * (COMMISSION_RATE / 100));
    const businessReceivesCents = finalAmountCents - commissionCents;

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const origin = req.headers.get("origin") || "https://mansamusamarketplace.com";
    const productName = business?.business_name
      ? `Payment to ${business.business_name}`
      : "QR Code Payment";
    const lineItemName = discountPercentage && discountPercentage > 0
      ? `${productName} (${discountPercentage}% discount applied)`
      : productName;

    // Create Checkout Session with Connect split
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: finalAmountCents,
            product_data: {
              name: lineItemName,
              description: description || `Original bill: $${amount.toFixed(2)}`,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: commissionCents,
        transfer_data: { destination: paymentAccount.stripe_account_id },
        metadata: {
          businessId,
          qrCodeId: qrCodeId || "direct",
          customerId: user.id,
          originalAmount: amount.toFixed(2),
          discountPercentage: String(discountPercentage || 0),
          finalAmount: (finalAmountCents / 100).toFixed(2),
          commissionRate: COMMISSION_RATE.toString(),
          transactionType: "qr_scan",
        },
        description: description || `QR Code Payment to ${business?.business_name || "Business"}`,
      },
      success_url: successUrl || `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/qr-scanner?canceled=1`,
      metadata: {
        businessId,
        qrCodeId: qrCodeId || "direct",
        customerId: user.id,
        transactionType: "qr_scan",
      },
    });

    // Record pending transaction (will be confirmed via stripe-webhook)
    const { data: transaction } = await supabase
      .from("transactions")
      .insert({
        business_id: businessId,
        customer_id: user.id,
        amount: finalAmountCents / 100,
        points_earned: Math.floor((finalAmountCents / 100) * 10),
        description: description || `QR Code Purchase`,
        transaction_type: "qr_scan",
        metadata: {
          checkout_session_id: session.id,
          payment_intent_id: session.payment_intent,
          qr_code_id: qrCodeId,
          original_amount: amount,
          discount_percentage: discountPercentage || 0,
          commission_rate: COMMISSION_RATE,
          status: "pending",
        },
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
        sessionId: session.id,
        transaction,
        breakdown: {
          originalAmount: amount,
          discountPercentage: discountPercentage || 0,
          finalAmount: finalAmountCents / 100,
          commission: {
            rate: COMMISSION_RATE,
            amount: commissionCents / 100,
            businessReceives: businessReceivesCents / 100,
          },
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error processing QR transaction:", error);
    const errorMessage = error instanceof Error ? (error as Error).message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
