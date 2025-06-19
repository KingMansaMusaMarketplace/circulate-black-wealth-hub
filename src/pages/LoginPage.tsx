
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Login | Mansa Musa Marketplace</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <LoginContainer>
          <LoginForm onSubmit={signIn} />
        </LoginContainer>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
