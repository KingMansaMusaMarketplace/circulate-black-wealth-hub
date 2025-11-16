
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 via-background to-mansagold/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mansablue/10 via-transparent to-transparent" />
      
      <AuthLayout>
        <LoginContainer
          header={
            <>
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-premium)] animate-fade-in-up">
                <span className="text-white font-spartan font-bold text-3xl">M</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Join the Movement
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Create an account to start circulating wealth in the Black community
              </p>
            </>
          }
        >
          <SignupForm />

          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-mansablue hover:text-mansablue-light font-semibold transition-colors duration-200 hover:underline">
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
