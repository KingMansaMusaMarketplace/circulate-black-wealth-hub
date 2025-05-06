
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent, userType: 'customer' | 'business') => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userType === 'customer' ? 'valued customer' : 'business partner'}!`,
      });
      // In a real app, would redirect to dashboard or home page after login
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-mansablue flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-spartan font-bold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-bold text-mansablue-dark">Welcome Back</h1>
            <p className="text-gray-600 mt-1">Log in to continue your journey</p>
          </div>

          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <form onSubmit={(e) => handleLogin(e, 'customer')}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="customer-password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs text-mansablue hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="customer-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-mansablue" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="business">
              <form onSubmit={(e) => handleLogin(e, 'business')}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <Input
                      id="business-name"
                      type="text"
                      placeholder="Your Business Name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="business-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="business-email"
                      type="email"
                      placeholder="business@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="business-password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs text-mansablue hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="business-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-mansablue" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-mansablue hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
