import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Trophy, History, MapPin, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DiscoveryPreferences } from '@/components/user/DiscoveryPreferences';
import { NotificationSettings } from '@/components/user/NotificationSettings';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
}

interface UserStats {
  total_points: number;
  total_scans: number;
  businesses_visited: number;
  rewards_redeemed: number;
}

export default function UserProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    total_points: 0,
    total_scans: 0,
    businesses_visited: 0,
    rewards_redeemed: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    
    if (user) {
      fetchUserProfile();
      fetchUserStats();
    } else {
      setIsLoading(false); // User not authenticated, stop loading
    }
  }, [user, authLoading]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get total points from transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('points_earned')
        .eq('customer_id', user?.id);

      // Get QR scans count
      const { data: scans } = await supabase
        .from('qr_scans')
        .select('id, business_id')
        .eq('customer_id', user?.id);

      // Get redeemed rewards count
      const { data: rewards } = await supabase
        .from('redeemed_rewards')
        .select('id')
        .eq('customer_id', user?.id);

      const totalPoints = transactions?.reduce((sum, t) => sum + t.points_earned, 0) || 0;
      const uniqueBusinesses = new Set(scans?.map(s => s.business_id)).size;

      setUserStats({
        total_points: totalPoints,
        total_scans: scans?.length || 0,
        businesses_visited: uniqueBusinesses,
        rewards_redeemed: rewards?.length || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleUpdateProfile = async (updatedData: Partial<UserProfile>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">Unable to load your profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 -z-10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <Avatar className="h-24 w-24 border-4 border-white/30 shadow-2xl">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-2xl bg-white/20 text-white backdrop-blur-sm">
                  {profile.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold text-white animate-fade-in">{profile.full_name || 'User'}</h1>
                <p className="text-white/90 text-lg">{profile.email}</p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">{profile.subscription_tier}</Badge>
                  <Badge className={profile.subscription_status === 'active' ? 'bg-green-500/30 text-white border-green-400/50 backdrop-blur-sm' : 'bg-white/20 text-white border-white/30 backdrop-blur-sm'}>
                    {profile.subscription_status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-white via-purple-50 to-pink-50 border-purple-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="flex items-center p-6">
                <Trophy className="h-10 w-10 text-purple-600 mr-3" />
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{userStats.total_points}</p>
                  <p className="text-sm text-gray-700 font-medium">Total Points</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="flex items-center p-6">
                <History className="h-10 w-10 text-blue-600 mr-3" />
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{userStats.total_scans}</p>
                  <p className="text-sm text-gray-700 font-medium">QR Scans</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-white via-green-50 to-emerald-50 border-green-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="flex items-center p-6">
                <MapPin className="h-10 w-10 text-green-600 mr-3" />
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{userStats.businesses_visited}</p>
                  <p className="text-sm text-gray-700 font-medium">Businesses Visited</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-white via-yellow-50 to-orange-50 border-yellow-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="flex items-center p-6">
                <Star className="h-10 w-10 text-yellow-600 mr-3" />
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{userStats.rewards_redeemed}</p>
                  <p className="text-sm text-gray-700 font-medium">Rewards Redeemed</p>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Profile Management */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Discovery</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile.city || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, city: e.target.value} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profile.state || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, state: e.target.value} : null)}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleUpdateProfile({
                      full_name: profile.full_name,
                      phone: profile.phone,
                      city: profile.city,
                      state: profile.state
                    })}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <DiscoveryPreferences />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}