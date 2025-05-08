
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, Building } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface TestAccountFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const TestAccountForm: React.FC<TestAccountFormProps> = ({ loading, setLoading }) => {
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('Test123!');
  const [testBusinessName, setTestBusinessName] = useState('');

  // Create a test user account
  const handleCreateTestUser = async (userType: 'customer' | 'business') => {
    if (!testEmail.trim()) {
      toast.error('Please enter a test email address');
      return;
    }

    // Add a test indicator to the email to ensure it's clearly marked as a test account
    const formattedEmail = testEmail.includes('test') ? testEmail : `test_${testEmail}`;

    try {
      setLoading(true);
      
      const metadata = {
        user_type: userType,
        full_name: userType === 'business' ? testBusinessName || 'Test Business' : 'Test Customer',
      };

      const { data, error } = await supabase.auth.signUp({
        email: formattedEmail,
        password: testPassword,
        options: {
          data: metadata,
        }
      });

      if (error) throw error;

      // Success!
      toast.success(`Test ${userType} account created successfully`);
      console.log('Test account created:', data);
      
    } catch (error: any) {
      console.error('Error creating test account:', error);
      toast.error(`Failed to create test account: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="testEmail">Test Email</Label>
        <Input 
          id="testEmail" 
          type="email"
          placeholder="test_user@example.com"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Will be prefixed with "test_" if not already containing "test"
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="testPassword">Test Password</Label>
        <Input 
          id="testPassword" 
          type="password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="testBusinessName">Business Name (for business accounts)</Label>
        <Input 
          id="testBusinessName" 
          placeholder="Test Business Name"
          value={testBusinessName}
          onChange={(e) => setTestBusinessName(e.target.value)}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          onClick={() => handleCreateTestUser('customer')}
          disabled={loading}
          className="flex-1"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <UserPlus className="mr-2 h-4 w-4" />
          Create Test Customer
        </Button>
        
        <Button 
          onClick={() => handleCreateTestUser('business')}
          disabled={loading}
          className="flex-1"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Building className="mr-2 h-4 w-4" />
          Create Test Business
        </Button>
      </div>
    </div>
  );
};
