
import React from 'react';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DirectoryErrorStateProps {
  error: string;
}

const DirectoryErrorState: React.FC<DirectoryErrorStateProps> = ({ error }) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error}. Please try refreshing the page or contact support if the problem persists.
      </AlertDescription>
    </Alert>
  );
};

export default DirectoryErrorState;
