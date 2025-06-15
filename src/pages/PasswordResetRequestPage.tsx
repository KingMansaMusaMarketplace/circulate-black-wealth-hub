
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';

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
          <h1 className="text-3xl font-bold text-mansablue mb-6 text-center">
            Reset Password
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-center">
              Password reset form coming soon...
            </p>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default PasswordResetRequestPage;
