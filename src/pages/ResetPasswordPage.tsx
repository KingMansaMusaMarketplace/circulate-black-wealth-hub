import React from 'react';
import { Helmet } from 'react-helmet-async';
import ResetPasswordForm from '@/components/auth/forms/ResetPasswordForm';

/**
 * /reset-password
 * Destination for password recovery emails. Renders the "set new password"
 * form which:
 *  - Detects PKCE ?code= query param OR legacy hash (#access_token / type=recovery)
 *  - Establishes a recovery session via Supabase auth
 *  - Lets the user submit a new password via supabase.auth.updateUser({ password })
 *
 * The "request a reset" form lives at /password-reset (PasswordResetRequestPage).
 */
const ResetPasswordPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Set New Password | 1325.AI</title>
        <meta name="description" content="Choose a new password for your 1325.AI account." />
      </Helmet>
      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
