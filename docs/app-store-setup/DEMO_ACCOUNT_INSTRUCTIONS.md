# Demo Account Setup for Apple App Review

## 📋 Account Credentials
- **Email:** testuser@example.com
- **Password:** TestPass123!

## 🚀 Quick Setup Instructions

### Step 1: Create Auth User in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns
2. Navigate to **Authentication** → **Users**
3. Click **Add User** (or **Invite**)
4. Fill in:
   - **Email:** testuser@example.com
   - **Password:** TestPass123!
   - ✅ **Auto Confirm User:** YES (important!)
5. Click **Create User**
6. **COPY THE USER ID** that was generated (you'll need it in Step 2)

### Step 2: Populate Demo Data

1. Go to **SQL Editor** in Supabase
2. Open the file `DEMO_ACCOUNT_SETUP.sql`
3. **Find this line:**
   ```sql
   demo_user_id UUID := 'YOUR_USER_ID_HERE';
   ```
4. **Replace** `'YOUR_USER_ID_HERE'` with the actual User ID you copied from Step 1
5. Click **Run** to execute the entire script

### Step 3: Verify Setup

1. Try logging in with the demo credentials:
   - Email: testuser@example.com
   - Password: TestPass123!

2. You should see:
   - ✅ Complete business profile: "Mansa Musa Demo Restaurant"
   - ✅ 3 active QR codes (loyalty, discount, check-in)
   - ✅ Analytics dashboard with 8 weeks of data
   - ✅ 4 customer reviews (4.8★ average rating)
   - ✅ Business hours configured
   - ✅ All notification preferences set

## 🎯 What This Demo Account Shows

### Business Profile Features
- **Verified Business**: Full business profile with all details
- **Location**: Atlanta, GA (33.7490, -84.3880)
- **Category**: Restaurant
- **Contact Info**: Phone, email, website
- **Media**: Logo and banner images

### QR Code Management
- **Loyalty Points QR**: 50 points per scan
- **Discount QR**: 15% off coupon
- **Check-in QR**: 25 points + 5% discount
- **Statistics**: Shows scan counts and usage

### Analytics Dashboard
- **Profile Views**: 8 weeks of visitor data
- **QR Scans**: Tracking across all QR code types
- **Social Shares**: Platform engagement metrics
- **Growth Trends**: Visual charts and statistics

### Customer Engagement
- **4 Reviews**: Verified customer feedback
- **4.8★ Rating**: High satisfaction score
- **127 Total Reviews**: Established reputation

### Business Operations
- **Operating Hours**: Mon-Fri (11 AM - 10 PM), Sat-Sun (10 AM - 11 PM)
- **Notification Settings**: All features enabled
- **User Type**: Business Owner with full access

## 📱 Testing Checklist for Apple Review

- [ ] Login works with credentials
- [ ] Business profile loads completely
- [ ] QR codes page displays all 3 codes
- [ ] Analytics dashboard shows data and charts
- [ ] Reviews section displays with ratings
- [ ] Business settings are accessible
- [ ] Hours of operation are visible
- [ ] All navigation works smoothly
- [ ] No errors in console

## 🔧 Troubleshooting

### If login fails:
1. Check that "Auto Confirm User" was enabled in Step 1
2. Verify email address is exactly: testuser@example.com
3. Ensure password is exactly: TestPass123! (case-sensitive)

### If data is missing:
1. Verify you replaced 'YOUR_USER_ID_HERE' with the actual UUID
2. Check SQL Editor for any error messages
3. Re-run the SQL script if needed

### If business profile is empty:
1. Make sure the user_type is set to 'business_owner'
2. Verify the businesses table has the demo business entry
3. Check that owner_id matches the demo user's ID

## 📝 Update App Store Connect

Once setup is complete, update your App Store Connect submission:

1. Go to **App Information** → **Review Information**
2. Update demo account credentials:
   - **Username:** testuser@example.com
   - **Password:** TestPass123!
3. Add review notes:
   ```
   DEMO ACCOUNT FULL ACCESS:
   - Email: testuser@example.com
   - Password: TestPass123!
   
   This account has:
   - Complete business profile with verified status
   - 3 active QR codes demonstrating all QR types
   - 8 weeks of analytics data
   - Customer reviews and ratings
   - Full business management capabilities
   
   The account showcases all native features:
   - Push notifications for business updates
   - Offline QR code generation
   - Location-based business discovery
   - Native camera QR scanning
   ```

## ✅ Ready for Submission

After completing these steps, your app has:
- ✅ Working demo account with full access
- ✅ Rich sample data showing all features
- ✅ Professional business profile
- ✅ Active engagement metrics
- ✅ Native mobile capabilities

This demonstrates a complete, production-ready business platform that goes far beyond a simple web wrapper.

---

**Last Updated:** December 2024
**Support:** support@mansamusamarketplace.com
