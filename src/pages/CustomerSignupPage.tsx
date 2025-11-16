
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
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
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12">
      <Helmet>
        <title>Customer Sign Up | Mansa Musa Marketplace</title>
        <meta name="description" content="Create a customer account on Mansa Musa Marketplace" />
      </Helmet>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-purple-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mansablue/20 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 space-y-4 animate-fade-in-up">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-mansablue to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-mansablue/50">
              <span className="text-white font-spartan font-bold text-3xl">M</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-mansablue bg-clip-text text-transparent">Create Your Account</h1>
              <p className="text-muted-foreground mt-2 text-lg">Join our community of conscious consumers</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-mansablue/20 to-purple-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-card/95 backdrop-blur-sm border-2 border-mansablue/30 rounded-2xl shadow-2xl p-8">
                <CustomerSignupTab />

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <a href="/login" className="text-mansablue hover:text-purple-600 font-semibold transition-colors hover:underline">
                      Log in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerSignupPage;
