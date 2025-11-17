
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-light relative overflow-hidden flex flex-col justify-center py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold-light/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-mansablue-light/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Grid overlay for modern effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      <div className="relative z-10 w-full px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="w-28 h-28 rounded-3xl bg-gradient-blue-gold flex items-center justify-center mx-auto shadow-2xl shadow-mansagold/50 animate-fade-in hover:scale-110 transition-all duration-500 hover:shadow-mansagold/70">
              <span className="text-text-on-blue font-spartan font-bold text-5xl drop-shadow-lg">M</span>
            </div>
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-mansagold via-mansagold-light to-white bg-clip-text text-transparent drop-shadow-lg">
                Join the Movement
              </h1>
              <p className="text-white text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                Create an account to start circulating wealth in the Black community 🚀
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SignupForm />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-lg text-white font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold bg-gradient-to-r from-mansagold via-mansagold-light to-mansagold bg-clip-text text-transparent hover:from-mansagold-light hover:via-white hover:to-mansagold-light transition-all duration-300 drop-shadow-md">
                Log in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
