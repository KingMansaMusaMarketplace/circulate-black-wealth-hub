import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map: stripe price_id -> { label, oldPrice, newPrice, interval }
// oldPrice/newPrice are MONTHLY equivalents in USD
const PRICE_MAP: Record<string, { label: string; oldMonthly: number; newMonthly: number; isNew?: boolean }> = {
  // Business Pro $29 -> $39
  "price_1TEJTNAsptTW1mCmN77AMfHC": { label: "Business Pro (legacy $29)", oldMonthly: 29, newMonthly: 39 },
  "price_1TEJU3AsptTW1mCmz4NCorgC": { label: "Business Pro Annual (legacy)", oldMonthly: 29, newMonthly: 39 },
  "price_1TNLRBAsptTW1mCmCpwvkqrV": { label: "Business Pro $39", oldMonthly: 29, newMonthly: 39 },
  "price_1TNLVlAsptTW1mCmedqECEFO": { label: "Business Pro Annual $390", oldMonthly: 29, newMonthly: 39 },
  // Kayla Starter $49 -> $79
  "price_1TGzeOAsptTW1mCmJCGRE0mL": { label: "Kayla Starter (legacy $49)", oldMonthly: 49, newMonthly: 79 },
  "price_1TGzg6AsptTW1mCmbkF4gffD": { label: "Kayla Starter Annual (legacy)", oldMonthly: 49, newMonthly: 79 },
  "price_1TNLRpAsptTW1mCm5QvipN9l": { label: "Kayla Starter $79", oldMonthly: 49, newMonthly: 79 },
  "price_1TNLWEAsptTW1mCm2jha0NfY": { label: "Kayla Starter Annual $790", oldMonthly: 49, newMonthly: 79 },
  // Kayla Pro $149 -> $299
  "price_1TGzewAsptTW1mCmYKjYk0Fn": { label: "Kayla Pro Founders' Lock $149", oldMonthly: 149, newMonthly: 149 },
  "price_1TGzgRAsptTW1mCmloHSfeKB": { label: "Kayla Pro Annual (legacy)", oldMonthly: 149, newMonthly: 299 },
  "price_1TNLSUAsptTW1mCmMW1G6Jfv": { label: "Kayla Pro $299", oldMonthly: 149, newMonthly: 299 },
  "price_1TNLXeAsptTW1mCmb6dsvL2y": { label: "Kayla Pro Annual $2,990", oldMonthly: 149, newMonthly: 299 },
  // Kayla Enterprise $420 -> $899
  "price_1TJtguAsptTW1mCmrS1wWoN7": { label: "Kayla Enterprise (legacy $420)", oldMonthly: 420, newMonthly: 899 },
  "price_1TGzfdAsptTW1mCms0S1EJ4d": { label: "Kayla Enterprise (very-legacy)", oldMonthly: 420, newMonthly: 899 },
  "price_1TNLTCAsptTW1mCmVEccEd1D": { label: "Kayla Enterprise $899", oldMonthly: 420, newMonthly: 899 },
  "price_1TNLU6AsptTW1mCmvlaqtQsZ": { label: "Enterprise per-user $50", oldMonthly: 30, newMonthly: 50 },
  // Sponsorship - Founding (NEW tier, no old equivalent)
  "price_1TNLUlAsptTW1mCm7rLwOuCq": { label: "Founding Sponsor $1,750 (new)", oldMonthly: 0, newMonthly: 1750, isNew: true },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Pull all active subscriptions (paginate up to 1000)
    const all: Stripe.Subscription[] = [];
    let starting_after: string | undefined;
    for (let i = 0; i < 10; i++) {
      const page = await stripe.subscriptions.list({ status: "active", limit: 100, starting_after });
      all.push(...page.data);
      if (!page.has_more) break;
      starting_after = page.data[page.data.length - 1].id;
    }

    let oldMRR = 0;
    let newMRR = 0;
    let unmappedCount = 0;
    let unmappedMRR = 0;
    let activeSubs = 0;
    const byTier: Record<string, { count: number; oldMRR: number; newMRR: number }> = {};
    const newTierMRR = { count: 0, mrr: 0 };

    for (const sub of all) {
      activeSubs++;
      for (const item of sub.items.data) {
        const price = item.price;
        const qty = item.quantity ?? 1;
        const monthlyFromStripe = ((price.unit_amount ?? 0) / 100) * qty *
          (price.recurring?.interval === "year" ? 1 / 12 : 1);

        const mapped = PRICE_MAP[price.id];
        if (mapped) {
          const oldM = mapped.oldMonthly * qty;
          const newM = mapped.newMonthly * qty;
          oldMRR += oldM;
          newMRR += newM;
          const key = mapped.label;
          if (!byTier[key]) byTier[key] = { count: 0, oldMRR: 0, newMRR: 0 };
          byTier[key].count += 1;
          byTier[key].oldMRR += oldM;
          byTier[key].newMRR += newM;
          if (mapped.isNew) {
            newTierMRR.count += 1;
            newTierMRR.mrr += newM;
          }
        } else {
          unmappedCount += 1;
          unmappedMRR += monthlyFromStripe;
          oldMRR += monthlyFromStripe;
          newMRR += monthlyFromStripe;
        }
      }
    }

    const monthlyUplift = newMRR - oldMRR;
    const annualUplift = monthlyUplift * 12;
    const upliftPct = oldMRR > 0 ? (monthlyUplift / oldMRR) * 100 : 0;

    return new Response(
      JSON.stringify({
        activeSubs,
        oldMRR,
        newMRR,
        monthlyUplift,
        annualUplift,
        upliftPct,
        newTierMRR,
        unmapped: { count: unmappedCount, mrr: unmappedMRR },
        byTier,
        generatedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[pricing-impact] error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
