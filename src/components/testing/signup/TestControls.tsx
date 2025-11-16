
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
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Play className="h-5 w-5 text-white" />
          </div>
          Test Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onRunTests} 
          disabled={isRunning}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestControls;
