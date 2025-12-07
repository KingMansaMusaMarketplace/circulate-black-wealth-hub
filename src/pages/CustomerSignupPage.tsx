
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import CustomerSignupTab from '@/components/auth/forms/CustomerSignupTab';
import { Users } from 'lucide-react';

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

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 space-y-4 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-mansagold bg-clip-text text-transparent font-display">
                Create Your Account
              </h1>
              <p className="text-blue-200/70 mt-2 text-lg">
                Join our community of conscious consumers
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                <CustomerSignupTab />

                <div className="mt-6 text-center">
                  <p className="text-sm text-white/60">
                    Already have an account?{' '}
                    <a href="/login" className="text-mansagold hover:text-yellow-400 font-semibold transition-colors hover:underline">
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
