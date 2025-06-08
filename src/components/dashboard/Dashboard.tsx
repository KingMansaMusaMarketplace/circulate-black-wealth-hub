
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar,
  MapPin,
  Star,
  Heart,
  Eye,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalBusinesses: number;
  recentTopics: number;
  upcomingEvents: number;
  userInteractions: number;
}

interface RecentActivity {
  id: string;
  type: 'business_view' | 'forum_post' | 'event_join' | 'business_favorite';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinesses: 0,
    recentTopics: 0,
    upcomingEvents: 0,
    userInteractions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch general stats
      const [businessesResult, topicsResult, eventsResult, interactionsResult] = await Promise.all([
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('forum_topics').select('id', { count: 'exact', head: true }),
        supabase.from('community_events').select('id').gte('event_date', new Date().toISOString()),
        user ? supabase.from('business_interactions').select('id', { count: 'exact', head: true }).eq('user_id', user.id) : { count: 0 }
      ]);

      setStats({
        totalBusinesses: businessesResult.count || 0,
        recentTopics: topicsResult.count || 0,
        upcomingEvents: eventsResult.data?.length || 0,
        userInteractions: interactionsResult.count || 0
      });

      // Fetch recent activity for the user
      if (user) {
        const activities: RecentActivity[] = [];

        // Recent business interactions
        const { data: interactions } = await supabase
          .from('business_interactions')
          .select(`
            *,
            businesses(business_name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        interactions?.forEach(interaction => {
          activities.push({
            id: `interaction-${interaction.id}`,
            type: interaction.interaction_type as any,
            title: `${interaction.interaction_type === 'view' ? 'Viewed' : 'Favorited'} ${interaction.businesses?.business_name}`,
            description: `You ${interaction.interaction_type}ed this business`,
            timestamp: interaction.created_at,
            icon: interaction.interaction_type === 'view' ? <Eye className="h-4 w-4" /> : <Heart className="h-4 w-4" />
          });
        });

        setRecentActivity(activities.slice(0, 5));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Discover Businesses',
      description: 'Find personalized recommendations',
      icon: <TrendingUp className="h-6 w-6" />,
      action: () => navigate('/community?tab=discover'),
      color: 'bg-blue-500'
    },
    {
      title: 'Join Community Forum',
      description: 'Connect with other community members',
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => navigate('/community?tab=forum'),
      color: 'bg-green-500'
    },
    {
      title: 'Browse Events',
      description: 'Find local community events',
      icon: <Calendar className="h-6 w-6" />,
      action: () => navigate('/community?tab=events'),
      color: 'bg-purple-500'
    },
    {
      title: 'Browse Directory',
      description: 'Explore all Black-owned businesses',
      icon: <MapPin className="h-6 w-6" />,
      action: () => navigate('/directory'),
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-mansablue to-mansablue-dark rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.name || 'Community Member'}!
        </h1>
        <p className="text-blue-100 mb-4">
          Ready to discover amazing Black-owned businesses and connect with your community?
        </p>
        <Button 
          onClick={() => navigate('/community')}
          className="bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold"
        >
          Explore Community Hub
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Forum Topics</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentTopics}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Your Interactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.userInteractions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into the community features you love</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="p-4 rounded-lg border border-gray-200 hover:border-mansablue hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-mansablue transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Featured This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Community Spotlight</p>
                <p className="text-xs text-gray-600">Join our weekly business owner success stories discussion</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Wealth Building Workshop</p>
                <p className="text-xs text-gray-600">Learn investment strategies this Saturday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Growing Fast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New businesses added</span>
                <Badge className="bg-green-100 text-green-800">+15 this week</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Forum discussions</span>
                <Badge className="bg-blue-100 text-blue-800">Very Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Community events</span>
                <Badge className="bg-purple-100 text-purple-800">12 upcoming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
