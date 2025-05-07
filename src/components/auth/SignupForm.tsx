
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (email: string, password: string, metadata: any) => Promise<any>;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent, userType: 'customer' | 'business') => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to the terms of service to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create metadata based on user type
      const metadata = userType === 'customer' 
        ? { 
            userType: 'customer',
            fullName: name,
            subscription_status: 'active',
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          }
        : {
            userType: 'business',
            businessName,
            businessType,
            businessAddress,
            subscription_status: 'trial',
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 day trial
          };
      
      const { data, error } = await onSubmit(email, password, metadata);
      
      if (error) throw error;
      
      // If signup was successful, redirect to dashboard
      if (data) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="customer" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="customer">Customer</TabsTrigger>
        <TabsTrigger value="business">Business Owner</TabsTrigger>
      </TabsList>

      <TabsContent value="customer">
        <form onSubmit={(e) => handleSignup(e, 'customer')}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <Link to="/terms" className="text-mansablue hover:underline">
                  terms of service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-mansablue hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>
            
            <Button type="submit" className="w-full bg-mansablue" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up - $10/month'
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Your subscription gives you access to all discounts, QR scanning, and loyalty rewards.
            </p>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="business">
        <form onSubmit={(e) => handleSignup(e, 'business')}>
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
              <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <select
                id="business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-mansablue focus:ring-mansablue"
                required
              >
                <option value="">Select a category</option>
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail</option>
                <option value="beauty">Beauty & Barber</option>
                <option value="services">Professional Services</option>
                <option value="health">Health & Wellness</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="business-address" className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <Input
                id="business-address"
                type="text"
                placeholder="123 Main St, City, State"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="business-email" className="block text-sm font-medium text-gray-700 mb-1">
                Business Email
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
              <label htmlFor="business-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="business-password"
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Business Owner Benefits:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• First month completely free</li>
                <li>• $100/month after trial period</li>
                <li>• Enhanced visibility to subscribers</li>
                <li>• QR code for in-store discounts</li>
                <li>• Customer loyalty analytics</li>
              </ul>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="business-terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <label
                htmlFor="business-terms"
                className="text-sm text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <Link to="/terms" className="text-mansablue hover:underline">
                  terms of service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-mansablue hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>
            
            <Button type="submit" className="w-full bg-mansablue" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up - First Month Free'
              )}
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default SignupForm;
