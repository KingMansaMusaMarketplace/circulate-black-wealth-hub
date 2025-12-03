import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchVerificationQueue } from '@/lib/api/verification-api';

const VerificationStatistics: React.FC = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    averageTimeToApproval: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const queue = await fetchVerificationQueue();
        
        const pendingRequests = queue.filter(item => item.verification_status === 'pending').length;
        const approvedRequests = queue.filter(item => item.verification_status === 'approved').length;
        const rejectedRequests = queue.filter(item => item.verification_status === 'rejected').length;
        
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
    colorClass,
    bgClass,
    isTime = false
  }: { 
    title: string; 
    value: number; 
    description: string;
    icon: any;
    colorClass: string;
    bgClass: string;
    isTime?: boolean;
  }) => (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <CardContent className="flex flex-row items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-white/70">{title}</p>
          <h3 className={`text-2xl font-bold mt-2 ${colorClass}`}>
            {isTime ? `${value} hrs` : value}
          </h3>
          <p className="text-xs text-white/60 mt-1">{description}</p>
        </div>
        <div className={`p-4 rounded-full ${bgClass}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-white">Verification Analytics</h2>
        <p className="text-white/70">Track performance and manage business verification processes</p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardContent className="p-6">
                <div className="h-4 w-24 bg-white/20 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-white/30 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-white/20 rounded animate-pulse mt-2"></div>
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
            colorClass="text-mansagold"
            bgClass="bg-mansagold/20"
          />
          <StatCard 
            title="Pending"
            value={stats.pendingRequests}
            description="Awaiting review"
            icon={Clock}
            colorClass="text-orange-400"
            bgClass="bg-orange-500/20"
          />
          <StatCard 
            title="Approved"
            value={stats.approvedRequests}
            description="Successfully verified"
            icon={CheckCircle}
            colorClass="text-green-400"
            bgClass="bg-green-500/20"
          />
          <StatCard 
            title="Rejected"
            value={stats.rejectedRequests}
            description="Failed verification"
            icon={XCircle}
            colorClass="text-red-400"
            bgClass="bg-red-500/20"
          />
        </div>
      )}

      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Average Verification Time</h3>
              <p className="text-sm text-white/60">Time from submission to approval</p>
            </div>
            <div className="text-2xl font-bold text-mansagold">
              {stats.averageTimeToApproval} hrs
            </div>
          </div>
          <div className="mt-4 w-full bg-white/10 rounded-full h-2.5">
            <div 
              className="bg-mansagold h-2.5 rounded-full transition-all" 
              style={{ width: `${Math.min(100, stats.averageTimeToApproval > 72 ? 100 : (stats.averageTimeToApproval/72*100))}%` }}
            ></div>
          </div>
          <p className="text-xs text-white/50 mt-2 text-right">Target: 24-72 hours</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationStatistics;
