
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NavigationTests: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Navigation Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/community-impact'}
          className="w-full"
        >
          Test: Navigate to Community Impact Page
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/dashboard'}
          className="w-full"
        >
          Test: Navigate to Dashboard (should have Community Impact link)
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/community'}
          className="w-full"
        >
          Test: Navigate to Community Hub
        </Button>
      </CardContent>
    </Card>
  );
};

export default NavigationTests;
