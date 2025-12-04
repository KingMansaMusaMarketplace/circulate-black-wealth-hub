
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';
import { secureSignIn } from '@/lib/security/auth-security';

const LoginPage: React.FC = () => {
  const handleSignIn = async (email: string, password: string) => {
    return await secureSignIn(email, password);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Modern gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/40 to-blue-600/40 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/30 to-amber-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-blue-700/30 to-mansablue/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <Helmet>
        <title>Login | Mansa Musa Marketplace</title>
      </Helmet>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start pt-8 sm:pt-12 md:justify-center md:pt-0 px-4 pb-8">
        {/* Title Section - Mobile First */}
        <div className="text-center mb-6 md:mb-8 w-full max-w-md">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent mb-2">
              Mansa Musa Marketplace
            </h1>
          </Link>
          <p className="text-white/70 text-sm sm:text-base">
            Welcome back! Sign in to continue.
          </p>
        </div>
        
        {/* Login Form - Directly Under Title */}
        <div className="w-full max-w-md animate-fade-in">
          <LoginContainer>
            <LoginForm onSubmit={handleSignIn} />
          </LoginContainer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
