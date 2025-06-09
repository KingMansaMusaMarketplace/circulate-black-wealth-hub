
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const ActivityFeedEmptyState: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
        <p className="text-gray-600">
          Start scanning QR codes and supporting businesses to see community activity!
        </p>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedEmptyState;
