# Demo Accounts for Apple App Review

## 📋 Demo Account Credentials

Apple requires demo accounts to test ALL features. We provide two accounts:

### Customer Account (Consumer Features)
- **Email:** customer.demo@mansamusa.com
- **Password:** CustomerDemo123!
- **Type:** Customer/Consumer
- **Features:** Browse businesses, earn points, scan QR codes, leave reviews

### Business Account (Business Management)
- **Email:** demo@mansamusa.com
- **Password:** Demo123!
- **Type:** Business Owner
- **Features:** Complete business profile, QR code management, analytics, customer engagement

---

## 🚀 Setup Instructions for Customer Demo Account

### Step 1: Create Customer Auth User

1. Go to Supabase Dashboard → Authentication → Users
2. Click **Add User**
3. Fill in:
   - **Email:** customer.demo@mansamusa.com
   - **Password:** CustomerDemo123!
   - ✅ **Auto Confirm User:** YES
4. Click **Create User**
5. **COPY THE USER ID**

### Step 2: Create Customer Profile

Run this SQL in Supabase SQL Editor:

```sql
-- Replace YOUR_USER_ID_HERE with the actual customer user ID
DO $$
DECLARE
  demo_customer_id UUID := 'YOUR_USER_ID_HERE';
BEGIN
  -- Create customer profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    user_type,
    phone,
    created_at,
    updated_at
  ) VALUES (
    demo_customer_id,
    'customer.demo@mansamusa.com',
    'Demo Customer',
    'customer',
    '+14045551234',
    NOW(),
    NOW()
  );

  -- Add customer loyalty points
  INSERT INTO public.customer_loyalty (
    customer_id,
    total_points,
    points_earned,
    points_redeemed,
    tier,
    created_at,
    updated_at
  ) VALUES (
    demo_customer_id,
    750,
    1200,
    450,
    'silver',
    NOW(),
    NOW()
  );

  -- Add favorite businesses (sample data)
  -- You can add these after creating businesses
  
  RAISE NOTICE 'Customer demo account created successfully';
END $$;
```

### Step 3: Verify Customer Account

Login with customer.demo@mansamusa.com and verify:
- ✅ Can browse business directory
- ✅ Can scan QR codes
- ✅ Has 750 loyalty points
- ✅ Can leave reviews
- ✅ Can save favorite businesses

---

## 🚀 Setup Instructions for Business Demo Account

### Step 1: Create Business Auth User

1. Go to Supabase Dashboard → Authentication → Users
2. Click **Add User**
3. Fill in:
   - **Email:** demo@mansamusa.com
   - **Password:** Demo123!
   - ✅ **Auto Confirm User:** YES
4. Click **Create User**
5. **COPY THE USER ID**

### Step 2: Run Business Demo Data SQL

Use the existing `DEMO_ACCOUNT_SETUP.sql` file in Supabase SQL Editor:
1. Replace `YOUR_USER_ID_HERE` with the business user ID
2. Run the entire script

### Step 3: Verify Business Account

Login with demo@mansamusa.com and verify:
- ✅ Complete business profile
- ✅ 3 active QR codes
- ✅ Analytics dashboard with data
- ✅ Customer reviews
- ✅ Business settings

---

## 📱 App Store Connect Submission Info

### Demo Account Information Section

```
DEMO ACCOUNTS PROVIDED:

CUSTOMER ACCOUNT (Test consumer features):
Username: customer.demo@mansamusa.com
Password: CustomerDemo123!
Account Type: Customer
Features: Browse businesses, scan QR codes, earn points, leave reviews

BUSINESS ACCOUNT (Test business features):
Username: demo@mansamusa.com  
Password: Demo123!
Account Type: Business Owner
Features: Business profile, QR management, analytics, customer engagement

IMPORTANT NOTES:
- App is 100% functional WITHOUT subscriptions on iOS
- Customer accounts are FREE FOREVER - no payment required
- Business features available for free trial period
- All subscription/payment features are HIDDEN on iOS per Apple guidelines
- Full payment features available on web version
- No payment is required to test any features in the iOS app
```

---

## ✅ Features to Highlight for Apple Review

### Customer Account Shows:
- **Business Discovery**: Browse and search Black-owned businesses
- **QR Code Scanning**: Native camera integration for loyalty points
- **Loyalty Program**: Earn and track points (no payment required)
- **Reviews & Ratings**: Community engagement features
- **Favorites**: Save and organize favorite businesses
- **Impact Tracking**: See community economic impact

### Business Account Shows:
- **Business Profile**: Complete business management
- **QR Code Generation**: Create loyalty and promotional codes
- **Analytics Dashboard**: Track customer engagement
- **Customer Reviews**: Manage business reputation
- **Native Features**: Push notifications, offline access

### What's Hidden on iOS:
- ❌ No Stripe payment UI
- ❌ No subscription pricing displays
- ❌ No "upgrade" or "subscribe" buttons
- ❌ No external payment links
- ✅ All features work without payment
- ✅ Complies with Apple IAP guidelines

---

## 🔧 Troubleshooting

### Customer Account Issues:
- If login fails: Check email is exactly customer.demo@mansamusa.com
- If no points showing: Verify customer_loyalty table entry
- If can't scan QR: Ensure camera permissions granted

### Business Account Issues:
- If profile empty: Verify businesses table entry with correct owner_id
- If no QR codes: Check qr_codes table has 3 entries
- If no analytics: Verify business_analytics table has data

### General Issues:
- Clear app cache and reinstall
- Check Supabase logs for errors
- Verify all SQL scripts ran successfully

---

## 📝 Review Notes Template

Copy this into App Store Connect review notes:

```
TESTING INSTRUCTIONS FOR REVIEWERS:

1. CUSTOMER ACCOUNT TESTING:
   - Login: customer.demo@mansamusa.com / CustomerDemo123!
   - Browse businesses in the directory
   - Scan QR codes (or use test button)
   - View loyalty points (750 points available)
   - Leave a review on any business
   - Save businesses to favorites

2. BUSINESS ACCOUNT TESTING:
   - Login: demo@mansamusa.com / Demo123!
   - View complete business dashboard
   - Check 3 active QR codes
   - Review analytics with 8 weeks of data
   - See customer reviews and ratings
   - Access all business management features

3. iOS COMPLIANCE:
   - All features work WITHOUT payment
   - No subscription prompts on iOS
   - No external payment links
   - Full functionality in free tier
   - Payment features only on web platform

4. ACCOUNT DELETION:
   - Available in Settings → Account → Delete Account
   - Requires typing "DELETE" to confirm
   - Permanently removes all user data
   - Works for both account types

This app demonstrates a complete marketplace platform supporting Black-owned businesses with native iOS features including camera integration, push notifications, and offline access.
```

---

**Last Updated:** November 2025  
**Support:** support@mansamusamarketplace.com
