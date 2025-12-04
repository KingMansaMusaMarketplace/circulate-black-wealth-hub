import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Search, RefreshCw, Clock, User, Building2, QrCode, Star, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ActivityLogEntry {
  id: string;
  user_id: string;
  business_id: string | null;
  activity_type: string;
  activity_data: any;
  points_involved: number | null;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

const AdminActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('7');

  useEffect(() => {
    fetchActivities();
  }, [typeFilter, timeFilter]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - parseInt(timeFilter));

      let query = supabase
        .from('activity_log')
        .select('*')
        .gte('created_at', dateFilter.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (typeFilter !== 'all') {
        query = query.ilike('activity_type', `%${typeFilter}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch activity log');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    if (type.includes('qr') || type.includes('scan')) return QrCode;
    if (type.includes('review') || type.includes('rating')) return Star;
    if (type.includes('points') || type.includes('transaction')) return DollarSign;
    if (type.includes('business')) return Building2;
    return Activity;
  };

  const getActivityColor = (type: string) => {
    if (type.includes('qr') || type.includes('scan')) return 'text-blue-400 bg-blue-500/20';
    if (type.includes('review') || type.includes('rating')) return 'text-yellow-400 bg-yellow-500/20';
    if (type.includes('points') || type.includes('transaction')) return 'text-green-400 bg-green-500/20';
    if (type.includes('business')) return 'text-purple-400 bg-purple-500/20';
    return 'text-gray-400 bg-gray-500/20';
  };

  const filteredActivities = activities.filter(activity =>
    activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activityTypes = [...new Set(activities.map(a => a.activity_type))];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Activities</p>
                <p className="text-3xl font-bold text-blue-400">{activities.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Unique Users</p>
                <p className="text-3xl font-bold text-purple-400">
                  {new Set(activities.map(a => a.user_id)).size}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <User className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Points</p>
                <p className="text-3xl font-bold text-green-400">
                  {activities.reduce((sum, a) => sum + (a.points_involved || 0), 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/20">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-blue-300"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="qr">QR Scans</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchActivities} variant="outline" className="border-white/10 text-blue-200 hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-yellow-400" />
            Activity Log ({filteredActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity) => {
                const Icon = getActivityIcon(activity.activity_type);
                const colorClass = getActivityColor(activity.activity_type);
                
                return (
                  <div
                    key={activity.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.activity_type}</p>
                        <p className="text-blue-300 text-sm">
                          User: {activity.user_id?.slice(0, 8)}...
                          {activity.business_id && ` • Business: ${activity.business_id.slice(0, 8)}...`}
                        </p>
                        {activity.activity_data && Object.keys(activity.activity_data).length > 0 && (
                          <p className="text-blue-400 text-xs mt-1">
                            {JSON.stringify(activity.activity_data).slice(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {activity.points_involved !== null && activity.points_involved !== 0 && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          +{activity.points_involved} pts
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-blue-300 text-sm whitespace-nowrap">
                        <Clock className="h-3 w-3" />
                        {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredActivities.length === 0 && (
                <div className="text-center py-8 text-blue-300">
                  No activities found matching your criteria
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivityLog;
