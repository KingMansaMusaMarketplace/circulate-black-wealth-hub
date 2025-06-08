
import React from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="flex gap-4 mb-6">
      <Button 
        onClick={onRunTests} 
        disabled={isRunningTests}
        className="bg-mansablue hover:bg-mansablue/90"
      >
        {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
      </Button>
      <Button 
        onClick={onRequestPermission} 
        variant="outline"
      >
        Request Location Permission
      </Button>
      <Button 
        onClick={onClearCache} 
        variant="outline"
      >
        Clear Location Cache
      </Button>
    </div>
  );
};

export default TestControls;
