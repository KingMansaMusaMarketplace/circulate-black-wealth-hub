
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 via-background to-mansagold/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mansablue/10 via-transparent to-transparent" />
      
      <div className="relative z-10 w-full px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center mx-auto shadow-[var(--shadow-premium)] animate-fade-in-up">
              <span className="text-white font-spartan font-bold text-4xl">M</span>
            </div>
            <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                Join the Movement
              </h1>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                Create an account to start circulating wealth in the Black community
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SignupForm />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-base text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-mansablue hover:text-mansablue-light font-semibold transition-colors duration-200 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
