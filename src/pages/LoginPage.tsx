
import React from 'react';
import { Helmet } from 'react-helmet';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';
import { secureSignIn } from '@/lib/security/auth-security';

const LoginPage: React.FC = () => {
  const handleSignIn = async (email: string, password: string) => {
    return await secureSignIn(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Login | Mansa Musa Marketplace</title>
      </Helmet>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <LoginContainer>
          <LoginForm onSubmit={handleSignIn} />
        </LoginContainer>
      </div>
    </div>
  );
};

export default LoginPage;
