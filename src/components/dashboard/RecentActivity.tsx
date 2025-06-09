
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, Star } from 'lucide-react';

type Activity = {
  id: number;
  businessName: string;
  action: string;
  points: number;
  date: string;
};

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
      
      {activities.map(activity => (
        <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
          <div className="flex items-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activity.action === 'Scan' ? 'bg-mansablue/10 text-mansablue' : 'bg-mansagold/10 text-mansagold'}`}>
              {activity.action === 'Scan' ? <QrCode size={16} /> : <Star size={16} />}
            </div>
            <div>
              <p className="font-medium">{activity.action} at {activity.businessName}</p>
              <p className="text-xs text-gray-500">{activity.date}</p>
            </div>
          </div>
          <div className="bg-mansagold/10 text-mansagold font-medium text-sm px-2 py-1 rounded">
            +{activity.points} points
          </div>
        </div>
      ))}

      <div className="mt-6 text-center">
        <Button variant="outline" className="text-mansablue border-mansablue hover:bg-mansablue hover:text-white">
          View Full History
        </Button>
      </div>
    </div>
  );
};

export default RecentActivity;
