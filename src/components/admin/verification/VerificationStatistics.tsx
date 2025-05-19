
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchVerificationQueue } from '@/lib/api/verification-api';
import { VerificationQueueItem } from '@/lib/types/verification';

const VerificationStatistics: React.FC = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    averageTimeToApproval: 0, // in hours
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const queue = await fetchVerificationQueue();
        
        // Calculate statistics
        const pendingRequests = queue.filter(item => item.verification_status === 'pending').length;
        const approvedRequests = queue.filter(item => item.verification_status === 'approved').length;
        const rejectedRequests = queue.filter(item => item.verification_status === 'rejected').length;
        
        // Calculate average approval time (for approved requests)
        const approvedItems = queue.filter(item => 
          item.verification_status === 'approved' && item.submitted_at && item.verified_at
        );
        
        let totalApprovalHours = 0;
        approvedItems.forEach(item => {
          const submittedDate = new Date(item.submitted_at!);
          const verifiedDate = new Date(item.verified_at!);
          const diffHours = (verifiedDate.getTime() - submittedDate.getTime()) / (1000 * 60 * 60);
          totalApprovalHours += diffHours;
        });
        
        const averageTimeToApproval = approvedItems.length > 0 
          ? Math.round(totalApprovalHours / approvedItems.length * 10) / 10
          : 0;
        
        setStats({
          totalRequests: queue.length,
          pendingRequests,
          approvedRequests,
          rejectedRequests,
          averageTimeToApproval,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading verification statistics:', error);
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon,
    color,
    isTime = false
  }: { 
    title: string; 
    value: number; 
    description: string;
    icon: any;
    color: string;
    isTime?: boolean;
  }) => (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">
            {isTime ? `${value} hrs` : value}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className={`p-4 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Verification Analytics</h2>
        <p className="text-muted-foreground">Track performance and manage business verification processes</p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Requests"
            value={stats.totalRequests}
            description="All-time verification requests"
            icon={Activity}
            color="blue"
          />
          <StatCard 
            title="Pending"
            value={stats.pendingRequests}
            description="Awaiting review"
            icon={Clock}
            color="amber"
          />
          <StatCard 
            title="Approved"
            value={stats.approvedRequests}
            description="Successfully verified"
            icon={CheckCircle}
            color="green"
          />
          <StatCard 
            title="Rejected"
            value={stats.rejectedRequests}
            description="Failed verification"
            icon={XCircle}
            color="red"
          />
        </div>
      )}

      <div className="mt-6 bg-slate-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Average Verification Time</h3>
            <p className="text-sm text-muted-foreground">Time from submission to approval</p>
          </div>
          <div className="text-2xl font-bold text-mansablue">
            {stats.averageTimeToApproval} hrs
          </div>
        </div>
        <div className="mt-4 w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="bg-mansablue h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, stats.averageTimeToApproval > 72 ? 100 : (stats.averageTimeToApproval/72*100))}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">Target: 24-72 hours</p>
      </div>
    </div>
  );
};

export default VerificationStatistics;
