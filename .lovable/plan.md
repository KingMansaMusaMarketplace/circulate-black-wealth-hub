## Security Fixes Plan

### What we're fixing
Three genuine security warnings from the latest scan.

### Changes

#### 1. Bookings: Hide payment identifiers from business owners
- Create a `business_owner_bookings` view that shows all booking fields EXCEPT `stripe_charge_id` and `payment_intent_id`
- Update any business-facing queries to use this view instead of the raw `bookings` table
- Business owners still see customer name/email/phone (they need those to operate), but they won't see raw Stripe payment tokens

#### 2. Vacation Bookings: Hide payment identifiers from hosts
- Create a `host_vacation_bookings` view that shows all booking fields EXCEPT `stripe_charge_id` and `payment_intent_id`
- Update any host-facing queries to use this view
- Hosts still see guest name/email/phone (operationally necessary), but no Stripe tokens

#### 3. B2B Leads: Remove PII columns from main table
- The `b2b_external_leads_private` table already stores `owner_email`, `phone_number`, and `owner_name`
- Drop these three columns from the `b2b_external_leads` main table
- Any code referencing them from the main table will be updated to use the private table

### Risk Assessment
- **Low risk**: These are defensive changes. No existing functionality is removed — only sensitive fields that shouldn't be exposed are filtered out.
- **No user-facing changes**: Customers and guests won't notice anything different.

### Technical details
```
Database migrations:
- Create view: business_owner_bookings
- Create view: host_vacation_bookings  
- Alter table: DROP COLUMN owner_email, phone_number, owner_name FROM b2b_external_leads

Frontend updates:
- Update any Supabase queries for bookings/vacation_bookings to use new views
- Update any B2B lead queries to join with private table for PII
```