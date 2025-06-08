
import { useState, useEffect } from 'react';

export interface BusinessMetrics {
  totalViews: number;
  totalScans: number;
  totalShares: number;
  avgRating: number;
  reviewCount: number;
}

export interface AnalyticsData {
  metrics: BusinessMetrics;
  viewsData: Array<{
    month: string;
    views: number;
    scans: number;
  }>;
  trafficSources: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const useBusinessAnalytics = (businessId: string) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from your analytics API
        const mockData: AnalyticsData = {
          metrics: {
            totalViews: 1247,
            totalScans: 89,
            totalShares: 156,
            avgRating: 4.7,
            reviewCount: 23
          },
          viewsData: [
            { month: 'Jan', views: 120, scans: 15 },
            { month: 'Feb', views: 180, scans: 22 },
            { month: 'Mar', views: 160, scans: 18 },
            { month: 'Apr', views: 200, scans: 25 },
            { month: 'May', views: 240, scans: 30 },
            { month: 'Jun', views: 300, scans: 35 }
          ],
          trafficSources: [
            { name: 'Direct Links', value: 45, color: '#8884d8' },
            { name: 'Search Results', value: 30, color: '#82ca9d' },
            { name: 'Social Media', value: 15, color: '#ffc658' },
            { name: 'QR Codes', value: 10, color: '#ff7300' }
          ]
        };
        
        setAnalytics(mockData);
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [businessId]);

  return {
    analytics,
    loading,
    error,
    refetch: () => {
      setError(null);
      // Re-fetch logic would go here
    }
  };
};
