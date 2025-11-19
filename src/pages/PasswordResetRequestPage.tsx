
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

const PasswordResetRequestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden flex flex-col justify-center py-12">
      <Helmet>
        <title>Password Reset | Mansa Musa Marketplace</title>
        <meta name="description" content="Request a password reset for your account" />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto animate-fade-in">
          <PasswordResetForm />
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequestPage;
