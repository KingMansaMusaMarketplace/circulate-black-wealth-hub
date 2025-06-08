
import React from 'react';
import { QrCode, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNew?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <div className="text-center py-12">
      <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Created</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Start engaging with your customers by creating your first QR code for discounts, loyalty points, or check-ins.
      </p>
      {onCreateNew && (
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create Your First QR Code
        </Button>
      )}
    </div>
  );
};
