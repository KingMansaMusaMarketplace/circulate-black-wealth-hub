
import React from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const HBCUTestPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>HBCU Verification Test</CardTitle>
            <CardDescription>
              Test page for HBCU verification functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Current User:</span>
              <Badge variant="outline">
                {user?.email || 'Not logged in'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span>HBCU Status:</span>
              <Badge variant="secondary">
                {user?.user_metadata?.is_hbcu_member ? 'Verified' : 'Not verified'}
              </Badge>
            </div>

            <Button>
              Test HBCU Verification
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HBCUTestPage;
