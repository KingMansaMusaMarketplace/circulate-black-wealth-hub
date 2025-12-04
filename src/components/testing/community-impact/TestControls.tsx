
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface TestControlsProps {
  isRunning: boolean;
  onRunTests: () => void;
}

const TestControls: React.FC<TestControlsProps> = ({ isRunning, onRunTests }) => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">Community Impact Test Suite</h2>
        <p className="text-blue-200 text-sm mt-1">Run automated tests to verify functionality</p>
      </div>
      <div className="p-6">
        <Button 
          onClick={onRunTests} 
          disabled={isRunning}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </Button>
      </div>
    </div>
  );
};

export default TestControls;
