
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

const PasswordResetRequestPage: React.FC = () => {
  return (
    <ResponsiveLayout
      title="Password Reset"
      description="Request a password reset"
    >
      <Helmet>
        <title>Password Reset | Mansa Musa Marketplace</title>
        <meta name="description" content="Request a password reset for your account" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <PasswordResetForm />
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default PasswordResetRequestPage;
