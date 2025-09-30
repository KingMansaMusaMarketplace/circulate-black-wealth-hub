# Payment Integration Guide

## Overview
This payment integration enables the platform to capture transaction fees (2.5% by default) on all payments processed through the app, similar to how Uber and Airbnb generate revenue.

## Features Implemented

### 1. **Stripe Connect Integration**
- Businesses can connect their Stripe accounts via Stripe Express
- Automated onboarding flow for businesses
- Account status tracking and verification

### 2. **Payment Processing with Platform Fees**
- Automatic fee splitting on every transaction
- Platform captures 2.5% fee, business receives 97.5%
- Secure payment processing through Stripe
- Transaction tracking in database

### 3. **Transaction Management**
- Complete transaction history for businesses and customers
- Real-time status updates via webhooks
- Revenue analytics and reporting

## Database Schema

### `business_payment_accounts`
Stores Stripe Connect account information for each business:
- `stripe_account_id`: Connected Stripe account
- `account_status`: pending, active, restricted, disabled
- `charges_enabled`: Can accept payments
- `payouts_enabled`: Can receive payouts

### `platform_transactions`
Records all platform transactions with fee breakdown:
- `amount_total`: Total amount paid by customer
- `amount_business`: Amount going to business (97.5%)
- `amount_platform_fee`: Platform fee captured (2.5%)
- `status`: succeeded, pending, failed, refunded

## Edge Functions

### 1. `connect-stripe-account`
**Purpose**: Creates/manages Stripe Connect accounts for businesses
**Authentication**: Required (business owner)
**Usage**:
```typescript
const { url, accountId } = await paymentService.connectStripeAccount(businessId);
window.location.href = url; // Redirect to Stripe onboarding
```

### 2. `create-payment-intent`
**Purpose**: Creates payment intent with automatic fee splitting
**Authentication**: Required (customer)
**Usage**:
```typescript
const result = await paymentService.createPaymentIntent({
  businessId: 'xxx',
  amount: 100.00,
  description: 'Product purchase'
});
// Use result.clientSecret with Stripe Elements
```

### 3. `stripe-webhook`
**Purpose**: Handles Stripe webhook events
**Authentication**: Not required (verified via webhook signature)
**Events Handled**:
- `payment_intent.succeeded` - Mark transaction as successful
- `payment_intent.payment_failed` - Mark transaction as failed
- `account.updated` - Update business account status
- `charge.refunded` - Mark transaction as refunded

## Setup Instructions

### 1. Configure Stripe Webhook
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/stripe-webhook`
3. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
   - `charge.refunded`
4. Copy the webhook signing secret
5. Add to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

### 2. Set Stripe Secret Key
The Stripe secret key should already be configured in Supabase secrets as `STRIPE_SECRET_KEY`.

### 3. Test the Integration
Visit `/payment-test` to test:
1. Connect a business Stripe account
2. Create a test payment
3. View transaction history

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 9995`

## UI Components

### `ConnectStripeButton`
Shows connection status and allows businesses to connect/complete setup
```tsx
<ConnectStripeButton 
  businessId={business.id} 
  onConnected={() => console.log('Connected!')}
/>
```

### `PaymentForm`
Allows customers to pay businesses
```tsx
<PaymentForm
  businessId={business.id}
  businessName="Test Business"
  suggestedAmount={100}
  onSuccess={(paymentIntentId) => {}}
/>
```

### `TransactionsList`
Displays transaction history with revenue metrics
```tsx
<TransactionsList 
  businessId={business.id} 
  showRevenue={true}
/>
```

## Revenue Model

### Platform Fee Structure
- **Default**: 2.5% per transaction
- **Configurable**: Can be adjusted per business tier
- **Example**: $100 payment
  - Customer pays: $100.00
  - Platform captures: $2.50 (2.5%)
  - Business receives: $97.50

### Future Enhancements
1. **Tiered Pricing**: Different fees for Premium/Business/Enterprise tiers
2. **Volume Discounts**: Lower fees for high-volume businesses
3. **Minimum Fee**: Set minimum platform fee (e.g., $0.30)
4. **Subscription Offset**: Reduce fees for paid subscribers

## Next Steps for Production

### High Priority
1. ✅ Database tables created
2. ✅ Edge functions implemented
3. ✅ Basic UI components created
4. ⏳ Set up Stripe webhook endpoint
5. ⏳ Configure `STRIPE_WEBHOOK_SECRET`
6. ⏳ Integrate Stripe Elements for card input
7. ⏳ Add proper error handling and retry logic

### Medium Priority
1. Add refund functionality
2. Implement dispute management
3. Add payout scheduling
4. Create admin dashboard for platform revenue
5. Add transaction export (CSV, PDF)
6. Implement fraud detection alerts

### Low Priority
1. Add split payments (multiple recipients)
2. Support for multiple currencies
3. Recurring/subscription payments
4. Invoice generation
5. Payment reminders

## Security Considerations

1. **RLS Policies**: ✅ Implemented on all tables
2. **JWT Verification**: ✅ Enabled for authenticated endpoints
3. **Webhook Signature**: Must be verified in production
4. **PCI Compliance**: Payment details handled entirely by Stripe
5. **Audit Logging**: All transactions logged in `platform_transactions`

## Testing Checklist

- [ ] Business can connect Stripe account
- [ ] Business onboarding flow completes successfully
- [ ] Payment intent creation works
- [ ] Platform fee calculated correctly
- [ ] Transaction recorded in database
- [ ] Webhook updates transaction status
- [ ] Business can view their transactions
- [ ] Customer can view their payment history
- [ ] Revenue metrics calculate correctly

## Monitoring & Alerts

### Key Metrics to Track
1. **Platform Revenue**: Total fees captured
2. **Transaction Volume**: Number of successful payments
3. **Failure Rate**: % of failed payments
4. **Average Transaction Value**: Average payment amount
5. **Connected Businesses**: # of businesses with active accounts

### Recommended Alerts
1. Webhook failures (> 5% failure rate)
2. High payment failure rate (> 10%)
3. Unusual transaction patterns
4. Large refund volumes
5. Account verification issues

## Support & Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## Revenue Projections

### Conservative (Year 1)
- 100 active businesses
- $5,000 average monthly transaction volume per business
- Total monthly volume: $500,000
- Platform revenue (2.5%): **$12,500/month** = **$150,000/year**

### Moderate (Year 3)
- 1,000 active businesses
- $10,000 average monthly transaction volume per business
- Total monthly volume: $10,000,000
- Platform revenue (2.5%): **$250,000/month** = **$3,000,000/year**

### Aggressive (Year 5)
- 10,000 active businesses
- $15,000 average monthly transaction volume per business
- Total monthly volume: $150,000,000
- Platform revenue (2.5%): **$3,750,000/month** = **$45,000,000/year**

---

**This payment integration provides the foundation for building a billion-dollar marketplace by capturing transaction fees at scale.**
