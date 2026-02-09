# Security Acknowledgments & False Positive Documentation

This document tracks security scanner findings that have been reviewed and acknowledged as acceptable within the context of this application.

## Overview

The Supabase security linter performs automated checks on database configuration. Some warnings are triggered by system-level components that are managed by Supabase and cannot (or should not) be modified by users.

---

## Acknowledged Findings

### 1. Security Definer View: `vault.decrypted_secrets`

**Severity:** ERROR (False Positive)  
**Status:** ✅ Acknowledged - No Action Required

**Description:**  
The `vault.decrypted_secrets` view is flagged because it uses `SECURITY DEFINER` which bypasses Row Level Security (RLS) policies.

**Why This Is Safe:**
- This is a **Supabase system view**, not user-created code
- It is required for Supabase's secret management functionality
- Users cannot modify or access this view directly
- Access is controlled by Supabase's internal security mechanisms

**Reference:** See `docs/SECURITY_DEFINER_VIEW_ANALYSIS.md` for detailed analysis.

---

### 2. Security Definer View: `extensions.pg_stat_statements`

**Severity:** ERROR (False Positive)  
**Status:** ✅ Acknowledged - No Action Required

**Description:**  
PostgreSQL's performance monitoring extension view.

**Why This Is Safe:**
- System-level PostgreSQL extension
- Managed by Supabase infrastructure
- Cannot be modified by application code
- Required for database performance monitoring

---

### 3. RLS Policy Audit: Public Access Tables

**Severity:** WARN  
**Status:** ✅ Reviewed and Secured

**Tables with Intentionally Permissive SELECT Policies:**

| Table | Policy | Justification |
|-------|--------|---------------|
| `business_directory` (view) | Public SELECT | Intentionally public business listings |
| `businesses_public_safe` (view) | Public SELECT | Sanitized public data with PII redacted |
| `ambassador_marketing_materials` | Public SELECT | Marketing materials for ambassadors |
| `ambassador_training_content` | Public SELECT | Training content for public access |

**Tables with Proper User-Scoped Policies:**
- All user-related tables enforce `auth.uid() = user_id`
- Financial tables use `is_admin_secure()` function
- Sensitive operations require authentication

---

### 4. MFA Configuration

**Severity:** WARN  
**Status:** ✅ Implemented

**Current Implementation:**
- TOTP (Time-based One-Time Password) enabled via authenticator apps
- MFA setup available at `/profile` settings
- Components: `MFASetup.tsx`, `MFAVerification.tsx`
- Hook: `useMFASetup.ts` for enrollment and verification

**Admin MFA Enforcement:**
- Admin users are prompted to enable MFA on dashboard access
- MFA verification required for sensitive operations

**Future Enhancements (Optional):**
- SMS-based MFA (requires Twilio configuration)
- Hardware security keys (WebAuthn)

---

## Security Best Practices Implemented

### 1. Role-Based Access Control (RBAC)

```sql
-- Roles stored in dedicated table (not on profiles)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Security definer function prevents recursion
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
AS $$ ... $$;
```

### 2. Admin Access Verification

```sql
-- All admin-level RLS policies use this function
CREATE FUNCTION public.is_admin_secure()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
$$;
```

### 3. Row Level Security (RLS)

- **Enabled on all tables** containing user data
- **User ownership checks** via `auth.uid() = user_id`
- **Admin overrides** via `is_admin_secure()` function
- **Views for public data** that redact PII (email, phone, etc.)

### 4. Data Protection

- **Personal data access audit** table tracks admin data access
- **PII redaction** in public views
- **Secure session handling** via Supabase Auth

---

## Review Schedule

| Review Type | Frequency | Last Review | Next Review |
|-------------|-----------|-------------|-------------|
| Security Linter | Monthly | 2026-02-09 | 2026-03-09 |
| RLS Policy Audit | Quarterly | 2026-02-09 | 2026-05-09 |
| MFA Adoption | Monthly | 2026-02-09 | 2026-03-09 |
| Dependency Audit | Weekly | Automated | Automated |

---

## How to Use This Document

1. **Before dismissing warnings:** Check this document to see if the finding is already acknowledged
2. **For new findings:** Add an entry with severity, status, and justification
3. **For remediated issues:** Move to a "Resolved" section with the fix description
4. **During security reviews:** Use this as a reference for expected vs. unexpected findings

---

## Contact

For security concerns or questions about this documentation:
- **Security Lead:** Platform Admin Team
- **Email:** security@mansamusamarketplace.com
- **Escalation:** Create a ticket in the admin dashboard

---

*Last Updated: February 9, 2026*
