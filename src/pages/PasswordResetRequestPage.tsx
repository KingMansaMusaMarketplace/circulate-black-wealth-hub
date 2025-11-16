
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

const PasswordResetRequestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-center py-12">
      <Helmet>
        <title>Password Reset | Mansa Musa Marketplace</title>
        <meta name="description" content="Request a password reset for your account" />
      </Helmet>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-mansagold/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansablue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto animate-fade-in">
          <PasswordResetForm />
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequestPage;
