

# Revert Login Form Changes

## Problem
The previous edit modified `useLoginForm.ts` and `AuthContext.tsx` unnecessarily -- login was working before those changes. The safest fix is to revert them.

## Changes

### 1. Revert useLoginForm.ts error handling
Restore the original error handling logic that was working:
- Remove the `result.success === false` check added to the error condition
- Restore original `result.error.message` access pattern
- Restore original `result.data?.session` check without the `result.success === true` fallback
- Restore original console warning message

### 2. Revert AuthContext.tsx timeout
Restore the original aggressive timeout values:
- iOS: back to 1500ms (from 3000ms)
- Web: back to 2000ms (from 5000ms)

These shorter timeouts were intentionally set for faster perceived load times, especially on iOS where WKWebView can hang.

## Why This Fixes It
The original code was tested and working in production. The changes I made altered the error-handling contract between `secureSignIn` (which returns `{success, data, error}`) and the form handler in ways that could cause edge-case failures, particularly around MFA flows and session detection.

## Technical Details
- Two files affected: `useLoginForm.ts` and `AuthContext.tsx`
- Pure revert -- no new logic introduced
- Both files go back to their pre-edit state

