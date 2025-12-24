# Patent Claim 2: Temporal Founding Status System

## PATENT PROTECTED - Provisional Application Filed

**Title:** System and Method for a Multi-Tenant Vertical Marketplace Operating System Featuring Temporal Incentives, Circulatory Multiplier Attribution, and Geospatial Velocity Fraud Detection

---

## CLAIM 2: Temporal Incentive System

This document describes the proprietary temporal incentive system that permanently designates early registrants as "founding" entities with immutable lifetime benefits.

### Implementation Location
- **Migration File:** `supabase/migrations/20251209120359_d1307781-5512-4e01-9296-cd3570e12e1f.sql`

### Protected Technical Elements

#### 1. Temporal Cutoff Constant
```sql
'2027-01-31T23:59:59Z'
```
The system monitors the `created_at` timestamp for all entities. Registration before this UTC cutoff qualifies for founding member status.

#### 2. Database Trigger Function
```sql
CREATE OR REPLACE FUNCTION public.set_founding_member_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.created_at < '2027-01-31T23:59:59Z' THEN
    NEW.is_founding_member := true;
    NEW.founding_member_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;
```

#### 3. Automatic Trigger Execution
```sql
CREATE TRIGGER set_founding_member_on_signup
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_founding_member_status();
```

### Key Protected Characteristics

1. **Immutability**: Once set, the `is_founding_member` flag cannot be revoked
2. **Automatic Execution**: Database-level trigger ensures consistent application
3. **Timestamp Preservation**: `founding_member_since` preserves the exact registration moment
4. **Lifetime Benefits**: Status persists regardless of future platform iterations or account changes

### Legal Notice

© 2024-2025. All rights reserved. Unauthorized replication of this temporal incentive system is prohibited.
