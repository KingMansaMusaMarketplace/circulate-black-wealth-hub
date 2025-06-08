
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Login | Mansa Musa Marketplace</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <LoginContainer>
          <LoginForm onSubmit={signIn} />
        </LoginContainer>
      </div>
    </div>
  );
};

export default LoginPage;
