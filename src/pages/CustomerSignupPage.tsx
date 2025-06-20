
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import LoginContainer from '@/components/auth/LoginContainer';
import CustomerSignupTab from '@/components/auth/forms/CustomerSignupTab';

const CustomerSignupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || '';

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Customer Sign Up | Mansa Musa Marketplace</title>
        <meta name="description" content="Create a customer account on Mansa Musa Marketplace" />
      </Helmet>

      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <LoginContainer 
          header={
            <>
              <div className="w-12 h-12 rounded-full bg-mansablue flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-spartan font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold text-mansablue-dark">Create Your Account</h1>
              <p className="text-gray-600 mt-1">Join our community of conscious consumers</p>
            </>
          }
        >
          <CustomerSignupTab />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-mansablue hover:underline font-medium">
                Log in
              </a>
            </p>
          </div>
        </LoginContainer>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerSignupPage;
