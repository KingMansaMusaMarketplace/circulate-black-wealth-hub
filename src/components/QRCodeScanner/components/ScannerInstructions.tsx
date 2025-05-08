
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

const ScannerInstructions: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-mansablue" />
            <h3 className="text-sm font-medium">How to scan QR codes</h3>
          </div>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
        
        {expanded && (
          <div className="mt-3 space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p>Hold your phone steady and make sure the QR code fits within the scanner frame</p>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p>Ensure the QR code is well-lit and not blurry</p>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p>Allow camera access when prompted</p>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="mt-0.5">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              <p>Avoid scanning in very low light or with reflections on the code</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md mt-3">
              <p className="text-xs text-center">Visit a participating business and scan their loyalty QR code to earn points with each purchase</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScannerInstructions;
