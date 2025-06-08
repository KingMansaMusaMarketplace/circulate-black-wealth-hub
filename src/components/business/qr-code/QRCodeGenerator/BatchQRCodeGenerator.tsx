
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BatchQRCodeGenerator: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch QR Code Generation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="quantity">Number of QR Codes</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="Enter quantity"
            min="1"
            max="100"
          />
        </div>
        
        <div>
          <Label htmlFor="prefix">QR Code Prefix</Label>
          <Input
            id="prefix"
            placeholder="Enter prefix (optional)"
          />
        </div>
        
        <Button className="w-full">
          Generate Batch QR Codes
        </Button>
        
        <p className="text-sm text-gray-500">
          Generate multiple QR codes at once for bulk campaigns or events.
        </p>
      </CardContent>
    </Card>
  );
};

export default BatchQRCodeGenerator;
