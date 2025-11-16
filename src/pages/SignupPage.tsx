
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex flex-col">
      <AuthLayout>
        <LoginContainer
          header={
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-spartan font-bold text-2xl">M</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Join the Movement 🚀</h1>
              <p className="text-muted-foreground text-base">Create an account to start circulating wealth in the Black community</p>
            </>
          }
        >
          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
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
