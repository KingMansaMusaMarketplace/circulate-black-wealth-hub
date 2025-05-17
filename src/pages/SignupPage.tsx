
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  const { signUp } = useAuth();

  return (
    <AuthLayout>
      <LoginContainer
        header={
          <>
            <div className="w-12 h-12 rounded-full bg-mansablue flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-spartan font-bold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-bold text-mansablue-dark">Join the Movement</h1>
            <p className="text-gray-600 mt-1">Create an account to start circulating</p>
          </>
        }
      >
        <SignupForm onSubmit={signUp} />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-mansablue hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </LoginContainer>
    </AuthLayout>
  );
};

export default SignupPage;
