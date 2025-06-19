
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TestInstructions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• This test uses hidden iframes to check each page for content without popup blockers</p>
          <p>• Pages with sufficient content and proper structure will pass</p>
          <p>• Blank or minimal pages will be flagged as failures</p>
          <p>• Some pages may show warnings due to cross-origin restrictions but are likely working</p>
          <p>• Click on any page name above to navigate there directly</p>
        </div>
      </CardContent>
    </Card>
  );
};
