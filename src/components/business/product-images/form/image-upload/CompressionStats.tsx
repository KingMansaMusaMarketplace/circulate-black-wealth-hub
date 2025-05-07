
import React from 'react';
import { BarChart, Save } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CompressionStatsProps {
  originalSize: number;
  compressedSize: number;
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const CompressionStats: React.FC<CompressionStatsProps> = ({
  originalSize,
  compressedSize,
  className
}) => {
  // Calculate savings
  const savedBytes = originalSize - compressedSize;
  const savingsPercentage = Math.round((savedBytes / originalSize) * 100);
  
  // Safety check to prevent NaN or Infinity
  const validSavings = isFinite(savingsPercentage) ? savingsPercentage : 0;
  
  return (
    <div className={cn("p-3 bg-gray-50 rounded-lg", className)}>
      <h4 className="text-sm font-medium flex items-center mb-2">
        <BarChart className="h-4 w-4 mr-1.5" />
        Image Optimization
      </h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Original:</span>
          <span className="font-medium">{formatFileSize(originalSize)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Compressed:</span>
          <span className="font-medium">{formatFileSize(compressedSize)}</span>
        </div>
        
        <Progress value={validSavings} className="h-2" />
        
        <div className="flex items-center justify-between text-green-600">
          <span className="flex items-center">
            <Save className="h-3.5 w-3.5 mr-1" />
            Space saved:
          </span>
          <span className="font-medium">
            {formatFileSize(savedBytes)} ({validSavings}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompressionStats;
