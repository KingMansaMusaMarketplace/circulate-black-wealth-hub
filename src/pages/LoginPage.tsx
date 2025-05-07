
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import { Separator } from '@/components/ui/separator';

const LoginPage = () => {
  const { signIn, signInWithSocial } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <LoginContainer 
          header={
            <>
              <h1 className="text-3xl font-bold text-mansablue">Welcome Back</h1>
              <p className="text-gray-600 mt-2">
                Sign in to your Mansa Musa Marketplace account
              </p>
            </>
          }
        >
          <SocialLogin onSocialLogin={signInWithSocial} />

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
              OR
            </span>
          </div>

          <LoginForm onSubmit={signIn} />
        </LoginContainer>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
