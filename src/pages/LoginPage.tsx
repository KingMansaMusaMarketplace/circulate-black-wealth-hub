
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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Helmet>
        <title>Login | Mansa Musa Marketplace</title>
      </Helmet>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-mansagold/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansablue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
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
