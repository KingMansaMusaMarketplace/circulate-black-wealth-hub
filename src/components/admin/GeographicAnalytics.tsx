import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Users, Building2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#d4af37', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'];

const GeographicAnalytics: React.FC = () => {
  const [dataType, setDataType] = useState<'users' | 'businesses'>('users');

  const { data: usersByState } = useQuery({
    queryKey: ['geo-users-by-state'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('state');
      if (error) throw error;
      
      const stateCounts: Record<string, number> = {};
      data?.forEach(profile => {
        const state = profile.state || 'Unknown';
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      });
      
      return Object.entries(stateCounts)
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
    }
  });

  const { data: businessesByState } = useQuery({
    queryKey: ['geo-businesses-by-state'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('state, city');
      if (error) throw error;
      
      const stateCounts: Record<string, number> = {};
      data?.forEach(business => {
        const state = business.state || 'Unknown';
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      });
      
      return Object.entries(stateCounts)
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
    }
  });

  const { data: usersByCity } = useQuery({
    queryKey: ['geo-users-by-city'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('city');
      if (error) throw error;
      
      const cityCounts: Record<string, number> = {};
      data?.forEach(profile => {
        const city = profile.city || 'Unknown';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      });
      
      return Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .filter(c => c.city !== 'Unknown')
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }
  });

  const { data: userRoleDistribution } = useQuery({
    queryKey: ['geo-role-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type');
      if (error) throw error;
      
      const roleCounts: Record<string, number> = {};
      data?.forEach(profile => {
        const role = profile.user_type || 'customer';
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
      
      return Object.entries(roleCounts)
        .map(([name, value]) => ({ name, value }));
    }
  });

  const { data: businessCategories } = useQuery({
    queryKey: ['geo-business-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('category');
      if (error) throw error;
      
      const categoryCounts: Record<string, number> = {};
      data?.forEach(business => {
        const category = business.category || 'Other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      return Object.entries(categoryCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    }
  });

  const currentData = dataType === 'users' ? usersByState : businessesByState;
  const totalCount = currentData?.reduce((acc, item) => acc + item.count, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-mansagold/10 border-mansagold/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-white/60 text-sm">States Covered</p>
                <p className="text-2xl font-bold text-mansagold">{usersByState?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-blue-400">
                  {usersByState?.reduce((acc, s) => acc + s.count, 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Total Businesses</p>
                <p className="text-2xl font-bold text-green-400">
                  {businessesByState?.reduce((acc, s) => acc + s.count, 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-white/60 text-sm">Top City</p>
                <p className="text-lg font-bold text-purple-400 truncate">
                  {usersByCity?.[0]?.city || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-mansagold" />
              Geographic Distribution
            </CardTitle>
            <Select value={dataType} onValueChange={(v: 'users' | 'businesses') => setDataType(v)}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="businesses">Businesses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="state" type="category" stroke="rgba(255,255,255,0.5)" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#d4af37" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-mansagold" />
              User Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userRoleDistribution?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Business Categories */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-mansagold" />
              Business Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={businessCategories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {businessCategories?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {businessCategories?.map((cat, index) => (
                <Badge
                  key={cat.name}
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Cities */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-mansagold" />
            Top Cities by Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {usersByCity?.map((city, index) => (
                <div
                  key={city.city}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-mansagold font-bold w-6">{index + 1}</span>
                    <span className="text-white">{city.city}</span>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/70">
                    {city.count} users
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeographicAnalytics;
