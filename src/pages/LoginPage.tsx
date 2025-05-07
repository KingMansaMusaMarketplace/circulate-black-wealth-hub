
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import OrSeparator from '@/components/auth/OrSeparator';

const LoginPage = () => {
  const { signIn, signInWithSocial } = useAuth();

  return (
    <AuthLayout>
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
        <OrSeparator />
        <LoginForm onSubmit={signIn} />
      </LoginContainer>
    </AuthLayout>
  );
};

export default LoginPage;
