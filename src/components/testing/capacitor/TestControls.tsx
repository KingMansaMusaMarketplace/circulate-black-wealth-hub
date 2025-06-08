
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, MapPin, Trash2 } from 'lucide-react';

interface TestControlsProps {
  isRunningTests: boolean;
  onRunTests: () => void;
  onRequestPermission: () => void;
  onClearCache: () => void;
}

const TestControls: React.FC<TestControlsProps> = ({
  isRunningTests,
  onRunTests,
  onRequestPermission,
  onClearCache
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={onRunTests} 
          disabled={isRunningTests}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunningTests ? "Running Tests..." : "Run All Tests"}
        </Button>
        
        <Button 
          onClick={onRequestPermission}
          variant="outline"
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Request Location Permission
        </Button>
        
        <Button 
          onClick={onClearCache}
          variant="outline"
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cache
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestControls;
