
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Gift } from 'lucide-react';

interface Activity {
  id: number;
  businessName: string;
  action: string;
  points: number;
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {activity.action === 'Scan' ? (
                <QrCode className="h-4 w-4 text-mansablue" />
              ) : (
                <Gift className="h-4 w-4 text-mansagold" />
              )}
              
              <div className="flex-1">
                <p className="font-medium text-sm">{activity.businessName}</p>
                <p className="text-xs text-gray-600">{activity.date}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-mansagold">+{activity.points}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
