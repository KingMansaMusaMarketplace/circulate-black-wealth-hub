
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface TestControlsProps {
  isRunning: boolean;
  onRunTests: () => void;
}

const TestControls: React.FC<TestControlsProps> = ({ isRunning, onRunTests }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onRunTests} 
          disabled={isRunning}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestControls;
