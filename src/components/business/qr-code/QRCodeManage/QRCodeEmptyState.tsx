
import React from 'react';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateNew?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <QrCode size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No QR Codes Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Generate QR codes for your business to offer discounts and loyalty points to your customers.
      </p>
      {onCreateNew && (
        <Button onClick={onCreateNew}>
          Create Your First QR Code
        </Button>
      )}
    </div>
  );
};
