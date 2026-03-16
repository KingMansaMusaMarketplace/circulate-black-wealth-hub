

## Diagnosis: Signup Failures for New Customers and Business Owners

After investigating the signup flow, I identified **three root causes** blocking new user signups:

### Problem 1: Rate Limiter Blocks Anonymous Signups
The `secureSignUp` function (used by **business signup**) calls `check_rate_limit_secure` RPC, which uses `auth.uid()` to identify the user. But during signup, the user is **not authenticated yet**, so `auth.uid()` returns `NULL`. This causes:
- All anonymous signup attempts to share the same `NULL` user_id
- After just 3 attempts across ALL users globally, every new signup gets rate-limited
- The INSERT into `rate_limit_log` also fails because the RLS policy only allows `authenticated` users to insert

### Problem 2: Password Complexity Requirements Are Hidden
The business signup uses `validatePasswordComplexity()` which requires uppercase, lowercase, number, AND special character. But the form only says "8+ characters." Users enter simple passwords, get a vague error, and give up.

The customer signup does NOT use `secureSignUp` — it calls `supabase.auth.signUp` directly, bypassing complexity validation. But Supabase's own password policy may still reject weak passwords without a clear message.

### Problem 3: Business Record Creation May Fail Silently
After signup, the business form inserts into `businesses` table. If the `handle_new_user` trigger hasn't finished creating the profile yet (race condition), or if RLS blocks the insert, the business record silently fails. The user sees "Account created" but has no business record, causing all downstream features to break.

---

### Fix Plan

**1. Fix rate limiting for anonymous signup operations**
- Modify `secureSignUp` in `src/lib/security/auth-security.ts` to **skip the rate limit RPC call** for signup operations (since the user isn't authenticated yet). Use a simple client-side cooldown instead.
- Alternatively, create a new SQL migration to make `check_rate_limit_secure` work for anonymous users by using IP-based or email-based tracking instead of `auth.uid()`.

**2. Show password requirements clearly on both signup forms**
- Update `CustomerSignupTab.tsx` and `BusinessSignupForm.tsx` to display password requirements inline (uppercase, lowercase, number, special char, 8+ chars).
- Add real-time password strength indicator so users know what's missing before submitting.
- Align both forms: either both use `secureSignUp` with complexity checks, or both use Supabase's native signup with clear error messages.

**3. Fix business record creation race condition**
- Add a retry mechanism with delay in `BusinessSignupForm.tsx` for the `businesses` table insert.
- Use `SECURITY DEFINER` edge function or database trigger to create the business record atomically with the profile, instead of relying on client-side insert after signup.

**4. Improve error messaging**
- Replace generic "Failed to create account" with specific, actionable messages (rate limited, password too weak, email already exists, etc.).
- Add a "Having trouble?" help link on the signup forms.

### Files to modify:
- `src/lib/security/auth-security.ts` — skip rate limit for unauthenticated signup
- `src/components/auth/forms/CustomerSignupTab.tsx` — add password requirements display
- `src/components/auth/forms/BusinessSignupForm.tsx` — add password requirements, fix business insert retry
- New SQL migration — fix `check_rate_limit_secure` for anonymous callers OR create a signup-specific business creation trigger

