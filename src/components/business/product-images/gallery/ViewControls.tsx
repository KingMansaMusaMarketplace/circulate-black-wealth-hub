
import React from 'react';
import { Button } from "@/components/ui/button";
import { List, GridIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewControlsProps {
  layoutType: 'grid' | 'list';
  setLayoutType: (type: 'grid' | 'list') => void;
  selectionMode: boolean;
  toggleSelectionMode: () => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({
  layoutType,
  setLayoutType,
  selectionMode,
  toggleSelectionMode
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Button
        size="sm"
        variant={selectionMode ? "default" : "outline"}
        onClick={toggleSelectionMode}
        className="h-9"
      >
        {selectionMode ? "Cancel Selection" : "Select Multiple"}
      </Button>
      
      <div className="border rounded-md flex">
        <Button 
          size="sm"
          variant={layoutType === 'grid' ? "ghost" : "ghost"}
          className={cn("h-9 rounded-r-none", layoutType === 'grid' ? "bg-muted" : "")}
          onClick={() => setLayoutType('grid')}
        >
          <GridIcon className="h-4 w-4" />
        </Button>
        <Button 
          size="sm"
          variant={layoutType === 'list' ? "ghost" : "ghost"}
          className={cn("h-9 rounded-l-none", layoutType === 'list' ? "bg-muted" : "")}
          onClick={() => setLayoutType('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ViewControls;
