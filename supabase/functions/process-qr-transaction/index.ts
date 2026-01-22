/**
 * @fileoverview QR Code Transaction Processing Engine
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 * 
 * CLAIM 9: QR Transaction Processing with Commission Splitting
 * ------------------------------------------------------------
 * This module implements QR-based payment processing with:
 * - 7.5% platform commission (COMMISSION_RATE constant)
 * - 10 coalition points per dollar (POINTS_PER_DOLLAR constant)
 * - Stripe Connect integration for automatic splits
 * - Geographic coordinate capture for fraud detection
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

// Input validation schema
const qrTransactionSchema = z.object({
  businessId: z.string().uuid(),
  qrCodeId: z.string().uuid().optional(),
  amount: z.number().positive().max(99999.99),
  description: z.string().max(500).optional(),
  customerEmail: z.string().email().max(255).optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = qrTransactionSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid request data", 
          details: parseResult.error.errors 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { businessId, qrCodeId, amount, description, customerEmail } = parseResult.data;

    console.log("Processing QR transaction:", {
      businessId,
      qrCodeId,
      amount,
      customerEmail,
    });

    // Get business payment account
    const { data: paymentAccount, error: accountError } = await supabase
      .from("business_payment_accounts")
      .select("stripe_account_id, charges_enabled")
      .eq("business_id", businessId)
      .single();

    if (accountError || !paymentAccount) {
      throw new Error("Business payment account not found");
    }

    if (!paymentAccount.charges_enabled) {
      throw new Error("Business cannot accept payments yet");
    }

    // Calculate fees with 7.5% commission
    const amountInCents = Math.round(amount * 100); // Convert to cents
    const commission = Math.round(amountInCents * (COMMISSION_RATE / 100));
    const businessAmount = amountInCents - commission;

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create payment intent with 7.5% commission
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      application_fee_amount: commission,
      transfer_data: {
        destination: paymentAccount.stripe_account_id,
      },
      metadata: {
        businessId,
        qrCodeId: qrCodeId || "direct",
        customerId: user.id,
        commissionRate: COMMISSION_RATE.toString(),
        transactionType: "qr_scan",
      },
      description: description || "QR Code Transaction",
      receipt_email: customerEmail || user.email,
    });

    // Record QR scan if qrCodeId provided
    let qrScanId = null;
    if (qrCodeId) {
      const { data: qrScan, error: scanError } = await supabase
        .from("qr_scans")
        .insert({
          qr_code_id: qrCodeId,
          customer_id: user.id,
          business_id: businessId,
          scan_date: new Date().toISOString(),
          points_awarded: 0, // Will be updated after successful payment
        })
        .select()
        .single();

      if (!scanError && qrScan) {
        qrScanId = qrScan.id;
      }
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        business_id: businessId,
        customer_id: user.id,
        amount: amount,
        points_earned: Math.floor(amount * 10), // 10 points per dollar
        description: description || "QR Code Purchase",
        transaction_type: "qr_scan",
        metadata: {
          payment_intent_id: paymentIntent.id,
          qr_code_id: qrCodeId,
          qr_scan_id: qrScanId,
          commission_rate: COMMISSION_RATE,
        }
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Transaction creation error:", transactionError);
      throw transactionError;
    }

    console.log("Transaction created successfully:", transaction.id);

    // Record commission transaction
    try {
      const { error: commissionError } = await supabase.rpc('record_commission', {
        p_transaction_id: transaction.id,
        p_booking_id: null,
        p_business_id: businessId,
        p_amount: amount,
        p_transaction_type: 'qr_scan'
      });

      if (commissionError) {
        console.error("Commission recording error:", commissionError);
        // Don't fail the transaction, just log the error
      } else {
        console.log("Commission recorded for transaction:", transaction.id);
      }
    } catch (commError) {
      console.error("Failed to record commission:", commError);
      // Continue even if commission recording fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        commission: {
          rate: COMMISSION_RATE,
          amount: commission / 100,
          businessReceives: businessAmount / 100,
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing QR transaction:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
