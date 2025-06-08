
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Create your first QR code to start engaging with customers and tracking interactions.
          </p>
          <Button onClick={onCreateNew} className="bg-mansablue hover:bg-mansablue-dark">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
