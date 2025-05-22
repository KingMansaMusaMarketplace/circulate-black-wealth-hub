
import React from 'react';
import { MapPin, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DirectoryResultsSummaryProps {
  totalResults: number;
  nearMeActive?: boolean;
  searchTerm?: string;
  isFiltered?: boolean;
}

const DirectoryResultsSummary: React.FC<DirectoryResultsSummaryProps> = ({ 
  totalResults, 
  nearMeActive = false,
  searchTerm,
  isFiltered = false
}) => {
  const getMessage = () => {
    if (totalResults === 0) {
      return "No businesses found";
    } else if (totalResults === 1) {
      return "1 business found";
    } else {
      return `${totalResults} businesses found`;
    }
  };
  
  return (
    <div className="flex items-center text-sm text-gray-500 mb-4">
      <div className="font-medium">
        {getMessage()}
        {searchTerm && <span className="ml-1">for "{searchTerm}"</span>}
      </div>
      
      {nearMeActive && (
        <div className="ml-auto flex items-center">
          <MapPin size={14} className="mr-1 text-mansablue" />
          <span className="text-mansablue font-medium">Near Me</span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1 rounded-full p-1 hover:bg-gray-100">
                  <Info size={12} className="text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Showing businesses based on your current location</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {isFiltered && (
        <div className="ml-2 text-gray-500 text-xs py-0.5 px-2 bg-gray-100 rounded-full">
          Filtered
        </div>
      )}
    </div>
  );
};

export default DirectoryResultsSummary;
