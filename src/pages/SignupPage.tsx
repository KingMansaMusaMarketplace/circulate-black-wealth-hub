
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthLayout>
        <LoginContainer
          header={
            <>
              <div className="w-12 h-12 rounded-full bg-mansablue flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-spartan font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Join the Movement 🚀</h1>
              <p className="text-muted-foreground mt-1">Create an account to start circulating</p>
            </>
          }
        >
          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </LoginContainer>
      </AuthLayout>
    </div>
  );
};

export default SignupPage;
