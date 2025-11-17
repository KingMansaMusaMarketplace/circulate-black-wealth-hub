
import React from 'react';
import { Helmet } from 'react-helmet';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';
import DemoAccountCard from '@/components/auth/DemoAccountCard';
import { secureSignIn } from '@/lib/security/auth-security';

const LoginPage: React.FC = () => {
  const handleSignIn = async (email: string, password: string) => {
    return await secureSignIn(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50 relative overflow-hidden flex flex-col">
      <Helmet>
        <title>Login | Mansa Musa Marketplace</title>
      </Helmet>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-mansagold/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <DemoAccountCard />
          <LoginContainer>
            <LoginForm onSubmit={handleSignIn} />
          </LoginContainer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
